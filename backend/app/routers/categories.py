from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.category import Category
from app.schemas.category_schema import CategoryCreate, CategoryResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse])
def get_categories(
    type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check user specific categories first
    query = db.query(Category).filter(
        (Category.user_id == current_user.id) | (Category.user_id == None)
    )
    if type and type != "all":
        query = query.filter((Category.type == type) | (Category.type == "both"))
    
    cats = query.order_by(Category.name.asc()).all()
    
    # Deduplicate by name if user has customized standard ones
    unique_cats = {}
    for c in cats:
        # Prefer user-specific over system default
        if c.name not in unique_cats or c.user_id == current_user.id:
            unique_cats[c.name] = c
            
    return sorted(list(unique_cats.values()), key=lambda x: x.name)

@router.post("", response_model=CategoryResponse)
def create_category(
    cat_in: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Category).filter(
        Category.name.ilike(cat_in.name),
        Category.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Categoria já cadastrada com esse nome.")
    
    cat = Category(**cat_in.model_dump(), user_id=current_user.id, is_custom=True)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cat = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Categoria não encontrada ou não pode ser excluída.")
    db.delete(cat)
    db.commit()
    return {"message": "Categoria removida com sucesso."}
