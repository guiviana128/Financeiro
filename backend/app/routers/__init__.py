from app.routers.auth import router as auth_router
from app.routers.categories import router as categories_router
from app.routers.credit_cards import router as credit_cards_router
from app.routers.transactions import router as transactions_router
from app.routers.budgets import router as budgets_router
from app.routers.goals import router as goals_router
from app.routers.dashboard import router as dashboard_router
from app.routers.open_finance import router as open_finance_router

__all__ = [
    "auth_router",
    "categories_router",
    "credit_cards_router",
    "transactions_router",
    "budgets_router",
    "goals_router",
    "dashboard_router",
    "open_finance_router"
]
