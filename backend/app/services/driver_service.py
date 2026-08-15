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

def list_drivers(db: Session) -> List[dict]:
    drivers = db.query(Driver).order_by(Driver.created_at.desc()).all()
    result = []
    for d in drivers:
        result.append({
            "id": d.id,
            "user_id": d.user_id,
            "driver_id": d.driver_id or f"NYC-DRV-{d.id[:6].upper()}",
            "name": d.name,
            "email": d.email,
            "phone": d.phone or "+1 (555) 234-5678",
            "license_number": d.license_number or "NYC-TLC-99821",
            "status": d.status or "Active",
            "rating": d.rating or 5.0,
            "total_trips": d.total_trips or 0,
            "total_earnings": d.total_earnings or 0.0,
            "created_at": d.created_at.isoformat() if d.created_at else None
        })
    return result

def get_driver_by_id(db: Session, driver_id_param: str) -> Optional[dict]:
    driver = db.query(Driver).filter(
        (Driver.id == driver_id_param) | (Driver.driver_id == driver_id_param)
    ).first()
    if not driver:
        return None
    return {
        "id": driver.id,
        "user_id": driver.user_id,
        "driver_id": driver.driver_id or f"NYC-DRV-{driver.id[:6].upper()}",
        "name": driver.name,
        "email": driver.email,
        "phone": driver.phone or "+1 (555) 234-5678",
        "license_number": driver.license_number or "NYC-TLC-99821",
        "status": driver.status or "Active",
        "rating": driver.rating or 5.0,
        "total_trips": driver.total_trips or 0,
        "total_earnings": driver.total_earnings or 0.0,
        "created_at": driver.created_at.isoformat() if driver.created_at else None
    }

def create_driver_account(db: Session, req: DriverCreateRequest) -> dict:
    clean_email = req.email.strip().lower()
    
    # 1. Check if user already exists
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
    
    # Generate Driver ID if not provided
    count = db.query(Driver).count()
    formatted_driver_id = req.driver_id.strip() if req.driver_id and len(req.driver_id.strip()) > 0 else f"NYC-DRV-{count + 1:03d}"
    
    # 3. Create Driver profile
    new_driver = Driver(
        user_id=new_user.id,
        driver_id=formatted_driver_id,
        name=req.name.strip(),
        email=clean_email,
        phone=req.phone.strip() if req.phone else "+1 (555) 345-6789",
        license_number=req.license_number.strip() if req.license_number else f"NYC-TLC-{count + 1000:04d}",
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
    
    return {
        "id": new_driver.id,
        "user_id": new_driver.user_id,
        "driver_id": new_driver.driver_id,
        "name": new_driver.name,
        "email": new_driver.email,
        "phone": new_driver.phone,
        "license_number": new_driver.license_number,
        "status": new_driver.status,
        "rating": new_driver.rating,
        "total_trips": new_driver.total_trips,
        "total_earnings": new_driver.total_earnings,
        "created_at": new_driver.created_at.isoformat() if new_driver.created_at else None,
        "temp_password": temp_password
    }

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
    
    return {
        "id": driver.id,
        "user_id": driver.user_id,
        "driver_id": driver.driver_id or f"NYC-DRV-{driver.id[:6].upper()}",
        "name": driver.name,
        "email": driver.email,
        "phone": driver.phone or "+1 (555) 234-5678",
        "license_number": driver.license_number or "NYC-TLC-99821",
        "status": driver.status or "Active",
        "rating": driver.rating or 5.0,
        "total_trips": driver.total_trips or 0,
        "total_earnings": driver.total_earnings or 0.0,
        "created_at": driver.created_at.isoformat() if driver.created_at else None
    }
