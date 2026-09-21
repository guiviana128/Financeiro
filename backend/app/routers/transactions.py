import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import date
from app.database import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.credit_card import CreditCard
from app.schemas.transaction_schema import TransactionCreate, TransactionUpdate, TransactionResponse
from app.services.finance_service import create_transactions_with_installments, get_competence_month
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

@router.get("", response_model=List[TransactionResponse])
def get_transactions(
    month: Optional[str] = Query(None, description="Competence month YYYY-MM"),
    card_id: Optional[int] = Query(None),
    category_id: Optional[int] = Query(None),
    type: Optional[str] = Query(None),
    is_paid: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(200, le=1000),
    offset: int = Query(0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Transaction).options(
        joinedload(Transaction.category),
        joinedload(Transaction.credit_card)
    ).filter(Transaction.user_id == current_user.id)

    if month:
        query = query.filter(Transaction.competence_month == month)
    if card_id:
        query = query.filter(Transaction.credit_card_id == card_id)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if type and type != "all":
        query = query.filter(Transaction.type == type)
    if is_paid is not None:
        query = query.filter(Transaction.is_paid == is_paid)
    if search:
        query = query.filter(Transaction.description.ilike(f"%{search}%"))

    return query.order_by(Transaction.date.desc(), Transaction.id.desc()).offset(offset).limit(limit).all()

@router.post("", response_model=List[TransactionResponse])
def create_transaction(
    tx_in: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    txs = create_transactions_with_installments(db, tx_in, user_id=current_user.id)
    return txs

@router.put("/{tx_id}", response_model=TransactionResponse)
def update_transaction(
    tx_id: int,
    tx_in: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tx = db.query(Transaction).filter(
        Transaction.id == tx_id,
        Transaction.user_id == current_user.id
    ).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transação não encontrada.")
    
    update_data = tx_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tx, field, value)
    
    # Recalculate competence month if date or credit card changed
    if "date" in update_data or "credit_card_id" in update_data:
        card = None
        if tx.credit_card_id:
            card = db.query(CreditCard).filter(
                CreditCard.id == tx.credit_card_id,
                CreditCard.user_id == current_user.id
            ).first()
        tx.competence_month = get_competence_month(tx.date, card)

    db.commit()
    db.refresh(tx)
    return tx

@router.patch("/{tx_id}/toggle-paid", response_model=TransactionResponse)
def toggle_paid_status(
    tx_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tx = db.query(Transaction).filter(
        Transaction.id == tx_id,
        Transaction.user_id == current_user.id
    ).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transação não encontrada.")
    tx.is_paid = not tx.is_paid
    db.commit()
    db.refresh(tx)
    return tx

@router.delete("/{tx_id}")
def delete_transaction(
    tx_id: int,
    delete_all_installments: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tx = db.query(Transaction).filter(
        Transaction.id == tx_id,
        Transaction.user_id == current_user.id
    ).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transação não encontrada.")
    
    if delete_all_installments and tx.installment_group_id:
        db.query(Transaction).filter(
            Transaction.installment_group_id == tx.installment_group_id,
            Transaction.user_id == current_user.id
        ).delete()
    else:
        db.delete(tx)
        
    db.commit()
    return {"message": "Transação removida com sucesso."}

@router.get("/export/csv")
def export_transactions_csv(
    month: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Transaction).options(
        joinedload(Transaction.category),
        joinedload(Transaction.credit_card)
    ).filter(Transaction.user_id == current_user.id)

    if month:
        query = query.filter(Transaction.competence_month == month)
    
    txs = query.order_by(Transaction.date.asc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output, delimiter=";")
    writer.writerow(["ID", "Data", "Mês Competência", "Descrição", "Tipo", "Valor (R$)", "Forma Pagamento", "Cartão", "Categoria", "Status", "Notas"])
    
    for t in txs:
        cat_name = t.category.name if t.category else ""
        card_name = t.credit_card.name if t.credit_card else ""
        status = "Pago" if t.is_paid else "Pendente"
        tipo = "Receita" if t.type == "income" else "Despesa"
        writer.writerow([
            t.id,
            t.date.strftime("%d/%m/%Y"),
            t.competence_month,
            t.description,
            tipo,
            f"{t.amount:.2f}".replace(".", ","),
            t.payment_method,
            card_name,
            cat_name,
            status,
            t.notes or ""
        ])
    
    content = output.getvalue().encode("utf-8-sig")
    filename = f"transacoes_{month or 'todas'}.csv"
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
