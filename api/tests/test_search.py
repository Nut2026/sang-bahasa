# ============================================================
# Sang Bahasa Search Tests
# ============================================================

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_search_empty_query_rejected(client: AsyncClient):
    response = await client.get("/api/search", params={"q": ""})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_search_returns_result_structure(client: AsyncClient):
    response = await client.get("/api/search", params={"q": "alah bisa"})
    assert response.status_code == 200
    data = response.json()
    assert "query" in data
    assert "total" in data
    assert "results" in data
    assert isinstance(data["results"], list)


@pytest.mark.asyncio
async def test_search_no_results_returns_empty_list(client: AsyncClient):
    response = await client.get(
        "/api/search", params={"q": "xyzxyzxyz_tidak_wujud_langsung"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["results"] == []


@pytest.mark.asyncio
async def test_suggestions_endpoint(client: AsyncClient):
    response = await client.get("/api/search/suggestions", params={"q": "alah"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_search_pagination(client: AsyncClient):
    response = await client.get(
        "/api/search", params={"q": "bisa", "page": 1, "page_size": 5}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 1
    assert data["page_size"] == 5
    assert len(data["results"]) <= 5