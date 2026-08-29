from fastapi import APIRouter, Depends
from app.models.entities import User, UserRole
from app.schemas.pydantic_schemas import DriverAdviceRequest, DriverAdviceResponse
from app.core.security import require_role
from app.services.llm_service import request_driver_advice

router = APIRouter(prefix="/api")

@router.post("/driver-advice", response_model=DriverAdviceResponse)
async def get_driver_advice(
    req: DriverAdviceRequest,
    current_user: User = Depends(require_role([UserRole.DRIVER, UserRole.ADMIN]))
):
    """
    Generates dispatch advice by passing context contract to Ollama LLM service (gemma2).
    Reasons strictly over real model outputs (Student A active, Student B/C pending).
    """
    query = req.query or "What dispatch recommendation do you have for my shift?"
    lat = req.location.lat if req.location else 40.7549
    lng = req.location.lng if req.location else -73.9840

    result = await request_driver_advice(query=query, driver_lat=lat, driver_lng=lng, history=req.history)
    return result
