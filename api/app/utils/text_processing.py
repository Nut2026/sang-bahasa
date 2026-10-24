# ============================================================
# Sang Bahasa Text Processing Utilities
# ============================================================

import re
from typing import List


def normalise_query(query: str) -> str:
    """
    Normalise a search query for consistent processing.
    - Strips whitespace
    - Collapses multiple spaces
    - Lowercases
    """
    return re.sub(r"\s+", " ", query.strip().lower())


def extract_tags_from_text(text: str) -> List[str]:
    """
    Extract potential tags from free text.
    Splits on commas, semicolons, or whitespace.
    Returns cleaned, deduplicated lowercase tokens.
    """
    tokens = re.split(r"[,;\s]+", text.strip())
    seen = set()
    result = []
    for token in tokens:
        cleaned = token.strip().lower()
        if cleaned and cleaned not in seen:
            seen.add(cleaned)
            result.append(cleaned)
    return result


def truncate(text: str, max_length: int = 160, suffix: str = "...") -> str:
    """
    Truncate text to a maximum length, appending suffix if truncated.
    Tries to break at word boundary.
    """
    if len(text) <= max_length:
        return text
    truncated = text[: max_length - len(suffix)]
    last_space = truncated.rfind(" ")
    if last_space > 0:
        truncated = truncated[:last_space]
    return truncated + suffix


def generate_meta_description(
    meaning_ms: str,
    max_length: int = 155,
) -> str:
    """
    Auto-generate an SEO meta description from the Malay meaning.
    """
    return truncate(meaning_ms, max_length)


def generate_meta_title(phrase: str, suffix: str = "- Sang Bahasa") -> str:
    """
    Auto-generate an SEO meta title from the phrase.
    Caps at 60 characters before suffix.
    """
    max_phrase_len = 60 - len(suffix) - 1
    title_phrase = truncate(phrase, max_phrase_len, suffix="")
    return f"{title_phrase} {suffix}".strip()
