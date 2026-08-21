from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.schemas.pydantic_schemas import DemandZoneResponse
from app.models.entities import User, UserRole, DemandZone
from app.services.demand_prediction_service import detect_demand_zones
from app.core.security import require_role

router = APIRouter(prefix="/api")

@router.get("/demand-zones", response_model=List[DemandZoneResponse])
def get_demand_zones(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.DRIVER, UserRole.ADMIN]))
):
    # Student B spatial demand-zone model is pending integration.
    # Return empty list signaling honest un-integrated state.
    return []


