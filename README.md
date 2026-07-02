# University Result & Student Management Portal

Full-stack monorepo:

- `backend/`: Node.js + Express + MongoDB (JWT auth, results, notices, attendance, Excel uploads)
- `frontend/`: React + Tailwind (student/admin dashboards)

## Quick start (local)

### 1) Prereqs

- Node.js (LTS)
- MongoDB (local) or MongoDB Atlas connection string

### 2) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3) Frontend

```bash
cd frontend
npm install
npm run dev
```

## Docker (optional)

```bash
docker compose up --build
```

