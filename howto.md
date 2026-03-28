# Howto: Desktop

Diese Anleitung beschreibt den aktuellen, bewusst auf Desktop ausgerichteten Betrieb.

## 1. Voraussetzungen

Installiert sein sollten:

- `node` und `npm`
- optional `python3`, wenn auch das vorbereitete Backend mitlaufen soll

## 2. Empfohlener Start

Im Projektwurzelverzeichnis:

```bash
cd "/home/konrad/BWI/DG Learner"
./start-test.sh
```

Das Skript:

- installiert fehlende Frontend-Abhängigkeiten automatisch
- baut das Frontend als installierbare Vorschau
- startet optional das Backend mit
- öffnet die App lokal unter `http://localhost:5173`

## 3. Desktop-App im Browser installieren

Empfohlen sind:

- Google Chrome
- Microsoft Edge

Vorgehen:

1. `./start-test.sh` starten
2. `http://localhost:5173` im Browser öffnen
3. warten, bis der Browser die App als installierbar erkennt
4. `App installieren` in der Adressleiste oder im Browser-Menü wählen

Danach läuft die Anwendung als eigenständiges Desktop-Fenster.

## 4. Entwicklung mit Hot Reload

Für reine Entwicklungsarbeit:

```bash
cd "/home/konrad/BWI/DG Learner"
./start-test.sh --dev
```

Wichtig:

- dieser Modus ist für Entwicklung gedacht
- der PWA-Installationsbutton erscheint dort im Browser oft nicht

## 5. Alternativ nur das Frontend starten

```bash
cd "/home/konrad/BWI/DG Learner/frontend"
npm install
npm run build
npm run preview -- --port 5173
```

Danach:

```text
http://localhost:5173
```

## 6. Backend optional starten

```bash
cd "/home/konrad/BWI/DG Learner/backend"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API-Adresse:

```text
http://127.0.0.1:8000
```

## 7. Veröffentlichung über GitHub

Für eine einfache Veröffentlichung zusammen mit dem Sourcecode sind aktuell zwei Wege sinnvoll:

1. Repository mit Sourcecode auf GitHub veröffentlichen
2. die Web-App zusätzlich über GitHub Pages bereitstellen

Dann können Nutzer:

- den Code direkt auf GitHub ansehen oder klonen
- oder die laufende Desktop-Web-App öffnen und als PWA installieren

Der Workflow dafür liegt unter:

- [\.github/workflows/deploy-pages.yml](/home/konrad/BWI/DG%20Learner/.github/workflows/deploy-pages.yml)
