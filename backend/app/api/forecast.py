from fastapi import APIRouter, Query, Depends
from app.schemas.pydantic_schemas import ForecastResponse
from app.services.forecast_service import get_hourly_forecast
from app.models.entities import User, UserRole
from app.core.security import require_role

router = APIRouter(prefix="/api")

@router.get("/forecast", response_model=ForecastResponse)
def get_forecast(
    zone: str = Query("Midtown Manhattan", description="Demand zone name"),
    horizon_hours: int = Query(24, ge=1, le=168),
    current_user: User = Depends(require_role([UserRole.DRIVER, UserRole.ADMIN]))
):
    points = get_hourly_forecast(zone_name=zone, horizon_hours=horizon_hours)
    return {
        "zone_name": zone,
        "horizon_hours": horizon_hours,
        "data": points
    }
