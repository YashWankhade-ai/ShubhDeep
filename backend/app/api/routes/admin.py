import math
from typing import Optional, List
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.db.session import get_db
from app.api.deps import get_current_admin
from collections import defaultdict, Counter
from datetime import datetime, timedelta, timezone
from app.models.order_item import OrderItem
from app.models.admin_user import AdminUser
from app.models.order import Order
from app.models.product import Product
from app.models.category import Category
from app.schemas.admin import DashboardStatsResponse
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.schemas.order import OrderResponse, OrderStatusUpdate
from app.schemas.common import PaginatedResponse
from app.services.product_service import product_service
from app.services.order_service import order_service
from app.api.routes.products import serialize_product

router = APIRouter(prefix="/admin", tags=["Admin Operations"], dependencies=[Depends(get_current_admin)])

@router.get("/dashboard", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_rev = db.query(func.sum(Order.total_amount)).filter(Order.order_status != "cancelled").scalar() or Decimal("0.00")
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0
    pending_orders = db.query(func.count(Order.id)).filter(Order.order_status == "pending").scalar() or 0
    shipped_orders = db.query(func.count(Order.id)).filter(Order.order_status == "shipped").scalar() or 0
    delivered_orders = db.query(func.count(Order.id)).filter(Order.order_status == "delivered").scalar() or 0
    low_stock = db.query(func.count(Product.id)).filter(Product.stock_quantity <= 10).scalar() or 0

    recent = db.query(Order).order_by(desc(Order.created_at)).limit(5).all()

    return DashboardStatsResponse(
        total_revenue=total_rev,
        total_orders=total_orders,
        total_products=total_products,
        pending_orders=pending_orders,
        shipped_orders=shipped_orders,
        delivered_orders=delivered_orders,
        low_stock_count=low_stock,
        recent_orders=[OrderResponse.model_validate(o) for o in recent]
    )

# --- Products ---
@router.get("/products", response_model=PaginatedResponse[ProductResponse])
def admin_get_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    items, total = product_service.list_products(
        db,
        category_slug=category,
        search=search,
        is_available=None, # Show all
        sort_by="newest",
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

@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def admin_create_product(data: ProductCreate, db: Session = Depends(get_db)):
    prod = product_service.create_product(db, data)
    return ProductResponse.model_validate(serialize_product(prod))

@router.patch("/products/{product_id}", response_model=ProductResponse)
def admin_update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    prod = product_service.update_product(db, product_id, data)
    return ProductResponse.model_validate(serialize_product(prod))

@router.delete("/products/{product_id}")
def admin_delete_product(product_id: int, db: Session = Depends(get_db)):
    product_service.delete_product(db, product_id)
    return {"message": "Product deleted successfully"}

# --- Categories ---
@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def admin_create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(Category).filter(Category.slug == data.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with slug '{data.slug}' already exists."
        )
    cat = Category(**data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return CategoryResponse.model_validate(cat)

@router.patch("/categories/{category_id}", response_model=CategoryResponse)
def admin_update_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    
    update_data = data.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != cat.slug:
        existing = db.query(Category).filter(Category.slug == update_data["slug"]).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with slug '{update_data['slug']}' already exists."
            )
    
    for k, v in update_data.items():
        setattr(cat, k, v)
    
    db.commit()
    db.refresh(cat)
    return CategoryResponse.model_validate(cat)

# --- Orders ---
@router.get("/orders", response_model=PaginatedResponse[OrderResponse])
def admin_get_orders(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    items, total = order_service.list_orders(
        db,
        status_filter=status_filter,
        search=search,
        page=page,
        page_size=page_size
    )
    serialized = [OrderResponse.model_validate(o) for o in items]
    total_pages = math.ceil(total / page_size) if total > 0 else 1
    return PaginatedResponse(
        items=serialized,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/orders/{order_id}", response_model=OrderResponse)
def admin_get_order(order_id: int, db: Session = Depends(get_db)):
    order = order_service.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return OrderResponse.model_validate(order)

@router.patch("/orders/{order_id}/status", response_model=OrderResponse)
def admin_update_order_status(order_id: int, data: OrderStatusUpdate, db: Session = Depends(get_db)):
    order = order_service.update_order_status(db, order_id, data)
    return OrderResponse.model_validate(order)

# --- Inventory ---
@router.get("/inventory")
def admin_get_inventory(db: Session = Depends(get_db)):
    prods = db.query(Product).order_by(Product.stock_quantity.asc()).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "price": p.price,
            "stock_quantity": p.stock_quantity,
            "is_available": p.is_available,
            "category_name": p.category.name if p.category else None,
            "thumbnail": p.images[0].image_url if p.images else None
        }
        for p in prods
    ]

@router.patch("/inventory/{product_id}")
def admin_update_inventory(
    product_id: int,
    stock_quantity: int = Query(..., ge=0),
    is_available: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    prod.stock_quantity = stock_quantity
    if is_available is not None:
        prod.is_available = is_available
    elif stock_quantity == 0:
        prod.is_available = False
    elif stock_quantity > 0 and not prod.is_available:
        prod.is_available = True

    db.commit()
    db.refresh(prod)
    return {
        "id": prod.id,
        "name": prod.name,
        "stock_quantity": prod.stock_quantity,
        "is_available": prod.is_available
    }

# --- Customers Management ---
@router.get("/customers")
def admin_get_customers(
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).order_by(desc(Order.created_at)).all()
    customers_map = {}
    for o in orders:
        phone = o.customer_phone.strip()
        if phone not in customers_map:
            customers_map[phone] = {
                "name": o.customer_name,
                "phone": phone,
                "address": o.delivery_address,
                "total_orders": 0,
                "total_spent": Decimal("0.00"),
                "last_order_date": o.created_at,
                "last_order_status": o.order_status,
                "order_numbers": []
            }
        c = customers_map[phone]
        c["total_orders"] += 1
        c["order_numbers"].append(o.order_number)
        if o.order_status != "cancelled":
            c["total_spent"] += o.total_amount

    customers = list(customers_map.values())
    if search:
        s = search.lower()
        customers = [
            c for c in customers 
            if s in c["name"].lower() or s in c["phone"].lower() or s in c["address"].lower()
        ]
    return customers

@router.get("/customers/{phone}")
def admin_get_customer_details(phone: str, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.customer_phone == phone).order_by(desc(Order.created_at)).all()
    if not orders:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    first = orders[0]
    active_orders = [o for o in orders if o.order_status != "cancelled"]
    total_spent = sum((o.total_amount for o in active_orders), Decimal("0.00"))

    return {
        "name": first.customer_name,
        "phone": phone,
        "primary_address": first.delivery_address,
        "total_orders": len(orders),
        "total_spent": float(total_spent),
        "average_order_value": float(total_spent / len(active_orders)) if active_orders else 0.0,
        "orders": [OrderResponse.model_validate(o) for o in orders]
    }

# --- Analytics & Reporting ---
@router.get("/analytics")
def admin_get_analytics(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    def to_aware(dt):
        if dt is None:
            return None
        return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt

    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    all_orders = db.query(Order).all()
    period_orders = [o for o in all_orders if to_aware(o.created_at) >= cutoff]

    active_orders = [o for o in period_orders if o.order_status != "cancelled"]
    total_revenue = sum((o.total_amount for o in active_orders), Decimal("0.00"))
    total_orders_count = len(period_orders)
    aov = (total_revenue / len(active_orders)) if active_orders else Decimal("0.00")

    status_counts = Counter(o.order_status for o in period_orders)

    daily_revenue_map = defaultdict(lambda: {"revenue": Decimal("0.00"), "orders": 0})
    for o in active_orders:
        date_str = o.created_at.strftime("%Y-%m-%d")
        daily_revenue_map[date_str]["revenue"] += o.total_amount
        daily_revenue_map[date_str]["orders"] += 1

    daily_trend = [
        {"date": d, "revenue": float(data["revenue"]), "orders": data["orders"]}
        for d, data in sorted(daily_revenue_map.items())
    ]

    top_items = db.query(
        OrderItem.product_name_snapshot,
        func.sum(OrderItem.quantity).label("units_sold"),
        func.sum(OrderItem.line_total).label("total_sales")
    ).group_by(OrderItem.product_name_snapshot)\
     .order_by(desc("units_sold")).limit(5).all()

    top_products = [
        {"name": row[0], "units_sold": row[1] or 0, "total_sales": float(row[2] or 0)}
        for row in top_items
    ]

    location_counts = Counter()
    for o in period_orders:
        parts = [p.strip() for p in o.delivery_address.split(",") if len(p.strip()) > 2]
        city = parts[-2] if len(parts) >= 2 else (parts[0] if parts else "India")
        location_counts[city] += 1

    top_locations = [{"location": loc, "orders": cnt} for loc, cnt in location_counts.most_common(5)]

    all_prods = db.query(Product).all()
    in_stock = sum(1 for p in all_prods if p.stock_quantity > 10)
    low_stock = sum(1 for p in all_prods if 0 < p.stock_quantity <= 10)
    out_of_stock = sum(1 for p in all_prods if p.stock_quantity == 0)

    return {
        "period_days": days,
        "total_revenue": float(total_revenue),
        "total_orders": total_orders_count,
        "average_order_value": float(aov),
        "status_breakdown": dict(status_counts),
        "daily_trend": daily_trend,
        "top_products": top_products,
        "top_locations": top_locations,
        "inventory_health": {
            "in_stock": in_stock,
            "low_stock": low_stock,
            "out_of_stock": out_of_stock,
            "total_catalog": len(all_prods)
        }
    }

# --- Deal of the Day Management ---
@router.post("/deal-of-the-day/{product_id}")
def admin_set_deal_of_the_day(
    product_id: int, 
    discount_price: Optional[Decimal] = Query(None),
    hours: int = Query(24, ge=1, le=168),
    db: Session = Depends(get_db)
):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # Reset other deals
    db.query(Product).filter(Product.is_deal == True).update({"is_deal": False})

    prod.is_deal = True
    prod.badge = "Deal of the Day"
    prod.deal_ends_at = datetime.now(timezone.utc) + timedelta(hours=hours)
    if discount_price and discount_price > 0:
        if not prod.old_price:
            prod.old_price = prod.price
        prod.price = discount_price

    db.commit()
    db.refresh(prod)
    return {"message": f"'{prod.name}' is now set as active Deal of the Day!", "product_id": prod.id}

