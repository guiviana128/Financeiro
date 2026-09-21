from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.database import get_db
from app.models.user import User
from app.schemas.dashboard_schema import DashboardSummary
from app.services.finance_service import get_dashboard_metrics
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard(
    month: Optional[str] = Query(None, description="Month format YYYY-MM"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not month:
        month = date.today().strftime("%Y-%m")
    
    return get_dashboard_metrics(db, month, user_id=current_user.id)
