from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.database import get_db
from app.models.user import User
from app.models.credit_card import CreditCard
from app.models.transaction import Transaction
from app.schemas.credit_card_schema import CreditCardCreate, CreditCardUpdate, CreditCardResponse
from app.services.finance_service import calculate_card_metrics
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/credit-cards", tags=["Credit Cards"])

def _card_to_response_dict(card: CreditCard, metrics: dict) -> dict:
    return {
        "id": card.id,
        "name": card.name,
        "bank": card.bank,
        "brand": card.brand,
        "last_four": card.last_four,
        "color": card.color,
        "color_end": card.color_end,
        "limit_total": card.limit_total,
        "closing_day": card.closing_day,
        "due_day": card.due_day,
        "is_active": card.is_active,
        "holder_cpf": card.holder_cpf,
        "automation_type": card.automation_type or "open_finance",
        "is_automated": card.is_automated if card.is_automated is not None else True,
        "webhook_token": card.webhook_token,
        "created_at": card.created_at,
        "current_bill": metrics["current_bill"],
        "available_limit": metrics["available_limit"],
        "usage_percentage": metrics["usage_percentage"],
        "status_label": metrics["status_label"]
    }

@router.get("", response_model=List[CreditCardResponse])
def get_credit_cards(
    month: Optional[str] = Query(None, description="Competence month YYYY-MM"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not month:
        month = date.today().strftime("%Y-%m")

    cards = db.query(CreditCard).filter(CreditCard.user_id == current_user.id).order_by(CreditCard.id.asc()).all()
    results = []
    for card in cards:
        metrics = calculate_card_metrics(db, card, month)
        results.append(CreditCardResponse(**_card_to_response_dict(card, metrics)))
    return results

@router.get("/{card_id}", response_model=CreditCardResponse)
def get_credit_card(
    card_id: int,
    month: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(CreditCard).filter(
        CreditCard.id == card_id,
        CreditCard.user_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=404, detail="Cartão de crédito não encontrado.")
    
    metrics = calculate_card_metrics(db, card, month)
    return CreditCardResponse(**_card_to_response_dict(card, metrics))

@router.post("", response_model=CreditCardResponse)
def create_credit_card(
    card_in: CreditCardCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = CreditCard(**card_in.model_dump(), user_id=current_user.id)
    db.add(card)
    db.commit()
    db.refresh(card)
    
    metrics = calculate_card_metrics(db, card)
    return CreditCardResponse(**_card_to_response_dict(card, metrics))

@router.put("/{card_id}", response_model=CreditCardResponse)
def update_credit_card(
    card_id: int,
    card_in: CreditCardUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(CreditCard).filter(
        CreditCard.id == card_id,
        CreditCard.user_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=404, detail="Cartão não encontrado.")
    
    update_data = card_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(card, field, value)
    
    db.commit()
    db.refresh(card)
    
    metrics = calculate_card_metrics(db, card)
    return CreditCardResponse(**_card_to_response_dict(card, metrics))

@router.delete("/{card_id}")
def delete_credit_card(
    card_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(CreditCard).filter(
        CreditCard.id == card_id,
        CreditCard.user_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=404, detail="Cartão não encontrado.")
    db.delete(card)
    db.commit()
    return {"message": "Cartão removido com sucesso."}
