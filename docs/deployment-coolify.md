# Deployment mit Coolify

Diese Anleitung beschreibt das Produktionsdeployment als eine Docker-Compose- Resource. Coolify veröffentlicht nur das
Frontend. Nginx leitet Anfragen unter
`/api/` intern an das Backend weiter; PostgreSQL bleibt ebenfalls intern.

## Voraussetzungen

- eine erreichbare Coolify-Instanz
- ein in Coolify eingebundener Server
- eine Domain mit Zugriff auf die DNS-Verwaltung
- Administratorzugriff auf das private GitHub-Repository

## 1. DNS konfigurieren

Beim DNS-Anbieter einen `A`-Record für die gewünschte Domain auf die IPv4- Adresse des Coolify-Servers setzen. Optional
kann zusätzlich ein `AAAA`-Record für IPv6 gesetzt werden.

Beispiel:

```text
app.example.com -> 203.0.113.10
```

Vor dem Deployment prüfen, ob die Domain bereits aufgelöst wird:

```bash
dig app.example.com
```

In den folgenden Schritten muss `app.example.com` durch die echte Domain ersetzt werden.

## 2. GitHub App in Coolify einrichten

1. In Coolify `Sources` öffnen und `Add` auswählen.
2. Die automatisierte Einrichtung einer GitHub App starten.
3. Bei GitHub ausschließlich Zugriff auf `CrossEra-Labs/runtime` erlauben.
4. Push-Events erlauben und die Einrichtung abschließen.
5. In Coolify prüfen, ob das Repository geladen werden kann.

## 3. Container-Images veröffentlichen

Nach dem Commit dieser Deployment-Dateien einmal auf `main` pushen. GitHub Actions testet die Anwendung, baut beide
Images und veröffentlicht sie unter:

```text
ghcr.io/crossera-labs/runtime-frontend:<commit-sha>
ghcr.io/crossera-labs/runtime-backend:<commit-sha>
```

Der Coolify-Deploy-Job läuft nach der Einrichtung bei erfolgreichen Pushes auf `main`.

## 4. Coolify für GHCR authentifizieren

Die Images eines privaten Repositorys sind standardmäßig ebenfalls privat. In GitHub einen Zugriffstoken mit
`read:packages` erstellen und gegebenenfalls für die Organisation autorisieren. In Coolify beim Zielserver prüfen,
welcher SSH-Benutzer konfiguriert ist, und sich auf dem Build-/Zielserver exakt als dieser Benutzer anmelden. Coolify
bindet dessen `~/.docker/config.json` in den temporären Deployment-Container ein.

```bash
read -s GHCR_TOKEN
printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u <github-benutzer> --password-stdin
unset GHCR_TOKEN
```

Der Token benötigt keinen Schreibzugriff. Er darf nicht als normale Variable in der Compose-Resource gespeichert werden.
Danach beide Images testweise mit dem gewünschten `IMAGE_TAG` pullen. Wenn ein separater Coolify-Buildserver aktiv ist,
muss der Login auch dort unter dessen konfiguriertem SSH-Benutzer erfolgen.

## 5. Compose-Resource erstellen

1. Das gewünschte Coolify-Projekt und die Produktionsumgebung öffnen.
2. `New Resource` auswählen.
3. `Private Repository (with GitHub App)` auswählen.
4. Repository `CrossEra-Labs/runtime` und Branch `main` auswählen.
5. Als Build Pack `Docker Compose` auswählen.
6. Base Directory `/` setzen.
7. Docker Compose Location `/compose.coolify.yml` setzen.
8. Raw Compose Deployment deaktiviert lassen.
9. Keine eigenen Docker-Netzwerke hinzufügen.

Coolify erstellt selbst ein internes Netzwerk. Darin sind die Services über die Namen `frontend`, `backend` und
`postgres` erreichbar.

## 6. Produktionsvariablen setzen

Unter `Environment Variables` folgende Werte konfigurieren:

```env
DB_NAME=runtime
DB_USER=runtime
DB_PASSWORD=<starkes-zufaelliges-passwort>
FRONTEND_URL=https://app.example.com
SPRING_SECURITY_USER_NAME=runtime-admin
SPRING_SECURITY_USER_PASSWORD=<weiteres-starkes-passwort>
IMAGE_TAG=<vollstaendige-commit-sha-des-ersten-image-builds>
```

Für beide Passwörter unterschiedliche, zufällige Werte verwenden. Die Werte nicht in `.env`, Screenshots, Tickets oder
das Repository übernehmen.

## 7. Domain zuweisen

1. In der Compose-Resource den Service `frontend` auswählen.
2. Als Domain `https://app.example.com` eintragen.
3. Als internen Zielport `80` verwenden.
4. Den Services `backend` und `postgres` keine Domain zuweisen.
5. Für keinen Service einen Host-Port veröffentlichen.

Coolify übernimmt den öffentlichen Reverse Proxy und das TLS-Zertifikat.

## 8. Erstes Deployment

Das erste Deployment manuell über `Deploy` starten. Anschließend in Coolify prüfen, ob alle Services als healthy
angezeigt werden.

Extern prüfen:

```bash
curl --fail https://app.example.com/healthz
curl --fail https://app.example.com/api/hello
```

Danach die Anwendung im Browser öffnen und kontrollieren, dass keine CORS- oder Mixed-Content-Fehler in der
Browser-Konsole erscheinen.

## 9. Direktes Auto Deploy deaktivieren

Die GitHub App aktiviert direktes Auto Deploy normalerweise automatisch. In der Resource unter `Advanced` die Option
`Auto Deploy` deaktivieren. Andernfalls könnte Coolify bereits deployen, bevor GitHub Actions fertig ist.

## 10. Coolify-API vorbereiten

1. In den globalen Coolify-Einstellungen unter `Advanced` API Access aktivieren.
2. Unter `Keys & Tokens` einen API-Token erstellen.
3. Dem Token die Berechtigungen `Read`, `Write` und `Deploy` geben.
4. Die Basis-URL der Coolify-Instanz notieren, beispielsweise `https://coolify.example.com`.
5. Die Application-UUID der Compose-Resource aus ihrer Coolify-URL kopieren.

## 11. GitHub-Secrets konfigurieren

Im GitHub-Repository `Settings`, `Secrets and variables`, `Actions` öffnen und folgendes Repository-Secret anlegen:

| Name            | Wert                                                        |
|-----------------|-------------------------------------------------------------|
| `COOLIFY_TOKEN` | Coolify API-Token mit Read-, Write- und Deploy-Berechtigung |

Folgende Repository-Variablen anlegen:

| Name                       | Wert                                                    |
|----------------------------|---------------------------------------------------------|
| `COOLIFY_URL`              | Basis-URL der Coolify-Instanz ohne abschließenden Slash |
| `COOLIFY_APPLICATION_UUID` | Application-UUID der Compose-Resource                   |

Unter `Settings`, `Environments` zusätzlich ein Environment namens
`production` erstellen. Dort kann optional eine manuelle Freigabe vor jedem Deployment verlangt werden.

## 12. Automatisches Deployment prüfen

Nachdem das manuelle Deployment, der API-Token und alle Variablen funktionieren, läuft bei jedem Push auf `main`
folgende Kette:

```text
Frontend-Prüfung + Backend-Prüfung
-> beide Container mit derselben Commit-SHA in GHCR veröffentlichen
-> Git-Revision und IMAGE_TAG in Coolify auf diese SHA setzen
-> Coolify-Deployment über die API auslösen
-> bis zum erfolgreichen Deploymentstatus warten
```

Pull Requests lösen niemals ein Produktionsdeployment aus.

## 13. Persistenz und Backups prüfen

PostgreSQL speichert seine Daten im Volume `postgres_data`. Dieses Volume darf beim normalen Redeployment nicht neu
erstellt oder gelöscht werden.

1. Einen Testdatensatz anlegen.
2. Die Resource erneut deployen.
3. Prüfen, ob der Testdatensatz weiterhin vorhanden ist.
4. In Coolify ein tägliches PostgreSQL-Backup konfigurieren.
5. Für Backups einen externen S3-kompatiblen Speicher verwenden.
6. Einen Restore in einer Testumgebung durchführen und dokumentieren.

Wenn Coolify für PostgreSQL innerhalb einer Compose-Resource keine geplanten Datenbankbackups anbietet, muss PostgreSQL
vor Produktivdaten als separate Coolify-Datenbankresource ausgelagert oder über einen eigenen `pg_dump`-Job gesichert
werden.

## 14. Rollback testen

1. Die Commit-SHA eines früheren erfolgreichen Deployments notieren.
2. Prüfen, dass beide GHCR-Images mit dieser SHA noch vorhanden sind.
3. In Coolify `IMAGE_TAG` auf die frühere SHA setzen.
4. In der Application-Konfiguration `Git Commit SHA` auf dieselbe SHA setzen.
5. Die Compose-Resource manuell deployen.
6. `/healthz`, `/api/hello` und die Datenbankverbindung prüfen.

GitHub-Paketregeln dürfen erfolgreich deployte SHA-Tags nicht automatisch löschen, solange diese Versionen für Rollbacks
benötigt werden.

Ein Rollback der Anwendung ersetzt keine Datenbankmigration. Vor dem ersten produktiven Datenmodell sollte deshalb
Flyway oder Liquibase eingeführt werden.

## Fehlerdiagnose

Status aller Services in Coolify kontrollieren und anschließend die Logs des betroffenen Services öffnen.

Wichtige interne Health-Endpunkte:

```text
frontend: http://frontend/healthz
backend:  http://backend:8080/actuator/health/readiness
postgres: pg_isready
```

Bei `502` oder `504` zuerst prüfen, ob `backend` healthy ist und ob keine eigenen Compose-Netzwerke ergänzt wurden. Bei
einem fehlgeschlagenen Deploy-Job in GitHub prüfen, ob `COOLIFY_TOKEN`, `COOLIFY_URL` und
`COOLIFY_APPLICATION_UUID` korrekt gesetzt sind.
