import os
import json
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.core.logger import logger

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_FEATURE_COLS_PATH = os.path.join(BASE_DIR, "models", "student_a", "v3_feature_columns.json")

# Default weather values derived from training dataset medians
DEFAULT_WEATHER = {
    "temp": 55.0,
    "windspeed": 7.0,
    "humidity": 65.0,
    "precip": 0.0,
    "pressure": 30.0,
    "dailyprecip": 0.0,
    "dailysnow": 0.0,
    "fog": 0.0,
    "conditions": "Clear"
}

def get_total_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Calculates Haversine distance between two coordinates in kilometers.
    Identical to Student A notebook Cell 12 formula.
    """
    r_lat1, r_lng1, r_lat2, r_lng2 = map(np.radians, (lat1, lng1, lat2, lng2))
    EARTH_RADIUS = 6371.0
    lat_delta = r_lat2 - r_lat1
    lng_delta = r_lng2 - r_lng1
    d = (
        np.sin(lat_delta * 0.5) ** 2
        + np.cos(r_lat1) * np.cos(r_lat2) * np.sin(lng_delta * 0.5) ** 2
    )
    return float(2 * EARTH_RADIUS * np.arcsin(np.sqrt(d)))

def get_angle_direction(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Calculates bearing angle direction in degrees between two coordinates.
    Identical to Student A notebook Cell 12 formula.
    """
    r_lat1, r_lng1, r_lat2, r_lng2 = map(np.radians, (lat1, lng1, lat2, lng2))
    lng_delta_rad = r_lng2 - r_lng1
    y = np.sin(lng_delta_rad) * np.cos(r_lat2)
    x = (
        np.cos(r_lat1) * np.sin(r_lat2)
        - np.sin(r_lat1) * np.cos(r_lat2) * np.cos(lng_delta_rad)
    )
    return float(np.degrees(np.arctan2(y, x)))

class TripDurationFeatureService:
    def __init__(self, feature_columns_path: str = DEFAULT_FEATURE_COLS_PATH):
        self.feature_columns_path = feature_columns_path
        self.feature_columns: List[str] = []
        self._load_feature_columns()

    def _load_feature_columns(self):
        if not os.path.exists(self.feature_columns_path):
            raise FileNotFoundError(f"Feature columns file not found at: {self.feature_columns_path}")
        with open(self.feature_columns_path, "r", encoding="utf-8") as f:
            self.feature_columns = json.load(f)
        logger.info(f"Loaded {len(self.feature_columns)} V3 feature columns from {self.feature_columns_path}")

    def build_features(self, raw_input: Dict[str, Any]) -> pd.DataFrame:
        """
        Converts raw trip input into a 44-feature DataFrame aligned with V3 model expectations.
        """
        # Parse datetime
        pickup_dt_val = raw_input.get("pickup_datetime")
        if isinstance(pickup_dt_val, str):
            dt = pd.to_datetime(pickup_dt_val)
        elif isinstance(pickup_dt_val, datetime):
            dt = pd.to_datetime(pickup_dt_val)
        else:
            dt = pd.to_datetime(datetime.now())

        pickup_hour = int(dt.hour)
        pickup_month = int(dt.month)
        pickup_day_of_week = str(dt.day_name())

        # Extract spatial features
        lat1 = float(raw_input.get("origin_lat", raw_input.get("pickup_latitude", 40.7128)))
        lng1 = float(raw_input.get("origin_lng", raw_input.get("pickup_longitude", -74.0060)))
        lat2 = float(raw_input.get("dest_lat", raw_input.get("dropoff_latitude", 40.7589)))
        lng2 = float(raw_input.get("dest_lng", raw_input.get("dropoff_longitude", -73.9851)))

        total_distance = get_total_distance(lat1, lng1, lat2, lng2)
        direction = get_angle_direction(lat1, lng1, lat2, lng2)

        # V3 Time-based indicators
        is_weekend = 1 if pickup_day_of_week in ["Saturday", "Sunday"] else 0
        is_rush_hour = 1 if pickup_hour in [7, 8, 9, 16, 17, 18, 19] else 0

        # Weather features with fallback to historical medians
        temp = float(raw_input.get("temp", DEFAULT_WEATHER["temp"]))
        windspeed = float(raw_input.get("windspeed", DEFAULT_WEATHER["windspeed"]))
        humidity = float(raw_input.get("humidity", DEFAULT_WEATHER["humidity"]))
        precip = float(raw_input.get("precip", DEFAULT_WEATHER["precip"]))
        pressure = float(raw_input.get("pressure", DEFAULT_WEATHER["pressure"]))
        dailyprecip = float(raw_input.get("dailyprecip", DEFAULT_WEATHER["dailyprecip"]))
        dailysnow = float(raw_input.get("dailysnow", DEFAULT_WEATHER["dailysnow"]))
        fog = float(raw_input.get("fog", DEFAULT_WEATHER["fog"]))
        conditions = str(raw_input.get("conditions", DEFAULT_WEATHER["conditions"]))

        # Build base dictionary
        data_dict = {
            "vendor_id": int(raw_input.get("vendor_id", 1)),
            "passenger_count": int(raw_input.get("passenger_count", 1)),
            "pickup_longitude": lng1,
            "pickup_latitude": lat1,
            "dropoff_longitude": lng2,
            "dropoff_latitude": lat2,
            "pickup_hour": pickup_hour,
            "pickup_month": pickup_month,
            "total_distance": total_distance,
            "direction": direction,
            "temp": temp,
            "windspeed": windspeed,
            "humidity": humidity,
            "precip": precip,
            "pressure": pressure,
            "dailyprecip": dailyprecip,
            "dailysnow": dailysnow,
            "fog": fog,
            "is_weekend": is_weekend,
            "is_rush_hour": is_rush_hour,
            "store_and_fwd_flag": str(raw_input.get("store_and_fwd_flag", "N")),
            "pickup_day_of_week": pickup_day_of_week,
            "conditions": conditions
        }

        df = pd.DataFrame([data_dict])

        # One-hot encode categorical variables
        df_encoded = pd.get_dummies(
            df,
            columns=["store_and_fwd_flag", "pickup_day_of_week", "conditions"],
            dtype=float
        )

        # Align columns with exact V3 feature list and order
        df_aligned = df_encoded.reindex(columns=self.feature_columns, fill_value=0.0).astype(float)

        return df_aligned, total_distance

feature_builder = TripDurationFeatureService()
