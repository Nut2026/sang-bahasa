# ============================================================
# Sang Bahasa Admin Routes (protected)
# All routes require X-Admin-Token header.
# POST   /api/admin/entries
# PUT    /api/admin/entries/{id}
# DELETE /api/admin/entries/{id}
# GET    /api/admin/entries          (all, including unpublished)
# ============================================================

import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.core.database import get_db
from app.schemas.peribahasa import (
    PeribahasaCreate,
    PeribahasaOut,
    PeribahasaUpdate,
    PaginatedResponse,
)
from app.services.entry_service import EntryService

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(require_admin)],
)


@router.get("/entries", response_model=PaginatedResponse)
async def admin_list_entries(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    category: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse:
    """List ALL entries including unpublished drafts. Admin only."""
    from app.repositories.peribahasa_repo import PeribahasaRepository
    from app.schemas.peribahasa import PeribahasaOut
    repo = PeribahasaRepository(db)
    items, total = await repo.get_all(
        page=page,
        page_size=page_size,
        category=category,
        published_only=False,
    )
    return PaginatedResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=[PeribahasaOut.model_validate(i) for i in items],
    )


@router.post("/entries", response_model=PeribahasaOut, status_code=status.HTTP_201_CREATED)
async def create_entry(
    payload: PeribahasaCreate,
    db: AsyncSession = Depends(get_db),
) -> PeribahasaOut:
    """Create a new peribahasa entry. Admin only."""
    service = EntryService(db)
    return await service.create(payload)


@router.put("/entries/{entry_id}", response_model=PeribahasaOut)
async def update_entry(
    entry_id: uuid.UUID,
    payload: PeribahasaUpdate,
    db: AsyncSession = Depends(get_db),
) -> PeribahasaOut:
    """Update an existing peribahasa entry. Admin only."""
    service = EntryService(db)
    return await service.update(entry_id, payload)


@router.delete("/entries/{entry_id}", status_code=status.HTTP_200_OK)
async def delete_entry(
    entry_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Permanently delete a peribahasa entry. Admin only."""
    service = EntryService(db)
    return await service.delete(entry_id)