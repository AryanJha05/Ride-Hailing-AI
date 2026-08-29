"""
Student C: Production Inference Module for 3-Hour Ride Demand Forecasting
========================================================================
Architecture:
    Input: Past 24 hours of demand sequence [d_{t-23}, ..., d_t]
    Preprocessing: MinMaxScaler fitted on training demand (min=0, max=221)
    Model: 2-Layer PyTorch LSTM (hidden_size=64, dropout=0.2) + Linear(64 -> 3)
    Output: Next 3 hours of predicted demand [d_{t+1}, d_{t+2}, d_{t+3}] in rides/hour
"""

import os
import joblib
import numpy as np
import torch
import torch.nn as nn
from typing import Union, List, Sequence


class DemandForecastingLSTM(nn.Module):
    """
    PyTorch Multi-Step LSTM for 3-Hour Ride Demand Forecasting.
    """
    def __init__(
        self,
        input_size: int = 1,
        hidden_size: int = 64,
        num_layers: int = 2,
        output_size: int = 3,
        dropout: float = 0.2
    ):
        super(DemandForecastingLSTM, self).__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.output_size = output_size
        
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0.0
        )
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x shape: (batch_size, seq_len=24, input_size=1)
        lstm_out, _ = self.lstm(x)
        # Extract last time step representation: (batch_size, 64)
        last_step = lstm_out[:, -1, :]
        # Output multi-step forecast: (batch_size, 3)
        return self.fc(last_step)


class DemandForecastPredictor:
    """
    Production predictor class that encapsulates model loading, preprocessing,
    inference, and post-processing (inverse scaling).
    """
    def __init__(
        self,
        model_path: str = None,
        scaler_path: str = None,
        device: str = None
    ):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        if model_path is None:
            zip_candidate = os.path.join(current_dir, "model.pth.zip")
            pth_candidate = os.path.join(current_dir, "model.pth")
            if os.path.isfile(pth_candidate):
                model_path = pth_candidate
            elif os.path.isfile(zip_candidate):
                model_path = zip_candidate
            else:
                model_path = pth_candidate

        if scaler_path is None:
            scaler_path = os.path.join(current_dir, "scaler.pkl")

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")
        if not os.path.exists(scaler_path):
            raise FileNotFoundError(f"Scaler file not found at: {scaler_path}")

            
        # Select device
        if device is None:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = torch.device(device)
            
        # Load scaler
        self.scaler = joblib.load(scaler_path)
        
        # Load model
        self.model = DemandForecastingLSTM(
            input_size=1,
            hidden_size=64,
            num_layers=2,
            output_size=3,
            dropout=0.2
        ).to(self.device)
        
        state_dict = torch.load(model_path, map_location=self.device, weights_only=True)
        self.model.load_state_dict(state_dict)
        self.model.eval()

    def predict(
        self,
        past_24h_demand: Union[Sequence[Union[int, float]], np.ndarray]
    ) -> List[float]:
        """
        Generate 3-hour demand forecast given past 24 hourly demand counts.
        
        Parameters:
            past_24h_demand: Sequence of 24 hourly demand values (integers or floats).
            
        Returns:
            List of 3 forecasted hourly demand values in rides/hour [t+1, t+2, t+3].
        """
        # Convert input to numpy array
        demand_arr = np.array(past_24h_demand, dtype=np.float32).flatten()
        
        if len(demand_arr) != 24:
            raise ValueError(f"Expected exactly 24 past hourly demand values, got {len(demand_arr)}")
            
        # 1. Scale input demand using fitted MinMaxScaler: Shape (24, 1) -> (1, 24, 1)
        scaled_input = self.scaler.transform(demand_arr.reshape(-1, 1)).reshape(1, 24, 1)
        input_tensor = torch.tensor(scaled_input, dtype=torch.float32).to(self.device)
        
        # 2. Forward pass through LSTM
        with torch.no_grad():
            scaled_output = self.model(input_tensor).cpu().numpy()  # Shape: (1, 3)
            
        # 3. Inverse transform predictions to original ride count scale
        unscaled_pred = self.scaler.inverse_transform(scaled_output).flatten()
        
        # 4. Clip negative artifacts to 0 (ride demand cannot be negative)
        clipped_pred = np.clip(unscaled_pred, a_min=0.0, a_max=None)
        
        return [round(float(val), 1) for val in clipped_pred]


# Convenience functional interface
_DEFAULT_PREDICTOR = None

def get_forecast(past_24h_demand: Union[Sequence[Union[int, float]], np.ndarray]) -> List[float]:
    """
    Convenience function for generating 3-hour demand predictions using cached predictor.
    """
    global _DEFAULT_PREDICTOR
    if _DEFAULT_PREDICTOR is None:
        _DEFAULT_PREDICTOR = DemandForecastPredictor()
    return _DEFAULT_PREDICTOR.predict(past_24h_demand)


if __name__ == "__main__":
    print("=" * 65)
    print("     STUDENT C PRODUCTION INFERENCE VERIFICATION TEST          ")
    print("=" * 65)
    
    predictor = DemandForecastPredictor()
    print(f"Device:            {predictor.device}")
    print(f"Scaler Data Min:   {predictor.scaler.data_min_[0]}")
    print(f"Scaler Data Max:   {predictor.scaler.data_max_[0]}")
    
    # Example 24-hour demand sequence (Midtown Manhattan sample)
    sample_24h = [
        123, 97, 124, 89, 30, 43, 30, 29,
        31, 62, 80, 93, 93, 110, 84, 102,
        111, 90, 119, 75, 78, 95, 113, 90
    ]
    
    forecast = predictor.predict(sample_24h)
    print(f"\nInput 24-Hour Sequence (length {len(sample_24h)}):")
    print(f"{sample_24h}")
    print(f"\nPredicted 3-Hour Horizon [t+1, t+2, t+3] (rides/hour):")
    print(f"{forecast}")
    print(f"Output Type:       {type(forecast)}, Length: {len(forecast)}")
    print("=" * 65)
    print("Inference Pipeline Verified Successfully.")
