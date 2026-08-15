# Ride AI — Demand Forecasting & Enterprise Driver Management Platform

Ride AI is an enterprise-grade ride-hailing demand forecasting, driver positioning assistant, and administrative fleet management platform. It combines multi-model machine learning services (Trip Duration prediction, Demand Zone clustering, and Time-Series demand forecasting) with an Ollama-powered LLM reasoning engine to give drivers real-time, actionable positioning advice, while empowering fleet admins with full transactional account control and operational metrics.

The user interface follows the **Velour** design system built with React and Material UI v5, featuring dark-mode operational ergonomics, spatial demand heatmaps, bento grid dashboards, real-time AI command chat, and an integrated RBAC navigation shell.

---

## 🎨 Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Material UI v5, Recharts, Leaflet, React Query, Vite
- **Backend**: FastAPI, Python 3.10+, SQLAlchemy ORM, Pydantic v2, Passlib (bcrypt), PyJWT, Uvicorn
- **AI / ML Layer**: 
  - **Student A**: Trip Duration Prediction Service
  - **Student B**: Demand Zone Detection & Clustering Service
  - **Student C**: 24h Hourly Demand Forecasting Service
  - **Student D**: Ollama LLM Reasoning Service (Gemma2 model default with circuit-breaker fallback)
- **Database**: SQLite / PostgreSQL (SQLAlchemy ORM with pre-seeded NYC demonstration data)
- **Security & Access Control**: Real JWT authentication with Role-Based Access Control (`DRIVER` and `ADMIN` roles)

---

## 🚀 How to Run Locally on Your PC

Follow these steps after cloning the repository.

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18+ recommended) & `npm`
- **Python** (v3.10+ recommended) & `pip`
- *(Optional)* **Ollama** installed locally if you wish to run full local LLM inference (`ollama pull gemma2`).

---

### Step 1: Clone the Repository & Navigate

```bash
git clone https://github.com/AryanJha05/Ride-Hailing-AI.git
cd Ride-Hailing-AI
```

---

### Step 2: Set Up and Start the Backend

1. Create a Python virtual environment and activate it:

   ```bash
   # On Linux/macOS
   python3 -m venv backend/venv
   source backend/venv/bin/activate

   # On Windows (PowerShell)
   python -m venv backend\venv
   .\backend\venv\Scripts\Activate.ps1
   ```

2. Install backend dependencies:

   ```bash
   pip install -r backend/requirements.txt
   ```

3. Seed the Database with initial demonstration data (Admin & Driver accounts, NYC demand zones):

   ```bash
   python backend/seed.py
   ```

4. Start the FastAPI server:

   ```bash
   python backend/main.py
   ```

   The backend will start at **`http://localhost:8000`**.
   - API Documentation (Swagger UI): `http://localhost:8000/docs`

---

### Step 3: Set Up and Start the Frontend

Open a new terminal window/tab:

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install npm dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

   The application will open at **`http://localhost:3000`**.

---

### Step 4: (Optional) Local Ollama LLM Setup

If you want the AI Assistant to generate responses using a local Ollama model instead of the rule-based fallback:

1. Download and start [Ollama](https://ollama.com).
2. Pull the default Gemma2 model:
   ```bash
   ollama pull gemma2
   ```
3. Ensure Ollama is running at `http://localhost:11434`.

---

## 🐳 Alternative: Running with Docker Compose

If you have Docker installed, you can start the entire stack (Backend + Frontend) with a single command:

```bash
docker-compose up --build
```

- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:8000`

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Allowed Section |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rideai.nyc` | `admin123` | `/admin/*` (Full Administrative & Fleet Control) |
| **Driver** | `alex.morgan@rideai.nyc` | `driver123` | `/driver/*` (Driver Operational Dashboard & AI Assistant) |

---

## 📱 Navigation & Routing Architecture

Ride AI uses a unified application shell with role-protected route namespaces:

### Authentication & Public Routes
| Page | URL | Description |
| :--- | :--- | :--- |
| **Login Page** | `/login` | Enterprise 50/50 split authentication page with quick demo login buttons |

### Driver Portal (`/driver/*`)
| Page | URL | Description |
| :--- | :--- | :--- |
| **Driver Dashboard** | `/driver/dashboard` | Main driver hub with bento grid metrics, quick actions & positioning advice |
| **Live Demand Map** | `/driver/demand` | Spatial Leaflet map with active NYC demand zones & surge multipliers |
| **AI Assistant** | `/driver/assistant` | Interactive AI command chat with real-time ML reasoning chips |
| **Earnings** | `/driver/earnings` | Detailed earnings analytics, shift performance & AI bonus breakdowns |
| **Trips** | `/driver/trips` | NYC trip log table with fares, ratings, and route details |
| **Forecast Analytics** | `/driver/analytics` | Hourly predictive demand charts and zone comparisons |
| **Driver Profile** | `/driver/profile` | Driver rating, vehicle assignment, and operational stats |
| **Settings & Support** | `/driver/settings`, `/driver/support` | Preferences, vehicle config, and NYC driver support center |

### Admin Operations Portal (`/admin/*`)
| Page | URL | Description |
| :--- | :--- | :--- |
| **Admin Dashboard** | `/admin/dashboard` | Fleet NOC overview, active drivers, total trips, and revenue metrics |
| **Fleet Management** | `/admin/fleet` | Live vehicle status, vehicle models, and maintenance alerts |
| **Driver Management** | `/admin/drivers` | Enterprise driver directory, real-time search, status filter, transactional account creation, and detail views |
| **Live Demand** | `/admin/demand` | Spatial surge map across NYC demand zones |
| **Demand Forecast** | `/admin/forecast` | Time-series demand forecasting by borough and zone |
| **Model Health** | `/admin/models` | ML latency monitoring, throughput, and model drift metrics |
| **AI Recommendations** | `/admin/recommendations` | System-wide automated dispatch & surge optimization rules |
| **Alerts & System Status**| `/admin/alerts`, `/admin/system` | Real-time anomaly notifications & microservice health checks |
| **Users & Roles** | `/admin/users` | RBAC account directory and permission management |

---

## ⚡ Key Platform Features

- ✅ **Unified App Shell Architecture**: Shared Header, Sidebar, Theme, and Typography across Driver and Admin portals while maintaining strict role-based navigation.
- ✅ **JWT Authentication & RBAC Protection**: Secure login via `/api/auth/login`, bcrypt password hashing, and route protection for `DRIVER` and `ADMIN` roles.
- ✅ **Admin Driver Management**: Full transactional driver account creation (`POST /api/admin/drivers`), linking a `User` account (`role=DRIVER`) with a `Driver` profile, temporary password modal prompt, detail viewer, and active/inactive status toggling.
- ✅ **NYC Telemetry & Spatial Intelligence**: Real NYC demand zones (Midtown Manhattan, JFK Airport, Financial District, Grand Central, Williamsburg, etc.) with live surge multipliers.
- ✅ **Multi-Model ML Integration**: Predicts trip duration, identifies high-demand clusters, and forecasts 24h demand horizons.
- ✅ **Automated RBAC Test Suite**: Backend test suite (`test_admin_drivers_rbac.py`) validating role isolation and unauthorized access prevention.

---

## 📂 Project Structure

```
Ride-Hailing-AI/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI routers (auth, admin, driver_advice, forecast, etc.)
│   │   ├── core/            # Security, JWT, hashing, RBAC middleware
│   │   ├── models/          # SQLAlchemy database entities (User, Driver, DemandZone)
│   │   ├── schemas/         # Pydantic validation schemas
│   │   └── services/        # Business logic services (driver_service, etc.)
│   ├── main.py              # FastAPI application entry point
│   ├── seed.py              # Database seeder with demonstration data
│   └── test_admin_drivers_rbac.py # RBAC and security test suite
├── frontend/
│   ├── src/
│   │   ├── auth/            # AuthContext, ProtectedRoute, role definitions
│   │   ├── components/      # Shared layout, AppShell, Header, Sidebar
│   │   ├── hooks/           # React Query hooks (useRideApi)
│   │   ├── layouts/         # MainLayout shell
│   │   ├── navigation/      # Admin and Driver sidebar navigation configs
│   │   ├── pages/           # Admin and Driver page components
│   │   ├── routes/          # Centralized route definitions
│   │   ├── services/        # Axios API client
│   │   └── theme/           # Velour color palette & MUI theme
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 👥 Team

| Member | Responsibility |
|---------|----------------|
| **Student A** | Trip Duration Prediction |
| **Student B** | Demand Zone Detection |
| **Student C** | Demand Forecasting |
| **Student D** | AI Driver Assistant, Ollama Integration, Full Stack Integration |