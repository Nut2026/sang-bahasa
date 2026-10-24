# ============================================================
# Sang Bahasa Entry Service
# Business logic for creating, updating, and retrieving entries.
# ============================================================

import uuid
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.repositories.peribahasa_repo import PeribahasaRepository
from app.schemas.peribahasa import (
    PeribahasaCreate,
    PeribahasaUpdate,
    PeribahasaOut,
    PeribahasaSummary,
    PaginatedResponse,
    SitemapEntry,
    CategoryOut,
)
from app.utils.slugify import generate_slug
from app.core.logging import get_logger

logger = get_logger(__name__)


class EntryService:

    def __init__(self, db: AsyncSession):
        self.repo = PeribahasaRepository(db)

    # --------------------------------------------------------
    # READ
    # --------------------------------------------------------

    async def get_by_slug(self, slug: str) -> PeribahasaOut:
        entry = await self.repo.get_by_slug(slug)
        if not entry:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Peribahasa with slug '{slug}' not found.",
            )
        return PeribahasaOut.model_validate(entry)

    async def get_all(
        self,
        page: int = 1,
        page_size: int = 20,
        category: Optional[str] = None,
        tags: Optional[List[str]] = None,
    ) -> PaginatedResponse:
        items, total = await self.repo.get_all(
            page=page,
            page_size=page_size,
            category=category,
            tags=tags,
            fast_count=False,  # Always count for accurate pagination display
        )
        return PaginatedResponse(
            total=total,
            page=page,
            page_size=page_size,
            items=[PeribahasaOut.model_validate(i) for i in items],
        )

    async def get_featured(self, limit: int = 10) -> List[PeribahasaSummary]:
        items = await self.repo.get_featured(limit=limit)
        return [PeribahasaSummary.model_validate(i) for i in items]

    async def get_random(self, limit: int = 5) -> List[PeribahasaSummary]:
        items = await self.repo.get_random(limit=limit)
        return [PeribahasaSummary.model_validate(i) for i in items]

    async def get_sitemap_entries(self) -> List[SitemapEntry]:
        rows = await self.repo.get_all_slugs()
        return [SitemapEntry(slug=row.slug, updated_at=row.updated_at) for row in rows]

    async def get_categories(self) -> List[CategoryOut]:
        cats = await self.repo.get_categories()
        return [CategoryOut.model_validate(c) for c in cats]

    # --------------------------------------------------------
    # WRITE (admin only)
    # --------------------------------------------------------

    async def create(self, payload: PeribahasaCreate) -> PeribahasaOut:
        # Resolve slug
        slug = payload.slug or generate_slug(payload.phrase)

        # Ensure uniqueness â€” append counter if needed
        base_slug = slug
        counter = 1
        while await self.repo.slug_exists(slug):
            slug = f"{base_slug}-{counter}"
            counter += 1

        data = payload.model_dump(exclude={"slug"})
        data["slug"] = slug

        entry = await self.repo.create(data)
        logger.info("Created entry: slug=%s", entry.slug)
        return PeribahasaOut.model_validate(entry)

    async def update(self, entry_id: uuid.UUID, payload: PeribahasaUpdate) -> PeribahasaOut:
        existing = await self.repo.get_by_id(entry_id)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Entry with id '{entry_id}' not found.",
            )

        data = payload.model_dump(exclude_none=True)

        # If phrase changed and no explicit slug, regenerate slug
        if "phrase" in data and "slug" not in data:
            new_slug = generate_slug(data["phrase"])
            base_slug = new_slug
            counter = 1
            while await self.repo.slug_exists(new_slug, exclude_id=entry_id):
                new_slug = f"{base_slug}-{counter}"
                counter += 1
            data["slug"] = new_slug

        entry = await self.repo.update(entry_id, data)
        logger.info("Updated entry: id=%s", entry_id)
        return PeribahasaOut.model_validate(entry)

    async def delete(self, entry_id: uuid.UUID) -> dict:
        existing = await self.repo.get_by_id(entry_id)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Entry with id '{entry_id}' not found.",
            )
        deleted = await self.repo.delete(entry_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Delete operation failed.",
            )
        logger.info("Deleted entry: id=%s", entry_id)
        return {"deleted": True, "id": str(entry_id)}