import re
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.db.session import get_db
from app.models.user import User
from app.models.order import Order
from app.schemas.customer import (
    CustomerRegisterRequest,
    CustomerLoginRequest,
    CustomerProfileUpdate,
    CustomerUserResponse,
    CustomerTokenResponse,
)
from app.schemas.order import OrderResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_customer

router = APIRouter(prefix="/customer", tags=["Customer Authentication & Account"])

def clean_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone or "")
    if len(digits) >= 10:
        return digits[-10:]
    return digits

@router.post("/register", response_model=CustomerTokenResponse)
def register_customer(data: CustomerRegisterRequest, db: Session = Depends(get_db)):
    email = data.email.strip().lower()
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please sign in instead."
        )
    
    phone_clean = clean_phone(data.phone)
    if len(phone_clean) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid 10-digit mobile number."
        )

    user = User(
        name=data.name.strip(),
        email=email,
        phone=phone_clean,
        password_hash=get_password_hash(data.password),
        delivery_address=data.delivery_address.strip() if data.delivery_address else None,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id, role="customer")
    return CustomerTokenResponse(
        access_token=token,
        token_type="bearer",
        user=CustomerUserResponse.model_validate(user)
    )

@router.post("/login", response_model=CustomerTokenResponse)
def login_customer(data: CustomerLoginRequest, db: Session = Depends(get_db)):
    identifier = data.email_or_phone.strip()
    digits = clean_phone(identifier)
    
    # Check by email or 10-digit phone number
    user = db.query(User).filter(
        or_(
            User.email == identifier.lower(),
            User.phone == digits,
            User.phone == identifier
        )
    ).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/mobile number or password. Please check your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact support."
        )

    token = create_access_token(subject=user.id, role="customer")
    return CustomerTokenResponse(
        access_token=token,
        token_type="bearer",
        user=CustomerUserResponse.model_validate(user)
    )

@router.get("/me", response_model=CustomerUserResponse)
def get_customer_me(current_customer: User = Depends(get_current_customer)):
    return CustomerUserResponse.model_validate(current_customer)

@router.put("/profile", response_model=CustomerUserResponse)
def update_customer_profile(
    data: CustomerProfileUpdate,
    db: Session = Depends(get_db),
    current_customer: User = Depends(get_current_customer)
):
    if data.name is not None and data.name.strip():
        current_customer.name = data.name.strip()
    if data.phone is not None and len(clean_phone(data.phone)) >= 10:
        current_customer.phone = clean_phone(data.phone)
    if data.delivery_address is not None:
        current_customer.delivery_address = data.delivery_address.strip() or None

    db.commit()
    db.refresh(current_customer)
    return CustomerUserResponse.model_validate(current_customer)

@router.get("/orders", response_model=List[OrderResponse])
def get_customer_orders(
    db: Session = Depends(get_db),
    current_customer: User = Depends(get_current_customer)
):
    # Find orders that match the customer's phone number or name
    phone = current_customer.phone
    phone_clean = clean_phone(phone)
    
    orders = db.query(Order).filter(
        or_(
            Order.customer_phone == phone,
            Order.customer_phone.ilike(f"%{phone_clean}%"),
            Order.customer_name.ilike(f"%{current_customer.name}%")
        )
    ).order_by(desc(Order.created_at)).all()

    return [OrderResponse.model_validate(o) for o in orders]
