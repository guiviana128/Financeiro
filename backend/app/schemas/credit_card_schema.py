from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CreditCardBase(BaseModel):
    name: str
    bank: str = "Outro"
    brand: str = "mastercard"
    last_four: str = "1234"
    color: str = "#820AD1"
    color_end: str = "#4C0677"
    limit_total: float = 1000.0
    closing_day: int = 25
    due_day: int = 5
    is_active: bool = True
    holder_cpf: Optional[str] = None
    automation_type: Optional[str] = "open_finance"
    is_automated: Optional[bool] = True
    webhook_token: Optional[str] = None

class CreditCardCreate(CreditCardBase):
    pass

class CreditCardUpdate(BaseModel):
    name: Optional[str] = None
    bank: Optional[str] = None
    brand: Optional[str] = None
    last_four: Optional[str] = None
    color: Optional[str] = None
    color_end: Optional[str] = None
    limit_total: Optional[float] = None
    closing_day: Optional[int] = None
    due_day: Optional[int] = None
    is_active: Optional[bool] = None
    holder_cpf: Optional[str] = None
    automation_type: Optional[str] = None
    is_automated: Optional[bool] = None
    webhook_token: Optional[str] = None

class CreditCardResponse(CreditCardBase):
    id: int
    created_at: datetime
    current_bill: float = 0.0
    available_limit: float = 0.0
    usage_percentage: float = 0.0
    status_label: str = "Em dia"

    class Config:
        from_attributes = True
