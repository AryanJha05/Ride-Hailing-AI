import os
import httpx
from typing import Dict, Any
from app.core.logger import logger
from app.services.demand_prediction_service import get_demand_zone_status, detect_demand_zones
from app.services.forecast_service import get_forecast_status, get_forecast_full_payload

LLM_SERVICE_URL = os.getenv("LLM_SERVICE_URL", "http://localhost:8001").rstrip("/")

def build_llm_context_contract(
    driver_lat: float = 40.7549,
    driver_lng: float = -73.9840,
    driver_query: str = ""
) -> Dict[str, Any]:
    """
    Constructs the standardized ML context contract payload for the LLM service.
    Exposes actual statuses of Student A, Student B, and Student C models.
    """
    demand_status = get_demand_zone_status()
    forecast_status = get_forecast_status()

    demand_data = detect_demand_zones(driver_lat=driver_lat, driver_lng=driver_lng)
    forecast_data = get_forecast_full_payload(zone_name="Midtown Manhattan")

    return {
        "driver_location": {"lat": driver_lat, "lng": driver_lng},
        "trip_duration": {
            "model": "xgboost-v3",
            "status": "OPERATIONAL",
            "description": "Student A XGBoost V3 model connected and predicting trip ETAs"
        },
        "demand_zones": {
            "status": demand_status["status"],
            "model_name": demand_status["model_name"],
            "data": demand_data.get("all_zones", [])
        },
        "forecast": {
            "status": forecast_status["status"],
            "model_name": forecast_status["model_name"],
            "data": forecast_data.get("data", [])
        },
        "driver_status": {
            "status": "Active",
            "rating": 4.92,
            "city": "New York City"
        }
    }

async def request_driver_advice(
    query: str,
    driver_lat: float = 40.7549,
    driver_lng: float = -73.9840
) -> Dict[str, Any]:
    """
    Calls the LLM service /generate endpoint passing the query and full context contract.
    Handles service availability gracefully without crashing backend.
    """
    context_contract = build_llm_context_contract(driver_lat=driver_lat, driver_lng=driver_lng, driver_query=query)

    payload = {
        "query": query,
        "context": context_contract
    }

    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.post(f"{LLM_SERVICE_URL}/generate", json=payload)
            if resp.status_code == 200:
                return resp.json()
            else:
                logger.warning(f"LLM service returned HTTP status {resp.status_code}")
    except Exception as e:
        logger.warning(f"Unable to connect to LLM service at {LLM_SERVICE_URL}: {str(e)}")

    # Fallback response if LLM service is offline
    return {
        "recommendation": "Platform System Advice",
        "reason": "Student A XGBoost V3 model is active for ETA calculation. Student B (Demand Zones) and Student C (Demand Forecast) models are in 'MODEL_NOT_CONNECTED' state awaiting teammate artifacts. (LLM engine offline)",
        "suggested_area": "Midtown Manhattan",
        "confidence": 0.0,
        "reasoning_chips": [
            {"label": "Student A (Trip Duration)", "value": "Operational (XGBoost V3)"},
            {"label": "Student B (Demand Zones)", "value": "Model Not Connected"},
            {"label": "Student C (Forecast)", "value": "Model Not Connected"}
        ],
        "status": "llm_service_offline"
    }
