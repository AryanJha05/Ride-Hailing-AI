import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Ride AI Platform"
    VERSION: str = "2.0.0"
    API_V1_STR: str = ""
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ride_ai.db")
    
    # Ollama LLM Configuration
    OLLAMA_HOST: str = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "gemma2")
    LLM_TIMEOUT_SECONDS: float = 8.0

    class Config:
        case_sensitive = True

settings = Settings()
