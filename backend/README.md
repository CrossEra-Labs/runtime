# Runtime Backend

Das Backend ist eine Spring-Boot-Anwendung mit Java 25, Maven, Spring Web,
Spring Security, Spring Data JPA und PostgreSQL.

## Voraussetzungen

- Java 25
- Docker mit Docker Compose
- Git

Eine separate Maven-Installation ist nicht notwendig, da der Maven Wrapper im
Repository enthalten ist.

## PostgreSQL vorbereiten

Im Stammverzeichnis des Projekts die lokale Konfiguration anlegen und die
Datenbank starten:

```bash
cp .env.example .env
docker compose up -d postgres
```

Prüfen, ob der Container bereit ist:

```bash
docker compose ps
```

Die Datei `.env` enthält lokale Zugangsdaten und wird nicht eingecheckt.

## Backend starten

In das Backend-Verzeichnis wechseln und die Variablen aus der Root-`.env`
laden:

```bash
cd backend
set -a
source ../.env
set +a
sh ./mvnw spring-boot:run
```

Das Backend läuft anschließend unter <http://localhost:8080>. Der öffentliche
Test-Endpunkt ist unter <http://localhost:8080/api/hello> erreichbar.

## Tests und Qualitätsprüfungen

Die Backend-Tests benötigen eine laufende PostgreSQL-Datenbank und die oben
geladenen Umgebungsvariablen.

Tests ausführen:

```bash
sh ./mvnw test
```

Formatierung prüfen:

```bash
sh ./mvnw spotless:check
```

Formatierung automatisch korrigieren:

```bash
sh ./mvnw spotless:apply
```

Die vollständige lokale CI-Prüfung ausführen:

```bash
sh ./mvnw --batch-mode --no-transfer-progress spotless:check verify
```

GitHub Actions startet für die Backend-Prüfung automatisch eine isolierte
PostgreSQL-Instanz.

## Konfiguration

Das Backend unterstützt folgende Umgebungsvariablen:

| Variable | Standardwert | Bedeutung |
| --- | --- | --- |
| `DB_HOST` | `localhost` | Hostname der PostgreSQL-Datenbank |
| `DB_PORT` | `5432` | Port der PostgreSQL-Datenbank |
| `DB_NAME` | `runtime` | Datenbankname |
| `DB_USER` | `runtime` | Datenbankbenutzer |
| `DB_PASSWORD` | `runtime` | Datenbankpasswort |
| `FRONTEND_URL` | `http://localhost:5173` | erlaubter CORS-Origin |
| `SPRING_SECURITY_USER_NAME` | von Spring erzeugt | Benutzer für HTTP Basic Auth |
| `SPRING_SECURITY_USER_PASSWORD` | von Spring erzeugt | Passwort für HTTP Basic Auth |

`GET /api/hello` ist ohne Anmeldung erreichbar. Andere Endpunkte benötigen
standardmäßig HTTP Basic Auth.

## Datenbank stoppen

Im Stammverzeichnis des Projekts:

```bash
docker compose down
```

Mit `docker compose down -v` wird zusätzlich das lokale Datenbank-Volume mit
allen Daten gelöscht.
