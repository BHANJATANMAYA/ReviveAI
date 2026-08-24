import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "ReviveAI - Autonomous Revenue Recovery Agent"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Razorpay Settings
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_reviveai_live01")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "mock_secret_key_buildathon2026")
    RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "whsec_reviveai_demo")
    USE_MOCK_RAZORPAY: bool = os.getenv("USE_MOCK_RAZORPAY", "true").lower() in ("true", "1", "yes")

    # LLM Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./reviveai.db")
    
    # Autonomous Agent Guardrails & Thresholds
    MAX_RETRY_COUNT: int = 3
    MIN_COOL_DOWN_MINUTES: int = 15
    MAX_RETENTION_DISCOUNT_PCT: float = 15.0
    MIN_LTV_FOR_DISCOUNT_INR: float = 5000.0
    MIN_PROBABILITY_TO_RETRY: float = 0.35
    DEFAULT_AUTOPILOT: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
