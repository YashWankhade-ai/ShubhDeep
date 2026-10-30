import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from fastapi import HTTPException, status
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderStatusUpdate

ALLOWED_TRANSITIONS = {
    "pending": ["confirmed", "cancelled"],
    "confirmed": ["processing", "cancelled"],
    "processing": ["shipped", "cancelled"],
    "shipped": ["delivered", "cancelled"],
    "delivered": [],
    "cancelled": []
}

class OrderService:
    @staticmethod
    def generate_order_number() -> str:
        date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
        random_suffix = uuid.uuid4().hex[:5].upper()
        return f"SD-{date_str}-{random_suffix}"

    @staticmethod
    def create_order(db: Session, data: OrderCreate) -> Order:
        # Idempotency check: prevent duplicate orders on browser retries
        if data.idempotency_key:
            existing = db.query(Order).options(
                joinedload(Order.items)
            ).filter(Order.idempotency_key == data.idempotency_key).first()
            if existing:
                return existing

        # Begin transaction
        subtotal = Decimal("0.00")
        order_items_to_create = []

        try:
            for item in data.items:
                # Lock row for update to prevent concurrent stock race conditions
                product = db.query(Product).filter(
                    Product.id == item.product_id
                ).with_for_update().first()

                if not product:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Product with ID {item.product_id} was not found."
                    )

                if not product.is_available:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"'{product.name}' is currently unavailable."
                    )

                if product.stock_quantity < item.quantity:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Insufficient stock for '{product.name}'. Only {product.stock_quantity} available, but {item.quantity} requested."
                    )

                unit_price = Decimal(str(product.price))
                line_total = unit_price * Decimal(item.quantity)
                subtotal += line_total

                # Deduct stock safely
                product.stock_quantity -= item.quantity

                variant_parts = [p for p in (item.size, item.color) if p]
                variant_str = " · ".join(variant_parts) if variant_parts else None

                order_item = OrderItem(
                    product_id=product.id,
                    product_name_snapshot=product.name,
                    unit_price=unit_price,
                    quantity=item.quantity,
                    line_total=line_total,
                    variant_snapshot=variant_str
                )
                order_items_to_create.append(order_item)

            # Calculate shipping: free pan-India above ₹1,499
            delivery_fee = Decimal("0.00") if subtotal >= Decimal("1499.00") else Decimal("99.00")
            total_amount = subtotal + delivery_fee

            order = Order(
                order_number=OrderService.generate_order_number(),
                customer_name=data.customer_name.strip(),
                customer_phone=data.customer_phone.strip(),
                delivery_address=data.delivery_address.strip(),
                subtotal=subtotal,
                delivery_fee=delivery_fee,
                total_amount=total_amount,
                order_status="pending",
                payment_status="pending",
                idempotency_key=data.idempotency_key,
                notes=data.notes
            )
            db.add(order)
            db.flush()

            for oi in order_items_to_create:
                oi.order_id = order.id
                db.add(oi)

            db.commit()
            db.refresh(order)
            return order

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def get_order_by_id(db: Session, order_id: int) -> Optional[Order]:
        return db.query(Order).options(
            joinedload(Order.items)
        ).filter(Order.id == order_id).first()

    @staticmethod
    def get_order_by_number(db: Session, order_number: str) -> Optional[Order]:
        clean_num = order_number.strip().upper()
        order = db.query(Order).options(
            joinedload(Order.items)
        ).filter(Order.order_number.ilike(clean_num)).first()

        if not order and not clean_num.startswith("SD-"):
            order = db.query(Order).options(
                joinedload(Order.items)
            ).filter(Order.order_number.ilike(f"SD-%{clean_num}")).first()
        return order

    @staticmethod
    def list_orders(
        db: Session,
        status_filter: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[Order], int]:
        query = db.query(Order).options(joinedload(Order.items))

        if status_filter:
            query = query.filter(Order.order_status == status_filter)

        if search:
            term = f"%{search.strip()}%"
            query = query.filter(
                Order.order_number.ilike(term) |
                Order.customer_name.ilike(term) |
                Order.customer_phone.ilike(term)
            )

        query = query.order_by(desc(Order.created_at))
        total = query.count()
        offset = (page - 1) * page_size
        items = query.offset(offset).limit(page_size).all()
        return items, total

    @staticmethod
    def update_order_status(db: Session, order_id: int, data: OrderStatusUpdate) -> Order:
        order = db.query(Order).options(joinedload(Order.items)).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        current_status = order.order_status
        new_status = data.order_status

        if current_status != new_status:
            allowed = ALLOWED_TRANSITIONS.get(current_status, [])
            if new_status not in allowed:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid transition from '{current_status}' to '{new_status}'. Allowed: {allowed}"
                )

            # If transitioning to cancelled, restore product stock!
            if new_status == "cancelled":
                for item in order.items:
                    if item.product_id:
                        prod = db.query(Product).filter(Product.id == item.product_id).first()
                        if prod:
                            prod.stock_quantity += item.quantity

            order.order_status = new_status

        if data.payment_status:
            order.payment_status = data.payment_status

        if data.notes:
            order.notes = data.notes

        db.commit()
        db.refresh(order)
        return order

order_service = OrderService()
