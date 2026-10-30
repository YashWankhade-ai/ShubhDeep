from typing import Optional
from sqlalchemy.orm import Session
from app.models.admin_user import AdminUser
from app.core.security import verify_password, get_password_hash
from app.core.config import settings

class AuthService:
    @staticmethod
    def authenticate_admin(db: Session, email: str, password: str) -> Optional[AdminUser]:
        user = db.query(AdminUser).filter(AdminUser.email == email.strip().lower()).first()
        if not user:
            return None
        if not user.is_active:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

    @staticmethod
    def seed_initial_admin(db: Session) -> AdminUser:
        email = settings.INITIAL_ADMIN_EMAIL.strip().lower()
        existing = db.query(AdminUser).filter(AdminUser.email == email).first()
        if not existing:
            admin = AdminUser(
                email=email,
                password_hash=get_password_hash(settings.INITIAL_ADMIN_PASSWORD),
                role="admin",
                is_active=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            return admin
        return existing

auth_service = AuthService()
