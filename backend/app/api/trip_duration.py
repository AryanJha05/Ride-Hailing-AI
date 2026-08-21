from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.pydantic_schemas import TripDurationRequest, TripDurationResponse
from app.services.trip_duration_service import trip_duration_model_service
from app.models.entities import User, UserRole
from app.core.security import require_role
from app.core.logger import logger

router = APIRouter(prefix="/api/driver")

@router.post(
    "/trip-duration",
    response_model=TripDurationResponse,
    summary="Predict Trip Duration using Student A XGBoost V3 Model"
)
def predict_driver_trip_duration(
    req: TripDurationRequest,
    current_user: User = Depends(require_role([UserRole.DRIVER, UserRole.ADMIN]))
):
    """
    Predicts trip duration (in minutes and seconds) based on origin/destination coordinates,
    temporal features, and optional weather conditions.
    """
    try:
        raw_input = req.model_dump(exclude_none=True)
        result = trip_duration_model_service.predict(raw_input)
        return result
    except Exception as e:
        logger.error(f"Error during trip duration prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Trip duration prediction failed: {str(e)}"
        )
