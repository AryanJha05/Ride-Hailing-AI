from fastapi import APIRouter, Query
from app.schemas.pydantic_schemas import ForecastResponse
from app.services.forecast_service import get_hourly_forecast

router = APIRouter()

@router.get("/forecast", response_model=ForecastResponse)
def get_forecast(
    zone: str = Query("Financial District", description="Demand zone name"),
    horizon_hours: int = Query(24, ge=1, le=168)
):
    points = get_hourly_forecast(zone_name=zone, horizon_hours=horizon_hours)
    return {
        "zone_name": zone,
        "horizon_hours": horizon_hours,
        "data": points
    }
