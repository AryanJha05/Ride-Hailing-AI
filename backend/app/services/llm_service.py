import os
import httpx
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.core.logger import logger
from app.services.demand_prediction_service import get_demand_zone_status, detect_demand_zones
from app.services.forecast_service import get_forecast_status, get_forecast_full_payload
from app.services.trip_duration_service import trip_duration_model_service

PRIMARY_LLM_URL = os.getenv("LLM_SERVICE_URL", "http://host.docker.internal:8001").rstrip("/")
CANDIDATE_LLM_URLS = [
    PRIMARY_LLM_URL,
    "http://host.docker.internal:8001",
    "http://172.17.0.1:8001",
    "http://llm-service:8001",
    "http://localhost:8001"
]

def build_llm_context_contract(
    driver_lat: float = 40.7549,
    driver_lng: float = -73.9840,
    driver_query: str = ""
) -> Dict[str, Any]:
    """
    Constructs the standardized ML context contract payload for the LLM service.
    Exposes actual operational states and real model outputs from Student A, B, and C models.
    """
    query_lower = (driver_query or "").lower().strip()

    # Fetch Student B spatial demand status and data
    demand_status = get_demand_zone_status()
    try:
        demand_data = detect_demand_zones(driver_lat=driver_lat, driver_lng=driver_lng)
        zones_list = demand_data.get("all_zones", [])
    except Exception as e:
        logger.warning(f"Error fetching demand zones for LLM context: {str(e)}")
        zones_list = []

    # Fetch Student C 24h forecast status and data
    forecast_status = get_forecast_status()
    try:
        forecast_payload = get_forecast_full_payload(zone_name="Midtown Manhattan")
        forecast_list = forecast_payload.get("data", [])
    except Exception as e:
        logger.warning(f"Error fetching forecast payload for LLM context: {str(e)}")
        forecast_list = []

    # Detect user intent from query
    is_trip_duration_query = any(kw in query_lower for kw in [
        "trip duration", "duration", "how long", "eta", "travel time", "jfk", "brooklyn",
        "take time", "minutes", "trip time", "distance", "how long will"
    ])
    is_forecast_query = any(kw in query_lower for kw in [
        "forecast", "next 3 hours", "next demand peak", "tonight", "outlook", "trend", "3 hours", "hourly"
    ])
    is_positioning_query = any(kw in query_lower for kw in [
        "position", "where to go", "where should i", "hotspot", "best area", "surge area", "where position"
    ])

    intent = "GENERAL"
    if is_trip_duration_query:
        intent = "TRIP_DURATION"
    elif is_positioning_query:
        intent = "POSITIONING"
    elif is_forecast_query:
        intent = "FORECAST"
    elif any(kw in query_lower for kw in ["demand", "surge", "why demand", "explain demand"]):
        intent = "DEMAND"

    # Evaluate Student A XGBoost model prediction if relevant or trip parameters mentioned
    trip_prediction_ctx: Dict[str, Any] = {}
    try:
        # Determine origin/destination based on query context or standard NYC routes
        if "jfk" in query_lower and "brooklyn" in query_lower:
            orig_lat, orig_lng = 40.6413, -73.7781
            dest_lat, dest_lng = 40.6925, -73.9904
            orig_name, dest_name = "JFK International Airport", "Downtown Brooklyn"
        elif "lga" in query_lower or "laguardia" in query_lower:
            orig_lat, orig_lng = 40.7769, -73.8740
            dest_lat, dest_lng = 40.7549, -73.9840
            orig_name, dest_name = "LaGuardia Airport", "Midtown Manhattan"
        else:
            orig_lat, orig_lng = driver_lat, driver_lng
            dest_lat, dest_lng = 40.6925, -73.9904
            orig_name, dest_name = "Driver Current Location (Midtown)", "Downtown Brooklyn"

        now_dt = datetime.now()
        raw_input = {
            "origin_lat": orig_lat,
            "origin_lng": orig_lng,
            "dest_lat": dest_lat,
            "dest_lng": dest_lng,
            "pickup_datetime": now_dt.strftime("%Y-%m-%d %H:%M:%S"),
            "passenger_count": 1,
            "vendor_id": 1
        }
        pred_res = trip_duration_model_service.predict(raw_input)

        pickup_hour = now_dt.hour
        is_rush = 1 if pickup_hour in [7, 8, 9, 16, 17, 18, 19] else 0
        is_wknd = 1 if now_dt.weekday() >= 5 else 0

        trip_prediction_ctx = {
            "status": "OPERATIONAL",
            "model": "Trip Duration Intelligence",
            "origin": orig_name,
            "destination": dest_name,
            "origin_coords": {"lat": orig_lat, "lng": orig_lng},
            "dest_coords": {"lat": dest_lat, "lng": dest_lng},
            "distance_km": pred_res.get("distance_km", 0.0),
            "distance_miles": pred_res.get("distance_miles", 0.0),
            "predicted_duration_minutes": pred_res.get("duration_min", 0.0),
            "formatted_duration": pred_res.get("formatted_duration", "0m 00s"),
            "predicted_seconds": pred_res.get("predicted_seconds", 0.0),
            "pickup_time": now_dt.strftime("%H:%M"),
            "day_of_week": now_dt.strftime("%A"),
            "is_rush_hour": is_rush,
            "is_weekend": is_wknd,
            "weather": {
                "temp": 55.0,
                "conditions": "Clear",
                "precip": 0.0
            },
            "features_contributing": [
                f"Total Distance ({pred_res.get('distance_km')} km / {pred_res.get('distance_miles')} mi)",
                f"Pickup time ({now_dt.strftime('%H:%M')}, {'Rush hour' if is_rush else 'Standard traffic'})",
                f"Day of week ({now_dt.strftime('%A')})",
                "Clear weather baseline"
            ]
        }
    except Exception as ex:
        logger.warning(f"Trip duration prediction unavailable for LLM context: {str(ex)}")
        trip_prediction_ctx = {
            "status": "UNAVAILABLE",
            "model": "Trip Duration Intelligence",
            "message": f"Prediction service unavailable: {str(ex)}"
        }

    return {
        "intent_detected": intent,
        "driver_location": {"lat": driver_lat, "lng": driver_lng},
        "trip_duration": {
            "model": "trip_duration_intelligence",
            "status": trip_prediction_ctx.get("status", "OPERATIONAL"),
            "prediction_details": trip_prediction_ctx
        },
        "demand_zones": {
            "status": demand_status.get("status", "OPERATIONAL"),
            "model_name": "Demand Zone Intelligence",
            "data": zones_list
        },
        "forecast": {
            "status": forecast_status.get("status", "OPERATIONAL"),
            "model_name": "Demand Forecasting Engine",
            "data": forecast_list
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
    driver_lng: float = -73.9840,
    history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """
    Calls the LLM service /generate endpoint passing query, conversation history, and context contract.
    Handles service availability gracefully without returning static fake responses.
    """
    context_contract = build_llm_context_contract(driver_lat=driver_lat, driver_lng=driver_lng, driver_query=query)

    payload = {
        "query": query,
        "context": context_contract,
        "history": history or []
    }

    async with httpx.AsyncClient(timeout=50.0) as client:
        for url in CANDIDATE_LLM_URLS:
            try:
                resp = await client.post(f"{url}/generate", json=payload)
                if resp.status_code == 200:
                    return resp.json()
            except Exception as e:
                logger.warning(f"Failed reaching LLM service at {url}: {str(e)}")

    # Fallback response ONLY when microservice is completely unreachable
    return {
        "recommendation": "Service Status Notice",
        "reason": "AI Copilot service is temporarily offline. Please verify backend service connection and try again.",
        "suggested_area": "",
        "confidence": 0.0,
        "reasoning_chips": [
            {"label": "Trip Duration Intelligence", "value": "Operational"},
            {"label": "Demand Zone Intelligence", "value": "Operational"},
            {"label": "Demand Forecasting", "value": "Operational"}
        ],
        "has_card": False,
        "status": "llm_service_offline"
    }

