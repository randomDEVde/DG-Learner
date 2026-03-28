# Programmdokumentation

Diese Dokumentation beschreibt den technischen Aufbau des Projekts
`Learning-Tool Bundeswehr-Dienstgrade`.

Die Dokumentation ist in zwei Hauptbereiche aufgeteilt:

- [Frontend](./frontend.md)
- [Backend](./backend.md)
- [Veröffentlichung](./publish.md)

## Ziel der Dokumentation

Die Dokumentation soll es ermöglichen,

- das Projekt lokal zu starten,
- den Aufbau des Codes zu verstehen,
- die Datenstruktur nachzuvollziehen,
- die Lernlogik zu erweitern,
- und neue Funktionen kontrolliert einzubauen.

## Projektüberblick

Das Projekt ist als responsive Web-Anwendung umgesetzt.

Aktueller Schwerpunkt:

- interaktive Lernmodi im Frontend
- lokale Speicherung im Browser
- PWA-Fähigkeit
- vorbereitete Backend-Struktur für spätere Erweiterungen

## Verzeichnisstruktur

```text
DG Learner/
  Docs/
    README.md
    frontend.md
    backend.md

  frontend/
    public/
    src/

  backend/
    app/

  start-test.sh
  README.md
  howto.md
```

## Einstiegspunkte

- Frontend-App: [frontend/src/main.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/main.jsx)
- Haupt-UI: [frontend/src/App.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/App.jsx)
- Zentrale Frontend-Logik: [frontend/src/utils/logic.js](/home/konrad/BWI/DG%20Learner/frontend/src/utils/logic.js)
- Rangdaten: [frontend/src/data/ranks.json](/home/konrad/BWI/DG%20Learner/frontend/src/data/ranks.json)
- Backend-App: [backend/app/main.py](/home/konrad/BWI/DG%20Learner/backend/app/main.py)

## Lokaler Start

Das empfohlene Startskript liegt im Projektwurzelverzeichnis:

```bash
./start-test.sh
```

Das Skript

- prüft Frontend-Abhängigkeiten,
- installiert sie bei Bedarf,
- erstellt bei Bedarf ein Python-`venv`,
- installiert Backend-Abhängigkeiten,
- startet Frontend als installierbare Vorschau und das Backend,
- und stellt die App lokal bereit.

Details dazu stehen in [howto.md](/home/konrad/BWI/DG%20Learner/howto.md).
