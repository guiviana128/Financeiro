from pydantic import BaseModel
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    icon: Optional[str] = "Tag"
    color: Optional[str] = "#6366f1"
    type: Optional[str] = "expense" # "expense" | "income" | "both"
    budget_type: Optional[str] = "needs" # "needs" | "wants" | "savings"
    is_custom: Optional[bool] = False

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True
