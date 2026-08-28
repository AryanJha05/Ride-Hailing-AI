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

@app.get("/health")
async def health_check():
    """Pings the Ollama engine to verify LLM connectivity."""
    ollama_status = "unreachable"
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                ollama_status = "healthy"
    except Exception as e:
        logger.warning(f"Ollama health check ping failed: {str(e)}")

    return {
        "status": "online",
        "ollama_status": ollama_status,
        "ollama_base_url": OLLAMA_BASE_URL,
        "model": OLLAMA_MODEL
    }

@app.post("/generate", response_model=LLMGenerateResponse)
async def generate_response(req: LLMGenerateRequest):
    """
    Generates driver dispatch advice using Ollama + Gemma2 reasoning over actual ML context.
    """
    query = req.query or "What is my recommended dispatch status?"
    context = req.context or {}

    # Extract model statuses from context contract
    student_a_status = context.get("trip_duration", {}).get("status", "Operational (XGBoost V3)")
    student_b_status = context.get("demand_zones", {}).get("status", "MODEL_NOT_CONNECTED")
    student_c_status = context.get("forecast", {}).get("status", "MODEL_NOT_CONNECTED")

    user_prompt = f"""
Current Driver Query: "{query}"

Platform Context:
- Student A (Trip Duration): {student_a_status}
- Student B (Demand Zones): {student_b_status}
- Student C (Demand Forecast): {student_c_status}
- Full Context Payload: {json.dumps(context)}

Please generate dispatch recommendation according to the system rules.
"""

    fallback_chips = [
        ReasoningChip(label="Student A (Trip Duration)", value="Operational (XGBoost V3)"),
        ReasoningChip(label="Student B (Demand Zones)", value=student_b_status),
        ReasoningChip(label="Student C (Forecast)", value=student_c_status),
    ]

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            ollama_payload = {
                "model": OLLAMA_MODEL,
                "system": SYSTEM_PROMPT,
                "prompt": user_prompt,
                "stream": False
            }
            logger.info(f"Sending prompt to Ollama at {OLLAMA_BASE_URL}/api/generate using model {OLLAMA_MODEL}")
            resp = await client.post(f"{OLLAMA_BASE_URL}/api/generate", json=ollama_payload)

            if resp.status_code == 200:
                result = resp.json()
                response_text = result.get("response", "").strip()
                return LLMGenerateResponse(
                    recommendation="AI Assistant Guidance",
                    reason=response_text if response_text else "Student A XGBoost V3 Trip Duration model is active. Student B & C models pending integration.",
                    suggested_area="Midtown Manhattan",
                    confidence=0.92,
                    reasoning_chips=fallback_chips,
                    status="success"
                )
            else:
                logger.warning(f"Ollama returned HTTP status {resp.status_code}: {resp.text}")
    except Exception as e:
        logger.warning(f"Failed to communicate with Ollama at {OLLAMA_BASE_URL}: {str(e)}")

    # Graceful Fallback Response when Ollama is offline/unreachable
    return LLMGenerateResponse(
        recommendation="Platform ML System Status",
        reason="The Ollama LLM service (Gemma2) is currently offline or unreachable. Student A (XGBoost V3 Trip Duration) model is fully operational. Student B & C models are waiting for teammate model artifacts.",
        suggested_area="Midtown Manhattan",
        confidence=0.0,
        reasoning_chips=fallback_chips,
        status="ollama_offline"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
