from fastapi import APIRouter, Query, Depends
from app.schemas.pydantic_schemas import ForecastResponse, ModelStatusResponse
from app.services.forecast_service import get_forecast_full_payload, get_forecast_status
from app.models.entities import User, UserRole
from app.core.security import require_role

router = APIRouter(prefix="/api")

@router.get("/forecast", response_model=ForecastResponse)
def get_forecast(
    zone: str = Query("Midtown Manhattan", description="Demand zone name"),
    horizon_hours: int = Query(24, ge=1, le=168),
    current_user: User = Depends(require_role([UserRole.DRIVER, UserRole.ADMIN]))
):
    """
    Returns 24-hour time-series demand forecast points predicted by Student C's model.
    When Student C model artifact is not connected, returns data: [] and status: MODEL_NOT_CONNECTED.
    """
    return get_forecast_full_payload(zone_name=zone, horizon_hours=horizon_hours)

@router.get("/forecast/status", response_model=ModelStatusResponse)
def get_forecast_model_status(
    current_user: User = Depends(require_role([UserRole.DRIVER, UserRole.ADMIN]))
):
    """
    Returns connectivity and operational health status of Student C's ML model.
    """
    return get_forecast_status()
