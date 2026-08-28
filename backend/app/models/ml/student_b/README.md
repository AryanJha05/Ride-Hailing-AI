# Student B — Spatial Demand Zone Model Directory

This directory is designated for Student B's Spatial Demand Zone Detection / Clustering ML model artifacts.

## Integration Instructions for Student B

To connect your trained model to the platform:

1. Place your trained model file in this directory:
   - Supported filename: `student_b_model.pkl`, `student_b_model.json`, or `student_b_model.onnx`
2. If custom pre-processing or feature transformation is required:
   - Provide a feature mapping script or update `StudentBModelAdapter` in `backend/app/services/student_b_adapter.py`.
3. The platform adapter automatically checks for model file existence. Once the model file is placed in this directory, the service status automatically transitions from `MODEL_NOT_CONNECTED` to `OPERATIONAL`.

## Expected Output Format
The model adapter expects predictions in the schema:
```json
{
  "recommended_zone": "Midtown Manhattan",
  "all_zones": [
    {
      "id": "zone-1",
      "zone_name": "Midtown Manhattan",
      "lat": 40.7549,
      "lng": -73.9840,
      "demand_score": 0.95,
      "trend": "rising",
      "surge_multiplier": 1.5,
      "demand_percentage": "+45%"
    }
  ],
  "global_demand_level": "High",
  "confidence_score": 0.92
}
```
