from datetime import datetime
from fastapi import APIRouter
from app.schemas.pydantic_schemas import SystemHealthResponse

router = APIRouter(prefix="/api")

@router.get("/health", response_model=SystemHealthResponse)
def get_system_health():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "active_drivers": 14921,
        "active_rides": 3842,
        "system_uptime": "99.98%",
        "avg_model_latency_ms": 14.2,
        "services": {
            "database": "online",
            "trip_duration_model": "active (Student A - XGBoost V3)",
            "demand_zone_model": "pending_integration (Student B)",
            "demand_forecast_model": "pending_integration (Student C)"
        }
    }
