from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Any, Dict
from datetime import datetime

class LoginRequest(BaseModel):
    email: str
    password: str

class DriverProfileSchema(BaseModel):
    id: str
    driver_id: Optional[str] = None
    phone: Optional[str] = None
    license_number: Optional[str] = None
    status: str = "Active"
    rating: float = 5.0
    total_trips: int = 0
    total_earnings: float = 0.0
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_plate: Optional[str] = None
    created_at: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    driver_profile: Optional[DriverProfileSchema] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class DriverCreateRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    driver_id: Optional[str] = None
    license_number: Optional[str] = None
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_plate: Optional[str] = None
    status: Optional[str] = "Active"
    password: Optional[str] = None

class DriverUpdateRequest(BaseModel):
    phone: Optional[str] = None
    license_number: Optional[str] = None
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_plate: Optional[str] = None
    status: Optional[str] = None
    is_active: Optional[bool] = None

class DriverResponseSchema(BaseModel):
    id: str
    user_id: Optional[str] = None
    driver_id: Optional[str] = None
    name: str
    email: str
    phone: Optional[str] = None
    license_number: Optional[str] = None
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_plate: Optional[str] = None
    status: str
    rating: float
    total_trips: int
    total_earnings: float
    created_at: Optional[str] = None
    temp_password: Optional[str] = None


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
    history: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

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
    has_card: Optional[bool] = False
    status: Optional[str] = "success"

class ForecastPoint(BaseModel):
    hour: str
    predicted_demand: float
    actual_demand: Optional[float] = None

class ForecastResponse(BaseModel):
    zone_name: str
    horizon_hours: int
    data: List[ForecastPoint]
    status: Optional[str] = "MODEL_NOT_CONNECTED"

class ModelStatusResponse(BaseModel):
    status: str
    model_name: str
    connected: bool
    artifact_path: Optional[str] = None
    message: str

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

class TripDurationRequest(BaseModel):
    origin_lat: float = Field(..., ge=-90.0, le=90.0, description="Pickup latitude")
    origin_lng: float = Field(..., ge=-180.0, le=180.0, description="Pickup longitude")
    dest_lat: float = Field(..., ge=-90.0, le=90.0, description="Dropoff latitude")
    dest_lng: float = Field(..., ge=-180.0, le=180.0, description="Dropoff longitude")
    pickup_datetime: Optional[str] = Field(default=None, description="Pickup timestamp (ISO format or YYYY-MM-DD HH:MM:SS)")
    passenger_count: Optional[int] = Field(default=1, ge=1, le=9, description="Number of passengers")
    vendor_id: Optional[int] = Field(default=1, ge=1, le=2, description="Vendor ID (1 or 2)")
    store_and_fwd_flag: Optional[str] = Field(default="N", description="Store and forward flag ('N' or 'Y')")
    
    # Optional weather inputs
    temp: Optional[float] = None
    windspeed: Optional[float] = None
    humidity: Optional[float] = None
    precip: Optional[float] = None
    pressure: Optional[float] = None
    dailyprecip: Optional[float] = None
    dailysnow: Optional[float] = None
    fog: Optional[float] = None
    conditions: Optional[str] = None

class TripDurationResponse(BaseModel):
    duration_min: float
    formatted_duration: str
    predicted_seconds: float
    distance_km: float
    distance_miles: float
    model: str = "xgboost-v3"
    status: str = "success"
