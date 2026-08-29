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

SYSTEM_PROMPT = """You are Ride AI Driver Assistant, an AI copilot for the Ride AI Mobility Intelligence application.

You help drivers understand and use this application.

You can answer questions about:
- Live Demand & Surge Zones
- Driver positioning & spatial demand (Student B - HDBSCAN)
- 24h Demand forecasting (Student C - PyTorch LSTM)
- Trip duration & ETA estimates (Student A - XGBoost V3)
- Earnings, trip logs, analytics, driver status
- Features and functionality of the Ride AI website

Use the supplied application context as your source of truth.

Rules:
1. Never invent application data, surge multipliers, earnings, or model predictions.
2. Answer the user prompt directly, concisely, and helpfully.
3. Do NOT return a generic demand recommendation unless the user explicitly asks for positioning or high demand guidance.
4. If the user asks "how would you help me" or greets you, explain your capabilities as a Ride AI copilot instead of giving a demand recommendation.
5. If the question is completely unrelated to Ride AI or mobility intelligence (e.g. general trivia, capital of France), politely explain that you are strictly scoped to the Ride AI application.
6. If information is unavailable, explicitly state that it is unavailable.
7. Keep responses concise (2 to 4 sentences max).
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

    # Extract spatial demand and ML status summaries for context block
    student_a_status = context.get("trip_duration", {}).get("status", "Operational (XGBoost V3)")
    student_b_status = context.get("demand_zones", {}).get("status", "Operational (Student B - HDBSCAN)")
    student_c_status = context.get("forecast", {}).get("status", "Operational (Student C - PyTorch LSTM)")
    demand_zones = context.get("demand_zones", {}).get("data", [])
    forecast_data = context.get("forecast", {}).get("data", [])

    top_area = "Midtown Manhattan Core"
    top_surge = 1.71
    if demand_zones:
        sorted_zones = sorted(demand_zones, key=lambda z: z.get("demand_score", 0), reverse=True)
        top_area = sorted_zones[0].get("zone_name", top_area)
        top_surge = sorted_zones[0].get("surge_multiplier", top_surge)

    # Format context contract cleanly for system message
    context_summary = {
        "models": {
            "Student A (Trip Duration)": student_a_status,
            "Student B (Spatial Demand)": student_b_status,
            "Student C (24h Forecast)": student_c_status,
        },
        "active_demand_zones": demand_zones[:5] if demand_zones else [],
        "forecast_sample": forecast_data[:5] if forecast_data else [],
        "driver_status": context.get("driver_status", {"status": "Active", "rating": 4.92, "city": "New York City"})
    }

    # Construct Ollama /api/chat messages array with history
    system_content = f"{SYSTEM_PROMPT}\n\nReal Application Context:\n{json.dumps(context_summary, indent=2)}"
    messages_payload = [{"role": "system", "content": system_content}]

    for item in history:
        role = "user" if item.role == "user" else "assistant"
        messages_payload.append({"role": role, "content": item.text})

    messages_payload.append({"role": "user", "content": query})

    fallback_chips = [
        ReasoningChip(label="Student A (Trip Duration)", value="Operational"),
        ReasoningChip(label="Student B (Demand Zones)", value="Operational"),
        ReasoningChip(label="Student C (Forecast)", value="Operational"),
    ]

    # Required Development Logging
    start_time = time.time()
    logger.info(f"AI request received: '{query}'")

    async with httpx.AsyncClient(timeout=45.0) as client:
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
                        # Determine if query calls for a spatial positioning recommendation card
                        q_lower = query.lower()
                        is_positioning_query = any(k in q_lower for k in [
                            "where to go", "high demand", "surge area", "positioning", "best area", "hotspot", "airport status"
                        ])

                        return LLMGenerateResponse(
                            recommendation="Positioning Guidance" if is_positioning_query else "Copilot Advice",
                            reason=response_text,
                            suggested_area=top_area if is_positioning_query else "",
                            confidence=0.95,
                            reasoning_chips=fallback_chips,
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
        reason="AI Assistant is temporarily offline. Please ensure Ollama service is running.",
        suggested_area="",
        confidence=0.0,
        reasoning_chips=fallback_chips,
        has_card=False,
        status="service_offline"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
