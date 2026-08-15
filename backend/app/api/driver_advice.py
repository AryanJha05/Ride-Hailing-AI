from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.entities import AIRecommendation, User, UserRole
from app.schemas.pydantic_schemas import DriverAdviceRequest, DriverAdviceResponse
from app.services.llm_service import llm_service
from app.core.security import require_role

router = APIRouter(prefix="/api")

@router.post("/driver-advice", response_model=DriverAdviceResponse)
def get_driver_advice(
    req: DriverAdviceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.DRIVER, UserRole.ADMIN]))
):
    # Invoke LLM Service (which gathers ML context from Students A & B, then generates/parses recommendation)
    result = llm_service.generate_driver_advice(
        driver_lat=req.location.lat,
        driver_lng=req.location.lng,
        user_query=req.query
    )
    
    # Audit log recommendation in database
    try:
        log_entry = AIRecommendation(
            driver_id=req.driver_id,
            input_context=req.model_dump(),
            recommendation=result["recommendation"],
            reason=result["reason"],
            confidence=result["confidence"],
            model_used=f"{llm_service.model}-local"
        )
        db.add(log_entry)
        db.commit()
    except Exception:
        db.rollback()

    return result
