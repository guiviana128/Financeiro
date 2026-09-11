from pydantic import BaseModel
from typing import Optional
from app.schemas.category_schema import CategoryResponse

class BudgetBase(BaseModel):
    category_id: int
    month: str # "YYYY-MM"
    allocated_amount: float

class BudgetCreate(BudgetBase):
    pass

class BudgetResponse(BudgetBase):
    id: int
    category: Optional[CategoryResponse] = None
    spent_amount: float = 0.0
    remaining_amount: float = 0.0
    spent_percentage: float = 0.0

    class Config:
        from_attributes = True

class BudgetRule503020(BaseModel):
    total_income: float
    needs_budget: float # 50%
    needs_spent: float
    wants_budget: float # 30%
    wants_spent: float
    savings_budget: float # 20%
    savings_spent: float
