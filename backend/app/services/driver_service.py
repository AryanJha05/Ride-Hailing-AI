import secrets
import string
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.entities import User, UserRole, Driver
from app.core.security import get_password_hash
from app.schemas.pydantic_schemas import DriverCreateRequest, DriverUpdateRequest

def generate_temp_password(length: int = 10) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))

def _format_driver_dict(d: Driver) -> dict:
    return {
        "id": d.id,
        "user_id": d.user_id,
        "driver_id": d.driver_id or f"NYC-DRV-{d.id[:6].upper()}",
        "name": d.name,
        "email": d.email,
        "phone": d.phone or "+1 (555) 234-5678",
        "license_number": d.license_number or "NYC-TLC-99821",
        "vehicle_make": getattr(d, "vehicle_make", "Toyota") or "Toyota",
        "vehicle_model": getattr(d, "vehicle_model", "Camry Hybrid") or "Camry Hybrid",
        "vehicle_plate": getattr(d, "vehicle_plate", "NYC-TLC-7782") or "NYC-TLC-7782",
        "status": d.status or "Active",
        "rating": d.rating if d.rating is not None else 5.0,
        "total_trips": d.total_trips or 0,
        "total_earnings": d.total_earnings or 0.0,
        "created_at": d.created_at.isoformat() if d.created_at else None
    }

def list_drivers(db: Session) -> List[dict]:
    drivers = db.query(Driver).order_by(Driver.created_at.desc()).all()
    return [_format_driver_dict(d) for d in drivers]

def get_driver_by_id(db: Session, driver_id_param: str) -> Optional[dict]:
    driver = db.query(Driver).filter(
        (Driver.id == driver_id_param) | (Driver.driver_id == driver_id_param)
    ).first()
    if not driver:
        return None
    return _format_driver_dict(driver)

def create_driver_account(db: Session, req: DriverCreateRequest) -> dict:
    clean_email = req.email.strip().lower()
    
    # 1. Check if user/driver already exists
    existing_user = db.query(User).filter(User.email == clean_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An account with email '{clean_email}' already exists."
        )
    
    existing_driver = db.query(Driver).filter(Driver.email == clean_email).first()
    if existing_driver:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A driver with email '{clean_email}' already exists."
        )
        
    # Generate password if not provided
    temp_password = req.password.strip() if req.password and len(req.password.strip()) > 0 else generate_temp_password(10)
    hashed_pwd = get_password_hash(temp_password)
    
    count = db.query(Driver).count()
    formatted_driver_id = req.driver_id.strip() if req.driver_id and len(req.driver_id.strip()) > 0 else f"NYC-DRV-{count + 1:03d}"
    
    try:
        # 2. Create User account with role DRIVER
        new_user = User(
            name=req.name.strip(),
            email=clean_email,
            password_hash=hashed_pwd,
            role=UserRole.DRIVER,
            is_active=True if req.status != "Inactive" else False
        )
        db.add(new_user)
        db.flush() # Populate new_user.id
        
        # 3. Create Driver profile
        new_driver = Driver(
            user_id=new_user.id,
            driver_id=formatted_driver_id,
            name=req.name.strip(),
            email=clean_email,
            phone=req.phone.strip() if req.phone else "+1 (555) 345-6789",
            license_number=req.license_number.strip() if req.license_number else f"NYC-TLC-{count + 1000:04d}",
            vehicle_make=req.vehicle_make.strip() if req.vehicle_make else "Toyota",
            vehicle_model=req.vehicle_model.strip() if req.vehicle_model else "Camry Hybrid",
            vehicle_plate=req.vehicle_plate.strip() if req.vehicle_plate else f"NYC-TLC-{count + 7000:04d}",
            status=req.status or "Active",
            rating=5.00,
            total_trips=0,
            total_earnings=0.0,
            acceptance_rate=100.0,
            cancellation_rate=0.0
        )
        db.add(new_driver)
        db.commit()
        db.refresh(new_driver)
        
        res = _format_driver_dict(new_driver)
        res["temp_password"] = temp_password
        return res
    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create driver account: {str(e)}"
        )

def update_driver_account(db: Session, driver_id_param: str, req: DriverUpdateRequest) -> dict:
    driver = db.query(Driver).filter(
        (Driver.id == driver_id_param) | (Driver.driver_id == driver_id_param)
    ).first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driver '{driver_id_param}' not found."
        )
    
    if req.phone is not None:
        driver.phone = req.phone.strip()
    if req.license_number is not None:
        driver.license_number = req.license_number.strip()
    if req.vehicle_make is not None:
        driver.vehicle_make = req.vehicle_make.strip()
    if req.vehicle_model is not None:
        driver.vehicle_model = req.vehicle_model.strip()
    if req.vehicle_plate is not None:
        driver.vehicle_plate = req.vehicle_plate.strip()
    if req.status is not None:
        driver.status = req.status.strip()
        # Sync User active status
        if driver.user_id:
            linked_user = db.query(User).filter(User.id == driver.user_id).first()
            if linked_user:
                linked_user.is_active = (driver.status != "Inactive")
    
    if req.is_active is not None and driver.user_id:
        linked_user = db.query(User).filter(User.id == driver.user_id).first()
        if linked_user:
            linked_user.is_active = req.is_active
            if not req.is_active:
                driver.status = "Inactive"
                
    db.commit()
    db.refresh(driver)
    return _format_driver_dict(driver)
