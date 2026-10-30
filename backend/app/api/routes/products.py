import math
from decimal import Decimal
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.schemas.product import ProductResponse
from app.schemas.common import PaginatedResponse
from app.services.product_service import product_service
from app.models.product import Product

router = APIRouter(prefix="/products", tags=["Public Products"])

def serialize_product(prod: Product) -> dict:
    return {
        "id": prod.id,
        "name": prod.name,
        "slug": prod.slug,
        "description": prod.description,
        "price": prod.price,
        "old_price": prod.old_price,
        "category_id": prod.category_id,
        "category_name": prod.category.name if prod.category else None,
        "category_slug": prod.category.slug if prod.category else None,
        "stock_quantity": prod.stock_quantity,
        "is_available": prod.is_available,
        "badge": prod.badge,
        "is_new": prod.is_new,
        "featured": prod.featured,
        "is_deal": getattr(prod, "is_deal", False),
        "deal_ends_at": getattr(prod, "deal_ends_at", None),
        "details": prod.details or [],
        "sizes": prod.sizes or [],
        "colors": prod.colors or [],
        "images": [
            {
                "id": img.id,
                "product_id": img.product_id,
                "image_url": img.image_url,
                "alt_text": img.alt_text,
                "display_order": img.display_order,
                "created_at": img.created_at
            }
            for img in prod.images
        ],
        "created_at": prod.created_at,
        "updated_at": prod.updated_at
    }

@router.get("/deal-of-the-day", response_model=Optional[ProductResponse])
def get_deal_of_the_day(db: Session = Depends(get_db)):
    # 1. Look for explicitly marked is_deal product
    deal_prod = db.query(Product).filter(
        Product.is_available == True,
        Product.is_deal == True,
        Product.stock_quantity > 0
    ).first()

    # 2. Fallback to badge="Deal of the Day"
    if not deal_prod:
        deal_prod = db.query(Product).filter(
            Product.is_available == True,
            Product.badge == "Deal of the Day",
            Product.stock_quantity > 0
        ).first()

    # 3. Fallback to product with biggest discount (old_price - price)
    if not deal_prod:
        deal_prod = db.query(Product).filter(
            Product.is_available == True,
            Product.old_price > Product.price,
            Product.stock_quantity > 0
        ).order_by(desc(Product.old_price - Product.price)).first()

    # 4. Fallback to any featured product
    if not deal_prod:
        deal_prod = db.query(Product).filter(
            Product.is_available == True,
            Product.stock_quantity > 0
        ).order_by(desc(Product.featured)).first()

    if not deal_prod:
        return None

    return ProductResponse.model_validate(serialize_product(deal_prod))

@router.get("", response_model=PaginatedResponse[ProductResponse])
def get_products(
    category: Optional[str] = Query(None, description="Category slug"),
    search: Optional[str] = Query(None, description="Search keyword"),
    min_price: Optional[Decimal] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[Decimal] = Query(None, ge=0, description="Maximum price filter"),
    in_stock_only: Optional[bool] = Query(None, description="Filter only in stock"),
    is_deal: Optional[bool] = Query(None, description="Filter deal products"),
    sort_by: Optional[str] = Query("featured", description="Sort: featured, price_asc, price_desc, newest"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    items, total = product_service.list_products(
        db,
        category_slug=category,
        search=search,
        is_available=True, # Public catalogue only shows available items
        min_price=min_price,
        max_price=max_price,
        in_stock_only=in_stock_only,
        is_deal=is_deal,
        sort_by=sort_by,
        page=page,
        page_size=page_size
    )

    serialized = [ProductResponse.model_validate(serialize_product(p)) for p in items]
    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return PaginatedResponse(
        items=serialized,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/{product_id_or_slug}", response_model=ProductResponse)
def get_product(product_id_or_slug: str, db: Session = Depends(get_db)):
    prod = product_service.get_product(db, product_id_or_slug)
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return ProductResponse.model_validate(serialize_product(prod))
