import os
import sys
from os.path import dirname, abspath
sys.path.append(dirname(abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from app.models.database import SessionLocal
from app.models.entities import User, Driver, UserRole
from seed import seed_database

def run_tests():
    # 0. Ensure seeded database
    seed_database()
    
    client = TestClient(app)
    print("=" * 60)
    print("STARTING ADMIN DRIVER MANAGEMENT & RBAC SECURITY TESTS")
    print("=" * 60)

    # 1. Login as Admin
    admin_login_res = client.post("/api/auth/login", json={
        "email": "admin@rideai.nyc",
        "password": "admin123"
    })
    assert admin_login_res.status_code == 200, f"Admin login failed: {admin_login_res.text}"
    admin_token = admin_login_res.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print("[PASS] Admin Authentication")

    # 2. Login as Driver
    driver_login_res = client.post("/api/auth/login", json={
        "email": "alex.morgan@rideai.nyc",
        "password": "driver123"
    })
    assert driver_login_res.status_code == 200, f"Driver login failed: {driver_login_res.text}"
    driver_token = driver_login_res.json()["access_token"]
    driver_headers = {"Authorization": f"Bearer {driver_token}"}
    print("[PASS] Demo Driver Authentication")

    # TEST 1: Admin JWT -> GET /api/admin/drivers -> 200
    res_t1 = client.get("/api/admin/drivers", headers=admin_headers)
    assert res_t1.status_code == 200, f"Test 1 failed: {res_t1.text}"
    drivers_list = res_t1.json()
    assert len(drivers_list) >= 1, "Expected at least 1 driver"
    print(f"[PASS] TEST 1: Admin GET /api/admin/drivers returned 200 (Count: {len(drivers_list)})")

    # TEST 2: Admin JWT -> POST /api/admin/drivers -> 201 Created
    import time
    new_driver_email = f"test.newdriver_{int(time.time())}@rideai.nyc"
    driver_id = f"NYC-DRV-{int(time.time()) % 10000}"
    res_t2 = client.post("/api/admin/drivers", headers=admin_headers, json={
        "name": "Test Driver Account",
        "email": new_driver_email,
        "phone": "+1 (555) 999-8888",
        "driver_id": driver_id,
        "license_number": "NYC-TLC-99999",
        "status": "Active",
        "password": "newdriver123"
    })
    assert res_t2.status_code == 201, f"Test 2 failed: {res_t2.text}"
    created_driver = res_t2.json()
    assert created_driver["email"] == new_driver_email
    assert created_driver["driver_id"] == driver_id
    print(f"[PASS] TEST 2: Admin POST /api/admin/drivers returned 201 Created ({new_driver_email})")

    # TEST 3: Driver JWT -> GET /api/admin/drivers -> 403 Forbidden
    res_t3 = client.get("/api/admin/drivers", headers=driver_headers)
    assert res_t3.status_code == 403, f"Test 3 failed: status was {res_t3.status_code}, expected 403"
    print("[PASS] TEST 3: Driver JWT -> GET /api/admin/drivers returned 403 Forbidden")

    # TEST 4: No JWT -> GET /api/admin/drivers -> 401 Unauthorized
    res_t4 = client.get("/api/admin/drivers")
    assert res_t4.status_code == 401, f"Test 4 failed: status was {res_t4.status_code}, expected 401"
    print("[PASS] TEST 4: No JWT -> GET /api/admin/drivers returned 401 Unauthorized")

    # TEST 5: Created Driver -> login -> JWT issued -> role = DRIVER
    res_t5 = client.post("/api/auth/login", json={
        "email": new_driver_email,
        "password": "newdriver123"
    })
    assert res_t5.status_code == 200, f"Test 5 login failed: {res_t5.text}"
    token_payload = res_t5.json()
    assert token_payload["user"]["role"] == "DRIVER"
    created_driver_token = token_payload["access_token"]
    print(f"[PASS] TEST 5: Newly created Driver logged in successfully with role=DRIVER")

    # TEST 6: Created Driver -> /api/admin/drivers -> denied (403)
    created_headers = {"Authorization": f"Bearer {created_driver_token}"}
    res_t6 = client.get("/api/admin/drivers", headers=created_headers)
    assert res_t6.status_code == 403, f"Test 6 failed: status was {res_t6.status_code}, expected 403"
    print("[PASS] TEST 6: Newly created Driver blocked from Admin API (403 Forbidden)")

    # TEST 7: Deactivate Driver -> Attempt Login -> 401 Inactive
    db = SessionLocal()
    try:
        user_in_db = db.query(User).filter(User.email == new_driver_email).first()
        assert user_in_db is not None
        assert user_in_db.role == UserRole.DRIVER, f"Expected role DRIVER, got {user_in_db.role}"
        print(f"[PASS] TEST 7A: Verified DB user account exists with role=DRIVER")
    finally:
        db.close()

    # Deactivate via Admin API
    res_t7 = client.patch(f"/api/admin/drivers/{created_driver['id']}", headers=admin_headers, json={
        "status": "Inactive"
    })
    assert res_t7.status_code == 200, f"Deactivation failed: {res_t7.text}"

    # Attempt login as deactivated driver
    res_t7_login = client.post("/api/auth/login", json={
        "email": new_driver_email,
        "password": "newdriver123"
    })
    assert res_t7_login.status_code == 401, f"Expected 401 for deactivated driver, got {res_t7_login.status_code}"
    print("[PASS] TEST 7B: Deactivated Driver blocked from authenticating (401 Inactive)")

    print("=" * 60)
    print("ALL SECURITY & AUTHENTICATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
