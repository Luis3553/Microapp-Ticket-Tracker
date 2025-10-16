# 🧩 Microapp – Issue Tracker

Microapp is a lightweight **issue tracking** app built with **NestJS + Drizzle ORM + PostgreSQL** on the backend and **React + Vite + TanStack Query + shadcn/ui** on the frontend. Everything runs in **Docker Compose**.

---

## 🚀 Quickstart (Docker)

```bash
git clone https://github.com/Luis3553/Microapp-Issue-Tracker.git
cd Microapp-Issue-Tracker
cp .db.env.example .db.env && cp api/.env.example api/.env && cp web/.env.example web/.env
docker compose up --build -d
cd api && npx drizzle-kit push && cd ..
docker compose run --rm api node dist/src/db/seed.js
```

-   Frontend: http://localhost:3000
-   API: http://localhost:5172
-   Postgres (host): localhost:5432 (inside Docker network: `db:5432`)

Note: The API container listens on port 3000. Compose maps host `5172 -> 3000`. If your `api/.env` sets `PORT=5172` (for local dev), unset it or set `PORT=3000` when running in Docker.

---

## 🧱 Stack

-   **Backend**: NestJS, Drizzle ORM, PostgreSQL 16
-   **Frontend**: React, Vite, Tailwind, shadcn/ui, TanStack Query
-   **Auth**: JWT access token + HttpOnly refresh cookie
-   **Infra**: Docker, docker-compose

---

## 📂 Monorepo Structure

```
/api        # NestJS backend (Drizzle + Auth + REST)
/web        # React frontend (Vite + TS + shadcn/ui)
/docker-compose.yml
```

_(Database volume is managed by Docker as `db_data`.)_

---

## ⚙️ Environment Variables

Create these files (examples below are included in the repo):

### `.db.env.example`

```env
POSTGRES_DB=microapp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

### `api/.env.example` (local dev)

```env
# Postgres (local host)
DATABASE_URL=postgres://postgres:postgres@localhost:5432/microapp

# JWT
JWT_SECRET=replace_me_access
JWT_REFRESH_SECRET=replace_me_refresh
JWT_EXPIRE_IN=15m
JWT_REFRESH_EXPIRE_IN=7d

# Note: CORS origin and cookie options are configured in code
#  - CORS origin: api/src/main.ts
#  - Refresh cookie options: api/src/auth/config/cookieOpts.ts
```

### `web/.env.example`

```env
# Used by Vite at build time
VITE_API_URL=http://localhost:5172
```

---

## 🐳 Run with Docker

```bash
# Build and start all services
docker compose up --build -d

# Apply DB migrations (run from host; the container runtime image doesn’t include drizzle.config.ts)
cd api && npx drizzle-kit push && cd ..

# Seed initial data (admin/user, project, issues, labels, comments, events)
docker compose run --rm api node dist/src/db/seed.js

# View logs
docker compose logs -f api
docker compose logs -f web
docker compose logs -f db
```

---

## 🧪 Local Development (without full Docker)

You can run only Postgres in Docker and run apps locally:

```bash
# Start only the DB in Docker
docker compose up -d db
```

**Backend**

```bash
cd api
npm install
# ensure api/.env has DATABASE_URL pointing to localhost
npx drizzle-kit push
npm run start:dev
```

**Frontend**

```bash
cd web
npm install
npm run dev
# opens http://localhost:3000 (Vite)
```

---

## 🔐 Auth Flow

-   **Access Token**: Bearer token (kept in memory on the client).
-   **Refresh Token**: HttpOnly cookie (same-site in dev, secure+same-site in prod).
-   Endpoints:
    -   `POST /auth/register`
    -   `POST /auth/login`
    -   `POST /auth/refresh`
    -   `POST /auth/logout`
    -   `GET /auth/me`

---

## 🌱 Seeding

Seeder is a standalone script that uses Drizzle directly (not a Nest provider).

-   Entry file: `src/db/seed.ts`
-   Run:

```bash
# In Docker (uses compiled JS inside the container)
docker compose run --rm api node dist/src/db/seed.js

# Locally (uses ts-node)
cd api && npm run seed
```

Creates:

-   2 users (admin + user)
-   1 project (`MICRO`)
-   2 labels (`bug`, `feature`)
-   2 issues (linked to labels)
-   Comments & an event (status change)

---

## 🗃️ Drizzle Migrations (Backend)

Use Drizzle CLI directly:

```bash
# Generate a migration from schema changes
npx drizzle-kit generate

# Apply migrations to the database
npx drizzle-kit push
```

---

## 📜 Scripts

**Backend (`/api`)**

-   `start:dev` - Nest watch mode
-   `seed` - Seed DB locally (`src/db/seed.ts`)
    -   For Docker, run `node dist/src/db/seed.js` in the container

**Frontend (`/web`)**

-   `dev` - Vite dev server
-   `build` - Production build
-   `serve` - Preview production build

---

## 🧩 Features

-   Users & roles (`user`, `admin`)
-   Projects (`key`, `name`, `description`)
-   Issues (status, priority, reporter, assignee)
-   Labels (many-to-many with issues)
-   Comments
-   Events (status changes with metadata)

---

## 🚢 Production Notes

-   Use strong secrets for JWT and cookies.
-   Serve behind HTTPS (Nginx/Traefik).
-   Set refresh cookie to `secure` and appropriate `sameSite` in `api/src/auth/config/cookieOpts.ts` for production.
-   Configure CORS `origin` to your real frontend domain.
-   Build frontend with correct `VITE_API_URL` at build time.

---

## 🧯 Troubleshooting

-   **API can’t connect to DB in Docker**  
    Ensure `DATABASE_URL` inside containers uses `@db`, not `@localhost`.
-   **CORS errors**  
    CORS origin is configured in `api/src/main.ts`. Default is `http://localhost:3000`.
-   **Refresh cookie not set**  
    Cookie name is `rt` at path `/auth/refresh`. Use the same host & scheme (HTTP in dev). Check `SameSite` and `Secure` flags in `api/src/auth/config/cookieOpts.ts`.

---

## 📄 License

MIT © 2025
