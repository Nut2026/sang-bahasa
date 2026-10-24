# ============================================================
# Sang Bahasa Slug Generator
# Converts a Malay phrase into a clean URL slug.
# ============================================================

import re
from unidecode import unidecode


def generate_slug(phrase: str) -> str:
    """
    Convert a phrase into a URL-safe slug.

    Steps:
    1. Transliterate unicode characters (handles accents, etc.)
    2. Lowercase
    3. Replace non-alphanumeric characters with hyphens
    4. Collapse consecutive hyphens
    5. Strip leading/trailing hyphens

    Examples:
        "Alah bisa, tegal biasa" > "alah-bisa-tegal-biasa"
        "Biar putih tulang, jangan putih mata" > "biar-putih-tulang-jangan-putih-mata"
    """
    if not phrase:
        return ""

    # Transliterate to ASCII
    slug = unidecode(phrase)

    # Lowercase
    slug = slug.lower()

    # Replace anything that isn't a letter, digit, or hyphen with a hyphen
    slug = re.sub(r"[^a-z0-9]+", "-", slug)

    # Collapse multiple hyphens
    slug = re.sub(r"-{2,}", "-", slug)

    # Strip leading/trailing hyphens
    slug = slug.strip("-")

    return slug