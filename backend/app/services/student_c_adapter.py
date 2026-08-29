import os
import sys
import importlib.util
from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.core.logger import logger

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
STUDENT_C_MODEL_DIR = os.path.join(BASE_DIR, "models", "student_c")

# Typical 24-hour baseline demand profiles by NYC zone (rides per hour)
ZONE_BASELINE_PATTERNS = {
    "Midtown Manhattan": [123, 97, 124, 89, 30, 43, 30, 29, 31, 62, 80, 93, 93, 110, 84, 102, 111, 90, 119, 75, 78, 95, 113, 90],
    "JFK International Airport": [85, 60, 40, 25, 15, 35, 70, 90, 105, 110, 100, 95, 90, 85, 95, 105, 120, 115, 100, 90, 85, 90, 95, 80],
    "Downtown Brooklyn": [65, 45, 30, 20, 15, 25, 55, 80, 95, 85, 75, 70, 75, 80, 85, 90, 100, 105, 95, 85, 75, 70, 65, 60],
    "LaGuardia Airport": [75, 50, 30, 20, 15, 30, 65, 85, 100, 105, 95, 90, 85, 80, 90, 100, 110, 105, 95, 85, 80, 85, 85, 70],
    "Williamsburg": [90, 70, 45, 30, 20, 15, 25, 45, 65, 70, 75, 80, 85, 90, 95, 105, 115, 125, 130, 120, 110, 105, 100, 95],
    "Financial District": [40, 25, 15, 10, 12, 35, 85, 140, 160, 120, 95, 90, 100, 95, 90, 110, 135, 150, 110, 75, 55, 45, 40, 35],
    "Lower Manhattan": [70, 50, 35, 20, 15, 25, 50, 85, 110, 100, 90, 85, 90, 95, 90, 100, 115, 125, 110, 90, 80, 75, 70, 65],
    "Long Island City": [50, 35, 25, 15, 10, 20, 45, 70, 85, 75, 65, 60, 65, 70, 75, 85, 95, 100, 90, 75, 65, 60, 55, 50],
}

def resolve_zone_baseline(zone_name: str) -> list[int]:
    """Resolves zone aliases to the appropriate 24-hour demand baseline sequence."""
    zn = zone_name.lower()
    if "jfk" in zn:
        return ZONE_BASELINE_PATTERNS["JFK International Airport"]
    elif "laguardia" in zn or "lga" in zn:
        return ZONE_BASELINE_PATTERNS["LaGuardia Airport"]
    elif "williamsburg" in zn or "greenpoint" in zn:
        return ZONE_BASELINE_PATTERNS["Williamsburg"]
    elif "financial" in zn:
        return ZONE_BASELINE_PATTERNS["Financial District"]
    elif "lower" in zn:
        return ZONE_BASELINE_PATTERNS["Lower Manhattan"]
    elif "brooklyn" in zn:
        return ZONE_BASELINE_PATTERNS["Downtown Brooklyn"]
    elif "long island" in zn or "astoria" in zn:
        return ZONE_BASELINE_PATTERNS["Long Island City"]
    else:
        return ZONE_BASELINE_PATTERNS["Midtown Manhattan"]


class StudentCModelAdapter:
    """
    Integration Adapter for Student C's PyTorch LSTM Time-Series Demand Forecasting Model.
    Dynamically loads inference.py and scaler/model weights from `backend/models/student_c/`.
    """
    def __init__(self, model_dir: str = STUDENT_C_MODEL_DIR):
        self.model_dir = model_dir
        self.predictor = None
        self._load_error = None

    def get_inference_path(self) -> str | None:
        path = os.path.join(self.model_dir, "inference.py")
        return path if os.path.exists(path) else None

    def is_connected(self) -> bool:
        """Returns True if Student C's model artifacts and inference script are present."""
        inf_path = self.get_inference_path()
        scaler_path = os.path.join(self.model_dir, "scaler.pkl")
        model_pth = os.path.join(self.model_dir, "model.pth")
        model_zip = os.path.join(self.model_dir, "model.pth.zip")
        model_dir = os.path.join(self.model_dir, "model")
        has_weights = os.path.exists(model_pth) or os.path.exists(model_zip) or os.path.exists(model_dir)
        return inf_path is not None and os.path.exists(scaler_path) and has_weights

    def _ensure_predictor_loaded(self):
        if self.predictor is not None or not self.is_connected():
            return
        try:
            inf_path = self.get_inference_path()
            spec = importlib.util.spec_from_file_location("student_c_inference", inf_path)
            module = importlib.util.module_from_spec(spec)
            sys.modules["student_c_inference"] = module
            spec.loader.exec_module(module)
            
            self.predictor = module.DemandForecastPredictor(
                model_path=None,
                scaler_path=os.path.join(self.model_dir, "scaler.pkl")
            )
            logger.info("Successfully loaded Student C PyTorch LSTM Demand Forecast Predictor.")
        except Exception as e:
            self._load_error = str(e)
            logger.error(f"Failed to initialize Student C predictor: {str(e)}")

    def get_status(self) -> Dict[str, Any]:
        connected = self.is_connected()
        if connected and self.predictor is None:
            self._ensure_predictor_loaded()
        
        operational = connected and self.predictor is not None
        return {
            "status": "OPERATIONAL (Demand Forecasting Engine)" if operational else "MODEL_NOT_CONNECTED",
            "model_name": "Demand Forecasting Engine",
            "connected": operational,
            "artifact_path": self.model_dir if connected else None,
            "message": "Demand Forecasting Engine active" if operational else (self._load_error or "Waiting for demand forecasting model artifact")
        }

    def predict_forecast(self, zone_name: str = "Midtown Manhattan", horizon_hours: int = 24) -> Dict[str, Any]:
        """
        Executes Student C's PyTorch LSTM forecast model to generate hourly ride demand points.
        """
        if not self.is_connected():
            logger.info("Student C model artifact not found. Returning MODEL_NOT_CONNECTED state.")
            return {
                "status": "MODEL_NOT_CONNECTED",
                "zone_name": zone_name,
                "horizon_hours": horizon_hours,
                "data": []
            }

        self._ensure_predictor_loaded()
        if self.predictor is None:
            return {
                "status": "ERROR",
                "error_details": self._load_error or "Predictor failed to initialize",
                "zone_name": zone_name,
                "horizon_hours": horizon_hours,
                "data": []
            }

        try:
            # Baseline past 24-hour demand sequence for requested zone
            past_24h = resolve_zone_baseline(zone_name)
            
            # Generate predictions auto-regressively in 3-hour steps up to horizon_hours
            forecast_values = []
            history = list(past_24h)
            
            steps_needed = (horizon_hours + 2) // 3
            for _ in range(steps_needed):
                input_24 = history[-24:]
                preds = self.predictor.predict(input_24)  # returns [t+1, t+2, t+3]
                forecast_values.extend(preds)
                history.extend(preds)

            forecast_values = forecast_values[:horizon_hours]

            # Generate hourly timestamp points starting from current hour
            now = datetime.now()
            start_hour = now.replace(minute=0, second=0, microsecond=0)
            
            data_points = []
            for i, val in enumerate(forecast_values):
                h_time = start_hour + timedelta(hours=i + 1)
                data_points.append({
                    "hour": h_time.strftime("%H:00"),
                    "predicted_demand": round(float(val), 1),
                    "actual_demand": None
                })

            return {
                "status": "OPERATIONAL",
                "zone_name": zone_name,
                "horizon_hours": horizon_hours,
                "data": data_points
            }
        except Exception as e:
            logger.error(f"Error during Student C model inference: {str(e)}")
            return {
                "status": "ERROR",
                "error_details": str(e),
                "zone_name": zone_name,
                "horizon_hours": horizon_hours,
                "data": []
            }

# Singleton Instance
student_c_adapter = StudentCModelAdapter()
