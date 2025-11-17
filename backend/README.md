# tm-score-backend (feature scaffold)

This directory contains the backend scaffold for the Terraforming Mars session management feature.

Quickstart (local development):

1. Install dependencies

```bash
cd backend
npm install
```

2. Start a local Postgres (see project quickstart)

3. Run in dev mode

```bash
npm run dev
```

API:

- GET /healthz -> { status: 'ok' }

Notes: This is an initial scaffold created for Phase 1 tasks (T001..T004). Add further services, Prisma schema and tests per plan.
