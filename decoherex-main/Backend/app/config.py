import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "decoherex"
    
    # JWT Settings
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # CORS
    allowed_origins: list = ["http://localhost:5173", "http://localhost:3000"]
    
    # API Settings
    api_v1_prefix: str = "/api/v1"
    project_name: str = "Decoherex Quantum Jobs Tracker"
    
    class Config:
        env_file = ".env"

settings = Settings()
