# Learning-Tool Bundeswehr-Dienstgrade

Responsive Lernanwendung als MVP mit:

- React + Vite + Tailwind im Frontend
- Tauri-Setup für native Desktop-Builds
- vorbereitetem FastAPI-Backend
- vier Lernmodi inklusive Organigramm
- lokaler Speicherung per `localStorage`
- Statistikansicht
- Desktop-PWA zur lokalen Installation

## Produktstrategie

Die Web-App bleibt bewusst der Hauptpfad des Projekts.

Warum das für diesen Use Case sinnvoll ist:

- ein gemeinsamer Codepfad für Entwicklung und Nutzung
- sehr einfache Bereitstellung über Browser oder GitHub Pages
- lokale Installation auf dem Desktop trotzdem möglich
- der native Desktop-Wrapper ist nur eine zusätzliche Verpackung, nicht die fachliche Hauptbasis

## Hinweis zum Datenstand

Die App bringt eine gepflegte Rangdatenbasis und echte Bilddateien fuer die hinterlegten
Dienstgrade unter `frontend/public/images/...` mit.

Falls spaeter weitere Ränge ergänzt werden, muessen die Bilddateien 1:1 passend zu den Pfaden in
`frontend/src/data/ranks.json` hinterlegt werden.

## Desktop-Installation

Die Web-App ist als installierbare Desktop-PWA vorbereitet:

- Chrome oder Edge oeffnen
- die laufende App aufrufen
- `App installieren` waehlen

Voraussetzung fuer die Installation ist ein Aufruf ueber `localhost` oder HTTPS.

Die native Desktop-App über Tauri ergänzt diesen Weg, ersetzt ihn aber nicht.

## Schnellstart

Empfohlen:

```bash
./start-test.sh
```

Das Skript:

- installiert fehlende Frontend-Abhaengigkeiten automatisch
- startet das Backend bei vorhandenem Python-Setup mit
- baut das Frontend als installierbare Vorschau
- stellt die App lokal bereit

Fuer Hot Reload in der Entwicklung:

```bash
./start-test.sh --dev
```

Hinweis:

- im Dev-Modus erscheint der PWA-Installationsbutton im Browser oft nicht
- fuer die Desktop-Installation ist `./start-test.sh` ohne `--dev` der richtige Weg

## Veröffentlichen auf GitHub

Es gibt zwei sinnvolle Wege:

1. Sourcecode im Repository bereitstellen
2. die Web-App zusaetzlich ueber GitHub Pages deployen und von dort als PWA installieren
3. native Desktop-Builds ueber GitHub Actions erzeugen

Damit koennen Nutzer:

- den Sourcecode direkt auf GitHub einsehen oder klonen
- oder die laufende Desktop-Web-App oeffnen und installieren
- oder einen nativen Desktop-Installer herunterladen

Der Build ist jetzt bewusst so aufgebaut, dass er auch unter Unterpfaden robust laeuft, was fuer
GitHub Pages wichtig ist.

Eine konkrete Schritt-fuer-Schritt-Anleitung liegt hier:

- [Docs/publish.md](/home/konrad/BWI/DG%20Learner/Docs/publish.md)

## Native Desktop-Builds

Das Repository ist jetzt auch fuer native Desktop-Builds vorbereitet:

- Windows: bevorzugt als `.exe`
- Linux: als `.deb` und `AppImage`
- macOS: als `DMG`

Das Tauri-Setup liegt unter:

- [frontend/src-tauri](/home/konrad/BWI/DG%20Learner/frontend/src-tauri)

Der Release-Workflow liegt unter:

- [release-desktop.yml](/home/konrad/BWI/DG%20Learner/.github/workflows/release-desktop.yml)

## Start

### Frontend

```bash
cd frontend
npm install
npm run build
npm run preview -- --port 5173
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
