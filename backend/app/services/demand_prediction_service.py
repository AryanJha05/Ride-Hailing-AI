"""
STUDENT B INTEGRATION SERVICE LAYER
Delegates prediction calls to StudentBModelAdapter.
When Student B drops their trained model into `backend/app/models/ml/student_b/`,
this service transparently routes inference to their model.
"""

from typing import Dict, Any
from app.services.student_b_adapter import student_b_adapter

def detect_demand_zones(driver_lat: float = 40.7549, driver_lng: float = -73.9840) -> Dict[str, Any]:
    """
    Executes Student B Spatial Demand Zone Detection.
    If Student B model is not connected, returns empty zones payload with MODEL_NOT_CONNECTED status.
    """
    return student_b_adapter.predict_demand_zones(driver_lat=driver_lat, driver_lng=driver_lng)

def get_demand_zone_status() -> Dict[str, Any]:
    """Returns the connectivity & operational health status of Student B's ML model."""
    return student_b_adapter.get_status()
