from sqlalchemy.orm import Session
from app.models.category import Category

def seed_database_if_empty(db: Session):
    """
    Seeds only standard default categories for expenses and incomes.
    No fictitious cards, transactions, budgets, or goals are created.
    """
    if db.query(Category).count() > 0:
        return # Categories already exist

    # Standard default categories
    categories_data = [
        # Expenses - Needs (50%)
        {"name": "Moradia & Contas", "icon": "Home", "color": "#6366f1", "type": "expense", "budget_type": "needs"},
        {"name": "Supermercado & Alimentação", "icon": "ShoppingCart", "color": "#f59e0b", "type": "expense", "budget_type": "needs"},
        {"name": "Transporte & Combustível", "icon": "Car", "color": "#3b82f6", "type": "expense", "budget_type": "needs"},
        {"name": "Saúde & Farmácia", "icon": "HeartPulse", "color": "#ef4444", "type": "expense", "budget_type": "needs"},
        {"name": "Educação & Cursos", "icon": "GraduationCap", "color": "#8b5cf6", "type": "expense", "budget_type": "needs"},
        
        # Expenses - Wants (30%)
        {"name": "Lazer & Restaurantes", "icon": "Utensils", "color": "#ec4899", "type": "expense", "budget_type": "wants"},
        {"name": "Compras & Vestuário", "icon": "ShoppingBag", "color": "#14b8a6", "type": "expense", "budget_type": "wants"},
        {"name": "Assinaturas & Streaming", "icon": "Tv", "color": "#06b6d4", "type": "expense", "budget_type": "wants"},
        {"name": "Viagens & Férias", "icon": "Plane", "color": "#f97316", "type": "expense", "budget_type": "wants"},
        
        # Expenses - Savings (20%)
        {"name": "Investimentos & Ações", "icon": "TrendingUp", "color": "#10b981", "type": "expense", "budget_type": "savings"},
        {"name": "Reserva de Emergência", "icon": "ShieldCheck", "color": "#059669", "type": "expense", "budget_type": "savings"},
        
        # Incomes
        {"name": "Salário Mensal", "icon": "Briefcase", "color": "#10b981", "type": "income", "budget_type": "needs"},
        {"name": "Rendimentos & Dividendos", "icon": "Coins", "color": "#34d399", "type": "income", "budget_type": "savings"},
        {"name": "Freelance & Extras", "icon": "Laptop", "color": "#60a5fa", "type": "income", "budget_type": "wants"},
    ]

    for cat_dict in categories_data:
        cat = Category(**cat_dict)
        db.add(cat)

    db.commit()
