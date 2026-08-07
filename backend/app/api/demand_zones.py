from typing import List
from fastapi import APIRouter
from app.schemas.pydantic_schemas import DemandZoneResponse
from app.services.demand_prediction_service import detect_demand_zones

router = APIRouter()

@router.get("/demand-zones", response_model=List[DemandZoneResponse])
def get_demand_zones():
    data = detect_demand_zones()
    return data.get("all_zones", [])
