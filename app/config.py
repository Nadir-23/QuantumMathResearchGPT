import os
import secrets
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    DATABASE_URL: Optional[str] = None
    REDIS_URL: Optional[str] = None
    SECRET_KEY: str = ""
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"

    def model_post_init(self, __context):
        if not self.SECRET_KEY:
            self.SECRET_KEY = secrets.token_hex(32)
            if self.ENVIRONMENT == "production":
                import warnings
                warnings.warn(
                    "SECRET_KEY is not set! A random key has been generated. "
                    "Tokens will be invalidated on restart. Set SECRET_KEY in .env for production.",
                    stacklevel=2,
                )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()
