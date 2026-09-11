from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.goal import Goal
from app.schemas.goal_schema import GoalCreate, GoalUpdate, GoalResponse

router = APIRouter(prefix="/api/goals", tags=["Goals"])

@router.get("", response_model=List[GoalResponse])
def get_goals(db: Session = Depends(get_db)):
    goals = db.query(Goal).order_by(Goal.id.asc()).all()
    results = []
    for g in goals:
        pct = (g.current_amount / g.target_amount * 100) if g.target_amount > 0 else 0
        rem = max(0.0, g.target_amount - g.current_amount)
        results.append(GoalResponse(
            id=g.id,
            title=g.title,
            target_amount=g.target_amount,
            current_amount=g.current_amount,
            target_date=g.target_date,
            category_icon=g.category_icon,
            color=g.color,
            created_at=g.created_at,
            progress_percentage=round(min(100.0, pct), 1),
            remaining_amount=round(rem, 2)
        ))
    return results

@router.post("", response_model=GoalResponse)
def create_goal(goal_in: GoalCreate, db: Session = Depends(get_db)):
    g = Goal(**goal_in.model_dump())
    db.add(g)
    db.commit()
    db.refresh(g)
    pct = (g.current_amount / g.target_amount * 100) if g.target_amount > 0 else 0
    rem = max(0.0, g.target_amount - g.current_amount)
    return GoalResponse(
        id=g.id,
        title=g.title,
        target_amount=g.target_amount,
        current_amount=g.current_amount,
        target_date=g.target_date,
        category_icon=g.category_icon,
        color=g.color,
        created_at=g.created_at,
        progress_percentage=round(min(100.0, pct), 1),
        remaining_amount=round(rem, 2)
    )

@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: int, goal_in: GoalUpdate, db: Session = Depends(get_db)):
    g = db.query(Goal).filter(Goal.id == goal_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Meta não encontrada.")
    
    update_data = goal_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(g, field, value)
        
    db.commit()
    db.refresh(g)
    
    pct = (g.current_amount / g.target_amount * 100) if g.target_amount > 0 else 0
    rem = max(0.0, g.target_amount - g.current_amount)
    return GoalResponse(
        id=g.id,
        title=g.title,
        target_amount=g.target_amount,
        current_amount=g.current_amount,
        target_date=g.target_date,
        category_icon=g.category_icon,
        color=g.color,
        created_at=g.created_at,
        progress_percentage=round(min(100.0, pct), 1),
        remaining_amount=round(rem, 2)
    )

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    g = db.query(Goal).filter(Goal.id == goal_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Meta não encontrada.")
    db.delete(g)
    db.commit()
    return {"message": "Meta removida com sucesso."}
