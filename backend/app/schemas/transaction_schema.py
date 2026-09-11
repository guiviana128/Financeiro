from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from app.schemas.category_schema import CategoryResponse

class TransactionBase(BaseModel):
    description: str
    amount: float
    type: str = "expense" # "expense" | "income"
    payment_method: str = "pix"
    category_id: int
    credit_card_id: Optional[int] = None
    date: date
    competence_month: Optional[str] = None # "YYYY-MM"
    is_installment: bool = False
    installment_current: int = 1
    installment_total: int = 1
    installment_group_id: Optional[str] = None
    is_fixed: bool = False
    is_paid: bool = True
    notes: Optional[str] = None

class TransactionCreate(TransactionBase):
    # If user creates an installment purchase, we can accept total_installments
    # and whether amount is total or per-installment.
    installments_count: Optional[int] = 1
    amount_is_total: Optional[bool] = True

class TransactionUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    type: Optional[str] = None
    payment_method: Optional[str] = None
    category_id: Optional[int] = None
    credit_card_id: Optional[int] = None
    date: Optional[date] = None
    competence_month: Optional[str] = None
    is_paid: Optional[bool] = None
    notes: Optional[str] = None

class CreditCardSimple(BaseModel):
    id: int
    name: str
    bank: str
    brand: str
    color: str
    last_four: str

    class Config:
        from_attributes = True

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime
    category: Optional[CategoryResponse] = None
    credit_card: Optional[CreditCardSimple] = None

    class Config:
        from_attributes = True
