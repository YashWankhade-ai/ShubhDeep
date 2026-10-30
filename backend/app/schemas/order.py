from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0, le=99)
    size: Optional[str] = None
    color: Optional[str] = None

class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=150)
    customer_phone: str = Field(..., min_length=8, max_length=30)
    delivery_address: str = Field(..., min_length=10)
    items: List[OrderItemCreate] = Field(..., min_length=1)
    idempotency_key: Optional[str] = None
    notes: Optional[str] = None

class OrderItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: Optional[int]
    product_name_snapshot: str
    unit_price: Decimal
    quantity: int
    line_total: Decimal
    variant_snapshot: Optional[str] = None

class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_number: str
    customer_name: str
    customer_phone: str
    delivery_address: str
    subtotal: Decimal
    delivery_fee: Decimal
    total_amount: Decimal
    order_status: str
    payment_status: str
    idempotency_key: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

class OrderStatusUpdate(BaseModel):
    order_status: str = Field(..., pattern="^(pending|confirmed|processing|shipped|delivered|cancelled)$")
    payment_status: Optional[str] = Field(None, pattern="^(pending|cod|paid|refunded)$")
    notes: Optional[str] = None
