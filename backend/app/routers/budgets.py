from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import date
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.budget import Budget
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.budget_schema import BudgetCreate, BudgetResponse, BudgetRule503020
from app.services.finance_service import get_50_30_20_rule
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/budgets", tags=["Budgets & Planning"])

@router.get("", response_model=List[BudgetResponse])
def get_budgets(
    month: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not month:
        month = date.today().strftime("%Y-%m")

    budgets = db.query(Budget).options(joinedload(Budget.category))\
                .filter(Budget.month == month, Budget.user_id == current_user.id).all()
    
    results = []
    for b in budgets:
        spent = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
            Transaction.category_id == b.category_id,
            Transaction.type == "expense",
            Transaction.competence_month == month,
            Transaction.user_id == current_user.id
        ).scalar() or 0.0

        remaining = b.allocated_amount - spent
        spent_pct = (spent / b.allocated_amount * 100) if b.allocated_amount > 0 else 0

        b_dict = {
            "id": b.id,
            "category_id": b.category_id,
            "month": b.month,
            "allocated_amount": b.allocated_amount,
            "category": b.category,
            "spent_amount": round(spent, 2),
            "remaining_amount": round(remaining, 2),
            "spent_percentage": round(spent_pct, 1)
        }
        results.append(BudgetResponse(**b_dict))
    
    return results

@router.post("", response_model=BudgetResponse)
def create_or_update_budget(
    budget_in: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Budget).filter(
        Budget.category_id == budget_in.category_id,
        Budget.month == budget_in.month,
        Budget.user_id == current_user.id
    ).first()

    if existing:
        existing.allocated_amount = budget_in.allocated_amount
        db.commit()
        db.refresh(existing)
        target = existing
    else:
        target = Budget(**budget_in.model_dump(), user_id=current_user.id)
        db.add(target)
        db.commit()
        db.refresh(target)

    spent = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.category_id == target.category_id,
        Transaction.type == "expense",
        Transaction.competence_month == target.month,
        Transaction.user_id == current_user.id
    ).scalar() or 0.0

    cat = db.query(Category).filter(Category.id == target.category_id).first()

    return BudgetResponse(
        id=target.id,
        category_id=target.category_id,
        month=target.month,
        allocated_amount=target.allocated_amount,
        category=cat,
        spent_amount=round(spent, 2),
        remaining_amount=round(target.allocated_amount - spent, 2),
        spent_percentage=round((spent / target.allocated_amount * 100) if target.allocated_amount > 0 else 0, 1)
    )

@router.delete("/{budget_id}")
def delete_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    b = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()
    if not b:
        raise HTTPException(status_code=404, detail="Orçamento não encontrado.")
    db.delete(b)
    db.commit()
    return {"message": "Orçamento removido com sucesso."}

@router.get("/rule-50-30-20", response_model=BudgetRule503020)
def get_rule_50_30_20(
    month: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_50_30_20_rule(db, month, user_id=current_user.id)
