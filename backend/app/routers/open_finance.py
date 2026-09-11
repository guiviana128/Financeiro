import re
import secrets
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any, List
from datetime import date, datetime
from pydantic import BaseModel
from app.database import get_db
from app.models.credit_card import CreditCard
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.transaction_schema import TransactionCreate
from app.services.finance_service import create_transactions_with_installments, calculate_card_metrics

router = APIRouter(prefix="/api/open-finance", tags=["Open Finance & Webhooks"])

class PurchaseWebhookPayload(BaseModel):
    merchant: str = "iFood *Restaurante"
    amount: float = 89.90
    cpf: Optional[str] = None # Ex: 123.456.789-00 ou 12345678900
    card_id: Optional[int] = None
    card_last_four: Optional[str] = None
    bank: Optional[str] = None
    category_id: Optional[int] = None
    category_name: Optional[str] = None
    installments: Optional[int] = 1
    date: Optional[str] = None
    notes: Optional[str] = "Compra capturada via Integração Bancária / Webhook"
    webhook_token: Optional[str] = None

# Smart merchant -> Category auto-mapping
MERCHANT_CATEGORY_KEYWORDS = {
    "Supermercado & Alimentação": ["mercado", "supermercado", "carrefour", "pao de acucar", "assai", "atacadao", "hortifruti", "padaria", "ifood", "rappi", "restaurante", "mcdonalds", "burger", "lanchonete", "bar", "cafe", "starbucks"],
    "Transporte & Combustível": ["posto", "shell", "ipiranga", "petrobras", "combustivel", "uber", "99", "99app", "taxi", "estacionamento", "pedagio", "sem parar"],
    "Compras & Vestuário": ["amazon", "mercado livre", "shopee", "aliexpress", "magalu", "magazine", "zara", "renner", "riachuelo", "centauro", "nike", "adidas", "shein"],
    "Saúde & Farmácia": ["drogaria", "farmacia", "drogasil", "raia", "pacheco", "sao paulo", "consulta", "laboratorio", "hospital", "dentista", "otica"],
    "Assinaturas & Streaming": ["netflix", "spotify", "prime video", "disney", "youtube", "hbo", "max", "apple", "google", "chatgpt", "openai", "cloud"],
    "Lazer & Restaurantes": ["cinema", "ingresso", "show", "teatro", "sympla", "eventim", "hotel", "airbnb", "resort", "viagem", "voo", "latam", "gol", "azul"]
}

def clean_cpf_digits(cpf_str: Optional[str]) -> str:
    if not cpf_str:
        return ""
    return re.sub(r"\D", "", cpf_str)

def find_best_category(db: Session, merchant: str, explicit_cat_id: Optional[int] = None) -> int:
    if explicit_cat_id:
        cat = db.query(Category).filter(Category.id == explicit_cat_id).first()
        if cat:
            return cat.id

    merchant_lower = merchant.lower()
    for cat_name, keywords in MERCHANT_CATEGORY_KEYWORDS.items():
        if any(kw in merchant_lower for kw in keywords):
            cat = db.query(Category).filter(Category.name.ilike(f"%{cat_name.split('&')[0].strip()}%")).first()
            if cat:
                return cat.id

    # Fallback to first expense category or default category
    fallback = db.query(Category).filter(Category.type == "expense").first()
    return fallback.id if fallback else 1

@router.post("/webhook/purchase")
def receive_bank_purchase_webhook(
    payload: PurchaseWebhookPayload,
    db: Session = Depends(get_db)
):
    """
    Public Webhook Endpoint for Banks / Open Finance / Push notifications.
    Matches the user's CPF, Bank, or Card and registers the incoming purchase in real-time.
    """
    clean_payload_cpf = clean_cpf_digits(payload.cpf)

    # 1. Match Credit Card query
    query = db.query(CreditCard).filter(CreditCard.is_active == True)

    # Filter by CPF if provided
    if clean_payload_cpf:
        # Search all active cards and filter by matching digits
        all_active_cards = query.all()
        matching_cpf_cards = [
            c for c in all_active_cards 
            if clean_cpf_digits(c.holder_cpf) == clean_payload_cpf
        ]
        if matching_cpf_cards:
            # Further filter by bank/card_id if available
            if payload.card_id:
                card = next((c for c in matching_cpf_cards if c.id == payload.card_id), matching_cpf_cards[0])
            elif payload.card_last_four:
                card = next((c for c in matching_cpf_cards if c.last_four == payload.card_last_four[-4:]), matching_cpf_cards[0])
            elif payload.bank:
                card = next((c for c in matching_cpf_cards if payload.bank.lower() in (c.bank or "").lower()), matching_cpf_cards[0])
            else:
                card = matching_cpf_cards[0]
        else:
            card = None
    else:
        card = None

    # If no CPF or not found by CPF, fallback to standard lookup (card_id, last_four, bank)
    if not card:
        if payload.card_id:
            card = query.filter(CreditCard.id == payload.card_id).first()
        elif payload.card_last_four:
            card = query.filter(CreditCard.last_four == payload.card_last_four[-4:]).first()
        elif payload.bank:
            card = query.filter(CreditCard.bank.ilike(f"%{payload.bank}%")).first()
        elif payload.webhook_token:
            card = query.filter(CreditCard.webhook_token == payload.webhook_token).first()
        
    if not card:
        # Match the first active automated card as ultimate fallback
        card = query.first()
        if not card:
            raise HTTPException(
                status_code=400,
                detail="Nenhum cartão de crédito ativo cadastrado no sistema para vincular a transação."
            )

    # 2. Match Category
    category_id = find_best_category(db, payload.merchant, payload.category_id)
    category = db.query(Category).filter(Category.id == category_id).first()

    # 3. Determine Date
    tx_date = date.today()
    if payload.date:
        try:
            tx_date = datetime.strptime(payload.date.split("T")[0], "%Y-%m-%d").date()
        except Exception:
            tx_date = date.today()

    # 4. Create Transaction
    installments_count = max(1, payload.installments or 1)
    notes_str = payload.notes or f"Transacao Open Finance ({card.bank})"
    if card.holder_cpf:
        notes_str += f" - CPF: {card.holder_cpf}"

    tx_in = TransactionCreate(
        description=payload.merchant,
        amount=round(payload.amount, 2),
        type="expense",
        payment_method="credit_card",
        category_id=category_id,
        credit_card_id=card.id,
        date=tx_date,
        is_installment=(installments_count > 1),
        installments_count=installments_count,
        amount_is_total=True,
        is_fixed=False,
        is_paid=False,
        notes=notes_str
    )

    created_txs = create_transactions_with_installments(db, tx_in)
    metrics = calculate_card_metrics(db, card)

    return {
        "success": True,
        "message": f"Notificação Bancária: Compra de R$ {payload.amount:.2f} no estabelecimento '{payload.merchant}' sincronizada no {card.name}!",
        "card": {
            "id": card.id,
            "name": card.name,
            "bank": card.bank,
            "brand": card.brand,
            "holder_cpf": card.holder_cpf,
            "automation_type": card.automation_type,
            "available_limit": metrics["available_limit"],
            "current_bill": metrics["current_bill"]
        },
        "category": {
            "id": category.id if category else None,
            "name": category.name if category else "Geral",
            "icon": category.icon if category else "Tag"
        },
        "transactions_created": len(created_txs),
        "transaction_id": created_txs[0].id if created_txs else None
    }

@router.get("/connections")
def get_bank_connections(db: Session = Depends(get_db)):
    """
    Returns the Open Finance status for all registered credit cards.
    """
    cards = db.query(CreditCard).all()
    connections = []
    for card in cards:
        tx_count = db.query(Transaction).filter(Transaction.credit_card_id == card.id).count()
        last_tx = db.query(Transaction).filter(Transaction.credit_card_id == card.id).order_by(Transaction.id.desc()).first()
        connections.append({
            "card_id": card.id,
            "card_name": card.name,
            "bank": card.bank,
            "brand": card.brand,
            "last_four": card.last_four,
            "holder_cpf": card.holder_cpf,
            "automation_type": card.automation_type or "open_finance",
            "is_automated": card.is_automated if card.is_automated is not None else True,
            "webhook_token": card.webhook_token,
            "color": card.color,
            "status": "connected" if card.is_automated else "manual",
            "provider": "Open Finance Brasil" if (card.automation_type == "open_finance") else (card.automation_type or "Webhook"),
            "auto_sync": card.is_automated if card.is_automated is not None else True,
            "total_synced_transactions": tx_count,
            "last_sync": last_tx.created_at.strftime("%d/%m/%Y %H:%M") if last_tx and last_tx.created_at else "Sem transações",
            "webhook_endpoint": "/api/open-finance/webhook/purchase"
        })
    return connections
