from fastapi import APIRouter, Query
from app.schemas.pydantic_schemas import DriverPerformanceResponse

router = APIRouter()

@router.get("/driver-performance", response_model=DriverPerformanceResponse)
def get_driver_performance(driver_id: str = Query("driver-001")):
    return {
        "driver_id": driver_id,
        "name": "E. Operations",
        "rating": 4.96,
        "total_trips": 1284,
        "total_earnings": 14250.00,
        "acceptance_rate": 98.0,
        "cancellation_rate": 1.2,
        "projected_shift_earnings": 245.50,
        "ai_bonus": 34.50,
        "est_next_hour_trips": "4-6",
        "performance_history": [
            {"day": "Mon", "trips": 18, "earnings": 210.0},
            {"day": "Tue", "trips": 22, "earnings": 265.0},
            {"day": "Wed", "trips": 19, "earnings": 230.0},
            {"day": "Thu", "trips": 24, "earnings": 290.0},
            {"day": "Fri", "trips": 28, "earnings": 360.0},
            {"day": "Sat", "trips": 32, "earnings": 420.0},
            {"day": "Sun", "trips": 25, "earnings": 310.0}
        ],
        "recent_trips": [
            {"id": "t-101", "date": "Today, 17:42", "zone": "Financial District", "duration": "14m 30s", "fare": "$38.50", "rating": 5.0},
            {"id": "t-102", "date": "Today, 16:15", "zone": "Midtown Core", "duration": "22m 10s", "fare": "$44.00", "rating": 5.0},
            {"id": "t-103", "date": "Today, 15:04", "zone": "Williamsburg", "duration": "18m 45s", "fare": "$29.00", "rating": 4.9},
            {"id": "t-104", "date": "Today, 13:30", "zone": "Airports (JFK)", "duration": "42m 15s", "fare": "$85.00", "rating": 5.0},
            {"id": "t-105", "date": "Today, 11:50", "zone": "SoHo / Tribeca", "duration": "12m 05s", "fare": "$21.50", "rating": 5.0}
        ]
    }
