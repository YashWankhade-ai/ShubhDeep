from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base, utc_now

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    old_price = Column(Numeric(10, 2), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    stock_quantity = Column(Integer, default=0, nullable=False)
    is_available = Column(Boolean, default=True, nullable=False)
    badge = Column(String(50), nullable=True)
    is_new = Column(Boolean, default=False, nullable=False)
    featured = Column(Boolean, default=False, nullable=False)
    is_deal = Column(Boolean, default=False, nullable=False, server_default="0")
    deal_ends_at = Column(DateTime(timezone=True), nullable=True)
    details = Column(JSON, default=list, nullable=True)
    sizes = Column(JSON, default=list, nullable=True)
    colors = Column(JSON, default=list, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.display_order")
    order_items = relationship("OrderItem", back_populates="product")
