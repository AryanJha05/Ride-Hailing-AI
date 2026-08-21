import os
import json
import xgboost as xgb
from typing import Dict, Any
from app.core.logger import logger
from app.services.trip_duration_feature_service import feature_builder

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_MODEL_PATH = os.path.join(BASE_DIR, "models", "trip_duration", "xgboost_trip_duration_v3.json")

class TripDurationModelService:
    def __init__(self, model_path: str = DEFAULT_MODEL_PATH):
        self.model_path = model_path
        self.model: xgb.XGBRegressor = None
        self._load_model()

    def _load_model(self):
        if not os.path.exists(self.model_path):
            logger.error(f"XGBoost V3 model file missing at: {self.model_path}")
            raise FileNotFoundError(f"Model file not found at: {self.model_path}")
        
        try:
            self.model = xgb.XGBRegressor()
            self.model.load_model(self.model_path)
            logger.info(f"Successfully loaded XGBoost V3 trip duration model from {self.model_path}")
        except Exception as e:
            logger.error(f"Failed to load XGBoost V3 model: {str(e)}")
            raise RuntimeError(f"Could not load XGBoost model: {str(e)}")

    def predict(self, raw_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes Student A V3 inference pipeline:
        1. Feature building & alignment
        2. XGBoost V3 inference
        3. Post-processing
        """
        if self.model is None:
            self._load_model()

        # Step 1: Build 44-feature aligned vector
        df_features, distance_km = feature_builder.build_features(raw_input)

        # Step 2: Predict trip duration in seconds
        try:
            pred_seconds = float(self.model.predict(df_features)[0])
        except Exception as e:
            logger.error(f"XGBoost prediction error: {str(e)}")
            raise RuntimeError(f"Prediction failed: {str(e)}")

        # Enforce physical min bound (e.g. at least 30 seconds for non-zero distance)
        if pred_seconds < 30.0:
            pred_seconds = 30.0

        # Step 3: Post-processing (seconds -> minutes & formatted string)
        duration_min = round(pred_seconds / 60.0, 1)
        minutes_int = int(pred_seconds // 60)
        seconds_int = int(round(pred_seconds % 60))
        if seconds_int == 60:
            minutes_int += 1
            seconds_int = 0

        formatted_duration = f"{minutes_int}m {seconds_int:02d}s"
        distance_miles = round(distance_km * 0.621371, 2)

        return {
            "duration_min": duration_min,
            "formatted_duration": formatted_duration,
            "predicted_seconds": round(pred_seconds, 2),
            "distance_km": round(distance_km, 2),
            "distance_miles": distance_miles,
            "model": "xgboost-v3",
            "status": "success"
        }

# Singleton instance
trip_duration_model_service = TripDurationModelService()

def predict_trip_duration(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float, time_of_day: str = "18:00") -> dict:
    """
    Backwards-compatible interface for trip duration prediction.
    """
    raw_input = {
        "origin_lat": origin_lat,
        "origin_lng": origin_lng,
        "dest_lat": dest_lat,
        "dest_lng": dest_lng,
        "time_of_day": time_of_day
    }
    return trip_duration_model_service.predict(raw_input)
