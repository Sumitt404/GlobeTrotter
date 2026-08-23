# GlobeTrotter Backend

FastAPI + PostgreSQL + SQLAlchemy 2.x backend for the GlobeTrotter travel-planning frontend. The source requirements prioritize AI itinerary generation, itinerary CRUD, and dynamic budget calculation.

## Quick start with Docker

```bash
docker compose up --build
```

In another terminal, run migrations and seed data inside the backend container:

```bash
docker compose exec backend alembic upgrade head
docker compose exec backend python -m seed.seed_data
```

API: http://localhost:8000
Swagger: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc

## Local

1. Start PostgreSQL.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`.
3. `python -m venv .venv && .venv\Scripts\activate` on Windows or `source .venv/bin/activate` on Linux/macOS.
4. `pip install -r requirements.txt`
5. `alembic upgrade head`
6. `python -m seed.seed_data`
7. `uvicorn app.main:app --reload --port 8000`

## Frontend

Set the frontend `.env` to:

```text
VITE_API_URL=http://localhost:8000/api
```

## Notes

- Production database schema is migration-driven; startup does not auto-create tables.
- JWT-protected routes enforce trip ownership.
- Public trip responses exclude private user data.
