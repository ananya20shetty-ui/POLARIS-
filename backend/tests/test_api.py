import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import engine, Base
from app.db.seed_data import seed_database

@pytest_asyncio.fixture(autouse=True, scope="module")
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_database()
    yield

@pytest.mark.asyncio
async def test_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "HEALTHY"
        assert "POLARIS-Ω" in data["service"]

@pytest.mark.asyncio
async def test_auth_and_rbac():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Login with seed admin
        login_res = await client.post("/api/v1/auth/login", json={
            "email": "admin@polaris.moes.gov.in",
            "password": "admin123"
        })
        assert login_res.status_code == 200
        token_data = login_res.json()
        assert "access_token" in token_data
        assert token_data["role"] == "ADMIN"
        token = token_data["access_token"]

        # Access protected me endpoint
        me_res = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert me_res.status_code == 200
        assert me_res.json()["email"] == "admin@polaris.moes.gov.in"

@pytest.mark.asyncio
async def test_documents_and_search():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        docs_res = await client.get("/api/v1/documents")
        assert docs_res.status_code == 200
        docs = docs_res.json()
        assert len(docs) >= 1

        search_res = await client.get("/api/v1/search/universal?q=sea ice")
        assert search_res.status_code == 200
        search_data = search_res.json()
        assert "results" in search_data
        assert len(search_data["results"]["documents"]) >= 1

@pytest.mark.asyncio
async def test_comparisons_and_stress_test():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Get claims
        claims_res = await client.get("/api/v1/claims")
        assert claims_res.status_code == 200
        claims = claims_res.json()
        assert len(claims) >= 2

        # Create comparison between first two claims
        comp_res = await client.post("/api/v1/comparisons", json={
            "claim_a_id": claims[0]["id"],
            "claim_b_id": claims[1]["id"]
        })
        assert comp_res.status_code == 200
        comp_data = comp_res.json()
        assert "polaris_heuristic_score" in comp_data

        # Run Stress Test on this comparison
        st_res = await client.post("/api/v1/stress-test", json={
            "comparison_id": comp_data["id"],
            "override_location": True
        })
        assert st_res.status_code == 200
        st_data = st_res.json()
        assert "dominant_influential_variable" in st_data
        assert "evidence_gap_description" in st_data

@pytest.mark.asyncio
async def test_evaluation_benchmarks():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        eval_res = await client.get("/api/v1/evaluations/metrics")
        assert eval_res.status_code == 200
        eval_data = eval_res.json()
        assert "benchmarks" in eval_data
        assert eval_data["benchmarks"]["claim_extraction"]["precision"] >= 0.5
