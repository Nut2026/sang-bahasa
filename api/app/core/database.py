# ============================================================
# Sang Bahasa > Database Connection Layer
# Async SQLAlchemy (FastAPI + PostgreSQL / Supabase ready)
# ============================================================

from typing import AsyncGenerator

from sqlalchemy import inspect
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.settings import get_settings
from app.models import Base

settings = get_settings()


def _asyncpg_connect_args(url: str) -> dict:
    """
    Supabase transaction pooler (PgBouncer, port 6543) breaks asyncpg prepared
    statements; session pooler on :5432 does not need this.
    """
    if ":6543/" in url.lower():
        return {"statement_cache_size": 0}
    return {}


# ============================================================
# ENGINE
# ============================================================
# IMPORTANT:
# - Do NOT manually set QueuePool (sync-only)
# - Do NOT use NullPool unless you are serverless
# - Async SQLAlchemy manages pooling internally
# ============================================================

engine = create_async_engine(
    settings.ASYNC_DATABASE_URL,

    # Performance & stability tuning
    echo=settings.DEBUG,
    pool_pre_ping=True,   # detects dead connections
    pool_recycle=900,     # recycle connections every 15 mins
    connect_args=_asyncpg_connect_args(settings.ASYNC_DATABASE_URL),
)


# ============================================================
# SESSION FACTORY
# ============================================================
# One AsyncSession per request
# ============================================================

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


# ============================================================
# FASTAPI DB DEPENDENCY
# ============================================================
# Ensures:
# - One session per request
# - Automatic rollback on error
# - Proper cleanup
# ============================================================

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Provides a database session per request.
    Handles commit/rollback safety automatically.
    """

    async with AsyncSessionLocal() as session:
        try:
            yield session

        except Exception:
            await session.rollback()
            raise

        finally:
            await session.close()


# ============================================================
# OPTIONAL: ENGINE LIFECYCLE HELPERS (FASTAPI STARTUP/SHUTDOWN)
# ============================================================

async def close_db_engine():
    """
    Gracefully dispose of the engine.
    Call this on app shutdown.
    """
    await engine.dispose()
