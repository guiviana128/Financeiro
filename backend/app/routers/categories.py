from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.category import Category
from app.schemas.category_schema import CategoryCreate, CategoryResponse

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse])
def get_categories(type: str = None, db: Session = Depends(get_db)):
    query = db.query(Category)
    if type and type != "all":
        query = query.filter((Category.type == type) | (Category.type == "both"))
    return query.order_by(Category.name.asc()).all()

@router.post("", response_model=CategoryResponse)
def create_category(cat_in: CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(Category).filter(Category.name.ilike(cat_in.name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Categoria já cadastrada com esse nome.")
    
    cat = Category(**cat_in.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Categoria não encontrada.")
    db.delete(cat)
    db.commit()
    return {"message": "Categoria removida com sucesso."}
