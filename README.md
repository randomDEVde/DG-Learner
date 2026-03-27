# Learning-Tool Bundeswehr-Dienstgrade

Responsive Lernanwendung als MVP mit:

- React + Vite + Tailwind im Frontend
- vorbereitetem FastAPI-Backend
- vier Lernmodi inklusive Organigramm
- lokaler Speicherung per `localStorage`
- Statistikansicht
- einfacher PWA-Basis

## Hinweis zum Datenstand

Die App bringt eine gepflegte Rangdatenbasis und generierte Platzhalter-Grafiken fuer die Dienstgradkarten mit.
Die Datenstruktur ist bereits so vorbereitet, dass spaeter echte Abzeichenbilder unter `frontend/public/images/...`
1:1 ueber den Dateinamen hinterlegt werden koennen.

## PWA-Installation

Die Web-App ist als installierbare PWA vorbereitet:

- Desktop: in Chrome oder Edge die Seite oeffnen und `App installieren` waehlen
- Android: im Browser `Zum Startbildschirm` oder `Installieren` nutzen
- iPhone/iPad: in Safari `Teilen` und dann `Zum Home-Bildschirm`

Voraussetzung fuer die echte Installation ist ein Aufruf ueber `localhost` oder HTTPS.

## Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
