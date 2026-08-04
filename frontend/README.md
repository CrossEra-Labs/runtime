# Runtime Frontend

Das Frontend ist eine React-Anwendung mit TypeScript, Vite, Material UI und
TanStack Query. Es ruft die REST-API des Backends auf.

## Voraussetzungen

- Node.js 24
- npm (wird zusammen mit Node.js installiert)
- ein laufendes Backend auf Port `8080`

## Einrichtung

Im Verzeichnis `frontend` die Umgebungsdatei anlegen und die Abhängigkeiten
installieren:

```bash
cp .env.example .env
npm ci
```

Die Variable `VITE_API_URL` legt die Adresse des Backends fest. Für die lokale
Entwicklung ist bereits folgender Wert vorbereitet:

```env
VITE_API_URL=http://localhost:8080
```

## Entwicklungsserver starten

```bash
npm run dev
```

Das Frontend ist anschließend unter <http://localhost:5173> erreichbar.

## Tests und Qualitätsprüfungen

Alle Unit-Tests einmalig ausführen:

```bash
npm test
```

Linting ausführen:

```bash
npm run lint
```

Einen Produktions-Build erstellen:

```bash
npm run build
```

Vor einem Push sollten alle drei Befehle erfolgreich durchlaufen. GitHub
Actions führt dieselben Prüfungen bei Pull Requests und Pushes auf `main` aus.

## Wichtige Verzeichnisse

- `src/features`: fachlich zusammengehörige Komponenten, Hooks und API-Aufrufe
- `src/test`: gemeinsames Setup für Vitest und Testing Library
- `dist`: erzeugter Produktions-Build, wird nicht eingecheckt
