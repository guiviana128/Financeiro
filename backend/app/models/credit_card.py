from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class CreditCard(Base):
    __tablename__ = "credit_cards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    bank = Column(String(50), nullable=False, default="Outro")
    brand = Column(String(30), nullable=False, default="mastercard") # mastercard, visa, elo, amex
    last_four = Column(String(4), nullable=False, default="1234")
    color = Column(String(50), default="#820AD1") # Main theme color
    color_end = Column(String(50), default="#4C0677") # Gradient end
    limit_total = Column(Float, nullable=False, default=1000.0)
    closing_day = Column(Integer, nullable=False, default=25)
    due_day = Column(Integer, nullable=False, default=5)
    is_active = Column(Boolean, default=True)
    holder_cpf = Column(String(20), nullable=True) # Formatted or raw CPF (e.g. 123.456.789-00)
    automation_type = Column(String(50), default="open_finance") # open_finance, push_notification, bank_webhook, manual
    is_automated = Column(Boolean, default=True)
    webhook_token = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    user = relationship("User", back_populates="credit_cards")
    transactions = relationship("Transaction", back_populates="credit_card", cascade="all, delete-orphan")
