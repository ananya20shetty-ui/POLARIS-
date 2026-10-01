# POLARIS-Ω: Production & Development Deployment Guide

## 1. Local Development Quickstart

### Step 1: Start Backend API & Database
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*API Swagger documentation will be available at: http://127.0.0.1:8000/api/v1/docs*

### Step 2: Start Frontend UI
```bash
cd frontend
npm install
npm run dev
```
*Frontend will be accessible at: http://localhost:3000*

---

## 2. Docker Compose Production Deployment

```bash
docker-compose up -d --build
```
This launches:
- `polaris-db`: PostgreSQL 16 with pgvector extension
- `polaris-backend`: FastAPI application server with async worker queue
- `polaris-frontend`: Nginx serving optimized React / TypeScript production bundle

---

## 3. Seed Credentials for Evaluators
- **Director (Admin):** `admin@polaris.moes.gov.in` / `admin123`
- **Senior Reviewer:** `reviewer@ncpor.res.in` / `reviewer123`
- **Researcher:** `researcher@ncpor.res.in` / `researcher123`
- **Student Fellow:** `student@iit.ac.in` / `student123`
