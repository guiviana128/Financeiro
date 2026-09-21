from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.goal import Goal
from app.schemas.goal_schema import GoalCreate, GoalUpdate, GoalResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/goals", tags=["Goals"])

def format_goal_response(g: Goal) -> GoalResponse:
    target = g.target_amount or 0.0
    current = g.current_amount or 0.0
    pct = (current / target * 100) if target > 0 else 0.0
    rem = max(0.0, target - current)
    
    return GoalResponse(
        id=g.id,
        title=g.title,
        target_amount=target,
        current_amount=current,
        target_date=g.target_date,
        category_icon=g.category_icon or "Target",
        color=g.color or "#10b981",
        created_at=g.created_at or datetime.utcnow(),
        progress_percentage=round(min(100.0, pct), 1),
        remaining_amount=round(rem, 2)
    )

@router.get("", response_model=List[GoalResponse])
def get_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).order_by(Goal.id.asc()).all()
    return [format_goal_response(g) for g in goals]

@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    g = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()
    if not g:
        raise HTTPException(status_code=404, detail="Meta não encontrada.")
    return format_goal_response(g)

@router.post("", response_model=GoalResponse)
def create_goal(
    goal_in: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    g = Goal(**goal_in.model_dump(), user_id=current_user.id)
    db.add(g)
    db.commit()
    db.refresh(g)
    return format_goal_response(g)

@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: int,
    goal_in: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    g = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()
    if not g:
        raise HTTPException(status_code=404, detail="Meta não encontrada.")
    
    update_data = goal_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(g, field, value)
        
    db.commit()
    db.refresh(g)
    return format_goal_response(g)

@router.delete("/{goal_id}")
def delete_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    g = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()
    if not g:
        raise HTTPException(status_code=404, detail="Meta não encontrada.")
    db.delete(g)
    db.commit()
    return {"message": "Meta removida com sucesso."}
