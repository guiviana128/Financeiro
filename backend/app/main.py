from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, Base, get_db, run_auto_migrations
from app.routers import (
    auth_router,
    categories_router,
    credit_cards_router,
    transactions_router,
    budgets_router,
    goals_router,
    dashboard_router,
    open_finance_router
)
from app.services.seed_service import seed_database_if_empty
from app.models import Category, CreditCard, Transaction, Budget, Goal, User
from app.services.auth_service import get_current_user

# Create tables and migrate columns if database already exists
Base.metadata.create_all(bind=engine)
run_auto_migrations()

app = FastAPI(
    title="FinFlow Pro - API de Gestão Financeira & Planejamento",
    description="Backend Python com FastAPI, SQLite e SQLAlchemy para controle financeiro completo e multiusuário.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed database on startup
@app.on_event("startup")
def on_startup():
    db = next(get_db())
    try:
        seed_database_if_empty(db)
    finally:
        db.close()

# Include Routers
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(transactions_router)
app.include_router(credit_cards_router)
app.include_router(categories_router)
app.include_router(budgets_router)
app.include_router(goals_router)
app.include_router(open_finance_router)

@app.get("/api/health")
def health_check():
    return {"status": "online", "message": "FinFlow Pro Backend API está ativo e operando!"}

@app.post("/api/reset-demo")
def reset_demo(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Reset and reseed demo data for current user."""
    db.query(Transaction).filter(Transaction.user_id == current_user.id).delete()
    db.query(Budget).filter(Budget.user_id == current_user.id).delete()
    db.query(Goal).filter(Goal.user_id == current_user.id).delete()
    db.query(CreditCard).filter(CreditCard.user_id == current_user.id).delete()
    db.query(Category).filter(Category.user_id == current_user.id).delete()
    db.commit()
    seed_database_if_empty(db)
    return {"message": "Dados de demonstração reinicializados com sucesso!"}
