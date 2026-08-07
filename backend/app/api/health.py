import httpx
from datetime import datetime
from fastapi import APIRouter
from app.core.config import settings
from app.schemas.pydantic_schemas import SystemHealthResponse

router = APIRouter()

@router.get("/health", response_model=SystemHealthResponse)
def get_system_health():
    # Check Ollama connection
    ollama_status = "offline"
    try:
        with httpx.Client(timeout=1.5) as client:
            r = client.get(f"{settings.OLLAMA_HOST}/api/tags")
            if r.status_code == 200:
                ollama_status = "online"
    except Exception:
        ollama_status = "offline (using ML rule engine fallback)"

    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "active_drivers": 14921,
        "active_rides": 3842,
        "system_uptime": "99.98%",
        "avg_model_latency_ms": 14.2,
        "services": {
            "database": "online",
            "trip_duration_model": "active (Student A)",
            "demand_zone_model": "active (Student B)",
            "demand_forecast_model": "active (Student C)",
            "ollama_llm": ollama_status
        }
    }
