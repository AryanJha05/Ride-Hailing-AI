from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Any
from datetime import datetime

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class LocationSchema(BaseModel):
    lat: float
    lng: float

class DriverAdviceRequest(BaseModel):
    driver_id: Optional[str] = None
    location: LocationSchema = Field(default_factory=lambda: LocationSchema(lat=40.7128, lng=-74.0060))
    demand_level: Optional[str] = "High"
    expected_rides: Optional[str] = "4-6"
    weather: Optional[str] = "Clear"
    time_of_day: Optional[str] = "18:00"
    query: Optional[str] = None

class DataChip(BaseModel):
    label: str
    value: str

class DriverAdviceResponse(BaseModel):
    recommendation: str
    reason: str
    suggested_area: str
    confidence: float
    reasoning_chips: List[DataChip] = []
    estimated_travel_time: Optional[str] = "14m 30s"
    surge_multiplier: Optional[float] = 1.4

class ForecastPoint(BaseModel):
    hour: str
    predicted_demand: float
    actual_demand: Optional[float] = None

class ForecastResponse(BaseModel):
    zone_name: str
    horizon_hours: int
    data: List[ForecastPoint]

class DemandZoneResponse(BaseModel):
    id: str
    zone_name: str
    lat: float
    lng: float
    demand_score: float
    trend: str
    surge_multiplier: float
    demand_percentage: str

class DriverPerformanceResponse(BaseModel):
    driver_id: str
    name: str
    rating: float
    total_trips: int
    total_earnings: float
    acceptance_rate: float
    cancellation_rate: float
    projected_shift_earnings: float
    ai_bonus: float
    est_next_hour_trips: str
    performance_history: List[dict] = []
    recent_trips: List[dict] = []

class SystemHealthResponse(BaseModel):
    status: str
    timestamp: str
    active_drivers: int
    active_rides: int
    system_uptime: str
    avg_model_latency_ms: float
    services: dict
