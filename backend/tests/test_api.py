import pytest
from decimal import Decimal
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.session import get_db
from app.models.base import Base
from app.db.seed_data import seed_database

# Create isolated in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    seed_database(session)
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

def get_admin_token(client: TestClient) -> str:
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@shubhdeep.in", "password": "Admin@ShubhDeep2026"}
    )
    assert res.status_code == 200
    return res.json()["access_token"]

# 1. Health Endpoint Test
def test_health_check(client: TestClient):
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert data["database"] == "healthy"

# 2. Product Listing Test
def test_get_products(client: TestClient):
    res = client.get("/api/v1/products")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 10
    assert len(data["items"]) >= 10
    first = data["items"][0]
    assert "name" in first
    assert "price" in first
    assert "images" in first

# 3. Product Details by ID & Slug
def test_get_product_details(client: TestClient):
    res = client.get("/api/v1/products/pearl-ring-diya-set")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Pearl Ring Tealight Diya Set"
    assert Decimal(str(data["price"])) == Decimal("1299.00")
    assert len(data["images"]) >= 1

# 4. Categories Listing
def test_get_categories(client: TestClient):
    res = client.get("/api/v1/categories")
    assert res.status_code == 200
    cats = res.json()
    assert len(cats) >= 6
    slugs = [c["slug"] for c in cats]
    assert "clay-diyas" in slugs
    assert "decorative-diyas" in slugs

# 5. Admin Authentication - Successful
def test_admin_login_success(client: TestClient):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@shubhdeep.in", "password": "Admin@ShubhDeep2026"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@shubhdeep.in"

# 6. Admin Authentication - Invalid Password
def test_admin_login_invalid_password(client: TestClient):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@shubhdeep.in", "password": "WrongPassword123"}
    )
    assert res.status_code == 401
    assert "Incorrect email or password" in res.json()["detail"]

# 7. Unauthorized Admin Access
def test_unauthorized_admin_access(client: TestClient):
    res = client.get("/api/v1/admin/dashboard")
    assert res.status_code == 401
    assert "Authentication required" in res.json()["detail"]

# 8. Admin Dashboard with Valid Token
def test_admin_dashboard_stats(client: TestClient):
    token = get_admin_token(client)
    res = client.get(
        "/api/v1/admin/dashboard",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "total_revenue" in data
    assert "total_products" in data
    assert data["total_products"] >= 10

# 9. Admin Product Creation & Validation
def test_admin_create_product(client: TestClient):
    token = get_admin_token(client)
    payload = {
        "name": "Royal Brass Peacock Lamp",
        "slug": "royal-brass-peacock-lamp",
        "description": "Exquisite hand-carved peacock lamp with bells.",
        "price": "3499.00",
        "stock_quantity": 15,
        "is_available": True,
        "image_urls": ["/images/3a4a127c60f86a88_diya6.jpeg"]
    }
    res = client.post(
        "/api/v1/admin/products",
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Royal Brass Peacock Lamp"
    assert Decimal(str(data["price"])) == Decimal("3499.00")
    assert len(data["images"]) == 1

# 10. Admin Product Editing
def test_admin_edit_product(client: TestClient):
    token = get_admin_token(client)
    # First get product id
    prod = client.get("/api/v1/products/emerald-silk-diya").json()
    prod_id = prod["id"]

    res = client.patch(
        f"/api/v1/admin/products/{prod_id}",
        json={"price": "399.00", "stock_quantity": 50},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    updated = res.json()
    assert Decimal(str(updated["price"])) == Decimal("399.00")
    assert updated["stock_quantity"] == 50

# 11. Order Creation & Authoritative Price/Stock Calculation
def test_order_creation_and_stock_deduction(client: TestClient):
    # Check initial stock
    prod = client.get("/api/v1/products/pearl-ring-diya-set").json()
    initial_stock = prod["stock_quantity"]
    prod_id = prod["id"]

    order_payload = {
        "customer_name": "Aarav Sharma",
        "customer_phone": "+91 9876543210",
        "delivery_address": "42, Shanti Kunj, C-Scheme, Jaipur, Rajasthan 302001",
        "items": [
            {
                "product_id": prod_id,
                "quantity": 2,
                "size": "Set of 6",
                "color": "Maroon"
            }
        ],
        "idempotency_key": "test-key-123"
    }

    res = client.post("/api/v1/orders", json=order_payload)
    assert res.status_code == 201
    order = res.json()
    assert order["order_number"].startswith("SD-")
    assert Decimal(str(order["subtotal"])) == Decimal("2598.00") # 1299 * 2
    assert Decimal(str(order["delivery_fee"])) == Decimal("0.00") # Free shipping >= 1499
    assert Decimal(str(order["total_amount"])) == Decimal("2598.00")
    assert len(order["items"]) == 1

    # Verify stock decreased by 2
    updated_prod = client.get("/api/v1/products/pearl-ring-diya-set").json()
    assert updated_prod["stock_quantity"] == initial_stock - 2

# 12. Duplicate Order Prevention (Idempotency)
def test_order_idempotency_prevents_duplicate(client: TestClient):
    prod = client.get("/api/v1/products/emerald-silk-diya").json()
    prod_id = prod["id"]

    payload = {
        "customer_name": "Priya Verma",
        "customer_phone": "9876500000",
        "delivery_address": "Flat 301, Lotus Apartments, Mumbai",
        "items": [{"product_id": prod_id, "quantity": 1}],
        "idempotency_key": "unique-idem-abc"
    }

    # First attempt
    res1 = client.post("/api/v1/orders", json=payload)
    assert res1.status_code == 201
    order1 = res1.json()

    # Second retry attempt with same idempotency key
    res2 = client.post("/api/v1/orders", json=payload)
    assert res2.status_code == 201
    order2 = res2.json()

    assert order1["order_number"] == order2["order_number"]
    assert order1["id"] == order2["id"]

# 13. Invalid Quantity & Out-of-Stock Handling
def test_order_out_of_stock_fails(client: TestClient):
    prod = client.get("/api/v1/products/blush-lotus-crochet-diya").json()
    prod_id = prod["id"]
    current_stock = prod["stock_quantity"]

    payload = {
        "customer_name": "Rohan Patel",
        "customer_phone": "9998887776",
        "delivery_address": "Sector 14, Gandhinagar, Gujarat",
        "items": [{"product_id": prod_id, "quantity": current_stock + 10}]
    }

    res = client.post("/api/v1/orders", json=payload)
    assert res.status_code == 400
    assert "Insufficient stock" in res.json()["detail"]

# 14. Order Status Transition & Stock Restoration on Cancellation
def test_order_cancellation_restores_stock(client: TestClient):
    token = get_admin_token(client)
    prod = client.get("/api/v1/products/kundan-saffron-pair").json()
    prod_id = prod["id"]
    initial_stock = prod["stock_quantity"]

    # Place order for 3 items
    order_res = client.post(
        "/api/v1/orders",
        json={
            "customer_name": "Sneha Roy",
            "customer_phone": "9123456780",
            "delivery_address": "Park Street, Kolkata, West Bengal",
            "items": [{"product_id": prod_id, "quantity": 3}]
        }
    )
    assert order_res.status_code == 201
    order_id = order_res.json()["id"]

    # Verify stock dropped
    assert client.get("/api/v1/products/kundan-saffron-pair").json()["stock_quantity"] == initial_stock - 3

    # Admin cancels order
    cancel_res = client.patch(
        f"/api/v1/admin/orders/{order_id}/status",
        json={"order_status": "cancelled", "notes": "Customer requested cancellation"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert cancel_res.status_code == 200
    assert cancel_res.json()["order_status"] == "cancelled"

    # Verify stock has been fully restored!
    assert client.get("/api/v1/products/kundan-saffron-pair").json()["stock_quantity"] == initial_stock

# 15. Admin Category Management
def test_admin_create_category(client: TestClient):
    token = get_admin_token(client)
    res = client.post(
        "/api/v1/admin/categories",
        json={
            "name": "Diwali Torans & Hangings",
            "slug": "diwali-torans",
            "description": "Handmade festive marigold and bead door hangings.",
            "is_active": True
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Diwali Torans & Hangings"
    assert data["slug"] == "diwali-torans"

    # Verify duplicate slug is rejected
    dup_res = client.post(
        "/api/v1/admin/categories",
        json={"name": "Duplicate", "slug": "diwali-torans"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert dup_res.status_code == 400

# 16. Admin Inventory Quick Update
def test_admin_update_inventory(client: TestClient):
    token = get_admin_token(client)
    prod = client.get("/api/v1/products/pearl-ring-diya-set").json()
    prod_id = prod["id"]

    res = client.patch(
        f"/api/v1/admin/inventory/{prod_id}?stock_quantity=88&is_available=true",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    assert res.json()["stock_quantity"] == 88

    # Verify via public product endpoint
    updated = client.get("/api/v1/products/pearl-ring-diya-set").json()
    assert updated["stock_quantity"] == 88

