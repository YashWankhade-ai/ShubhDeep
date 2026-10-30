from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

class ProductImageBase(BaseModel):
    image_url: str = Field(..., max_length=1024)
    alt_text: Optional[str] = None
    display_order: int = 0

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageResponse(ProductImageBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    created_at: datetime

class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    slug: str = Field(..., min_length=2, max_length=255)
    description: str = Field(..., min_length=5)
    price: Decimal = Field(..., gt=0)
    old_price: Optional[Decimal] = Field(None, gt=0)
    category_id: Optional[int] = None
    stock_quantity: int = Field(default=0, ge=0)
    is_available: bool = True
    badge: Optional[str] = None
    is_new: bool = False
    featured: bool = False
    is_deal: bool = False
    deal_ends_at: Optional[datetime] = None
    details: Optional[List[str]] = []
    sizes: Optional[List[str]] = []
    colors: Optional[List[str]] = []

class ProductCreate(ProductBase):
    image_urls: Optional[List[str]] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    slug: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, min_length=5)
    price: Optional[Decimal] = Field(None, gt=0)
    old_price: Optional[Decimal] = None
    category_id: Optional[int] = None
    stock_quantity: Optional[int] = Field(None, ge=0)
    is_available: Optional[bool] = None
    badge: Optional[str] = None
    is_new: Optional[bool] = None
    featured: Optional[bool] = None
    is_deal: Optional[bool] = None
    deal_ends_at: Optional[datetime] = None
    details: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    image_urls: Optional[List[str]] = None

class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category_name: Optional[str] = None
    category_slug: Optional[str] = None
    images: List[ProductImageResponse] = []
    created_at: datetime
    updated_at: datetime
