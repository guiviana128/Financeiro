import uuid
from datetime import date, datetime, timedelta
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.models.transaction import Transaction
from app.models.credit_card import CreditCard
from app.models.category import Category
from app.models.budget import Budget
from app.models.goal import Goal
from app.schemas.transaction_schema import TransactionCreate

def get_competence_month(tx_date: date, credit_card: CreditCard = None) -> str:
    """
    Computes competence month (YYYY-MM).
    If it's a credit card transaction and date is after the closing day,
    the invoice falls into the next month.
    """
    if not credit_card or credit_card.closing_day is None:
        return tx_date.strftime("%Y-%m")
    
    closing_day = credit_card.closing_day
    if tx_date.day > closing_day:
        # Falls in next month
        year = tx_date.year
        month = tx_date.month + 1
        if month > 12:
            month = 1
            year += 1
        return f"{year:04d}-{month:02d}"
    
    return tx_date.strftime("%Y-%m")

def add_months(sourcedate: date, months: int) -> date:
    """Adds months safely to a date handling month ends."""
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    # Handle end of month rollover (e.g., Feb 30 -> Feb 28)
    day = min(sourcedate.day, [31,
        29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28,
        31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1])
    return date(year, month, day)

def create_transactions_with_installments(db: Session, tx_in: TransactionCreate) -> List[Transaction]:
    """
    Creates one or multiple transactions (if installment).
    """
    card = None
    if tx_in.credit_card_id:
        card = db.query(CreditCard).filter(CreditCard.id == tx_in.credit_card_id).first()

    installments = max(1, tx_in.installments_count or 1)
    
    if installments == 1:
        comp_month = tx_in.competence_month or get_competence_month(tx_in.date, card)
        tx = Transaction(
            description=tx_in.description,
            amount=round(tx_in.amount, 2),
            type=tx_in.type,
            payment_method=tx_in.payment_method,
            category_id=tx_in.category_id,
            credit_card_id=tx_in.credit_card_id,
            date=tx_in.date,
            competence_month=comp_month,
            is_installment=False,
            installment_current=1,
            installment_total=1,
            installment_group_id=None,
            is_fixed=tx_in.is_fixed,
            is_paid=tx_in.is_paid,
            notes=tx_in.notes
        )
        db.add(tx)
        db.commit()
        db.refresh(tx)
        return [tx]
    
    # Handle installments (e.g. 10x)
    total_amount = tx_in.amount if tx_in.amount_is_total else tx_in.amount * installments
    installment_amount = round(total_amount / installments, 2)
    group_id = str(uuid.uuid4())
    
    created = []
    for i in range(1, installments + 1):
        # Calculate date for i-th installment
        inst_date = add_months(tx_in.date, i - 1)
        comp_month = get_competence_month(inst_date, card)
        
        desc = f"{tx_in.description} ({i}/{installments})"
        tx = Transaction(
            description=desc,
            amount=installment_amount,
            type=tx_in.type,
            payment_method=tx_in.payment_method,
            category_id=tx_in.category_id,
            credit_card_id=tx_in.credit_card_id,
            date=inst_date,
            competence_month=comp_month,
            is_installment=True,
            installment_current=i,
            installment_total=installments,
            installment_group_id=group_id,
            is_fixed=False,
            is_paid=(i == 1 and tx_in.is_paid),
            notes=tx_in.notes
        )
        db.add(tx)
        created.append(tx)
    
    db.commit()
    for tx in created:
        db.refresh(tx)
    return created

def calculate_card_metrics(db: Session, card: CreditCard, month: str = None) -> Dict[str, Any]:
    """
    Computes current bill, available limit, and usage percentage for a card.
    """
    if not month:
        month = date.today().strftime("%Y-%m")
        
    # Sum expenses for this card in this competence month
    bill = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.credit_card_id == card.id,
        Transaction.type == "expense",
        Transaction.competence_month == month
    ).scalar() or 0.0

    # Total all unpaid card transactions across all months to know total locked limit
    total_unpaid = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.credit_card_id == card.id,
        Transaction.type == "expense",
        Transaction.is_paid == False
    ).scalar() or 0.0

    # If bill is paid, used is total_unpaid, else at least current bill
    used_limit = max(bill, total_unpaid)
    available = max(0.0, card.limit_total - used_limit)
    usage_pct = round((used_limit / card.limit_total * 100) if card.limit_total > 0 else 0, 1)
    
    status = "Excelente"
    if usage_pct > 85:
        status = "Limite Crítico"
    elif usage_pct > 60:
        status = "Atenção ao Limite"
    elif usage_pct > 30:
        status = "Uso Moderado"

    return {
        "current_bill": round(bill, 2),
        "available_limit": round(available, 2),
        "usage_percentage": min(100.0, usage_pct),
        "status_label": status
    }

def get_dashboard_metrics(db: Session, month: str = None) -> Dict[str, Any]:
    if not month:
        month = date.today().strftime("%Y-%m")
    
    # Incomes in month
    monthly_income = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.type == "income",
        Transaction.competence_month == month
    ).scalar() or 0.0

    # Expenses in month (non-card or all)
    monthly_expense = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.type == "expense",
        Transaction.competence_month == month
    ).scalar() or 0.0

    # Card bill in month
    card_bill = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.type == "expense",
        Transaction.credit_card_id != None,
        Transaction.competence_month == month
    ).scalar() or 0.0

    # Total balance = all lifetime incomes - all lifetime expenses
    all_income = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.type == "income"
    ).scalar() or 0.0
    all_expense = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.type == "expense"
    ).scalar() or 0.0
    total_balance = all_income - all_expense

    net_savings = monthly_income - monthly_expense
    savings_rate = round((net_savings / monthly_income * 100) if monthly_income > 0 else 0, 1)
    if savings_rate < 0:
        savings_rate = 0.0

    # Health Score Calculation (0 to 100)
    # 1. Savings rate (40 pts): > 20% = 40 pts
    score_savings = min(40, (savings_rate / 20.0) * 40)
    
    # 2. Credit Card usage (30 pts): < 30% limit = 30 pts, > 80% limit = 5 pts
    cards = db.query(CreditCard).filter(CreditCard.is_active == True).all()
    total_limit = sum(c.limit_total for c in cards)
    total_used = sum(calculate_card_metrics(db, c, month)["current_bill"] for c in cards)
    card_ratio = (total_used / total_limit) if total_limit > 0 else 0
    if card_ratio <= 0.30:
        score_cards = 30
    elif card_ratio <= 0.60:
        score_cards = 20
    elif card_ratio <= 0.85:
        score_cards = 10
    else:
        score_cards = 5

    # 3. Budget & Deficit (30 pts): No deficit = 30 pts
    score_budget = 30 if net_savings >= 0 else max(0, 30 + int(net_savings / (monthly_income or 1000) * 30))

    health_score = int(score_savings + score_cards + score_budget)
    health_score = max(5, min(100, health_score))

    health_status = "Excelente" if health_score >= 80 else ("Bom" if health_score >= 60 else ("Alerta" if health_score >= 40 else "Crítico"))

    tips = []
    if savings_rate >= 20:
        tips.append(f"Parabéns! Sua taxa de poupança ({savings_rate}%) está excelente e acima da média.")
    elif savings_rate > 0:
        tips.append(f"Sua taxa de poupança está em {savings_rate}%. Tente atingir 20% para acelerar suas metas.")
    else:
        tips.append("Seus gastos estão superando suas receitas neste mês. Revise despesas variáveis imediatamente.")

    if card_ratio > 0.70:
        tips.append("Atenção: O uso do limite dos seus cartões ultrapassou 70%. Cuidado com juros rotativos.")
    else:
        tips.append("Uso de cartões de crédito sob controle.")

    if total_balance > 0:
        tips.append("Mantenha sua reserva de emergência rendendo em liquidez diária.")

    # Category Breakdown
    cat_query = db.query(
        Category.name,
        Category.color,
        Category.icon,
        func.sum(Transaction.amount).label("total")
    ).join(Transaction, Transaction.category_id == Category.id)\
     .filter(Transaction.type == "expense", Transaction.competence_month == month)\
     .group_by(Category.id)\
     .order_by(func.sum(Transaction.amount).desc()).all()

    expenses_by_category = [
        {
            "name": row[0],
            "color": row[1],
            "icon": row[2],
            "amount": round(row[3], 2),
            "percentage": round((row[3] / monthly_expense * 100) if monthly_expense > 0 else 0, 1)
        }
        for row in cat_query
    ]

    # 6-Month Cashflow History
    current_dt = datetime.strptime(month, "%Y-%m")
    cashflow_history = []
    pt_months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    for i in range(5, -1, -1):
        past_dt = add_months(current_dt.date(), -i)
        past_m = past_dt.strftime("%Y-%m")
        month_label = f"{pt_months[past_dt.month - 1]}/{str(past_dt.year)[-2:]}"
        
        inc = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
            Transaction.type == "income",
            Transaction.competence_month == past_m
        ).scalar() or 0.0

        exp = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
            Transaction.type == "expense",
            Transaction.competence_month == past_m
        ).scalar() or 0.0

        card_exp = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
            Transaction.type == "expense",
            Transaction.credit_card_id != None,
            Transaction.competence_month == past_m
        ).scalar() or 0.0

        cashflow_history.append({
            "month": past_m,
            "label": month_label,
            "income": round(inc, 2),
            "expense": round(exp, 2),
            "credit_card": round(card_exp, 2),
            "savings": round(inc - exp, 2)
        })

    # Upcoming bills (Credit cards due dates + upcoming pending transactions)
    upcoming_bills = []
    for card in cards:
        card_m = calculate_card_metrics(db, card, month)
        if card_m["current_bill"] > 0:
            upcoming_bills.append({
                "type": "card",
                "title": f"Fatura {card.name}",
                "amount": card_m["current_bill"],
                "due_day": card.due_day,
                "bank": card.bank,
                "color": card.color
            })

    return {
        "current_month": month,
        "total_balance": round(total_balance, 2),
        "monthly_income": round(monthly_income, 2),
        "monthly_expense": round(monthly_expense, 2),
        "monthly_credit_card_bill": round(card_bill, 2),
        "net_savings": round(net_savings, 2),
        "savings_rate": savings_rate,
        "financial_health_score": health_score,
        "health_status": health_status,
        "health_tips": tips,
        "expenses_by_category": expenses_by_category,
        "cashflow_history": cashflow_history,
        "upcoming_bills": upcoming_bills,
        "total_credit_limit": round(total_limit, 2),
        "total_credit_used": round(total_used, 2)
    }

def get_50_30_20_rule(db: Session, month: str = None) -> Dict[str, Any]:
    if not month:
        month = date.today().strftime("%Y-%m")

    income = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.type == "income",
        Transaction.competence_month == month
    ).scalar() or 0.0

    # Group expenses by category budget_type (needs, wants, savings)
    expenses = db.query(
        Category.budget_type,
        func.coalesce(func.sum(Transaction.amount), 0.0)
    ).join(Transaction, Transaction.category_id == Category.id)\
     .filter(Transaction.type == "expense", Transaction.competence_month == month)\
     .group_by(Category.budget_type).all()

    spent_map = {row[0]: row[1] for row in expenses}
    
    needs_spent = round(spent_map.get("needs", 0.0), 2)
    wants_spent = round(spent_map.get("wants", 0.0), 2)
    savings_spent = round(spent_map.get("savings", 0.0), 2)

    return {
        "total_income": round(income, 2),
        "needs_budget": round(income * 0.50, 2),
        "needs_spent": needs_spent,
        "wants_budget": round(income * 0.30, 2),
        "wants_spent": wants_spent,
        "savings_budget": round(income * 0.20, 2),
        "savings_spent": savings_spent
    }
