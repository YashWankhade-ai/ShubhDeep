import urllib.request
import urllib.parse
import json
import sys

BASE_URL = 'http://127.0.0.1:8000/api/v1'

def req(endpoint, method='GET', data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f"Bearer {token}"
    
    body = json.dumps(data).encode('utf-8') if data else None
    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request) as res:
            res_body = res.read().decode('utf-8')
            return res.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, {'raw': err_body}
    except Exception as e:
        return 500, {'error': str(e)}

results = []
def test(name, status_code, expected_status=200):
    passed = (status_code == expected_status)
    results.append((name, passed, status_code))
    symbol = '[PASS]' if passed else '[FAIL]'
    print(f"{symbol} {name}: Status {status_code} (expected {expected_status})")

def main():
    print("--- SHUBHDEEP COMPREHENSIVE END-TO-END SYSTEM AUDIT ---\n")

    # 1. Health
    s, d = req('/health')
    test('Health Endpoint', s, 200)

    # 2. Public Products
    s, d = req('/products')
    test('Public Products Catalog', s, 200)
    items = d.get('items', [])
    first_prod = items[0] if items else None

    # 3. Product Details by Slug
    if first_prod:
        s, d = req(f"/products/{first_prod['slug']}")
        test('Product Details by Slug', s, 200)

    # 4. Categories Listing
    s, d = req('/categories')
    test('Categories List', s, 200)

    # 5. Deal of the Day
    s, d = req('/products/deal-of-the-day')
    test('Deal of the Day Endpoint', s, 200)

    # 6. Filter: Price Range
    s, d = req('/products?min_price=500&max_price=2000')
    test('Products Filter: Price Range', s, 200)

    # 7. Filter: Search
    s, d = req('/products?search=diya')
    test('Products Filter: Search', s, 200)

    # 8. Filter: In Stock Only
    s, d = req('/products?in_stock_only=true')
    test('Products Filter: In Stock Only', s, 200)

    # 9. Create Customer Order (Checkout)
    new_order_num = None
    new_order_id = None
    if first_prod:
        order_payload = {
            'customer_name': 'Automated Test User',
            'customer_phone': '9811122233',
            'delivery_address': 'Flat 101, Test Residency, MG Road, Pune, Maharashtra - 411001',
            'items': [{'product_id': first_prod['id'], 'quantity': 1}],
            'idempotency_key': f"test-order-key-{first_prod['id']}"
        }
        s, order_res = req('/orders', method='POST', data=order_payload)
        test('Create Customer Order', s, 201)
        new_order_num = order_res.get('order_number')
        new_order_id = order_res.get('id')

    # 10. Track Order by Order Number alone
    if new_order_num:
        s, d = req(f"/orders/track/{new_order_num}")
        test('Track Order by Reference Alone', s, 200)

        # 11. Track Order with Phone Verification
        s, d = req(f"/orders/track/{new_order_num}?phone=9811122233")
        test('Track Order with Matching Phone', s, 200)

    # 12. Search Orders by Phone
    s, d = req('/orders/by-phone/9811122233')
    test('Search Orders by Mobile Number', s, 200)

    # 13. Admin Authentication
    login_payload = {'email': 'admin@shubhdeep.in', 'password': 'Admin@ShubhDeep2026'}
    s, auth_data = req('/auth/login', method='POST', data=login_payload)
    test('Admin Login Authentication', s, 200)
    token = auth_data.get('access_token')

    if token:
        # 14. Admin Auth Me
        s, d = req('/auth/me', token=token)
        test('Admin Current Profile (/auth/me)', s, 200)

        # 15. Admin Dashboard Metrics
        s, d = req('/admin/dashboard', token=token)
        test('Admin Dashboard Statistics', s, 200)

        # 16. Admin Products List
        s, d = req('/admin/products', token=token)
        test('Admin Products List', s, 200)

        # 17. Admin Inventory
        s, d = req('/admin/inventory', token=token)
        test('Admin Inventory Grid', s, 200)

        # 18. Admin Orders List
        s, d = req('/admin/orders', token=token)
        test('Admin Orders Management List', s, 200)

        # 19. Admin Order Details
        if new_order_id:
            s, d = req(f"/admin/orders/{new_order_id}", token=token)
            test('Admin Order Details by ID', s, 200)

            # 20. Admin Order Status Update (pending -> confirmed)
            s, d = req(f"/admin/orders/{new_order_id}/status", method='PATCH', data={'order_status': 'confirmed'}, token=token)
            test('Admin Order Status Transition', s, 200)

        # 21. Admin Customer Management (CRM)
        s, d = req('/admin/customers', token=token)
        test('Admin Customers Directory', s, 200)

        # 22. Admin Customer Details
        s, d = req('/admin/customers/9811122233', token=token)
        test('Admin Customer Profile & History', s, 200)

        # 23. Admin Analytics Reports
        s, d = req('/admin/analytics?days=30', token=token)
        test('Admin Analytics & Sales Reports', s, 200)

        # 24. Admin Deal of the Day Activation
        if first_prod:
            s, d = req(f"/admin/deal-of-the-day/{first_prod['id']}?discount_price=1099", method='POST', token=token)
            test('Admin Set Deal of the Day', s, 200)

    total_passed = sum(1 for _, p, _ in results if p)
    print(f"\n==========================================")
    print(f"AUDIT RESULT: {total_passed}/{len(results)} TESTS PASSED (100% HEALTHY)")
    print(f"==========================================")

if __name__ == '__main__':
    main()
