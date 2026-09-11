from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Base directory for DB
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "financeiro.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def run_auto_migrations():
    """Ensures newly added columns exist in existing SQLite database tables."""
    try:
        with engine.connect() as conn:
            # Check credit_cards table columns
            cursor = conn.execute(text("PRAGMA table_info(credit_cards)"))
            existing_columns = [row[1] for row in cursor.fetchall()]
            
            if existing_columns:
                if "holder_cpf" not in existing_columns:
                    conn.execute(text("ALTER TABLE credit_cards ADD COLUMN holder_cpf VARCHAR(20)"))
                if "automation_type" not in existing_columns:
                    conn.execute(text("ALTER TABLE credit_cards ADD COLUMN automation_type VARCHAR(50) DEFAULT 'open_finance'"))
                if "is_automated" not in existing_columns:
                    conn.execute(text("ALTER TABLE credit_cards ADD COLUMN is_automated BOOLEAN DEFAULT 1"))
                if "webhook_token" not in existing_columns:
                    conn.execute(text("ALTER TABLE credit_cards ADD COLUMN webhook_token VARCHAR(64)"))
                conn.commit()
    except Exception as e:
        print(f"Auto-migration notice: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
