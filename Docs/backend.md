# Backend-Dokumentation

## Zweck

Das Backend ist aktuell bewusst schlank gehalten und dient als vorbereitetes Fundament für spätere
API-Erweiterungen. Der produktive Schwerpunkt des Projekts liegt derzeit weiterhin im Frontend.

## Technologien

- Python 3
- FastAPI
- Uvicorn

## Relevante Dateien

- [backend/app/main.py](/home/konrad/BWI/DG%20Learner/backend/app/main.py)
- [backend/app/__init__.py](/home/konrad/BWI/DG%20Learner/backend/app/__init__.py)
- [backend/requirements.txt](/home/konrad/BWI/DG%20Learner/backend/requirements.txt)

## Aktuelle Struktur

```text
backend/
  app/
    __init__.py
    main.py
  requirements.txt
```

## Aktuelle Verantwortung

Das Backend stellt momentan nur Basis-Endpunkte bereit:

- Health-Check
- einfache Info-Route
- minimales Startgerüst für spätere APIs

Nicht im Backend, sondern aktuell im Frontend umgesetzt:

- Rangdaten-Nutzung
- Aufgabenlogik
- Bewertungslogik
- Spaced Repetition
- lokale Statistik
- Persistenz des Lernstands

## FastAPI-App

Die Anwendung wird in [backend/app/main.py](/home/konrad/BWI/DG%20Learner/backend/app/main.py) erzeugt:

```python
app = FastAPI(title="DG Learner API", version="0.1.0")
```

## Endpunkte

### `GET /health`

Antwort:

```json
{
  "status": "ok"
}
```

### `GET /api/info`

Antwort:

```json
{
  "message": "Backend-Grundgeruest fuer spaetere zentrale Datenpflege und API-Erweiterungen."
}
```

## Lokaler Start

Direkt:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Danach ist das Backend unter `http://127.0.0.1:8000` erreichbar.

## Start über das Projektskript

[start-test.sh](/home/konrad/BWI/DG%20Learner/start-test.sh) übernimmt für das Backend:

- Prüfung auf `python3`
- Erstellen des virtuellen Environments
- Installation der Abhängigkeiten
- Start von `uvicorn app.main:app --reload`

Wenn `python3` fehlt oder keine `requirements.txt` vorhanden wäre, würde das Skript den Backend-Teil
überspringen oder abbrechen.

## Mögliche Ausbauschritte

Sinnvolle nächste Backend-Themen wären:

- Bereitstellung der Rangdaten per API
- serverseitige Aufgaben- oder Bewertungslogik
- geräteübergreifende Speicherung des Lernstands
- Benutzerkonten
- Import-/Export- und Verwaltungsfunktionen

## Wartungshinweise

- das lokale virtuelle Environment liegt unter `backend/.venv`
- Abhängigkeiten werden in [backend/requirements.txt](/home/konrad/BWI/DG%20Learner/backend/requirements.txt) gepflegt
- für den aktuellen Entwicklungsstand ist das Backend optional, aber lauffähig
