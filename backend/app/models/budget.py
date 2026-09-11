from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    month = Column(String(7), nullable=False) # "YYYY-MM" or "DEFAULT"
    allocated_amount = Column(Float, nullable=False, default=0.0)

    category = relationship("Category", back_populates="budgets")
