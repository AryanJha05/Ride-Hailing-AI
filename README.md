# Ride AI — Demand Forecasting & Enterprise Mobility Intelligence Platform

Ride AI is an enterprise-grade ride-hailing demand forecasting, driver positioning assistant, and administrative fleet management platform. It combines multi-model machine learning services (**XGBoost V3 Trip Duration Engine**, **Spatial HDBSCAN Demand Clustering Engine**, and **PyTorch LSTM Demand Forecasting Engine**) with an integrated Ollama Gemma2 LLM positioning assistant microservice, while empowering drivers and fleet admins with full real-time operational metrics and dynamic state binding.

The user interface follows the **Velour** design system built with React and Material UI v5, featuring dark-mode operational ergonomics, spatial Leaflet route map pickers with live reverse-geocoding, multi-layer demand/driver/event maps, bento grid dashboards, production copilot AI chat, and an integrated RBAC navigation shell.

---

## 🎨 Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Material UI v5, Recharts, Leaflet, React-Leaflet, React Query, Vite
- **Backend**: FastAPI, Python 3.10+, PyTorch 2.0+, XGBoost, Scikit-learn, SQLAlchemy ORM, Pydantic v2, Passlib (bcrypt), PyJWT, Uvicorn
- **LLM Reasoning Microservice**: FastAPI + Ollama Gemma2 (`:8001`) with cross-service context aggregation and offline fallback mechanisms.
- **AI / ML Layer & Adapter Architecture**: 
  - **Trip Duration Intelligence (XGBoost V3)**: Processes 44 spatial features via dynamic Leaflet route picker and returns accurate ETA predictions (`POST /api/driver/trip-duration`).
  - **Demand Clustering Engine (HDBSCAN Model)**: Parses spatial clusters and zone data to calculate live demand scores, dynamic surge multipliers, trend indicators, and spatial nearest-zone predictions across NYC clusters (`GET /api/demand-zones`).
  - **Demand Forecasting Engine (PyTorch LSTM)**: Utilizes a 2-layer PyTorch LSTM neural network and spatial scalers to compute 24-hour auto-regressive demand predictions, peak volume detection, and time-series demand curves (`GET /api/forecast`).
  - **AI Driver Copilot Framework**: Production conversation copilot integrated with Ollama Gemma2 microservice (`:8001`) for real-time positioning and positioning strategy advice.
- **Database**: SQLite / PostgreSQL (SQLAlchemy ORM with authenticated user state, auto-seeding lifespan triggers, and profile update synchronization)
- **Security & Access Control**: Real JWT authentication with Role-Based Access Control (`DRIVER` and `ADMIN` roles)

---

## 🚀 How to Run Locally on Your PC

### 🐳 Recommended: One-Command Docker Execution

Run the entire application stack (Frontend + Backend + LLM Service) with a single command from the project root:

```bash
docker compose up --build
```

- **Frontend UI**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **LLM Microservice**: `http://localhost:8001`
- **API Documentation (Swagger)**: `http://localhost:8000/docs`

To stop the Docker stack:
```bash
docker compose down
```

---

### Manual Step-by-Step Setup

If you prefer to run services manually without Docker:

#### Prerequisites
- **Node.js** (v18+ recommended) & `npm`
- **Python** (v3.10+ recommended) & `pip`

#### Step 1: Set Up and Start the Backend

1. Create a Python virtual environment and activate it:
   ```bash
   python3 -m venv backend/venv
   source backend/venv/bin/activate
   ```

2. Install dependencies and seed demonstration data:
   ```bash
   pip install -r backend/requirements.txt
   python backend/seed.py
   ```

3. Start the FastAPI server:
   ```bash
   python backend/main.py
   ```

#### Step 2: Set Up and Start the LLM Service
Open a new terminal window:
```bash
python llm-service/main.py
```

#### Step 3: Set Up and Start the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Demo Access Credentials

| Role | Name | Email | Password | Allowed Section |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Suraj Panigrahi | `suraj.admin@rideai.demo` | `admin123` | `/admin/*` (Full Administrative & Fleet Control) |
| **Driver** | Aryan Jha | `aryan.driver@rideai.demo` | `driver123` | `/driver/*` (Driver Operational Dashboard & AI Assistant) |

---

## 📱 Navigation & Routing Architecture

Ride AI uses a unified application shell with role-protected route namespaces:

### Authentication & Public Routes
| Page | URL | Description |
| :--- | :--- | :--- |
| **Login Page** | `/login` | Enterprise split authentication page with quick demo login buttons |

### Driver Portal (`/driver/*`)
| Page | URL | Description |
| :--- | :--- | :--- |
| **Driver Dashboard** | `/driver/dashboard` | Main driver hub with bento grid metrics, quick actions & positioning advice |
| **Live Demand Map** | `/driver/demand` | Spatial Leaflet base map with active GPS vehicle pin & real model demand overlays |
| **AI Assistant** | `/driver/assistant` | Interactive AI command chat powered by Ollama Gemma2 LLM reasoning microservice |
| **Earnings** | `/driver/earnings` | Detailed earnings analytics, shift performance & AI bonus breakdowns |
| **Trips** | `/driver/trips` | NYC trip log table with fares, ratings, and route details |
| **Forecast Analytics** | `/driver/analytics` | Hourly predictive demand charts and zone comparisons |
| **Driver Profile** | `/driver/profile` | Driver rating, vehicle assignment, and operational stats |
| **Settings & Support** | `/driver/settings`, `/driver/support` | Preferences, vehicle config, profile edits, and operational support center |

### Admin Operations Portal (`/admin/*`)
| Page | URL | Description |
| :--- | :--- | :--- |
| **Admin Dashboard** | `/admin/dashboard` | Fleet NOC overview, active drivers, total trips, and revenue metrics |
| **Fleet Management** | `/admin/fleet` | Live vehicle status, vehicle models, and maintenance alerts |
| **Driver Management** | `/admin/drivers` | Enterprise driver directory, real-time search, status filter, transactional account creation, and detail views |
| **Live Demand** | `/admin/demand` | Spatial surge map across NYC demand zones |
| **Demand Forecast** | `/admin/forecast` | Time-series demand forecasting by borough and zone |
| **Model Health** | `/admin/models` | Dynamic ML latency monitoring, model connection telemetry, and drift metrics |
| **AI Recommendations** | `/admin/recommendations` | System-wide automated dispatch & surge optimization rules |
| **Alerts & System Status**| `/admin/alerts`, `/admin/system` | Real-time anomaly notifications & microservice health checks |
| **Users & Roles** | `/admin/users` | RBAC account directory and permission management |

---

## ⚡ Key Platform Features

- ✅ **Unified Route Map Picker & Reverse Geocoding**: Interactive 2-click Leaflet map selection (1st click = 🟢 Pickup, 2nd click = 🟣 Drop-off, connecting route polyline, auto-fitting bounds). Live reverse-geocoding displays human-readable place names (`Midtown Manhattan, New York, NY`) while sending exact numerical float coordinates (`origin_lat`, `origin_lng`, `dest_lat`, `dest_lng`) to XGBoost V3.
- ✅ **Real XGBoost V3 Integration**: ML model produces live trip duration predictions through the FastAPI backend (`POST /api/driver/trip-duration`).
- ✅ **Real HDBSCAN Demand Zone Integration**: ML model produces live spatial cluster demand zone predictions (`GET /api/demand-zones`), returning real center coordinates, dynamic surge multipliers, trend indicators, and driver-to-zone spatial recommendations.
- ✅ **Real PyTorch LSTM Demand Forecasts**: Time-series demand forecasting engine provides 24-hour demand curves and peak volume predictions (`GET /api/forecast`).
- ✅ **Profile & Credential Synchronization**: Seamless profile updates (`PUT /api/auth/profile`) and password changes (`PUT /api/auth/password`) synchronized between React state and SQLite/PostgreSQL ORM models.
- ✅ **Ollama Gemma2 LLM Integration**: AI Assistant service connects to local/Dockerized Ollama Gemma2 for real-time dispatch advice, with fallback handling when offline.
- ✅ **Admin Driver Management & RBAC**: Full transactional driver account creation (`POST /api/admin/drivers`), linking `User` (`role=DRIVER`) with `Driver` profiles, temporary password modal prompt, detail viewer, active/inactive status toggling, and automated RBAC security test suite (`test_admin_drivers_rbac.py`).

---

## 📂 Project Structure

```
Ride-Hailing-AI/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI routers (auth, admin, driver_advice, forecast, trip_duration, demand_zones)
│   │   ├── core/            # Security, JWT, hashing, RBAC middleware
│   │   ├── models/          # SQLAlchemy database entities (User, Driver, DemandZone)
│   │   ├── schemas/         # Pydantic validation schemas
│   │   └── services/        # Business logic & model adapters
│   ├── models/              # Consolidated Machine Learning Model Storage
│   │   ├── student_a/       # Trip Duration Model (XGBoost V3) & Feature Columns
│   │   ├── student_b/       # HDBSCAN Spatial Demand Zone Model (.pkl, metadata, zones.json)
│   │   └── student_c/       # PyTorch LSTM Demand Forecasting Model (.pth, scaler.pkl)
│   ├── main.py              # FastAPI application entry point
│   ├── seed.py              # Database seeder with demonstration data
│   ├── test_admin_drivers_rbac.py # RBAC and security test suite
│   └── run_tests.py         # Automated unit test suite runner
├── llm-service/             # Ollama Gemma2 LLM reasoning microservice (:8001)
│   ├── main.py
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── auth/            # AuthContext, ProtectedRoute, role definitions
│   │   ├── components/      # Shared layout, AppShell, Header, Sidebar, LocationRoutePickerModal
│   │   ├── hooks/           # React Query hooks (useRideApi)
│   │   ├── layouts/         # MainLayout shell
│   │   ├── navigation/      # Admin and Driver sidebar navigation configs
│   │   ├── pages/           # Admin and Driver page components
│   │   ├── routes/          # Centralized route definitions
│   │   ├── services/        # Axios API client & reverse geocoding service
│   │   └── theme/           # Velour color palette & MUI theme
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 👥 Team

| Member | Responsibility |
|---------|----------------|
| **Student A** | Trip Duration Prediction (**XGBoost V3 Active**) |
| **Student B** | Spatial Demand Zone Detection (**HDBSCAN Model Active**) |
| **Student C** | 24h Demand Forecasting (**PyTorch LSTM Model Active**) |
| **Student D** | AI Driver Assistant, Full Stack Integration & Enterprise Operations Platform |