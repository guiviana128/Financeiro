from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.schemas.user_schema import UserRegister, UserLogin, UserUpdate, UserResponse, TokenResponse
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    email = user_in.email.strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="E-mail é obrigatório.")
    
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Já existe uma conta cadastrada com este e-mail.")
    
    if len(user_in.password) < 4:
        raise HTTPException(status_code=400, detail="A senha deve ter pelo menos 4 caracteres.")

    # Create User
    new_user = User(
        name=user_in.name.strip(),
        email=email,
        password_hash=hash_password(user_in.password),
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate JWT Token
    token = create_access_token({"sub": str(new_user.id), "email": new_user.email, "name": new_user.name})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )

@router.post("/login", response_model=TokenResponse)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    email = user_in.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos."
        )

    token = create_access_token({"sub": str(user.id), "email": user.email, "name": user.name})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.put("/profile", response_model=UserResponse)
def update_profile(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_in.name:
        current_user.name = user_in.name.strip()
    
    if user_in.email:
        new_email = user_in.email.strip().lower()
        if new_email != current_user.email:
            existing = db.query(User).filter(User.email == new_email).first()
            if existing:
                raise HTTPException(status_code=400, detail="Este e-mail já está em uso.")
            current_user.email = new_email

    if user_in.new_password:
        if not user_in.current_password:
            raise HTTPException(status_code=400, detail="Senha atual é necessária para alterar a senha.")
        if not verify_password(user_in.current_password, current_user.password_hash):
            raise HTTPException(status_code=400, detail="Senha atual incorreta.")
        if len(user_in.new_password) < 4:
            raise HTTPException(status_code=400, detail="A nova senha deve ter no mínimo 4 caracteres.")
        current_user.password_hash = hash_password(user_in.new_password)

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)
