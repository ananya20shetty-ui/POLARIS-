# POLARIS-Ω REST API Documentation

**Base URL:** `/api/v1`  
**OpenAPI Spec:** `GET /api/v1/openapi.json`  
**Interactive Swagger UI:** `GET /api/v1/docs`

---

## 1. Authentication & RBAC

### `POST /auth/register`
Creates a new user profile with role-based permissions (`STUDENT`, `RESEARCHER`).
- **Request Body:** `{ email, password, full_name, role, institution }`
- **Response:** `{ access_token, role, user_id, full_name }`

### `POST /auth/login`
Authenticates user and generates stateless Bearer JWT.
- **Request Body:** `{ email, password }`
- **Response:** `{ access_token, role, user_id, full_name }`

### `GET /auth/me`
Retrieves authenticated user profile. Requires `Authorization: Bearer <token>`.

---

## 2. Scientific Repository & Documents

### `GET /documents`
Faceted retrieval of indexed polar research documents.
- **Query Parameters:**
  - `domain` (e.g. `Cryospheric Sciences`, `Glaciology`, `Oceanography`)
  - `location` (e.g. `Maitri`, `Weddell Sea`, `Kongsfjorden`)
  - `year` (e.g. `2023`)
  - `source_type` (`OFFICIAL`, `OPEN_ACCESS`, `USER_UPLOADED`)
  - `search` (Keyword search query)

### `GET /documents/{id}`
Returns complete document record with metadata, citations, SHA-256 hash, and extracted claims.

### `POST /documents`
Multipart file upload with asynchronous document intelligence triggering.
- **Form Data:** `title`, `research_domain`, `document_type`, `authors`, `abstract`, `location_name`, `year`, `methodology`, `file`

---

## 3. Claim & Evidence Intelligence

### `GET /claims`
Lists sentence-grounded claims with source pages, confidence ratings, and direction filters (`DECREASE`, `INCREASE`, `STABLE`, `CYCLIC`).

### `GET /evidence/lineage/{claim_id}`
Returns the complete 6-level provenance lineage chain:
`QUESTION -> CLAIM -> PAPER -> DATASET -> EXPEDITION -> PROVENANCE RECORD`

---

## 4. Evidence Comparison & Stress-Test Engine

### `POST /comparisons`
Evaluates multi-variable contextual compatibility between any two claims.
- **Request Body:** `{ claim_a_id, claim_b_id }`
- **Response:** `{ id, title, potential_disagreement, location_match, period_match, season_match, method_match, polaris_heuristic_score, contextual_explanation }`

### `POST /stress-test` ⭐ (Signature Feature)
Executes contextual sensitivity analysis with interactive simulation overrides.
- **Request Body:** `{ comparison_id, override_location, override_period, override_season, override_method }`
- **Response:**
  - `variable_sensitivities`: Array of weighted influence spectrums (Location, Period, Season, Method).
  - `dominant_influential_variable`: Contextual factor with highest explanatory leverage.
  - `explanation`: Contextual simulation breakdown.
  - `evidence_gap_description`: Formulation of missing empirical observations.
  - `recommended_dataset_code`: Matching NCPOR/MoES repository dataset.

---

## 5. Temporal Research & Question Tracker

### `GET /temporal/timeline?topic=Antarctic+sea+ice`
Returns decadal timeline events and the four-state Evidence Landscape:
- `Supporting`
- `Contrasting`
- `Uncertain`
- `Insufficient evidence`

### `GET /research-questions` & `GET /research-questions/{slug}`
Returns active living scientific questions with attached claims and sub-hypotheses.

---

## 6. Quantitative Benchmarks & Admin

### `GET /evaluations/metrics`
Executes and returns real quantitative AI evaluation benchmarks (Precision, Recall, F1, MRR, Direction Accuracy).

### `GET /admin/analytics`
Returns live database counts, system health, and verification rates.
