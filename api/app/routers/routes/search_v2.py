# ============================================================
# Sang Bahasa Comprehensive Search Routes (v2)
# Supports all word types: peribahasa, simpulan-bahasa, bahasa-klasik
# ============================================================

from typing import List, Optional

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.peribahasa import SearchResult, PeribahasaSummary
from app.services.word_search_service import WordSearchService
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/search", tags=["Search"])

VALID_WORD_TYPES = ["peribahasa", "simpulan-bahasa", "bahasa-klasik", "all"]
WORD_TYPE_ALIASES = {
    "simpulan_bahasa": "simpulan-bahasa",
    "bahasa_klasik": "bahasa-klasik"
}


def validate_word_type(word_type: str) -> str:
    """Validate and return word type."""
    word_type = WORD_TYPE_ALIASES.get(word_type, word_type)
    if word_type not in VALID_WORD_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid word_type. Must be one of: {', '.join(VALID_WORD_TYPES)}"
        )
    return word_type


@router.get("", response_model=SearchResult)
async def search(
    q: str = Query(..., min_length=1, max_length=200, description="Search query"),
    word_type: str = Query(default="peribahasa", description="Word type: peribahasa, simpulan-bahasa, bahasa-klasik"),
    category: Optional[str] = Query(default=None, description="Filter by category"),
    tags: Optional[List[str]] = Query(default=None, description="Filter by tags"),
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=20, ge=1, le=100, description="Results per page"),
    db: AsyncSession = Depends(get_db),
) -> SearchResult:
    """
    Search across all word types using full-text search (FTS) with ILIKE fallback.
    
    Supports:
    - peribahasa: Traditional Malay proverbs
    - simpulan-bahasa: Simplified sayings and wisdom
    - bahasa-klasik: Classical Malay language
    """
    word_type = validate_word_type(word_type)
    service = WordSearchService(db, word_type)
    return await service.search(
        query=q,
        category=category,
        tags=tags,
        page=page,
        page_size=page_size,
    )


@router.get("/suggestions", response_model=List[PeribahasaSummary])
async def suggestions(
    q: str = Query(..., min_length=1, max_length=100),
    word_type: str = Query(default="all", description="Word type or 'all' for all types"),
    limit: int = Query(default=5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
) -> List[PeribahasaSummary]:
    """
    Get quick autocomplete suggestions for a partial query.
    Uses ILIKE for speed. Not paginated.
    """
    word_type = validate_word_type(word_type)
    service = WordSearchService(db, word_type)
    return await service.get_suggestions(query=q, limit=limit)


@router.get("/similar", response_model=List[PeribahasaSummary])
async def similar(
    q: str = Query(..., min_length=1, max_length=200),
    word_type: str = Query(default="peribahasa", description="Word type"),
    limit: int = Query(default=5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
) -> List[PeribahasaSummary]:
    """
    Return similar entries when no exact matches found.
    Used for "Tiada keputusan dijumpai" (No results found) scenarios.
    """
    word_type = validate_word_type(word_type)
    service = WordSearchService(db, word_type)
    return await service.get_similar(query=q, limit=limit)
