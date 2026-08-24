# Agent instructions

## Repository layout

- `frontend/` is the React/TypeScript/Vite app. Its entrypoint is `src/main.tsx`; feature code belongs under `src/features/`.
- `backend/` is the Java 25/Spring Boot app. `HelloController` currently exposes `GET /api/hello`; PostgreSQL is configured but no domain model exists yet.
- `compose.yml` runs the local PostgreSQL service. `compose.build.yml` builds the two container images; `compose.coolify.yml` is the production deployment definition.

## Local setup

- Copy the root `.env.example` to `.env` before starting the database or backend. The backend imports `.env` from either its working directory or the repository root.
- The frontend needs `frontend/.env` with `VITE_API_URL` (normally `http://localhost:8080`).
- This repository has no DDEV configuration. Do not invent one; use the documented Compose setup only when the user asks to run local services.

## Verification

- Frontend, from `frontend/`: `npm ci`, then `npm run lint`, `npm test`, and `npm run build`. Vitest uses `jsdom` and `src/test/setup.ts`.
- Backend, from `backend/`: with PostgreSQL running and DB environment variables loaded, run `sh ./mvnw --batch-mode --no-transfer-progress spotless:check verify`.
- A focused frontend test is `npm test -- src/features/hello/HelloWorld.test.tsx`. A focused backend test is `sh ./mvnw -Dtest=HelloControllerTest test`.
- CI runs frontend lint, test, build and backend Spotless plus tests. It also validates the Coolify Compose file and builds both images.

## Conventions and deployment

- Java formatting is Google Java Format via Spotless. The pre-commit hook runs `backend/mvnw spotless:apply` and re-stages changed Java files; do not bypass it or edit generated formatting manually.
- Frontend API calls use `ky` through `src/features/*/*Api.ts` and server state uses TanStack Query hooks. Keep feature-specific components, types, API functions, and hooks together.
- `/api/hello` and backend readiness health endpoints are public; other backend routes require HTTP Basic Auth. CORS allows only `FRONTEND_URL` and currently permits GET requests.
- Production exposes only the frontend. Nginx proxies `/api/` to the internal `backend` service, and PostgreSQL must remain internal with its persistent `postgres_data` volume.
- Pushes to `main` publish both images to GHCR using the commit SHA and trigger Coolify deployment through GitHub Actions. Never put production credentials in the repository or `.env` files committed to Git.
