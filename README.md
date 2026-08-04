# Runtime

Runtime besteht aus einem React-Frontend, einem Spring-Boot-Backend und einer
PostgreSQL-Datenbank.

## Voraussetzungen

- Node.js 24 mit npm
- Java 25
- Docker mit Docker Compose
- Git

## Schnellstart

Lokale Konfiguration und PostgreSQL vorbereiten:

```bash
cp .env.example .env
docker compose up -d postgres
```

Backend in einem Terminal starten:

```bash
cd backend
set -a
source ../.env
set +a
sh ./mvnw spring-boot:run
```

Frontend in einem zweiten Terminal starten:

```bash
cd frontend
cp .env.example .env
npm ci
npm run dev
```

Danach sind die Anwendungen unter folgenden Adressen erreichbar:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:8080>
- Test-Endpunkt: <http://localhost:8080/api/hello>

## Weitere Dokumentation

- [Frontend einrichten, testen und bauen](frontend/README.md)
- [Backend und Datenbank einrichten und testen](backend/README.md)

Bei Pull Requests und Pushes auf `main` prüft GitHub Actions Frontend und
Backend automatisch.
