# DG Learner

Interaktive Lernanwendung für Bundeswehr-Dienstgrade mit React-Frontend, optionalem FastAPI-Backend,
PWA-Unterstützung und vorbereitetem Tauri-Setup für native Desktop- und spätere Mobile-Releases.

## Überblick

Der aktuelle Produktschwerpunkt liegt auf dem Frontend. Dort laufen:

- die Lernmodi
- die Aufgabenlogik
- die lokale Fortschrittsspeicherung
- die Statistikansicht
- die PWA-Installation

Zusätzlich ist eine schlanke Backend-Struktur für spätere API-Erweiterungen vorhanden.

## Funktionsumfang

- vier Lernmodi inklusive Organigramm
- Auswahl nach Teilstreitkraft und Kategorie
- lokaler Lernstand via `localStorage`
- Spaced Repetition für die drei Quiz-Modi
- installierbare Web-App über Browser
- native Desktop-Builds über GitHub Actions
- vorbereiteter Android-Build-Pfad über Tauri Android

## Lokaler Start

Der empfohlene Einstieg ist das Projektskript [start-test.sh](/home/konrad/BWI/DG%20Learner/start-test.sh):

```bash
./start-test.sh
```

Das Skript:

- prüft `node` und `npm`
- installiert Frontend-Abhängigkeiten bei Bedarf
- legt bei vorhandenem Python ein Backend-`venv` an
- installiert Backend-Abhängigkeiten bei Bedarf
- startet das Backend unter `http://127.0.0.1:8000`
- baut das Frontend und stellt es unter `http://localhost:5173` bereit

Für Entwicklung mit Hot Reload:

```bash
./start-test.sh --dev
```

Hinweise:

- der PWA-Installationsbutton erscheint typischerweise nur im Preview-/Produktionsmodus
- das Skript öffnet keinen Browser automatisch

## PWA-Nutzung

Die Web-App kann in Chrome oder Edge als Desktop-PWA installiert werden.

Voraussetzungen:

- Aufruf über `localhost` oder HTTPS
- Frontend läuft im Preview-/Deployment-Modus

Typischer Ablauf:

1. `./start-test.sh` starten
2. `http://localhost:5173` im Browser öffnen
3. `App installieren` wählen

## Projektstruktur

```text
DG Learner/
  Docs/
    README.md
    frontend.md
    backend.md
    publish.md
  backend/
    app/
    requirements.txt
  frontend/
    public/
    src/
    src-tauri/
  start-test.sh
  README.md
```

## Veröffentlichung

Das Projekt unterstützt zwei Bereitstellungswege:

- Web-App per GitHub Pages über [deploy-pages.yml](/home/konrad/BWI/DG%20Learner/.github/workflows/deploy-pages.yml)
- native Desktop-Releases per GitHub Actions über [release-desktop.yml](/home/konrad/BWI/DG%20Learner/.github/workflows/release-desktop.yml)

Zusätzlich ist ein lokaler Mobile-Pfad vorbereitet:

- Android per Tauri Android mit APK/AAB-Builds
- iOS konzeptionell vorbereitet, aber lokal nur auf macOS mit Xcode buildbar

Der typische Desktop-Release-Flow ist:

```bash
./deploy_pages.sh
./desktop_build.sh 0.1.2
```

Dabei gilt:

- `deploy_pages.sh` stößt das GitHub-Pages-Deployment für `main` an
- `desktop_build.sh` übernimmt Versionsupdate, Commit, Push und Tag-Push
- der Tag startet den Desktop-Workflow für Windows, Linux und macOS

Falls die lokalen Helferskripte nicht genutzt werden sollen, bleibt der manuelle Fallback:

```bash
perl -0pi -e 's/"version":\s*"[^"]+"/"version": "0.1.2"/' frontend/src-tauri/tauri.conf.json
perl -0pi -e 's/version = "[^"]+"/version = "0.1.2"/' frontend/src-tauri/Cargo.toml
perl -0pi -e 's/"version":\s*"[^"]+"/"version": "0.1.2"/' frontend/package.json
git add frontend/src-tauri/tauri.conf.json frontend/src-tauri/Cargo.toml frontend/package.json
git commit -m "Prepare release v0.1.2"
git push origin main
git tag v0.1.2
git push origin v0.1.2
```

## Dokumentation

Die gepflegte technische Dokumentation liegt unter [Docs/README.md](/home/konrad/BWI/DG%20Learner/Docs/README.md):

- [Docs/frontend.md](/home/konrad/BWI/DG%20Learner/Docs/frontend.md)
- [Docs/backend.md](/home/konrad/BWI/DG%20Learner/Docs/backend.md)
- [Docs/publish.md](/home/konrad/BWI/DG%20Learner/Docs/publish.md)
- [Docs/mobile.md](/home/konrad/BWI/DG%20Learner/Docs/mobile.md)
