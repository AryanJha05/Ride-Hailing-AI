from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.schemas.pydantic_schemas import DemandZoneResponse, ModelStatusResponse
from app.models.entities import User, UserRole
from app.services.demand_prediction_service import detect_demand_zones, get_demand_zone_status
from app.core.security import require_role

router = APIRouter(prefix="/api")

@router.get("/demand-zones", response_model=List[DemandZoneResponse])
def get_demand_zones(
    driver_lat: float = 40.7549,
    driver_lng: float = -73.9840,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.DRIVER, UserRole.ADMIN]))
):
    """
    Returns spatial demand zones predicted by Student B's model.
    When Student B model artifact is not connected, returns empty list [].
    """
    res = detect_demand_zones(driver_lat=driver_lat, driver_lng=driver_lng)
    return res.get("all_zones", [])

@router.get("/demand-zones/status", response_model=ModelStatusResponse)
def get_demand_zones_model_status(
    current_user: User = Depends(require_role([UserRole.DRIVER, UserRole.ADMIN]))
):
    """
    Returns connectivity and operational health status of Student B's ML model.
    """
    return get_demand_zone_status()
