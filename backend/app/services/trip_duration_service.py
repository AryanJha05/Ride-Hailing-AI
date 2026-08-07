"""
STUDENT A INTEGRATION POINT — Trip Duration Prediction Model
Do not change the function signature or return shape.
Student A will replace the dummy logic inside `predict_trip_duration` with their trained ML model.
"""

def predict_trip_duration(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float, time_of_day: str = "18:00") -> dict:
    """
    Predicts trip duration (in minutes) and estimated route time based on coordinates and temporal context.
    """
    # Calculate simple haversine/Euclidean distance placeholder
    distance_approx_km = (((dest_lat - origin_lat)**2 + (dest_lng - origin_lng)**2) ** 0.5) * 111.0
    if distance_approx_km < 0.1:
        distance_approx_km = 5.1  # default mock distance ~3.2 miles
        
    duration_mins = round(distance_approx_km * 2.8 + 3.0, 1)
    
    minutes_int = int(duration_mins)
    seconds_int = int((duration_mins - minutes_int) * 60)
    
    return {
        "predicted_duration_minutes": duration_mins,
        "formatted_duration": f"{minutes_int}m {seconds_int:02d}s",
        "distance_km": round(distance_approx_km, 2),
        "distance_miles": round(distance_approx_km * 0.621371, 1),
        "route_summary": "via FDR Drive & Wall St",
        "confidence": 0.942
    }
