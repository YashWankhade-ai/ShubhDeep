from typing import List, Optional
from decimal import Decimal
from pydantic import BaseModel
from app.schemas.order import OrderResponse

class DashboardStatsResponse(BaseModel):
    total_revenue: Decimal
    total_orders: int
    total_products: int
    pending_orders: int
    shipped_orders: int
    delivered_orders: int
    low_stock_count: int
    recent_orders: List[OrderResponse] = []
