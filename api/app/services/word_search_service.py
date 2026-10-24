# ============================================================
# Sang Bahasa Generic Word Service
# Supports all word types
# ============================================================

from difflib import SequenceMatcher
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.core.settings import get_settings
from app.repositories.word_repo import WordRepository
from app.schemas.peribahasa import PeribahasaSummary, SearchResult

logger = get_logger(__name__)
settings = get_settings()


class WordSearchService:
    """Generic search service for all word types."""

    WORD_TYPE_LABELS = {
        "peribahasa": "Peribahasa",
        "simpulan-bahasa": "Simpulan Bahasa",
        "bahasa-klasik": "Bahasa Klasik",
    }

    def __init__(self, db: AsyncSession, word_type: str = "peribahasa"):
        self.repo = WordRepository(db, word_type)
        self.word_type = word_type

    def _format_label(self, value: str) -> str:
        if not value:
            return ""
        return value.replace("_", " ").title()

    def _normalize_tags(self, category: Optional[str] = None) -> List[str]:
        word_type_label = self.WORD_TYPE_LABELS.get(self.word_type, self._format_label(self.word_type))
        category_label = self._format_label(category or "lain_lain")
        return [word_type_label, category_label]

    def _build_summary(self, row: any) -> PeribahasaSummary:
        summary = PeribahasaSummary.model_construct(**row.__dict__)
        summary.tags = self._normalize_tags(summary.category)
        summary.word_type = self.word_type
        return summary

    async def search(
        self,
        query: str,
        category: Optional[str] = None,
        tags: Optional[List[str]] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> SearchResult:
        """Search across the word type."""
        query_clean = (query or "").strip()

        if not query_clean:
            return SearchResult(
                query="",
                total=0,
                page=page,
                page_size=page_size,
                results=[],
                word_type=self.word_type,
            )

        results, total = await self.repo.search(
            query=query_clean,
            category=category,
            tags=tags,
            page=page,
            page_size=page_size,
        )

        return SearchResult(
            query=query_clean,
            total=total,
            page=page,
            page_size=page_size,
            results=[
                self._build_summary(row)
                for row in results
            ],
            word_type=self.word_type,
        )

    async def get_all(
        self,
        category: Optional[str] = None,
        tags: Optional[List[str]] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> SearchResult:
        """Get all entries with optional filtering."""
        # Handle "all" word type by fetching from all word types and combining
        if self.word_type == "all":
            all_results = []
            all_totals = 0
            
            for wt in ["peribahasa", "simpulan-bahasa", "bahasa-klasik"]:
                repo = WordRepository(self.repo.db, wt)
                results, total = await repo.get_all(
                    category=category,
                    tags=tags,
                    page=1,  # Get all for combining
                    page_size=10000,  # Large number to get all
                )
                all_totals += total
                all_results.extend([
                    PeribahasaSummary.model_construct(**row.__dict__, word_type=wt)
                    for row in results
                ])
            
            # Sort alphabetically by phrase
            all_results.sort(key=lambda x: x.phrase.lower())
            
            # Apply pagination
            start_idx = (page - 1) * page_size
            end_idx = start_idx + page_size
            paginated_results = all_results[start_idx:end_idx]
            
            return SearchResult(
                query="",
                total=all_totals,
                page=page,
                page_size=page_size,
                results=paginated_results,
                word_type=self.word_type,
            )
        
        # Handle specific word types
        results, total = await self.repo.get_all(
            category=category,
            tags=tags,
            page=page,
            page_size=page_size,
        )

        return SearchResult(
            query="",
            total=total,
            page=page,
            page_size=page_size,
            results=[self._build_summary(row) for row in results],
            word_type=self.word_type,
        )

    async def _log_search_safe(self, query: str, total: int) -> None:
        """Safely log search query."""
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
        """Get quick suggestions."""
        query_clean = (query or "").strip()

        if not query_clean:
            return []

        if self.word_type == "all":
            all_results = []
            # Fetch more results per word type to ensure we have enough
            fetch_limit = max(limit, 20)
            for wt in ["peribahasa", "simpulan-bahasa", "bahasa-klasik"]:
                repo = WordRepository(self.repo.db, wt)
                results = await repo.get_suggestions(query=query_clean, limit=fetch_limit)
                all_results.extend([
                    PeribahasaSummary.model_construct(**row.__dict__, word_type=wt)
                    for row in results
                ])
            # Sort by relevance or something, but for now just take top limit
            return all_results[:limit]
        else:
            results = await self.repo.get_suggestions(query=query_clean, limit=limit)
            return [
                PeribahasaSummary.model_construct(**row.__dict__, word_type=self.word_type)
                for row in results
            ]

    async def get_similar(
        self,
        query: str,
        limit: int = 5,
    ) -> List[PeribahasaSummary]:
        """Get similar entries."""
        query_clean = (query or "").strip()

        if not query_clean:
            return []

        if self.word_type == "all":
            # Search across all word types
            all_similar = []
            for wt in ["peribahasa", "simpulan-bahasa", "bahasa-klasik"]:
                repo = WordRepository(self.repo.db, wt)
                similar = await repo.search_similar(query=query_clean, limit=limit)
                all_similar.extend([
                    PeribahasaSummary.model_construct(**row.__dict__, word_type=wt)
                    for row in similar
                ])
            
            # If we don't have enough results, search all entries for each word type
            if len(all_similar) < limit:
                for wt in ["peribahasa", "simpulan-bahasa", "bahasa-klasik"]:
                    repo = WordRepository(self.repo.db, wt)
                    for item in await repo.get_all_published_summaries():
                        score = self._similarity_score(query_clean, item.phrase)
                        if score >= 0.34:
                            # Check if already in results
                            if not any(s.slug == item.slug for s in all_similar):
                                all_similar.append(
                                    PeribahasaSummary.model_construct(**item.__dict__, word_type=wt)
                                )
            
            # Sort by similarity score
            all_similar.sort(
                key=lambda item: self._similarity_score(query_clean, item.phrase),
                reverse=True,
            )
            return all_similar[:limit]
        else:
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
        """Calculate similarity score between query and phrase."""
        query_norm = query.lower().strip()
        phrase_norm = phrase.lower().strip()
        direct = SequenceMatcher(None, query_norm, phrase_norm).ratio()
        token_scores = [
            SequenceMatcher(None, query_norm, token).ratio()
            for token in phrase_norm.split()
        ]
        contains_bonus = 0.2 if query_norm in phrase_norm else 0
        return max([direct, *token_scores], default=0) + contains_bonus
