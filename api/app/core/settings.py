# ============================================================
# Sang Bahasa > Application Settings
# All config is read from environment variables / .env file.
# ============================================================

from functools import lru_cache
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/ directory (this file lives at backend/app/core/settings.py)
_BACKEND_DIR = Path(__file__).resolve().parents[2]
_REPO_ROOT = _BACKEND_DIR.parent
_REPO_ENV = _REPO_ROOT / ".env"
_BACKEND_ENV = _BACKEND_DIR / ".env"

# Repo-root .env first, then backend/.env so the API always prefers backend/.env
# regardless of the process current working directory (fixes wrong DB when
# uvicorn is started from the monorepo root).
if _REPO_ENV.is_file():
    load_dotenv(_REPO_ENV)
if _BACKEND_ENV.is_file():
    load_dotenv(_BACKEND_ENV, override=True)


class Settings(BaseSettings):
    # --------------------------------------------------------
    # App
    # --------------------------------------------------------
    APP_ENV: str = "development"
    APP_NAME: str = "Sang Bahasa API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # --------------------------------------------------------
    # Database
    # --------------------------------------------------------
    DATABASE_URL: str
    ASYNC_DATABASE_URL: str

    # --------------------------------------------------------
    # Security
    # --------------------------------------------------------
    SECRET_KEY: str
    ADMIN_SECRET_TOKEN: str

    # --------------------------------------------------------
    # CORS
    # Accepts comma-separated string from env, parses to list
    # --------------------------------------------------------
    CORS_ORIGINS: str = "http://localhost:4321,http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    # --------------------------------------------------------
    # URLs
    # --------------------------------------------------------
    BACKEND_URL: str = "http://localhost:8000"
    PUBLIC_SITE_URL: str = "http://localhost:4321"

    # --------------------------------------------------------
    # Logging
    # --------------------------------------------------------
    LOG_LEVEL: str = "INFO"

    # --------------------------------------------------------
    # Pagination
    # --------------------------------------------------------
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    # --------------------------------------------------------
    # Search
    # --------------------------------------------------------
    SEARCH_HISTORY_ENABLED: bool = False  # Disabled by default for performance
    MAX_SEARCH_RESULTS: int = 50

    model_config = SettingsConfigDict(
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
