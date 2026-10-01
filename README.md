# POLARIS-Ω: Polar Research Intelligence & Scientific Evidence System

**Smart India Hackathon 2026 — Problem Statement SIH26063**  
*Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal*  
*Organization:* **Ministry of Earth Sciences (MoES)**  
*Department:* **National Centre for Polar and Ocean Research (NCPOR)**  
*Category:* **Software**  
*Theme:* **Smart Education**

> 🎬 **Platform Demo Video:** [`polaris_walkthrough_demo.mp4`](./polaris_walkthrough_demo.mp4)  
> A full feature walkthrough (1280×720, ~17 MB) showcasing all 10 platform modules.

---


## 🎥 Walkthrough Video Demo

A comprehensive, high-definition feature walkthrough video has been compiled and is included directly in the root project directory:

- **Video File:** [`polaris_walkthrough_demo.mp4`](./polaris_walkthrough_demo.mp4)
- **Resolution:** 1280 × 720 (HD @ 30 FPS)
- **Video Generator Script:** [`scripts/generate_walkthrough_video.py`](./scripts/generate_walkthrough_video.py)

```bash
# Play or preview the video using your default media player
start polaris_walkthrough_demo.mp4
```

---

## 🌌 Executive Summary & Vision

> **"From Static Polar Archives to a Living Scientific Evidence Layer."**

Traditional repositories merely allow researchers to search and download PDF documents. **POLARIS-Ω** transforms 40+ years of Indian polar expedition history (1981–2026) across **Antarctica, the Arctic, and the Himalayas (Third Pole)** into a queryable, connected, and mathematically verifiable **Scientific Evidence Intelligence System**.

```
  [FIND] ──► [UNDERSTAND] ──► [CONNECT] ──► [COMPARE] ──► [TRACE] ──► [QUESTION] ──► [DISCOVER]
     │              │               │             │            │             │              │
  Faceted      Extracted Claims   Evidence    Stress-Test    W3C PROV    Unresolved     Historical
  Metadata      & Variables        Graphs     Sensitivity    SHA-256      Questions     Rediscovery
```

---

## 🧭 Comprehensive Feature Walkthrough

### 1. 🛰️ Live Polar Command & Telemetry Hub
- **Real-Time Station Monitoring**: Live weather, atmospheric pressure, ice drift, and temperature monitoring across:
  - **Bharati Station** (Larsemann Hills, East Antarctica — 69°24'S, 76°11'E)
  - **Maitri Station** (Schirmacher Oasis, Antarctica — 70°46'S, 11°44'E)
  - **Himadri Station** (Ny-Ålesund, Svalbard, Arctic — 78°55'N, 11°56'E)
  - **IndARC Observatory** (Kongsfjorden Moored Underwater Array — 200m depth)
  - **Himansh Observatory** (Chandra Basin, Western Himalaya — 4,000m ASL)
- **High-Impact Metrics Bar**: Total processed claims, active expeditions, cryptographic validation rate (100%), and model disagreement F1 scores.

### 2. 📚 Cryptographic Knowledge Repository & Vault
- **FAIR Data Compliance**: Findable, Accessible, Interoperable, Reusable scientific assets.
- **Cryptographic SHA-256 Ledger**: Every expedition report, raw sensor reading, and ice-core borehole log is verified against a tamper-evident hash.
- **Faceted Multi-Dimensional Filtering**: Search by domain (*Glaciology, Oceanography, Atmospheric Sciences, Space Weather, Marine Biology*), geographical region, time bounds (1981–present), and expedition index (ISEA-01 through ISEA-43).

### 3. 🔬 AI-Powered Scientific Claim & Evidence Extraction
- **Granular Claim Parsing**: Deconstructs dense academic publications into structured semantic triples:
  - **Subject Variable**: e.g., *Antarctic Sea Ice Extent, Kongsfjorden Atlantic Water Temperature, Mass Balance of Bara Shigri Glacier*.
  - **Directionality**: `INCREASING`, `DECREASING`, `STABLE`, or `COMPLEX / NON-LINEAR`.
  - **Context Variables**: Latitude/Longitude bounding box, depth, seasonal window, elevation, and instrument calibration.
- **W3C PROV Lineage**: Interactive evidence graph tracing every claim back to primary source chunks and raw measurement datasets.

### 4. ⭐ The Signature Innovation: Evidence Stress-Test Engine
Instead of merely declaring that two peer-reviewed publications "disagree," the **POLARIS-Ω Stress-Test Simulator** executes counterfactual perturbations to determine:
1. **Contextual Sensitivity Attribution**: Computes variance contribution across 4 dimensions:
   - **Location / Spatial Bounds** (e.g., Prydz Bay vs. Weddell Sea)
   - **Observation Season** (e.g., Austral Summer vs. Austral Winter)
   - **Baseline Time Period** (e.g., 1981–2000 vs. 2001–2023)
   - **Measurement Methodology** (e.g., CryoSat-2 Altimetry vs. Mooring Hydrography)
2. **Evidence Gap Identification**: Pinpoints missing observational variables causing divergence.
3. **Automated Archive Resolution**: Scans the existing NCPOR database for historical datasets that can reconcile the scientific dispute.

### 5. 🗺️ 3D Geospatial Map Explorer
- **Interactive Polar Station Coordinates**: Explores India's polar research presence in both polar hemispheres and high-altitude Himalayan stations.
- **Expedition Route Visualizer**: Traverses across East Antarctic ice sheet traverses (320 km) and marine research cruises (ORV Sagar Kanya / RV Kronprins Haakon).

### 6. ⏳ Temporal Climate Evolution & Historical Rediscovery
- **Four Decades of Indian Polar Science**: Chronological timeline of milestones from India's first Antarctic expedition (1981 led by Dr. S.Z. Qasim) to modern satellite constellations.
- **Historical Rediscovery Matrix**: Cross-references forgotten 1980s paper logs with modern satellite altimetry (ICESat-2, Sentinel-3, CryoSat-2) to establish 40-year baseline trends.

### 7. 📡 Automated Outreach & Multi-Channel Media Dissemination
- **Multi-Platform Content Generator**: Generates outreach communications:
  - **X (Twitter)**: Concise, character-counted summaries with scientific hashtags.
  - **LinkedIn**: Long-form expedition highlights and research milestone briefs.
  - **Instagram**: Visual storytelling narratives focused on Aurora Australis, glacier traverses, and wildlife.
  - **MoES Press Releases**: Formal institutional announcements with quote templates and media contacts.
- **Interactive Polar Media Vault**: High-resolution photography, drone footage, and audio logs.

### 8. 🎓 Smart Education: Interactive Polar Learning Hub
- **Curated Learning Paths**:
  - *Path 1: Antarctic Glaciology & Ice Sheet Dynamics*
  - *Path 2: Arctic Oceanography & IndARC Moored Systems*
  - *Path 3: Paleoclimatology & Ice Core Proxies*
  - *Path 4: Himalayan Cryosphere & Water Security*
- **Gamified Knowledge Verification**: Self-paced modules with interactive quizzes, score calculations, and certificates of completion.

### 9. 🛡️ Administrative Command & RBAC Governance
- **Role-Based Access Control (RBAC)**: Distinct permissions for `ADMIN`, `REVIEWER`, `RESEARCHER`, and `STUDENT`.
- **Peer-Review Workflow**: Reviewer dashboard for validating newly uploaded expedition reports and claim extractions.
- **Immutable Audit Trail**: Logs all system events, moderation actions, and dataset approvals with UTC timestamps.

---

## 🏗️ System Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PRESENTATION LAYER                     │
│  React 18  •  TypeScript  •  Vite  •  Tailwind CSS  •  Lucide Icons    │
│  Port: 3000  (with automatic reverse proxy to Backend API)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST / WebSocket
┌───────────────────────────────────▼────────────────────────────────────┐
│                         BACKEND APPLICATION LAYER                      │
│  FastAPI  •  Python 3.14  •  SQLAlchemy 2.0 Async  •  Pydantic v2      │
│  JWT Security  •  W3C PROV Engine  •  Stress-Testing Simulation Engine │
│  Port: 8080  (Interactive Docs at /api/v1/docs)                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                         PERSISTENCE & STORAGE                          │
│  SQLite (Async aiosqlite) / PostgreSQL 16 + pgvector                   │
│  SHA-256 Storage Vault  •  Inverted & Semantic Embedding Indices       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quickstart & Running Locally

### Prerequisites
- **Python**: 3.10+ (tested on Python 3.14)
- **Node.js**: v18+ (tested on Node v22 / Vite 8)

### 1. Launch FastAPI Backend Service
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server on port 8080
uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload
```
*API docs available at:* `http://127.0.0.1:8080/api/v1/docs`

### 2. Launch Vite React Frontend
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend interface available at:* `http://localhost:3000`

---

## 🧪 Testing & Verification

### Run Backend API Test Suite
```bash
cd backend
python -m pytest tests/test_api.py -v
```

### Run Frontend Production Build Check
```bash
cd frontend
npm run build
```

---

## 🔑 Pre-Seeded Evaluator Accounts

| Role | Email | Password | Scope of Access |
| :--- | :--- | :--- | :--- |
| **Director / Admin** | `admin@polaris.moes.gov.in` | `admin123` | Full administrative control, system telemetry, audit trail & user moderation |
| **Senior Reviewer** | `reviewer@ncpor.res.in` | `reviewer123` | Scientific claim verification, evidence audit & dispute review |
| **Cryosphere Researcher** | `researcher@ncpor.res.in` | `researcher123` | Expedition upload, dataset registration & claim extraction |
| **Student / Public** | `student@iit.ac.in` | `student123` | Educational learning hub, quizzes, search & media dissemination |

---

## 📚 Technical Documentation Suite

For deeper architectural details, please refer to the documents in the [`docs/`](./docs/) folder:

- **[System Architecture & Data Flows](docs/ARCHITECTURE.md)**
- **[Complete REST API Reference](docs/API.md)**
- **[AI Intelligence & Extraction Pipeline](docs/AI_PIPELINE.md)**
- **[Security, Provenance & RBAC Matrix](docs/SECURITY.md)**
- **[Quantitative Benchmark Evaluation](docs/EVALUATION.md)**
- **[Containerized Deployment Guide](docs/DEPLOYMENT.md)**

---

*Developed for Smart India Hackathon 2026 (SIH26063) — Ministry of Earth Sciences (MoES) & National Centre for Polar and Ocean Research (NCPOR).*
#   P O L A R I S -  
 