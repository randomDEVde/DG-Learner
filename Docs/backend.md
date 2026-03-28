# Backend-Dokumentation

## 1. Zweck des Backends

Das Backend ist aktuell bewusst schlank gehalten und dient vor allem als vorbereitete Struktur
für spätere Erweiterungen.

Der derzeitige produktive Schwerpunkt liegt im Frontend.

Aktuell übernimmt das Backend:

- Health-Check
- einfache Info-Route
- Grundgerüst für spätere APIs

Technologien:

- Python
- FastAPI
- Uvicorn

## 2. Relevante Dateien

- [backend/app/main.py](/home/konrad/BWI/DG%20Learner/backend/app/main.py)
- [backend/app/__init__.py](/home/konrad/BWI/DG%20Learner/backend/app/__init__.py)
- [backend/requirements.txt](/home/konrad/BWI/DG%20Learner/backend/requirements.txt)

## 3. Aktuelle Struktur

```text
backend/
  app/
    __init__.py
    main.py
  requirements.txt
```

## 4. FastAPI-Anwendung

Die FastAPI-App wird in [backend/app/main.py](/home/konrad/BWI/DG%20Learner/backend/app/main.py) erstellt:

```python
app = FastAPI(title="DG Learner API", version="0.1.0")
```

## 5. Aktuelle Endpunkte

### `GET /health`

Zweck:

- einfacher Health-Check
- geeignet für lokale Prüfung oder spätere Deployments

Antwort:

```json
{
  "status": "ok"
}
```

### `GET /api/info`

Zweck:

- beschreibt, dass das Backend aktuell als Grundgerüst dient

Antwort:

```json
{
  "message": "Backend-Grundgeruest fuer spaetere zentrale Datenpflege und API-Erweiterungen."
}
```

## 6. Installation und Start

Manuell:

```bash
cd "/home/konrad/BWI/DG Learner/backend"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Danach erreichbar unter:

```text
http://127.0.0.1:8000
```

## 7. Automatischer Start über das Projektskript

Das Hauptskript [start-test.sh](/home/konrad/BWI/DG%20Learner/start-test.sh) übernimmt für das Backend:

- Prüfung auf `python3`
- Anlegen des virtuellen Environments
- Installation von `requirements.txt`
- Start von Uvicorn

## 8. Aktuelle Rolle im Gesamtsystem

Derzeit werden diese Kernbereiche noch nicht vom Backend übernommen:

- Rangdatenbereitstellung
- Aufgabenlogik
- Lernstand
- Benutzerkonten
- Statistik
- Spaced Repetition

All das liegt aktuell im Frontend.

## 9. Empfohlene spätere Ausbauschritte

Das Backend kann in späteren Projektphasen folgende Aufgaben übernehmen:

- zentrale Bereitstellung der Rangdaten aus JSON oder Datenbank
- serverseitige Validierung und Aufgabenlogik
- Synchronisierung des Lernstands zwischen Geräten
- Benutzerkonten und Login
- Import-/Export-Funktionen
- Administrationsoberfläche
- Pflege von Bild- und Rangdaten

## 10. Sinnvolle zukünftige Struktur

Eine spätere saubere Backend-Struktur könnte so aussehen:

```text
backend/
  app/
    main.py
    routes/
    models/
    services/
    schemas/
    data/
```

Mögliche Inhalte:

- `routes/`: API-Endpunkte
- `models/`: interne Datenmodelle
- `schemas/`: Pydantic-Schemas
- `services/`: Fachlogik
- `data/`: JSON- oder Importdaten

## 11. Mögliche zukünftige API-Endpunkte

Sinnvolle Kandidaten:

- `GET /api/ranks`
- `GET /api/ranks/{id}`
- `GET /api/branches`
- `GET /api/categories`
- `POST /api/session/check`
- `POST /api/session/review`
- `GET /api/stats`

## 12. Hinweise zur Kopplung mit dem Frontend

Wenn das Backend später aktiv genutzt wird, sollte die Umstellung schrittweise erfolgen:

1. Rangdaten per API bereitstellen
2. Frontend liest Daten nicht mehr direkt aus lokaler JSON, sondern aus dem Backend
3. danach Aufgabenlogik optional in Services verschieben
4. erst zuletzt Persistenz und Benutzerverwaltung serverseitig ergänzen

So bleibt das Projekt auch während des Ausbaus benutzbar.

## 13. Wartungshinweise

- Das virtuelle Environment liegt unter `backend/.venv`
- Diese Umgebung gehört nicht in die eigentliche Programmlogik
- Für Änderungen an Abhängigkeiten immer `backend/requirements.txt` aktualisieren
- Für reale Produktionsnutzung sollte später eine sauberere Deploy-Konfiguration ergänzt werden
