"""
STUDENT B INTEGRATION POINT — Demand Zone Detection Model
Do not change the function signature or return shape.
Student B will replace the dummy logic inside `detect_demand_zones` with their spatial clustering / ML model.
"""

def detect_demand_zones(driver_lat: float = 40.7549, driver_lng: float = -73.9840) -> dict:
    """
    Detects high demand spatial clusters in New York City (NYC Region) and returns active demand zones with surge metrics.
    """
    zones = [
        {
            "id": "zone-midtown",
            "zone_name": "Midtown Manhattan",
            "lat": 40.7549,
            "lng": -73.9840,
            "demand_score": 94.5,
            "trend": "up",
            "surge_multiplier": 1.65,
            "demand_percentage": "+42%",
            "demand_forecast_delta": "+412%",
            "historical_avg": "2.4x",
            "distance_miles": "1.2 mi",
            "recommended": True
        },
        {
            "id": "zone-jfk",
            "zone_name": "JFK Airport (JFK)",
            "lat": 40.6413,
            "lng": -73.7781,
            "demand_score": 88.0,
            "trend": "up",
            "surge_multiplier": 1.8,
            "demand_percentage": "+65%",
            "demand_forecast_delta": "+280%",
            "historical_avg": "3.1x",
            "distance_miles": "12.4 mi",
            "recommended": False
        },
        {
            "id": "zone-fidi",
            "zone_name": "Financial District",
            "lat": 40.7075,
            "lng": -74.0089,
            "demand_score": 82.0,
            "trend": "up",
            "surge_multiplier": 1.4,
            "demand_percentage": "+28%",
            "demand_forecast_delta": "+185%",
            "historical_avg": "2.0x",
            "distance_miles": "3.5 mi",
            "recommended": False
        },
        {
            "id": "zone-grand-central",
            "zone_name": "Grand Central Terminal",
            "lat": 40.7527,
            "lng": -73.9772,
            "demand_score": 85.0,
            "trend": "up",
            "surge_multiplier": 1.5,
            "demand_percentage": "+35%",
            "demand_forecast_delta": "+210%",
            "historical_avg": "2.2x",
            "distance_miles": "0.6 mi",
            "recommended": False
        },
        {
            "id": "zone-williamsburg",
            "zone_name": "Williamsburg",
            "lat": 40.7081,
            "lng": -73.9571,
            "demand_score": 68.0,
            "trend": "up",
            "surge_multiplier": 1.2,
            "demand_percentage": "+18%",
            "demand_forecast_delta": "+95%",
            "historical_avg": "1.4x",
            "distance_miles": "4.2 mi",
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
