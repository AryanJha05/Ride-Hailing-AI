import pytest
import jwt
from fastapi.testclient import TestClient
from main import app
from app.models.database import SessionLocal
from app.models.entities import User, UserRole
from app.core.security import get_password_hash, create_access_token
from app.core.config import settings

client = TestClient(app)

def test_auth_01_valid_driver_login():
    response = client.post(
        "/api/auth/login",
        json={"email": "alex.morgan@rideai.nyc", "password": "driver123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "alex.morgan@rideai.nyc"
    assert data["user"]["role"] == "DRIVER"
    assert "password" not in data["user"]
    assert "password_hash" not in data["user"]

def test_auth_02_valid_admin_login():
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@rideai.nyc", "password": "admin123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@rideai.nyc"
    assert data["user"]["role"] == "ADMIN"

def test_auth_03_invalid_password():
    response = client.post(
        "/api/auth/login",
        json={"email": "alex.morgan@rideai.nyc", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

def test_auth_04_unknown_email():
    response = client.post(
        "/api/auth/login",
        json={"email": "unknown@rideai.nyc", "password": "driver123"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

def test_auth_05_missing_token():
    response = client.get("/api/auth/me")
    assert response.status_code == 401
    assert "detail" in response.json()

def test_auth_06_invalid_token():
    headers = {"Authorization": "Bearer invalid_jwt_token_format"}
    response = client.get("/api/auth/me", headers=headers)
    assert response.status_code == 401

def test_auth_07_expired_token():
    from datetime import timedelta
    expired_token = create_access_token(
        data={"sub": "user-driver-001", "email": "alex.morgan@rideai.nyc", "role": "DRIVER"},
        expires_delta=timedelta(seconds=-10)
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.get("/api/auth/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Token has expired"

def test_auth_me_successful():
    login_res = client.post(
        "/api/auth/login",
        json={"email": "alex.morgan@rideai.nyc", "password": "driver123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["id"] == "user-driver-001"
    assert me_data["email"] == "alex.morgan@rideai.nyc"
    assert me_data["role"] == "DRIVER"

def test_jwt_does_not_contain_sensitive_info():
    login_res = client.post(
        "/api/auth/login",
        json={"email": "alex.morgan@rideai.nyc", "password": "driver123"}
    )
    token = login_res.json()["access_token"]
    payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    
    assert "password" not in payload
    assert "password_hash" not in payload
    assert "secret" not in payload
