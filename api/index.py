# ============================================================
# Sang Bahasa — FastAPI Application Entry Point
# ============================================================

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.settings import get_settings
from app.core.logging import setup_logging, get_logger
from app.api.routes import admin, sitemap
from app.api.routes import search_v2, entries_v2
from app.schemas.peribahasa import HealthResponse

# --------------------------------------------------------
# Bootstrap
# --------------------------------------------------------
setup_logging()
settings = get_settings()
logger = get_logger(__name__)


# --------------------------------------------------------
# Cache-Control Middleware
# --------------------------------------------------------
class CacheControlMiddleware(BaseHTTPMiddleware):
    """Adds Cache-Control headers to optimize performance."""
    # 
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Never cache live homepage data endpoints
        if request.url.path.startswith("/api/entries/newest"):
            response.headers["Cache-Control"] = "no-store"

        # Cache search results for 5 minutes (API responses change rarely)
        elif request.url.path.startswith("/api/search"):
            response.headers["Cache-Control"] = "public, max-age=300, stale-while-revalidate=600"
        
        # Cache entries (featured, random, specific entry) for 1 hour
        elif request.url.path.startswith("/api/entries"):
            response.headers["Cache-Control"] = "public, max-age=3600, stale-while-revalidate=7200"
        
        # Cache categories and sitemap for 24 hours
        elif request.url.path.startswith("/api/sitemap"):
            response.headers["Cache-Control"] = "public, max-age=86400"
        
        # Don't cache admin routes
        elif request.url.path.startswith("/api/admin"):
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-XSS-Protection"] = "1; mode=block"

        return response


# --------------------------------------------------------
# Lifespan — startup / shutdown hooks
# --------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    logger.info(
        "Starting %s v%s [%s]",
        settings.APP_NAME,
        settings.APP_VERSION,
        settings.APP_ENV,
    )
    yield
    logger.info("Shutting down %s", settings.APP_NAME)


# --------------------------------------------------------
# App instance
# --------------------------------------------------------
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "REST API for the Sang Bahasa Malay language dictionary platform. "
        "Provides search, entry retrieval, sitemap data, and admin management."
    ),
    docs_url="/docs" if settings.APP_ENV != "production" else None,
    redoc_url="/redoc" if settings.APP_ENV != "production" else None,
    lifespan=lifespan,
)


# --------------------------------------------------------
# Middleware (Order matters!)
# --------------------------------------------------------
# 1. Add GZip compression first (should be outermost)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 2. Cache-Control middleware
app.add_middleware(CacheControlMiddleware)

# 3. CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# 4. Trusted Host middleware for production
if settings.APP_ENV == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*.onrender.com", "*.vercel.app", "localhost"],
    )


# --------------------------------------------------------
# Routers
# --------------------------------------------------------
API_PREFIX = "/api"

# Use new generic routes (v2) that support all word types
# Old routes (search, entries) are not registered and their imports have been removed.
app.include_router(search_v2.router, prefix=API_PREFIX)
app.include_router(entries_v2.router, prefix=API_PREFIX)
app.include_router(admin.router, prefix=API_PREFIX)
app.include_router(sitemap.router, prefix=API_PREFIX)


# --------------------------------------------------------
# Root & Health endpoints
# --------------------------------------------------------
@app.get("/", include_in_schema=False)
async def root() -> JSONResponse:
    return JSONResponse(
        content={
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "docs": "/docs",
            "health": "/health",
        }
    )


@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health() -> HealthResponse:
    """Health check endpoint used by Render and Docker."""
    return HealthResponse(
        status="ok",
        version=settings.APP_VERSION,
        environment=settings.APP_ENV,
    )
