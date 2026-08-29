import os
import httpx
from datetime import datetime, timedelta
from typing import Dict, Any, List
from app.services.student_b_adapter import student_b_adapter
from app.services.student_c_adapter import student_c_adapter
from app.services.trip_duration_service import trip_duration_model_service

LLM_SERVICE_URL = os.getenv("LLM_SERVICE_URL", "http://localhost:8001").rstrip("/")

async def check_ollama_status() -> bool:
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get(f"{LLM_SERVICE_URL}/health")
            if resp.status_code == 200:
                data = resp.json()
                return data.get("ollama_status") == "healthy" or data.get("status") == "online"
    except Exception:
        pass
    return False

async def get_noc_model_health_telemetry() -> Dict[str, Any]:
    # Check actual connection status of models
    trip_duration_active = trip_duration_model_service.model is not None
    demand_zone_active = student_b_adapter.is_connected()
    demand_forecast_active = student_c_adapter.is_connected()
    ollama_active = await check_ollama_status()

    active_count = sum([trip_duration_active, demand_zone_active, demand_forecast_active])
    total_count = 3

    system_status = "HEALTHY"
    if active_count < total_count:
        system_status = "DEGRADED"
    if active_count == 0:
        system_status = "CRITICAL"

    now_iso = datetime.utcnow().isoformat() + "Z"

    # Services Roster
    services = [
        {
            "id": "trip_duration",
            "name": "Trip Duration Intelligence",
            "architecture": "XGBoost Regressor V3 (44 Spatial Features)",
            "version": "v3.2.0-spatial",
            "status": "OPERATIONAL" if trip_duration_active else "NOT_CONNECTED",
            "is_pending": not trip_duration_active,
            "inference_latency_ms": 12.4,
            "requests_per_min": 142,
            "error_rate_pct": 0.04,
            "cpu_utilization_pct": 18.2,
            "gpu_utilization_pct": None,
            "memory_usage_mb": 245,
            "last_health_check": now_iso,
            "last_inference_timestamp": now_iso,
            "loss_eval": "MAE 2.1 mins",
            "deployment_target": "FastAPI Core Cluster",
            "training_date": "2026-08-15",
            "recent_logs": [
                {"timestamp": now_iso, "level": "INFO", "message": "XGBoost V3 inference engine initialized with 44 feature columns."},
                {"timestamp": now_iso, "level": "INFO", "message": "Spatial coordinate transformation verified (NYC Bounding Box)."}
            ]
        },
        {
            "id": "demand_zone",
            "name": "Demand Zone Intelligence",
            "architecture": "HDBSCAN Spatial Demand Clustering",
            "version": "v2.1.0-hdbscan",
            "status": "OPERATIONAL" if demand_zone_active else "NOT_CONNECTED",
            "is_pending": not demand_zone_active,
            "inference_latency_ms": 14.1,
            "requests_per_min": 86,
            "error_rate_pct": 0.08,
            "cpu_utilization_pct": 22.5,
            "gpu_utilization_pct": None,
            "memory_usage_mb": 310,
            "last_health_check": now_iso,
            "last_inference_timestamp": now_iso,
            "loss_eval": "NYC HDBSCAN Clusters",
            "deployment_target": "FastAPI Core Cluster",
            "training_date": "2026-08-18",
            "recent_logs": [
                {"timestamp": now_iso, "level": "INFO", "message": "HDBSCAN model loaded successfully from demand_zones_model_optimized.pkl."},
                {"timestamp": now_iso, "level": "INFO", "message": "Cluster centers mapped across JFK, LGA, and Brooklyn hubs."}
            ]
        },
        {
            "id": "demand_forecast",
            "name": "Demand Forecasting Engine",
            "architecture": "PyTorch 2-Layer LSTM Neural Network",
            "version": "v1.4.2-lstm",
            "status": "OPERATIONAL" if demand_forecast_active else "NOT_CONNECTED",
            "is_pending": not demand_forecast_active,
            "inference_latency_ms": 18.6,
            "requests_per_min": 56,
            "error_rate_pct": 0.15,
            "cpu_utilization_pct": 34.1,
            "gpu_utilization_pct": None,
            "memory_usage_mb": 512,
            "last_health_check": now_iso,
            "last_inference_timestamp": now_iso,
            "loss_eval": "24h Time-Series Forecast",
            "deployment_target": "PyTorch Runtime Pipeline",
            "training_date": "2026-08-20",
            "recent_logs": [
                {"timestamp": now_iso, "level": "INFO", "message": "PyTorch LSTM model state dictionary loaded with MinMax scaler."},
                {"timestamp": now_iso, "level": "INFO", "message": "24-hour auto-regressive forecast horizon generated."}
            ]
        },
        {
            "id": "ollama_llm",
            "name": "AI Mobility Copilot (Ollama LLM)",
            "architecture": "Ollama + Gemma2:9b / Llama3 8B",
            "version": "v2.0-gemma2",
            "status": "HEALTHY" if ollama_active else "UNAVAILABLE",
            "is_pending": not ollama_active,
            "inference_latency_ms": 180.0 if ollama_active else 0.0,
            "requests_per_min": 24 if ollama_active else 0,
            "error_rate_pct": 0.20 if ollama_active else 1.0,
            "cpu_utilization_pct": 45.0 if ollama_active else 0.0,
            "gpu_utilization_pct": 12.0 if ollama_active else 0.0,
            "memory_usage_mb": 4096 if ollama_active else 0,
            "last_health_check": now_iso,
            "last_inference_timestamp": now_iso,
            "loss_eval": "Dispatch Reasoning",
            "deployment_target": "Ollama Microservice (:8001)",
            "training_date": "2026-08-25",
            "recent_logs": [
                {"timestamp": now_iso, "level": "INFO" if ollama_active else "WARN", 
                 "message": "Ollama microservice responding on port 8001." if ollama_active else "Ollama LLM microservice offline. Operating in fallback reasoning mode."}
            ]
        }
    ]

    # Calculate system KPIs
    total_rpm = sum(s["requests_per_min"] for s in services)
    avg_latency = round(sum(s["inference_latency_ms"] for s in services if s["inference_latency_ms"] > 0) / max(1, sum(1 for s in services if s["inference_latency_ms"] > 0)), 1)
    avg_error = round(sum(s["error_rate_pct"] for s in services) / len(services), 2)

    # 24-point Telemetry History for charts
    base_time = datetime.now()
    telemetry_history = []
    for i in range(24, 0, -1):
        t = base_time - timedelta(minutes=i * 5)
        time_str = t.strftime("%H:%M")
        # generate stable curves
        lat = round(12.0 + (i % 5) * 1.2 + (0.5 if i % 2 == 0 else -0.3), 1)
        reqs = int(240 + (i % 7) * 15 + (10 if i > 12 else -5))
        err = round(0.02 + (0.03 if i % 6 == 0 else 0.01), 2)
        telemetry_history.append({
            "time": time_str,
            "latency_ms": lat,
            "request_volume": reqs,
            "error_rate_pct": err
        })

    # Incidents
    active_incidents = []
    if not ollama_active:
        active_incidents.append({
            "id": "INC-104",
            "severity": "WARNING",
            "service": "AI Mobility Copilot (Ollama LLM)",
            "problem": "Ollama microservice endpoint unreachable on port 8001. Fallback mode active.",
            "status": "Monitoring",
            "detected_time": "5 min ago",
            "duration": "5m",
            "action": "Probe Endpoint"
        })

    resolved_incidents = [
        {
            "id": "INC-101",
            "severity": "INFO",
            "service": "Demand Zone Intelligence",
            "problem": "Spatial cluster cache refreshed following HDBSCAN model sync",
            "status": "Resolved",
            "detected_time": "45 min ago",
            "resolved_time": "42 min ago"
        },
        {
            "id": "INC-098",
            "severity": "INFO",
            "service": "Trip Duration Intelligence",
            "problem": "Feature matrix validation check completed successfully",
            "status": "Resolved",
            "detected_time": "2 hours ago",
            "resolved_time": "1 hour 58 min ago"
        }
    ]

    # Platform Services Dependencies
    platform_services = [
        {"name": "FastAPI Core Gateway", "status": "HEALTHY", "type": "REST Router", "latency": "1.2ms", "last_check": "Just now"},
        {"name": "SQLite ORM Engine", "status": "HEALTHY", "type": "Database Store", "latency": "0.8ms", "last_check": "Just now"},
        {"name": "Telemetry Cache Buffer", "status": "HEALTHY", "type": "In-Memory Store", "latency": "0.3ms", "last_check": "Just now"},
        {"name": "Trip Duration ML Engine", "status": "HEALTHY" if trip_duration_active else "DOWN", "type": "XGBoost Engine", "latency": "12.4ms" if trip_duration_active else "N/A", "last_check": "Just now"},
        {"name": "Demand Zone ML Engine", "status": "HEALTHY" if demand_zone_active else "DOWN", "type": "HDBSCAN Engine", "latency": "14.1ms" if demand_zone_active else "N/A", "last_check": "Just now"},
        {"name": "Demand Forecasting Engine", "status": "HEALTHY" if demand_forecast_active else "DOWN", "type": "PyTorch LSTM", "latency": "18.6ms" if demand_forecast_active else "N/A", "last_check": "Just now"},
        {"name": "Ollama LLM Microservice", "status": "HEALTHY" if ollama_active else "DEGRADED", "type": "Gemma2 Inference", "latency": "180ms" if ollama_active else "N/A", "last_check": "Just now"}
    ]

    return {
        "status": "success",
        "timestamp": now_iso,
        "is_demo_telemetry": True,
        "kpis": {
            "system_health": system_status,
            "active_ml_services": f"{active_count}/{total_count}",
            "requests_per_minute": total_rpm,
            "avg_inference_latency_ms": avg_latency,
            "error_rate_pct": avg_error,
            "uptime_pct": "99.98%"
        },
        "services": services,
        "telemetry_history": telemetry_history,
        "active_incidents": active_incidents,
        "resolved_incidents": resolved_incidents,
        "platform_services": platform_services
    }
