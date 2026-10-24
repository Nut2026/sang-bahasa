# ============================================================
# Sang Bahasa Sitemap Route
# GET /api/sitemap returns all slugs for sitemap generation
# ============================================================

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.peribahasa import SitemapEntry, CategoryOut
from app.services.entry_service import EntryService

router = APIRouter(prefix="/sitemap", tags=["Sitemap"])


@router.get("", response_model=List[SitemapEntry])
async def get_sitemap_entries(
    db: AsyncSession = Depends(get_db),
) -> List[SitemapEntry]:
    """
    Return all published slugs and their last-updated timestamps.
    Used by the sitemap generator script and frontend sitemap route.
    """
    service = EntryService(db)
    return await service.get_sitemap_entries()


@router.get("/categories", response_model=List[CategoryOut])
async def get_categories(
    db: AsyncSession = Depends(get_db),
) -> List[CategoryOut]:
    """Return all categories with display metadata."""
    service = EntryService(db)
    return await service.get_categories()