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
            # Helper to check and add column
            def ensure_column(table_name: str, column_name: str, column_def: str):
                cursor = conn.execute(text(f"PRAGMA table_info({table_name})"))
                cols = [row[1] for row in cursor.fetchall()]
                if cols and column_name not in cols:
                    conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_def}"))

            # Check credit_cards table columns
            ensure_column("credit_cards", "holder_cpf", "VARCHAR(20)")
            ensure_column("credit_cards", "automation_type", "VARCHAR(50) DEFAULT 'open_finance'")
            ensure_column("credit_cards", "is_automated", "BOOLEAN DEFAULT 1")
            ensure_column("credit_cards", "webhook_token", "VARCHAR(64)")
            ensure_column("credit_cards", "user_id", "INTEGER")

            # Check user_id in all models
            ensure_column("users", "avatar_url", "TEXT")
            ensure_column("transactions", "user_id", "INTEGER")
            ensure_column("categories", "user_id", "INTEGER")
            ensure_column("budgets", "user_id", "INTEGER")
            ensure_column("goals", "user_id", "INTEGER")

            conn.commit()
    except Exception as e:
        print(f"Auto-migration notice: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
