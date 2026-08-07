"""
STUDENT C INTEGRATION POINT — Time-Series Demand Forecasting Model
Do not change the function signature or return shape.
Student C will replace the dummy logic inside `get_hourly_forecast` with their trained time-series model.
"""
import random
from datetime import datetime, timedelta

def get_hourly_forecast(zone_name: str = "Financial District", horizon_hours: int = 24) -> list:
    """
    Generates 24-hour time-series forecast data comparing predicted demand vs actual baseline.
    """
    base_time = datetime.now().replace(minute=0, second=0, microsecond=0)
    forecast_points = []
    
    # Representative hourly curve with peak during evening hours
    hourly_weights = [
        30, 25, 20, 15, 15, 25, 45, 75, 85, 70, 60, 65,
        70, 75, 80, 85, 90, 95, 98, 92, 80, 65, 50, 40
    ]
    
    for i in range(min(horizon_hours, 24)):
        target_hour = base_time + timedelta(hours=i)
        hour_idx = target_hour.hour
        weight = hourly_weights[hour_idx]
        
        # Add realistic variation
        predicted = round(weight * 1.15 + random.uniform(-3, 3), 1)
        actual = round(weight + random.uniform(-2, 2), 1) if i < 12 else None
        
        forecast_points.append({
            "hour": target_hour.strftime("%H:00"),
            "timestamp": target_hour.isoformat(),
            "predicted_demand": max(10.0, predicted),
            "actual_demand": max(10.0, actual) if actual is not None else None
        })
        
    return forecast_points
