# Programmdokumentation

Diese Dokumentation beschreibt den aktuellen technischen Stand von `DG Learner`.

## Inhalt

- [Frontend](./frontend.md)
- [Backend](./backend.md)
- [Veröffentlichung und Releases](./publish.md)

## Ziel

Die Dokumentation soll dabei helfen,

- das Projekt lokal zu starten
- die wichtigsten Einstiegspunkte im Code schnell zu finden
- Datenmodell und Lernlogik nachzuvollziehen
- Deployment und Release-Abläufe sicher auszuführen

## Projektstatus

Das Projekt ist eine responsive Web-Anwendung mit optionalem Backend und vorbereitetem
Desktop-Build über Tauri.

Der aktuelle Schwerpunkt liegt auf:

- Frontend-Logik und UI
- lokaler Speicherung im Browser
- PWA-Nutzung im Browser
- GitHub-basierten Deployments und Desktop-Releases

## Verzeichnisstruktur

```text
DG Learner/
  Docs/
    README.md
    frontend.md
    backend.md
    publish.md
  frontend/
    public/
    src/
    src-tauri/
  backend/
    app/
    requirements.txt
  .github/
    workflows/
  start-test.sh
  README.md
```

Optional können lokal zusätzliche Helferskripte liegen, etwa für Pages-Deployments oder den
kompletten Desktop-Release-Ablauf. Diese sind nicht Teil der festen Repo-Dokumentationsbasis und
werden bewusst separat gehalten.

## Einstiegspunkte

- Frontend-Entry: [frontend/src/main.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/main.jsx)
- Hauptanwendung: [frontend/src/App.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/App.jsx)
- Lernlogik: [frontend/src/utils/logic.js](/home/konrad/BWI/DG%20Learner/frontend/src/utils/logic.js)
- Rangdaten: [frontend/src/data/ranks.json](/home/konrad/BWI/DG%20Learner/frontend/src/data/ranks.json)
- Backend-Entry: [backend/app/main.py](/home/konrad/BWI/DG%20Learner/backend/app/main.py)
- Startskript: [start-test.sh](/home/konrad/BWI/DG%20Learner/start-test.sh)

## Lokaler Start

Für die meisten Fälle reicht:

```bash
./start-test.sh
```

Für Hot Reload:

```bash
./start-test.sh --dev
```

Die fachliche Kurzübersicht steht im Root-[README.md](/home/konrad/BWI/DG%20Learner/README.md).
