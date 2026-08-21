import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models.database import engine, Base
from app.api import health, driver_advice, forecast, demand_zones, driver_performance, auth, admin, trip_duration

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.core.logger import logger
    logger.info("Ride AI Backend API Server Started Successfully.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Ride AI Monorepo Backend — Production API Layer with ML & LLM Integration Services",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(health.router, tags=["Health"])
app.include_router(driver_advice.router, tags=["AI Driver Advice"])
app.include_router(forecast.router, tags=["Demand Forecast"])
app.include_router(demand_zones.router, tags=["Demand Zones"])
app.include_router(driver_performance.router, tags=["Driver Performance"])
app.include_router(trip_duration.router, tags=["Trip Duration"])

@app.get("/")
def read_root():
    return {
        "title": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
