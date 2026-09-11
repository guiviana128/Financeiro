from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, date
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String(20), nullable=False, default="expense") # "expense" | "income"
    payment_method = Column(String(50), nullable=False, default="pix") # "credit_card", "debit_card", "pix", "cash", "bank_transfer", "boleto"
    
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    credit_card_id = Column(Integer, ForeignKey("credit_cards.id"), nullable=True)
    
    date = Column(Date, nullable=False, default=date.today)
    competence_month = Column(String(7), nullable=False, index=True) # "YYYY-MM"
    
    is_installment = Column(Boolean, default=False)
    installment_current = Column(Integer, default=1)
    installment_total = Column(Integer, default=1)
    installment_group_id = Column(String(50), nullable=True) # group installments together
    
    is_fixed = Column(Boolean, default=False)
    is_paid = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="transactions")
    credit_card = relationship("CreditCard", back_populates="transactions")
