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

