"""
STUDENT B INTEGRATION POINT — Demand Zone Detection Model
Do not change the function signature or return shape.
Student B will replace the dummy logic inside `detect_demand_zones` with their spatial clustering / ML model.
"""

def detect_demand_zones(driver_lat: float = 40.7128, driver_lng: float = -74.0060) -> dict:
    """
    Detects high demand spatial clusters and returns active demand zones with surge metrics.
    """
    zones = [
        {
            "id": "zone-financial-district",
            "zone_name": "Financial District",
            "lat": 40.7075,
            "lng": -74.0089,
            "demand_score": 94.5,
            "trend": "up",
            "surge_multiplier": 1.4,
            "demand_percentage": "+42%",
            "demand_forecast_delta": "+412%",
            "historical_avg": "2.4x",
            "distance_miles": "3.2mi",
            "recommended": True
        },
        {
            "id": "zone-airports",
            "zone_name": "Airports (JFK / LGA)",
            "lat": 40.6413,
            "lng": -73.7781,
            "demand_score": 88.0,
            "trend": "up",
            "surge_multiplier": 1.65,
            "demand_percentage": "+65%",
            "demand_forecast_delta": "+280%",
            "historical_avg": "3.1x",
            "distance_miles": "12.4mi",
            "recommended": False
        },
        {
            "id": "zone-midtown",
            "zone_name": "Midtown Core",
            "lat": 40.7549,
            "lng": -73.9840,
            "demand_score": 72.0,
            "trend": "flat",
            "surge_multiplier": 1.2,
            "demand_percentage": "+18%",
            "demand_forecast_delta": "+115%",
            "historical_avg": "1.8x",
            "distance_miles": "4.1mi",
            "recommended": False
        },
        {
            "id": "zone-williamsburg",
            "zone_name": "Williamsburg",
            "lat": 40.7081,
            "lng": -73.9571,
            "demand_score": 64.0,
            "trend": "up",
            "surge_multiplier": 1.1,
            "demand_percentage": "+15%",
            "demand_forecast_delta": "+85%",
            "historical_avg": "1.5x",
            "distance_miles": "2.8mi",
            "recommended": False
        },
        {
            "id": "zone-soho",
            "zone_name": "SoHo / Tribeca",
            "lat": 40.7233,
            "lng": -74.0030,
            "demand_score": 58.0,
            "trend": "down",
            "surge_multiplier": 1.0,
            "demand_percentage": "+8%",
            "demand_forecast_delta": "+40%",
            "historical_avg": "1.2x",
            "distance_miles": "1.1mi",
            "recommended": False
        }
    ]
    
    top_recommended = zones[0]
    
    return {
        "recommended_zone": top_recommended,
        "all_zones": zones,
        "global_demand_level": "Elevated",
        "confidence_score": 0.942
    }
