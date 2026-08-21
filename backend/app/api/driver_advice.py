from fastapi import APIRouter, Depends, HTTPException, status
from app.models.entities import User, UserRole
from app.schemas.pydantic_schemas import DriverAdviceRequest, DriverAdviceResponse
from app.core.security import require_role

router = APIRouter(prefix="/api")

@router.post("/driver-advice", response_model=DriverAdviceResponse)
def get_driver_advice(
    req: DriverAdviceRequest,
    current_user: User = Depends(require_role([UserRole.DRIVER, UserRole.ADMIN]))
):
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="AI Assistant service is currently disabled (LLM reasoning integration planned for future phase)."
    )
