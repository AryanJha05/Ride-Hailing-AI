import sys
import unittest
from fastapi.testclient import TestClient
from main import app
from app.core.security import create_access_token
from app.core.config import settings
import jwt
from datetime import timedelta

client = TestClient(app)

class TestAuth(unittest.TestCase):
    def test_auth_01_valid_driver_login(self):
        response = client.post(
            "/api/auth/login",
            json={"email": "aryan.jha@rideai.nyc", "password": "driver123"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["token_type"], "bearer")
        self.assertEqual(data["user"]["email"], "aryan.jha@rideai.nyc")
        self.assertEqual(data["user"]["role"], "DRIVER")
        self.assertNotIn("password", data["user"])
        self.assertNotIn("password_hash", data["user"])

    def test_auth_02_valid_admin_login(self):
        response = client.post(
            "/api/auth/login",
            json={"email": "admin@rideai.nyc", "password": "admin123"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["email"], "admin@rideai.nyc")
        self.assertEqual(data["user"]["role"], "ADMIN")

    def test_auth_03_invalid_password(self):
        response = client.post(
            "/api/auth/login",
            json={"email": "aryan.jha@rideai.nyc", "password": "wrongpassword"}
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Invalid email or password")

    def test_auth_04_unknown_email(self):
        response = client.post(
            "/api/auth/login",
            json={"email": "unknown@rideai.nyc", "password": "driver123"}
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Invalid email or password")

    def test_auth_05_missing_token(self):
        response = client.get("/api/auth/me")
        self.assertEqual(response.status_code, 401)

    def test_auth_06_invalid_token(self):
        headers = {"Authorization": "Bearer invalid_jwt_token_format"}
        response = client.get("/api/auth/me", headers=headers)
        self.assertEqual(response.status_code, 401)

    def test_auth_07_expired_token(self):
        expired_token = create_access_token(
            data={"sub": "user-driver-001", "email": "aryan.jha@rideai.nyc", "role": "DRIVER"},
            expires_delta=timedelta(seconds=-10)
        )
        headers = {"Authorization": f"Bearer {expired_token}"}
        response = client.get("/api/auth/me", headers=headers)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Token has expired")

    def test_auth_me_successful(self):
        login_res = client.post(
            "/api/auth/login",
            json={"email": "aryan.jha@rideai.nyc", "password": "driver123"}
        )
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        me_res = client.get("/api/auth/me", headers=headers)
        self.assertEqual(me_res.status_code, 200)
        me_data = me_res.json()
        self.assertEqual(me_data["id"], "user-driver-001")
        self.assertEqual(me_data["email"], "aryan.jha@rideai.nyc")
        self.assertEqual(me_data["role"], "DRIVER")

    def test_jwt_does_not_contain_sensitive_info(self):
        login_res = client.post(
            "/api/auth/login",
            json={"email": "aryan.jha@rideai.nyc", "password": "driver123"}
        )
        token = login_res.json()["access_token"]
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        
        self.assertNotIn("password", payload)
        self.assertNotIn("password_hash", payload)
        self.assertNotIn("secret", payload)

    def test_auth_08_driver_accessing_driver_endpoint(self):
        login_res = client.post(
            "/api/auth/login",
            json={"email": "aryan.jha@rideai.nyc", "password": "driver123"}
        )
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        res = client.get("/api/demand-zones", headers=headers)
        self.assertEqual(res.status_code, 200)

    def test_auth_09_admin_accessing_admin_endpoint(self):
        login_res = client.post(
            "/api/auth/login",
            json={"email": "admin@rideai.nyc", "password": "admin123"}
        )
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        res = client.get("/api/admin/fleet", headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["total_fleet_vehicles"], 450)

    def test_auth_10_driver_accessing_admin_endpoint_forbidden(self):
        login_res = client.post(
            "/api/auth/login",
            json={"email": "aryan.jha@rideai.nyc", "password": "driver123"}
        )
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        res = client.get("/api/admin/fleet", headers=headers)
        self.assertEqual(res.status_code, 403)

    def test_auth_11_unauthenticated_admin_endpoint_request(self):
        res = client.get("/api/admin/fleet")
        self.assertEqual(res.status_code, 401)

    def test_auth_12_unauthenticated_driver_endpoint_request(self):
        res = client.get("/api/driver-performance")
        self.assertEqual(res.status_code, 401)

if __name__ == "__main__":
    unittest.main()
