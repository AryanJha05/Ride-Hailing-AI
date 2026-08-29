import os
import json
import logging
import time
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import httpx

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("llm-service")

# Candidate base URLs for host/container connectivity
CANDIDATE_OLLAMA_URLS = [
    os.getenv("OLLAMA_BASE_URL", "http://host.docker.internal:11434").rstrip("/"),
    "http://localhost:11434",
    "http://172.17.0.1:11434"
]
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:1b")

app = FastAPI(
    title="Ride AI LLM Microservice",
    description="Dynamic Ollama Copilot Microservice for Ride AI Mobility Intelligence",
    version="2.0.0"
)

class ChatHistoryItem(BaseModel):
    role: str = Field(description="'user' or 'assistant'")
    text: str = Field(description="Message text")

class LLMGenerateRequest(BaseModel):
    query: Optional[str] = Field(default=None, description="Driver query or message")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Platform ML & Operational Context")
    history: Optional[List[ChatHistoryItem]] = Field(default_factory=list, description="Conversation history")

class ReasoningChip(BaseModel):
    label: str
    value: str

class LLMGenerateResponse(BaseModel):
    recommendation: str
    reason: str
    suggested_area: str
    confidence: float
    reasoning_chips: List[ReasoningChip] = []
    has_card: bool = False
    status: str = "success"

SYSTEM_PROMPT = """You are Ride AI Driver Copilot, an enterprise-grade AI mobility intelligence assistant for professional rideshare and fleet drivers.

You assist drivers by providing context-aware, analytical, highly actionable, and data-driven insights using the real-time application context provided.

### PROFESSIONAL TERMINOLOGY RULES:
- Use "Trip Duration Intelligence" when referring to travel time and route duration predictions.
- Use "Demand Zone Intelligence" when referring to spatial hotspots and surge clusters.
- Use "Demand Forecasting Engine" when referring to multi-hour demand forecasts.
- Do NOT refer to internal model codes (e.g. "Student A", "Student B", "Student C", "XGBoost", "HDBSCAN", "PyTorch LSTM") in driver-facing responses.

### CORE OPERATIONAL DIRECTIVES:

1. SOURCE OF TRUTH & ZERO FABRICATION:
   - Base all numerical answers strictly on the `Real Application Context` provided.
   - Extract and state the EXACT numbers present in context (e.g. distance_km, formatted_duration, predicted_duration_minutes, demand_score, surge_multiplier).
   - NEVER use literal placeholder characters like 'X' or 'Y'. Use the actual numbers from context.
   - If a model status in context is "UNAVAILABLE" or offline, explicitly inform the driver.

2. DETAILED & STRUCTURED RESPONSES BY QUESTION TYPE:

   A. TRIP DURATION & ETA QUESTIONS (e.g., "trip duration", "how long will this trip take?", "ETA"):
      - Direct Answer: State estimated duration prominently using `formatted_duration` and `predicted_duration_minutes` from context (e.g. "Trip Duration Intelligence estimates this trip at approximately 32 minutes").
      - Trip Specifications: List Pickup location, Destination, Distance (km and miles), Pickup time, Day of week, and Rush hour status.
      - Intelligence Breakdown: Detail key contributing factors (distance, peak hours, day of week, baseline conditions).
      - Driver Takeaway: Actionable shift planning guidance.

   B. DEMAND & SPATIAL HOTSPOT QUESTIONS (e.g., "where is demand high?", "why is demand high?", "explain demand"):
      - Direct Answer: State top demand zone(s) identified by Demand Zone Intelligence.
      - Demand Metrics: Provide Zone Name, Demand Score, Surge Multiplier, and Demand Percentage.
      - Strategic Staging Recommendation: Clear vehicle staging and positioning advice.

   C. FORECAST & OUTLOOK QUESTIONS (e.g., "forecast next 3 hours", "what's the next demand peak?", "tonight's outlook"):
      - Direct Answer: Summarize the forecast horizon from Demand Forecasting Engine.
      - Hourly Breakdown: List hourly predictions for upcoming hours with exact predicted ride counts from context.
      - Trend & Strategy: Rising/falling trend and shift strategy.

   D. VEHICLE STAGING & RELOCATION QUESTIONS (e.g., "where to stage?", "where to find rides?", "best pickup zone"):
      - Direct Answer: Clear target zone recommendation combining spatial demand and forecast trend.
      - Structured Staging Advice:
        • Recommended Zone: [Zone Name]
        • Current Demand Signal: [Score & Surge]
        • Trend: [Rising / Stable]
        • Operational Reason: [Why this pickup zone is optimal]
        • Immediate Action: [Relocate vs hold position]

   E. GENERAL ASSISTANCE & GREETINGS:
      - Provide a structured summary of capabilities across Trip ETAs, Demand Intelligence, 24h Forecasting, and Shift Performance. Do NOT use robotic preambles ("As an AI language model...").

3. FORMATTING & READABILITY:
   - Use clear markdown headers (`###`), bullet points (`•`), and **bold text**.
   - Keep answers structured, concise, professional, and actionable.
"""

async def find_working_ollama_endpoint(client: httpx.AsyncClient) -> Optional[str]:
    """Finds a reachable Ollama URL from candidate base URLs."""
    for base_url in CANDIDATE_OLLAMA_URLS:
        try:
            resp = await client.get(f"{base_url}/api/tags", timeout=3.0)
            if resp.status_code == 200:
                return base_url
        except Exception:
            continue
    return None

async def get_active_ollama_model(client: httpx.AsyncClient, base_url: str) -> str:
    """Detects installed Ollama models or defaults to OLLAMA_MODEL."""
    try:
        resp = await client.get(f"{base_url}/api/tags", timeout=3.0)
        if resp.status_code == 200:
            models = resp.json().get("models", [])
            model_names = [m.get("name") for m in models]
            if OLLAMA_MODEL in model_names:
                return OLLAMA_MODEL
            # Check for partial match (e.g. llama3.2:1b matching llama3.2)
            for m in model_names:
                if OLLAMA_MODEL in m or m in OLLAMA_MODEL:
                    return m
            if model_names:
                logger.info(f"Preferred model '{OLLAMA_MODEL}' not found. Auto-selected installed model '{model_names[0]}'")
                return model_names[0]
    except Exception as e:
        logger.warning(f"Failed querying Ollama tags from {base_url}: {str(e)}")
    return OLLAMA_MODEL

@app.get("/health")
async def health_check():
    """Pings Ollama to verify LLM connectivity."""
    ollama_status = "unreachable"
    active_url = None
    active_model = OLLAMA_MODEL
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            active_url = await find_working_ollama_endpoint(client)
            if active_url:
                ollama_status = "healthy"
                active_model = await get_active_ollama_model(client, active_url)
    except Exception as e:
        logger.warning(f"Ollama health check failed: {str(e)}")

    return {
        "status": "online",
        "ollama_status": ollama_status,
        "ollama_url": active_url or CANDIDATE_OLLAMA_URLS[0],
        "model": active_model
    }

@app.post("/generate", response_model=LLMGenerateResponse)
async def generate_response(req: LLMGenerateRequest):
    """
    Executes real LLM inference via Ollama /api/chat using full context contract and prompt rules.
    """
    query = (req.query or "How can Ride AI help my shift today?").strip()
    context = req.context or {}
    history = req.history or []

    # Extract intent and model context
    intent = context.get("intent_detected", "GENERAL")
    trip_status = context.get("trip_duration", {}).get("status", "OPERATIONAL")
    demand_status = context.get("demand_zones", {}).get("status", "OPERATIONAL")
    forecast_status = context.get("forecast", {}).get("status", "OPERATIONAL")

    trip_prediction = context.get("trip_duration", {}).get("prediction_details", {})
    demand_zones = context.get("demand_zones", {}).get("data", [])
    forecast_data = context.get("forecast", {}).get("data", [])

    top_area = "Midtown Manhattan Core"
    if demand_zones:
        sorted_zones = sorted(demand_zones, key=lambda z: z.get("demand_score", 0), reverse=True)
        top_area = sorted_zones[0].get("zone_name", top_area)

    # Format forecast horizon sample
    forecast_sample = []
    if forecast_data:
        for f in forecast_data[:6]:
            forecast_sample.append({
                "hour": f.get("hour"),
                "predicted_demand_rides": round(f.get("predicted_demand", 0), 1)
            })

    # Build rich application context contract for system prompt
    context_summary = {
        "intent_detected": intent,
        "ml_model_statuses": {
            "Trip Duration Intelligence": trip_status,
            "Demand Zone Intelligence": demand_status,
            "Demand Forecasting Engine": forecast_status,
        },
        "real_model_outputs": {
            "trip_duration_prediction": trip_prediction,
            "active_demand_zones": demand_zones[:6] if demand_zones else [],
            "forecast_next_6_hours": forecast_sample
        },
        "driver_status": context.get("driver_status", {"status": "Active", "rating": 4.92, "city": "New York City"}),
        "driver_location": context.get("driver_location", {"lat": 40.7549, "lng": -73.9840})
    }

    # Construct Ollama /api/chat messages array with history
    system_content = f"{SYSTEM_PROMPT}\n\nReal Application Context:\n{json.dumps(context_summary, indent=2)}"
    messages_payload = [{"role": "system", "content": system_content}]

    for item in history:
        role = "user" if item.role == "user" else "assistant"
        messages_payload.append({"role": role, "content": item.text})

    messages_payload.append({"role": "user", "content": query})

    reasoning_chips = [
        ReasoningChip(
            label="Trip Duration Intelligence",
            value="Operational" if "OPERATIONAL" in str(trip_status).upper() else "Unavailable"
        ),
        ReasoningChip(
            label="Demand Zone Intelligence",
            value="Operational" if "OPERATIONAL" in str(demand_status).upper() else "Unavailable"
        ),
        ReasoningChip(
            label="Demand Forecasting",
            value="Operational" if "OPERATIONAL" in str(forecast_status).upper() else "Unavailable"
        ),
    ]

    # Required Development Logging
    start_time = time.time()
    logger.info(f"AI request received: '{query}' [Intent: {intent}]")

    async with httpx.AsyncClient(timeout=60.0) as client:
        active_url = await find_working_ollama_endpoint(client)
        if active_url:
            target_model = await get_active_ollama_model(client, active_url)
            logger.info(f"LLM model: {target_model} at {active_url}")
            logger.info("Sending request to Ollama...")

            ollama_request_body = {
                "model": target_model,
                "messages": messages_payload,
                "stream": False
            }

            try:
                resp = await client.post(f"{active_url}/api/chat", json=ollama_request_body)
                duration_ms = round((time.time() - start_time) * 1000, 2)

                if resp.status_code == 200:
                    res_json = resp.json()
                    response_text = res_json.get("message", {}).get("content", "").strip()
                    logger.info(f"Ollama response received in {duration_ms} ms (Length: {len(response_text)} chars)")

                    if response_text:
                        q_lower = query.lower()
                        is_positioning_query = intent == "POSITIONING" or any(k in q_lower for k in [
                            "where to go", "high demand", "surge area", "positioning", "best area", "hotspot", "airport status"
                        ])

                        return LLMGenerateResponse(
                            recommendation="Positioning Guidance" if is_positioning_query else "Copilot Advice",
                            reason=response_text,
                            suggested_area=top_area if is_positioning_query else "",
                            confidence=0.95,
                            reasoning_chips=reasoning_chips,
                            has_card=is_positioning_query,
                            status="success"
                        )
                else:
                    logger.warning(f"Ollama HTTP error {resp.status_code}: {resp.text}")
            except Exception as e:
                logger.warning(f"Ollama generation exception at {active_url}: {str(e)}")
        else:
            logger.warning("No working Ollama endpoint found among candidates.")

    # Honest service unavailable response — ZERO pretend AI answers
    duration_ms = round((time.time() - start_time) * 1000, 2)
    logger.warning(f"Ollama request failed after {duration_ms} ms. Returning service unavailable notice.")

    return LLMGenerateResponse(
        recommendation="Service Notice",
        reason="AI Copilot service is temporarily offline. Please ensure Ollama service is running.",
        suggested_area="",
        confidence=0.0,
        reasoning_chips=reasoning_chips,
        has_card=False,
        status="service_offline"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
