# Student C — Time-Series Demand Forecasting Model Directory

This directory is designated for Student C's 24-Hour Time-Series Demand Forecasting ML model artifacts.

## Integration Instructions for Student C

To connect your trained model to the platform:

1. Place your trained model file in this directory:
   - Supported filename: `student_c_model.pkl`, `student_c_model.pt`, `student_c_model.h5`, or `student_c_model.json`
2. If custom pre-processing or feature transformation is required:
   - Provide a feature mapping script or update `StudentCModelAdapter` in `backend/app/services/student_c_adapter.py`.
3. The platform adapter automatically checks for model file existence. Once the model file is placed in this directory, the service status automatically transitions from `MODEL_NOT_CONNECTED` to `OPERATIONAL`.

## Expected Output Format
The model adapter expects forecast points in the schema:
```json
{
  "zone_name": "Midtown Manhattan",
  "horizon_hours": 24,
  "data": [
    {
      "hour": "00:00",
      "predicted_demand": 42.5,
      "actual_demand": 40.0
    }
  ]
}
```
