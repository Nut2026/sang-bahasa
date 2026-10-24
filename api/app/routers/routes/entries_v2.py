# ============================================================
# Sang Bahasa Comprehensive Entry Routes (v2)
# Supports all word types: peribahasa, simpulan-bahasa, bahasa-klasik
# ============================================================

from typing import List, Optional
import random
from datetime import date

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.core.database import get_db
from app.schemas.peribahasa import (
    PeribahasaSummary,
    PeribahasaOut,
    PaginatedResponse,
    SearchResult,
)
from app.repositories.word_repo import WordRepository, WORD_TYPE_MODELS
from app.services.word_search_service import WordSearchService
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/entries", tags=["Entries"])

VALID_WORD_TYPES = ["peribahasa", "simpulan-bahasa", "bahasa-klasik", "all"]
WORD_TYPE_ALIASES = {
    "simpulan_bahasa": "simpulan-bahasa",
    "bahasa_klasik": "bahasa-klasik",
}


def validate_word_type(word_type: str) -> str:
    """Validate word type."""
    word_type = WORD_TYPE_ALIASES.get(word_type, word_type)
    if word_type not in VALID_WORD_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid word_type. Must be one of: {', '.join(VALID_WORD_TYPES)}"
        )
    return word_type


@router.get("", response_model=SearchResult)
async def list_entries(
    word_type: str = Query(default="peribahasa", description="Word type: peribahasa, simpulan-bahasa, bahasa-klasik"),
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=20, ge=1, le=100, description="Results per page"),
    category: Optional[str] = Query(default=None, description="Filter by category"),
    tags: Optional[List[str]] = Query(default=None, description="Filter by tags"),
    db: AsyncSession = Depends(get_db),
) -> SearchResult:
    """List all published entries for a word type, paginated."""
    word_type = validate_word_type(word_type)
    service = WordSearchService(db, word_type)
    return await service.get_all(
        category=category,
        tags=tags,
        page=page,
        page_size=page_size,
    )


@router.get("/featured", response_model=List[PeribahasaSummary])
async def featured_entries(
    limit: int = Query(default=10, ge=1, le=50),
    word_type: str = Query(default="peribahasa", description="Word type"),
    db: AsyncSession = Depends(get_db),
) -> List[PeribahasaSummary]:
    """Return a selection of featured entries."""
    word_type = validate_word_type(word_type)
    repo = WordRepository(db, word_type)
    results = await repo.get_featured(limit=limit)
    return [
        PeribahasaSummary.model_validate({**row.__dict__, "word_type": word_type})
        for row in results
    ]


@router.get("/random", response_model=List[PeribahasaSummary])
async def random_entries(
    limit: int = Query(default=5, ge=1, le=20),
    word_type: str = Query(default="peribahasa", description="Word type"),
    db: AsyncSession = Depends(get_db),
) -> List[PeribahasaSummary]:
    """Return random entries."""
    word_type = validate_word_type(word_type)
    repo = WordRepository(db, word_type)
    results = await repo.get_random(limit=limit)
    return [
        PeribahasaSummary.model_validate({**row.__dict__, "word_type": word_type})
        for row in results
    ]


@router.get("/newest", response_model=List[PeribahasaSummary])
async def newest_entries(
    limit: int = Query(default=5, ge=1, le=5),
    db: AsyncSession = Depends(get_db),
) -> List[PeribahasaSummary]:
    """
    Return up to `limit` entries from the newest (latest) created_at DATE
    across all word types. If more than `limit` exist on that newest date,
    randomly pick `limit`.
    """
    word_types = ["peribahasa", "simpulan-bahasa", "bahasa-klasik"]

    newest_date: date | None = None
    for wt in word_types:
        model = WORD_TYPE_MODELS[wt]
        d = await db.scalar(
            select(func.max(func.date(model.created_at))).where(model.is_published == True)
        )
        if d and (newest_date is None or d > newest_date):
            newest_date = d

    if newest_date is None:
        return []

    pool: List[PeribahasaSummary] = []
    for wt in word_types:
        model = WORD_TYPE_MODELS[wt]
        rows = await db.scalars(
            select(model).where(
                and_(
                    model.is_published == True,
                    func.date(model.created_at) == newest_date,
                )
            )
        )
        for row in list(rows):
            pool.append(PeribahasaSummary.model_validate({**row.__dict__, "word_type": wt}))

    if not pool:
        return []

    random.shuffle(pool)
    selected = pool[:limit]
    selected.sort(
        key=lambda entry: (
            entry.created_at.date().isoformat() if entry.created_at else "",
            entry.phrase.lower(),
            entry.slug,
        )
    )
    return selected


@router.get("/{slug}", response_model=PeribahasaOut)
async def get_entry(
    slug: str,
    word_type: str = Query(default="peribahasa", description="Word type"),
    db: AsyncSession = Depends(get_db),
) -> PeribahasaOut:
    """Get a single entry by its slug."""
    """Get a single entry by its slug."""
    word_type = validate_word_type(word_type)
    repo = WordRepository(db, word_type)
    entry = await repo.get_by_slug(slug)
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    return PeribahasaOut.model_validate({**entry.__dict__, "word_type": word_type})
