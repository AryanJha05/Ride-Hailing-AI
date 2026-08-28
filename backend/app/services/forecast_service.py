"""
STUDENT C INTEGRATION SERVICE LAYER
Delegates forecasting calls to StudentCModelAdapter.
When Student C drops their trained model into `backend/app/models/ml/student_c/`,
this service transparently routes inference to their model.
"""

from typing import Dict, Any, List
from app.services.student_c_adapter import student_c_adapter

def get_hourly_forecast(zone_name: str = "Midtown Manhattan", horizon_hours: int = 24) -> List[dict]:
    """
    Executes Student C 24-Hour Time-Series Demand Forecasting.
    Returns empty list when Student C model artifact is not connected.
    """
    result = student_c_adapter.predict_forecast(zone_name=zone_name, horizon_hours=horizon_hours)
    return result.get("data", [])

def get_forecast_full_payload(zone_name: str = "Midtown Manhattan", horizon_hours: int = 24) -> Dict[str, Any]:
    """
    Returns full forecast response payload including status telemetry.
    """
    return student_c_adapter.predict_forecast(zone_name=zone_name, horizon_hours=horizon_hours)

def get_forecast_status() -> Dict[str, Any]:
    """Returns the connectivity & operational health status of Student C's ML model."""
    return student_c_adapter.get_status()
