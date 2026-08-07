import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.models.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(120), nullable=False)
    email = Column(String(160), unique=True, nullable=False)
    rating = Column(Float, default=5.00)
    total_trips = Column(Integer, default=0)
    total_earnings = Column(Float, default=0.0)
    acceptance_rate = Column(Float, default=98.0)
    cancellation_rate = Column(Float, default=1.2)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    trips = relationship("Trip", back_populates="driver")
    ai_recommendations = relationship("AIRecommendation", back_populates="driver")

class Trip(Base):
    __tablename__ = "trips"

    id = Column(String, primary_key=True, default=generate_uuid)
    driver_id = Column(String, ForeignKey("drivers.id"), nullable=True)
    zone_name = Column(String(120), nullable=True)
    origin_lat = Column(Float)
    origin_lng = Column(Float)
    destination_lat = Column(Float)
    destination_lng = Column(Float)
    predicted_duration_minutes = Column(Float)
    actual_duration_minutes = Column(Float)
    fare = Column(Float)
    rating = Column(Float)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    driver = relationship("Driver", back_populates="trips")

class DemandZone(Base):
    __tablename__ = "demand_zones"

    id = Column(String, primary_key=True, default=generate_uuid)
    zone_name = Column(String(120), nullable=False, unique=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    demand_score = Column(Float, default=50.0)
    trend = Column(String(20), default="flat")  # 'up' | 'down' | 'flat'
    surge_multiplier = Column(Float, default=1.0)
    updated_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    forecast_logs = relationship("ForecastLog", back_populates="zone")

class ForecastLog(Base):
    __tablename__ = "forecast_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    zone_id = Column(String, ForeignKey("demand_zones.id"))
    forecast_hour = Column(DateTime)
    predicted_demand = Column(Float)
    model_version = Column(String(40), default="v2.1-prod")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    zone = relationship("DemandZone", back_populates="forecast_logs")

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"

    id = Column(String, primary_key=True, default=generate_uuid)
    driver_id = Column(String, ForeignKey("drivers.id"), nullable=True)
    input_context = Column(JSON, nullable=True)
    recommendation = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    confidence = Column(Float, default=0.95)
    model_used = Column(String(60), default="gemma2-local")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    driver = relationship("Driver", back_populates="ai_recommendations")
