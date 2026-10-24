# ============================================================
# Sang Bahasa > API Dependencies
# Shared FastAPI dependencies injected into route handlers.
# ============================================================

import time
from typing import Dict
from fastapi import Header, HTTPException, status, Request
from app.core.settings import get_settings
from app.core.logging import get_logger

settings = get_settings()
logger = get_logger(__name__)

# ============================================================
# Simple Rate Limiting (in-memory)
# Production: Use Redis or external service
# ============================================================
request_times: Dict[str, list] = {}


async def check_rate_limit(
    request: Request,
    limit: int = 100,
    window: int = 60  # seconds
) -> None:
    """
    Simple rate limiting based on client IP.
    Limit: `limit` requests per `window` seconds.
    """
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()

    # Initialize IP tracking
    if client_ip not in request_times:
        request_times[client_ip] = []

    # Remove old requests outside the window
    request_times[client_ip] = [
        t for t in request_times[client_ip] if now - t < window
    ]

    # Check limit
    if len(request_times[client_ip]) >= limit:
        logger.warning("rate_limit_exceeded ip=%s", client_ip)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again later.",
        )

    # Record this request
    request_times[client_ip].append(now)


async def require_admin(
    x_admin_token: str = Header(...),
    request: Request = None
) -> str:
    """
    Dependency that validates the admin token.
    Includes rate limiting for admin operations.
    
    Usage:
        @router.post("/", dependencies=[Depends(require_admin)])
    """
    if not x_admin_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing admin token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if x_admin_token != settings.ADMIN_SECRET_TOKEN:
        logger.warning("admin_auth_failed ip=%s", request.client.host if request else "unknown")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Rate limit admin operations: 100 requests per 60 seconds
    await check_rate_limit(request, limit=100, window=60)
    
    return x_admin_token