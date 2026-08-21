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
    db_zones = db.query(DemandZone).all()
    if db_zones and len(db_zones) > 0:
        results = []
        for z in db_zones:
            results.append({
                "id": z.id,
                "zone_name": z.zone_name,
                "lat": z.lat,
                "lng": z.lng,
                "demand_score": z.demand_score or 75.0,
                "trend": z.trend or "up",
                "surge_multiplier": z.surge_multiplier or 1.2,
                "demand_percentage": f"+{int((z.surge_multiplier - 1.0) * 50)}%" if z.surge_multiplier and z.surge_multiplier > 1 else "+15%",
                "demand_forecast_delta": "+150%",
                "historical_avg": f"{z.surge_multiplier or 1.2}x",
                "distance_miles": "2.5 mi",
                "recommended": True if z.demand_score and z.demand_score > 90 else False
            })
        return results

    # Fallback if DB table is unseeded
    data = detect_demand_zones()
    return data.get("all_zones", [])

