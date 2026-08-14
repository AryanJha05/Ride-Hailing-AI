# Ride AI — Demand Forecasting & Driver Assistant Platform

Ride AI is an enterprise-grade ride-hailing demand forecasting and driver positioning assistant. It combines multi-model machine learning services (Trip Duration prediction, Demand Zone clustering, and Time-Series demand forecasting) with an Ollama-powered LLM reasoning engine to give drivers real-time, actionable positioning advice.

The user interface follows the **Velour** design system built with React and Material UI v5, featuring dark-mode operational ergonomics, spatial demand heatmaps, bento grid dashboards, and real-time AI command chat.

---

## 🎨 Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Material UI v5, Recharts, Leaflet, React Query, Vite
- **Backend**: FastAPI, Python 3.10+, SQLAlchemy, Pydantic v2, Uvicorn
- **AI / ML Layer**: 
  - **Student A**: Trip Duration Prediction Service
  - **Student B**: Demand Zone Detection & Clustering Service
  - **Student C**: 24h Hourly Demand Forecasting Service
  - **Student D**: Ollama LLM Reasoning Service (Gemma2 model default with circuit-breaker fallback)
- **Database**: SQLite (SQLAlchemy ORM with pre-seeded demonstration data)

---

## 🚀 How to Run locally on Your PC

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

3. Seed the Database with initial mock data:

   ```bash
   python backend/seed.py
   ```

4. Start the FastAPI server:

   ```bash
   python backend/main.py
   ```

   The backend will start at **`http://localhost:8000`**.
   - API Documentation (Swagger): `http://localhost:8000/docs`

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

If you want the AI Assistant to generate responses using a local Ollama model instead of the rule-based circuit-breaker fallback:

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

## 📱 Platform Pages & Navigation

Once running, navigate through the platform using the left sidebar:

| Page | URL | Description |
| :--- | :--- | :--- |
| **Login Page (Default Entry)** | `http://localhost:3000/` or `/login` | Enterprise split-screen managed authentication entry point (Demo Driver & Demo Admin options) |
| **Operations View** | `http://localhost:3000/dashboard` | Main driver dashboard with bento grid metrics & AI recommendations |
| **Live Demand Map** | `http://localhost:3000/live-map` | Spatial Leaflet map with active zone filters & surge multipliers |
| **AI Assistant** | `http://localhost:3000/ai-assistant` | Interactive AI command chat with real-time ML analysis chips |
| **Forecast Analytics** | `http://localhost:3000/analytics` | 24h predictive area charts, zone comparisons & weekly heatmap |
| **Driver Profile** | `http://localhost:3000/profile` | Driver rating (Alex Morgan, NYC-2048), earnings history, and recent trip table |
| **Trips** | `http://localhost:3000/trips` | Detailed NYC trip logs and fare breakdowns |
| **Settings** | `http://localhost:3000/settings` | Driver preference, vehicle, and dispatch configuration |
| **Support** | `http://localhost:3000/support` | NYC driver support center and emergency contacts |
| **Admin Dashboard** | `http://localhost:3000/admin` | NOC live status, ML model health monitoring & anomaly alerts |

---

## 🚧 Current Development Status

The application architecture and frontend/backend implementation are under active development.

Current status:
- ✅ React frontend (Velour enterprise design system)
- ✅ FastAPI backend with NYC spatial telemetry & USD currency models
- ✅ Split-screen enterprise authentication entry point (`/login`, `/register`)
- ✅ Production-ready Docker & Docker Compose infrastructure
- ✅ SQLite database with NYC seed data (Alex Morgan, NYC-2048)
- ✅ REST API contracts & JSON schemas
- ✅ Ollama LLM integration structure (Gemma2 model)
- 🚧 Student A ML Model (Pending Integration)
- 🚧 Student B ML Model (Pending Integration)
- 🚧 Student C ML Model (Pending Integration)
- 🚧 Backend JWT/OAuth authentication logic (Pending implementation)

## 📂 Project Structure

Ride-AI/

├── frontend/

├── backend/

├── docs/

├── README.md

└── .gitignore


## 👥 Team

| Member | Responsibility |
|---------|----------------|
| Student A | Trip Duration Prediction |
| Student B | Demand Zone Detection |
| Student C | Demand Forecasting |
| Student D | AI Driver Assistant, Ollama Integration, Full Stack Integration |