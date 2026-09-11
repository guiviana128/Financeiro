from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class DashboardSummary(BaseModel):
    current_month: str
    total_balance: float
    monthly_income: float
    monthly_expense: float
    monthly_credit_card_bill: float
    net_savings: float
    savings_rate: float # percentage 0 - 100
    financial_health_score: int # 0 - 100
    health_status: str # "Excelente", "Bom", "Alerta", "Crítico"
    health_tips: List[str]
    
    # Category Breakdown for Pie/Donut Chart
    expenses_by_category: List[Dict[str, Any]]
    
    # 6-Month Cashflow history
    cashflow_history: List[Dict[str, Any]]

    # Next upcoming bills / alerts
    upcoming_bills: List[Dict[str, Any]]

    # Total credit limits vs used
    total_credit_limit: float
    total_credit_used: float
