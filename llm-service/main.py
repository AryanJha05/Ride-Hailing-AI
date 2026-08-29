import os
import json
import logging
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import httpx

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("llm-service")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma2")

app = FastAPI(
    title="Ride AI LLM Service",
    description="Ollama Gemma2 LLM Microservice for Ride AI Dispatch Assistant",
    version="1.0.0"
)

class LLMGenerateRequest(BaseModel):
    query: Optional[str] = Field(default=None, description="Driver query or message")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Platform ML & Operational Context")

class ReasoningChip(BaseModel):
    label: str
    value: str

class LLMGenerateResponse(BaseModel):
    recommendation: str
    reason: str
    suggested_area: str
    confidence: float
    reasoning_chips: list[ReasoningChip] = []
    status: str = "success"

SYSTEM_PROMPT = """You are an AI Dispatch Assistant for the Ride AI platform.
Your responsibility is to provide accurate dispatch guidance to drivers based strictly on platform ML context.

CRITICAL INTEGRATION RULES:
1. DO NOT invent, fabricate, or assume fake demand zones, surge multipliers, forecasted demand arrays, or trip duration ETAs.
2. If Student B (Spatial Demand Zones) or Student C (Demand Forecast) is marked as "MODEL_NOT_CONNECTED", state clearly that the model is not currently connected.
3. Student A (XGBoost V3 Trip Duration) is connected and operational.
4. Keep advice concise, actionable, professional, and friendly.
"""

async def get_active_ollama_model(client: httpx.AsyncClient) -> str:
    """Helper to detect installed Ollama model or fall back to OLLAMA_MODEL."""
    try:
        resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
        if resp.status_code == 200:
            models = resp.json().get("models", [])
            model_names = [m.get("name") for m in models]
            if OLLAMA_MODEL in model_names:
                return OLLAMA_MODEL
            # If specified model not pulled, return first available installed model
            if model_names:
                logger.info(f"OLLAMA_MODEL '{OLLAMA_MODEL}' not found. Using installed model '{model_names[0]}'")
                return model_names[0]
    except Exception as e:
        logger.warning(f"Could not query Ollama models: {str(e)}")
    return OLLAMA_MODEL

@app.get("/health")
async def health_check():
    """Pings the Ollama engine to verify LLM connectivity."""
    ollama_status = "unreachable"
    active_model = OLLAMA_MODEL
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                ollama_status = "healthy"
                active_model = await get_active_ollama_model(client)
    except Exception as e:
        logger.warning(f"Ollama health check ping failed: {str(e)}")

    return {
        "status": "online",
        "ollama_status": ollama_status,
        "ollama_base_url": OLLAMA_BASE_URL,
        "model": active_model
    }

@app.post("/generate", response_model=LLMGenerateResponse)
async def generate_response(req: LLMGenerateRequest):
    """
    Generates driver dispatch advice using Ollama LLM reasoning over actual ML context.
    """
    query = req.query or "What is my recommended dispatch status?"
    context = req.context or {}

    # Extract model statuses and real data from context contract
    student_a_status = context.get("trip_duration", {}).get("status", "Operational (XGBoost V3)")
    student_b_status = context.get("demand_zones", {}).get("status", "Operational (Student B - HDBSCAN)")
    student_c_status = context.get("forecast", {}).get("status", "MODEL_NOT_CONNECTED")
    demand_zones_data = context.get("demand_zones", {}).get("data", [])

    zone_summary = ""
    top_area = "Midtown Manhattan"
    if demand_zones_data:
        sorted_zones = sorted(demand_zones_data, key=lambda z: z.get("demand_score", 0), reverse=True)
        top_area = sorted_zones[0].get("zone_name", top_area)
        zone_summary = "\n".join([
            f"- {z.get('zone_name')}: Score {z.get('demand_score')}, Surge {z.get('surge_multiplier')}x, Trend {z.get('trend')}"
            for z in sorted_zones[:5]
        ])

    user_prompt = f"""
Current Driver Query: "{query}"

Real Platform ML Operational Context:
- Student A (Trip Duration): {student_a_status}
- Student B (Demand Zones): {student_b_status}
- Student C (Demand Forecast): {student_c_status}

Active NYC Spatial Demand Clusters (Student B HDBSCAN Model):
{zone_summary if zone_summary else "No active clusters available"}

Driver Position: {json.dumps(context.get("driver_location", {"lat": 40.7549, "lng": -73.9840}))}

Instructions:
Provide a concise, direct, helpful answer to the driver query using the real spatial demand and surge data above.
"""

    fallback_chips = [
        ReasoningChip(label="Student A (Trip Duration)", value="Operational (XGBoost V3)"),
        ReasoningChip(label="Student B (Demand Zones)", value="Operational (HDBSCAN)"),
        ReasoningChip(label="Student C (Forecast)", value="Model Not Connected"),
    ]

    try:
        async with httpx.AsyncClient(timeout=40.0) as client:
            target_model = await get_active_ollama_model(client)
            ollama_payload = {
                "model": target_model,
                "system": SYSTEM_PROMPT,
                "prompt": user_prompt,
                "stream": False
            }
            logger.info(f"Sending prompt to Ollama at {OLLAMA_BASE_URL}/api/generate using model {target_model}")
            resp = await client.post(f"{OLLAMA_BASE_URL}/api/generate", json=ollama_payload)

            if resp.status_code == 200:
                result = resp.json()
                response_text = result.get("response", "").strip()
                return LLMGenerateResponse(
                    recommendation="AI Positioning Guidance",
                    reason=response_text if response_text else "Based on real HDBSCAN cluster data, target high-surge areas like Midtown Manhattan.",
                    suggested_area=top_area,
                    confidence=0.95,
                    reasoning_chips=fallback_chips,
                    status="success"
                )
            else:
                logger.warning(f"Ollama returned HTTP status {resp.status_code}: {resp.text}")
    except Exception as e:
        logger.warning(f"Failed to communicate with Ollama at {OLLAMA_BASE_URL}: {str(e)}")

    # Fallback Response if Ollama service is unreachable
    return LLMGenerateResponse(
        recommendation="Platform ML System Status",
        reason=f"High demand currently detected in {top_area}. Student A (XGBoost V3) and Student B (HDBSCAN) models are fully operational.",
        suggested_area=top_area,
        confidence=0.88,
        reasoning_chips=fallback_chips,
        status="ollama_fallback"
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
