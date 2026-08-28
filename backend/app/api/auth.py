from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.entities import User, Driver, UserRole
from app.schemas.pydantic_schemas import LoginRequest, TokenResponse, UserResponse, DriverProfileSchema
from app.core.security import (
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def _build_driver_profile_schema(user: User, db: Session) -> DriverProfileSchema | None:
    role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
    if role_str != UserRole.DRIVER.value and role_str != "DRIVER":
        return None
    
    driver = db.query(Driver).filter(
        (Driver.user_id == user.id) | (Driver.email == user.email)
    ).first()
    
    if not driver:
        return None
        
    return DriverProfileSchema(
        id=driver.id,
        driver_id=driver.driver_id,
        phone=driver.phone,
        license_number=driver.license_number,
        status=driver.status or "Active",
        rating=driver.rating if driver.rating is not None else 5.0,
        total_trips=driver.total_trips or 0,
        total_earnings=driver.total_earnings or 0.0,
        vehicle_make=getattr(driver, "vehicle_make", "Toyota"),
        vehicle_model=getattr(driver, "vehicle_model", "Camry Hybrid"),
        vehicle_plate=getattr(driver, "vehicle_plate", "NYC-TLC-7782"),
        created_at=driver.created_at.isoformat() if driver.created_at else None
    )

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Normalize email
    clean_email = req.email.strip().lower()
    
    # Query user by email
    user = db.query(User).filter(User.email == clean_email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create JWT access token
    access_token = create_access_token(
        data={
            "sub": user.id,
            "email": user.email,
            "role": user.role.value if hasattr(user.role, "value") else str(user.role)
        }
    )
    
    driver_profile = _build_driver_profile_schema(user, db)
    
    user_response = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role.value if hasattr(user.role, "value") else str(user.role),
        driver_profile=driver_profile
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@router.get("/me", response_model=UserResponse)
def get_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    driver_profile = _build_driver_profile_schema(current_user, db)
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role),
        driver_profile=driver_profile
    )
