# ============================================================
# Sang Bahasa Search Service
# ============================================================

from difflib import SequenceMatcher
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.core.settings import get_settings
from app.repositories.peribahasa_repo import PeribahasaRepository
from app.schemas.peribahasa import PeribahasaSummary, SearchResult

logger = get_logger(__name__)
settings = get_settings()


class SearchService:
    def __init__(self, db: AsyncSession):
        self.repo = PeribahasaRepository(db)

    async def search(
        self,
        query: str,
        category: Optional[str] = None,
        tags: Optional[List[str]] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> SearchResult:
        query_clean = (query or "").strip()

        if not query_clean:
            return SearchResult(
                query="",
                total=0,
                page=page,
                page_size=page_size,
                results=[],
            )

        results, total = await self.repo.search(
            query=query_clean,
            category=category,
            tags=tags,
            page=page,
            page_size=page_size,
            fast_count=False,
        )

        if settings.SEARCH_HISTORY_ENABLED:
            await self._log_search_safe(query_clean, total)

        logger.info("search_done query=%s total=%s page=%s", query_clean, total, page)

        return SearchResult(
            query=query_clean,
            total=total,
            page=page,
            page_size=page_size,
            results=[
                PeribahasaSummary.model_construct(**row.__dict__)
                for row in results
            ],
        )

    async def _log_search_safe(self, query: str, total: int) -> None:
        if not settings.SEARCH_HISTORY_ENABLED:
            return

        try:
            await self.repo.log_search(query, total)
        except Exception as exc:
            logger.warning("search_log_failed=%s", str(exc))

    async def get_suggestions(
        self,
        query: str,
        limit: int = 5,
    ) -> List[PeribahasaSummary]:
        query_clean = (query or "").strip()

        if not query_clean:
            return []

        results = await self.repo.get_suggestions(query=query_clean, limit=limit)
        return [
            PeribahasaSummary.model_construct(**row.__dict__)
            for row in results
        ]

    async def get_similar(
        self,
        query: str,
        limit: int = 5,
    ) -> List[PeribahasaSummary]:
        query_clean = (query or "").strip()

        if not query_clean:
            return []

        similar = await self.repo.search_similar(query=query_clean, limit=limit)
        ranked = {str(item.id): item for item in similar}

        if len(ranked) < limit:
            for item in await self.repo.get_all_published_summaries():
                score = self._similarity_score(query_clean, item.phrase)
                if score >= 0.34:
                    ranked[str(item.id)] = item

        ordered = sorted(
            ranked.values(),
            key=lambda item: self._similarity_score(query_clean, item.phrase),
            reverse=True,
        )[:limit]

        return [
            PeribahasaSummary.model_construct(**row.__dict__)
            for row in ordered
        ]

    def _similarity_score(self, query: str, phrase: str) -> float:
        query_norm = query.lower().strip()
        phrase_norm = phrase.lower().strip()
        direct = SequenceMatcher(None, query_norm, phrase_norm).ratio()
        token_scores = [
            SequenceMatcher(None, query_norm, token).ratio()
            for token in phrase_norm.split()
        ]
        contains_bonus = 0.2 if query_norm in phrase_norm else 0
        return max([direct, *token_scores], default=0) + contains_bonus
