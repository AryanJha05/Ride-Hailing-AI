from fastapi import APIRouter, Depends
from app.models.entities import User, UserRole
from app.core.security import require_role

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"])

@router.get("/fleet")
def get_fleet_summary(current_user: User = Depends(require_role(UserRole.ADMIN))):
    return {
        "status": "success",
        "total_fleet_vehicles": 450,
        "active_vehicles": 382,
        "maintenance_required": 14,
        "city": "New York City",
        "requested_by": current_user.email
    }
