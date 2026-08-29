from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.entities import User, UserRole
from app.core.security import require_role
from app.schemas.pydantic_schemas import DriverCreateRequest, DriverUpdateRequest, DriverResponseSchema
from app.services import driver_service

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

@router.get("/drivers", response_model=list[DriverResponseSchema])
def get_admin_drivers(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    return driver_service.list_drivers(db)

@router.post("/drivers", response_model=DriverResponseSchema, status_code=status.HTTP_201_CREATED)
def create_admin_driver(
    req: DriverCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    return driver_service.create_driver_account(db, req)

@router.get("/drivers/{driver_id}", response_model=DriverResponseSchema)
def get_admin_driver_detail(
    driver_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    driver = driver_service.get_driver_by_id(db, driver_id)
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driver '{driver_id}' not found."
        )
    return driver

@router.patch("/drivers/{driver_id}", response_model=DriverResponseSchema)
def update_admin_driver(
    driver_id: str,
    req: DriverUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    return driver_service.update_driver_account(db, driver_id, req)


@router.get("/models/health")
async def get_admin_model_health_noc(
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """
    Returns live enterprise NOC health telemetry for ML models and platform services.
    Protected for Admin role.
    """
    from app.services.noc_telemetry_service import get_noc_model_health_telemetry
    return await get_noc_model_health_telemetry()


@router.post("/models/{service_id}/reconnect")
async def reconnect_admin_model_service(
    service_id: str,
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """
    Executes a health probe / reconnect attempt for the specified ML model or service.
    Protected for Admin role.
    """
    from app.services.noc_telemetry_service import get_noc_model_health_telemetry
    telemetry = await get_noc_model_health_telemetry()
    matched = next((s for s in telemetry["services"] if s["id"] == service_id), None)
    if not matched:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service '{service_id}' not recognized in NOC roster."
        )
    return {
        "status": "success",
        "message": f"Reconnect probe completed for service '{matched['name']}'. Status: {matched['status']}",
        "service": matched
    }


