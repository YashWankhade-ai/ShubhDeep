from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse, AdminUserResponse
from app.services.auth_service import auth_service
from app.core.security import create_access_token
from app.api.deps import get_current_admin
from app.models.admin_user import AdminUser

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    admin = auth_service.authenticate_admin(db, email=data.email, password=data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = create_access_token(subject=admin.id, role=admin.role)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=AdminUserResponse.model_validate(admin)
    )

@router.post("/logout")
def logout(current_admin: AdminUser = Depends(get_current_admin)):
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=AdminUserResponse)
def get_me(current_admin: AdminUser = Depends(get_current_admin)):
    return AdminUserResponse.model_validate(current_admin)
