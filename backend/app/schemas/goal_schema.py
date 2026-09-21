# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class GoalBase(BaseModel):
    title: str
    target_amount: float
    current_amount: float = 0.0
    target_date: Optional[date] = None
    category_icon: str = "Target"
    color: str = "#10b981"

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    target_date: Optional[date] = None
    category_icon: Optional[str] = None
    color: Optional[str] = None

class GoalResponse(GoalBase):
    id: int
    created_at: datetime
    progress_percentage: float = 0.0
    remaining_amount: float = 0.0

    class Config:
        from_attributes = True
