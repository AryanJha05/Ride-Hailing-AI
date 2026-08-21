from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.schemas.pydantic_schemas import DriverPerformanceResponse
from app.models.entities import User, UserRole, Driver
from app.core.security import require_role

router = APIRouter(prefix="/api")

@router.get("/driver-performance", response_model=DriverPerformanceResponse)
def get_driver_performance(
    driver_id: str = Query("driver-001"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.DRIVER, UserRole.ADMIN]))
):
    # Query database for Driver linked to current user or driver_id
    db_driver = db.query(Driver).filter(
        (Driver.user_id == current_user.id) | (Driver.driver_id == driver_id) | (Driver.email == current_user.email)
    ).first()

    name = db_driver.name if db_driver else current_user.name
    email = db_driver.email if db_driver else current_user.email
    d_id = db_driver.driver_id if db_driver else driver_id
    rating = db_driver.rating if db_driver and db_driver.rating else 4.92
    total_trips = db_driver.total_trips if db_driver and db_driver.total_trips else 1284
    total_earnings = db_driver.total_earnings if db_driver and db_driver.total_earnings else 7480.00
    acceptance_rate = db_driver.acceptance_rate if db_driver and db_driver.acceptance_rate else 97.0
    cancellation_rate = db_driver.cancellation_rate if db_driver and db_driver.cancellation_rate else 2.0

    return {
        "driver_id": d_id,
        "name": name,
        "email": email,
        "rating": rating,
        "total_trips": total_trips,
        "total_earnings": total_earnings,
        "acceptance_rate": acceptance_rate,
        "cancellation_rate": cancellation_rate,
        "projected_shift_earnings": round(total_earnings * 0.038, 2) if total_earnings else 285.00,
        "ai_bonus": 45.00,
        "est_next_hour_trips": "4-6",
        "performance_history": [
            {"day": "Mon", "trips": 18, "earnings": 210.0},
            {"day": "Tue", "trips": 22, "earnings": 265.0},
            {"day": "Wed", "trips": 19, "earnings": 230.0},
            {"day": "Thu", "trips": 24, "earnings": 290.0},
            {"day": "Fri", "trips": 28, "earnings": 360.0},
            {"day": "Sat", "trips": 32, "earnings": 420.0},
            {"day": "Sun", "trips": 25, "earnings": 270.0}
        ],
        "recent_trips": [
            {"id": "t-101", "date": "Today, 17:42", "zone": "Midtown Manhattan", "duration": "14m 30s", "fare": "$34.50", "rating": 5.0},
            {"id": "t-102", "date": "Today, 16:15", "zone": "Financial District", "duration": "22m 10s", "fare": "$44.00", "rating": 5.0},
            {"id": "t-103", "date": "Today, 15:04", "zone": "Grand Central Terminal", "duration": "18m 45s", "fare": "$28.00", "rating": 4.9},
            {"id": "t-104", "date": "Today, 13:30", "zone": "JFK Airport (JFK)", "duration": "42m 15s", "fare": "$62.00", "rating": 5.0},
            {"id": "t-105", "date": "Today, 11:50", "zone": "Williamsburg", "duration": "12m 05s", "fare": "$21.50", "rating": 5.0}
        ]
    }

