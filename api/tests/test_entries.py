# ============================================================
# Sang Bahasa Entry Tests
# ============================================================

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_entries(client: AsyncClient):
    response = await client.get("/api/entries")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "items" in data
    assert isinstance(data["items"], list)


@pytest.mark.asyncio
async def test_get_entry_not_found(client: AsyncClient):
    response = await client.get("/api/entries/slug-yang-tidak-wujud")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_featured_entries(client: AsyncClient):
    response = await client.get("/api/entries/featured")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_random_entries(client: AsyncClient):
    response = await client.get("/api/entries/random")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_admin_create_requires_token(client: AsyncClient):
    response = await client.post(
        "/api/admin/entries",
        json={
            "phrase": "Test peribahasa",
            "meaning_ms": "Maksud ujian untuk peribahasa ini.",
            "category": "lain_lain",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_admin_create_with_wrong_token(client: AsyncClient):
    response = await client.post(
        "/api/admin/entries",
        headers={"X-Admin-Token": "wrong-token"},
        json={
            "phrase": "Test peribahasa",
            "meaning_ms": "Maksud ujian untuk peribahasa ini.",
            "category": "lain_lain",
        },
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data


@pytest.mark.asyncio
async def test_sitemap_endpoint(client: AsyncClient):
    response = await client.get("/api/sitemap")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
