# runtime

## Frontend nach dem Checkout starten

Nach dem Checkout die Abhängigkeiten installieren und den Entwicklungsserver starten:

```bash
cd frontend
npm install
npm run dev
```

Das Frontend ist anschließend unter <http://localhost:5173> erreichbar.

## Postgres starten
`docker-compose.yml` öffnen und in IntelliJ auf den Play-Button
neben dem `postgres`-Service klicken (oder: `docker compose up -d postgres`).
