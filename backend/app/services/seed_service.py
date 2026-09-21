from sqlalchemy.orm import Session
from app.models.category import Category
from app.models.user import User
from app.models.credit_card import CreditCard
from app.models.transaction import Transaction
from app.models.goal import Goal
from app.services.auth_service import hash_password
from datetime import date, datetime

DEFAULT_CATEGORIES = [
    # Expenses - Needs (50% - Essencial)
    {"name": "Moradia & Contas", "icon": "Home", "color": "#6366f1", "type": "expense", "budget_type": "needs"},
    {"name": "Supermercado & Alimentação", "icon": "ShoppingCart", "color": "#f59e0b", "type": "expense", "budget_type": "needs"},
    {"name": "Transporte & Combustível", "icon": "Car", "color": "#3b82f6", "type": "expense", "budget_type": "needs"},
    {"name": "Saúde & Farmácia", "icon": "HeartPulse", "color": "#ef4444", "type": "expense", "budget_type": "needs"},
    {"name": "Educação & Cursos", "icon": "GraduationCap", "color": "#8b5cf6", "type": "expense", "budget_type": "needs"},
    {"name": "Pets & Animais", "icon": "PawPrint", "color": "#f97316", "type": "expense", "budget_type": "needs"},
    {"name": "Impostos, Taxas & Seguros", "icon": "FileText", "color": "#64748b", "type": "expense", "budget_type": "needs"},
    
    # Expenses - Wants (30% - Estilo de Vida & Lazer)
    {"name": "Lazer & Restaurantes", "icon": "Utensils", "color": "#ec4899", "type": "expense", "budget_type": "wants"},
    {"name": "Compras & Vestuário", "icon": "ShoppingBag", "color": "#14b8a6", "type": "expense", "budget_type": "wants"},
    {"name": "Assinaturas & Streaming", "icon": "Tv", "color": "#06b6d4", "type": "expense", "budget_type": "wants"},
    {"name": "Viagens & Férias", "icon": "Plane", "color": "#f97316", "type": "expense", "budget_type": "wants"},
    {"name": "Beleza & Cuidados Pessoais", "icon": "Sparkles", "color": "#d946ef", "type": "expense", "budget_type": "wants"},
    {"name": "Casa & Manutenção", "icon": "Wrench", "color": "#84cc16", "type": "expense", "budget_type": "wants"},
    {"name": "Presentes & Doações", "icon": "Gift", "color": "#fb7185", "type": "expense", "budget_type": "wants"},
    {"name": "Hobbies & Jogos", "icon": "Gamepad2", "color": "#a855f7", "type": "expense", "budget_type": "wants"},
    
    # Expenses - Savings (20% - Futuro & Metas)
    {"name": "Investimentos & Ações", "icon": "TrendingUp", "color": "#10b981", "type": "expense", "budget_type": "savings"},
    {"name": "Reserva de Emergência", "icon": "ShieldCheck", "color": "#059669", "type": "expense", "budget_type": "savings"},
    
    # Incomes
    {"name": "Salário Mensal", "icon": "Briefcase", "color": "#10b981", "type": "income", "budget_type": "needs"},
    {"name": "Rendimentos & Dividendos", "icon": "Coins", "color": "#34d399", "type": "income", "budget_type": "savings"},
    {"name": "Freelance & Extras", "icon": "Laptop", "color": "#60a5fa", "type": "income", "budget_type": "wants"},
    {"name": "Vendas & Desapegos", "icon": "Tag", "color": "#38bdf8", "type": "income", "budget_type": "wants"},
    {"name": "Outras Receitas", "icon": "PlusCircle", "color": "#10b981", "type": "income", "budget_type": "needs"},
]

def seed_database_if_empty(db: Session):
    """
    Seeds global categories and a default demo user.
    """
    # 1. Global / base categories
    for cat_dict in DEFAULT_CATEGORIES:
        exists = db.query(Category).filter(Category.name == cat_dict["name"]).first()
        if not exists:
            cat = Category(**cat_dict, user_id=None)
            db.add(cat)
    db.commit()

    # 2. Seed default demo user
    demo_user = db.query(User).filter(User.email == "demo@finflow.com").first()
    if not demo_user:
        demo_user = User(
            name="Usuário Demo",
            email="demo@finflow.com",
            password_hash=hash_password("demo123"),
            created_at=datetime.utcnow()
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        # Link any existing unassigned records to demo user
        db.query(CreditCard).filter(CreditCard.user_id == None).update({"user_id": demo_user.id})
        db.query(Transaction).filter(Transaction.user_id == None).update({"user_id": demo_user.id})
        db.query(Goal).filter(Goal.user_id == None).update({"user_id": demo_user.id})
        db.commit()
