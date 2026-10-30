from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime
from sqlalchemy.orm import relationship
from app.models.base import Base, utc_now

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    customer_name = Column(String(150), nullable=False)
    customer_phone = Column(String(30), nullable=False, index=True)
    delivery_address = Column(Text, nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
    delivery_fee = Column(Numeric(10, 2), default=0.00, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    order_status = Column(String(30), default="pending", nullable=False, index=True) # pending, confirmed, processing, shipped, delivered, cancelled
    payment_status = Column(String(30), default="pending", nullable=False) # pending, cod, paid, refunded
    idempotency_key = Column(String(100), unique=True, nullable=True, index=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False, index=True)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
