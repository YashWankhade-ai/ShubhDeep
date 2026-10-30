import re
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import order_service
from app.models.order import Order

router = APIRouter(prefix="/orders", tags=["Public Orders"])

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(data: OrderCreate, db: Session = Depends(get_db)):
    order = order_service.create_order(db, data)
    return OrderResponse.model_validate(order)

@router.get("/track/{order_number}", response_model=OrderResponse)
def track_order(
    order_number: str,
    phone: Optional[str] = Query(None, description="Optional customer phone or last 4 digits for verification"),
    phone_last4: Optional[str] = Query(None, description="Legacy parameter for last 4 digits"),
    db: Session = Depends(get_db)
):
    clean_order_num = order_number.strip().upper()
    order = order_service.get_order_by_number(db, clean_order_num)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No order found matching reference '{clean_order_num}'. Please check your confirmation message."
        )

    # Optional phone verification
    verification_digits = phone or phone_last4
    if verification_digits:
        input_digits = re.sub(r"\D", "", verification_digits)
        saved_digits = re.sub(r"\D", "", order.customer_phone)

        # Check if last 4 digits match
        if len(input_digits) >= 4:
            if not saved_digits.endswith(input_digits[-4:]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Order found, but the phone digits provided do not match our records."
                )

    return OrderResponse.model_validate(order)

@router.get("/by-phone/{phone_number}", response_model=List[OrderResponse])
def get_orders_by_phone(
    phone_number: str,
    db: Session = Depends(get_db)
):
    digits = re.sub(r"\D", "", phone_number)
    if len(digits) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide at least 6 digits of your phone number."
        )

    all_orders = db.query(Order).order_by(desc(Order.created_at)).all()
    matched = [
        o for o in all_orders 
        if re.sub(r"\D", "", o.customer_phone).endswith(digits[-10:])
    ]

    return [OrderResponse.model_validate(o) for o in matched]

