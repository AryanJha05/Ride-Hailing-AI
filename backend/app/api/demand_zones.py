from typing import List
from fastapi import APIRouter, Depends
from app.schemas.pydantic_schemas import DemandZoneResponse
from app.services.demand_prediction_service import detect_demand_zones
from app.models.entities import User, UserRole
from app.core.security import require_role

router = APIRouter(prefix="/api")

@router.get("/demand-zones", response_model=List[DemandZoneResponse])
def get_demand_zones(current_user: User = Depends(require_role([UserRole.DRIVER, UserRole.ADMIN]))):
    data = detect_demand_zones()
    return data.get("all_zones", [])
