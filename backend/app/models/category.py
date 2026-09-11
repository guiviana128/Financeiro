from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    icon = Column(String(50), default="Tag") # Lucide icon name
    color = Column(String(30), default="#6366f1") # HEX color
    type = Column(String(20), default="expense") # "expense" | "income" | "both"
    budget_type = Column(String(30), default="needs") # "needs" (50%) | "wants" (30%) | "savings" (20%)
    is_custom = Column(Boolean, default=False)

    transactions = relationship("Transaction", back_populates="category", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="category", cascade="all, delete-orphan")
