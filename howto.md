# Howto: Desktop und Handy

Diese Anleitung beschreibt, wie das Learning-Tool lokal gestartet und auf

- Desktop
- Android
- iPhone / iPad

genutzt oder als App installiert werden kann.

## 1. Voraussetzungen

Installiert sein sollten:

- `node` und `npm`
- optional `python3`, wenn auch das Backend gestartet werden soll

Der aktuelle Stand der Anwendung funktioniert bereits komplett im Frontend.
Das Backend ist vorbereitet, aber fuer den normalen lokalen Betrieb aktuell nicht noetig.

## 2. Frontend lokal starten

Im Projektordner:

```bash
cd "/home/konrad/BWI/DG Learner/frontend"
npm install
npm run dev
```

Danach ist die App lokal erreichbar unter:

```text
http://localhost:5173
```

## 3. Nutzung auf dem Desktop

### Im Browser starten

1. Frontend mit `npm run dev` starten
2. Im Browser `http://localhost:5173` oeffnen

Das funktioniert direkt auf dem Rechner, auf dem der Dev-Server laeuft.

### Als Desktop-App installieren

Empfohlen sind:

- Google Chrome
- Microsoft Edge

Vorgehen:

1. `http://localhost:5173` im Browser oeffnen
2. Im Browser-Menue oder in der Adressleiste `App installieren` auswaehlen
3. Die App wird dann als eigenstaendiges Fenster installiert

Danach startet die Anwendung wie eine normale Desktop-App.

## 4. Nutzung auf dem Handy im gleichen WLAN

Wenn das Handy die App waehrend der lokalen Entwicklung auf deinem Rechner nutzen soll,
muss der Frontend-Server im Netzwerk sichtbar sein.

### Dev-Server fuer das Netzwerk freigeben

```bash
cd "/home/konrad/BWI/DG Learner/frontend"
npm run dev -- --host
```

Vite zeigt danach in der Konsole neben `Local` meist auch eine `Network`-Adresse an, zum Beispiel:

```text
http://192.168.178.50:5173
```

### Auf dem Handy oeffnen

1. Handy und Rechner muessen im selben WLAN sein
2. Die angezeigte Netzwerk-Adresse im Handy-Browser oeffnen

Damit ist die App auf dem Handy lauffaehig.

## 5. Wichtiger Unterschied: laufen vs. installieren

Es gibt zwei Faelle:

### A. Nur im Browser nutzen

Das geht lokal problemlos:

- auf Desktop ueber `http://localhost:5173`
- auf dem Handy im gleichen WLAN ueber die `http://<deine-ip>:5173`-Adresse

### B. Als echte PWA installieren

Die Installation als App funktioniert zuverlaessig nur unter:

- `localhost`
- oder `HTTPS`

Das bedeutet:

- Desktop auf dem lokalen Rechner: Installation ueber `localhost` ist moeglich
- Handy im WLAN ueber normale `http://192.168...`: meist im Browser nutzbar, aber nicht sauber als PWA installierbar
- Handy ueber `HTTPS`: lauffaehig und installierbar

## 6. Android

### Android im Browser nutzen

1. Frontend mit `npm run dev -- --host` starten
2. Netzwerk-Adresse auf dem Android-Geraet in Chrome oeffnen

### Android als App installieren

Dafuer sollte die App ueber `HTTPS` bereitgestellt werden.

Dann:

1. Seite in Chrome oeffnen
2. `Installieren` oder `Zum Startbildschirm` waehlen
3. Die App wird als installierbare Anwendung hinterlegt

## 7. iPhone / iPad

### iPhone / iPad im Browser nutzen

1. Frontend mit `npm run dev -- --host` starten
2. Netzwerk-Adresse in Safari aufrufen

### iPhone / iPad als App installieren

Auch hier ist fuer einen sauberen produktiven Einsatz `HTTPS` empfehlenswert.

Vorgehen:

1. Seite in Safari oeffnen
2. Auf `Teilen` tippen
3. `Zum Home-Bildschirm` auswaehlen

Danach erscheint die App wie eine normale Web-App auf dem Startbildschirm.

## 8. Empfohlener Weg fuer echte Handy-Installation

Wenn die App nicht nur im lokalen WLAN laufen, sondern auf dem Handy wirklich als App installiert werden soll,
ist dieser Weg am sinnvollsten:

1. Frontend bauen
2. Ueber einen kleinen Webserver mit `HTTPS` bereitstellen
3. Die HTTPS-URL auf dem Handy oeffnen
4. Danach als PWA installieren

### Frontend Build erzeugen

```bash
cd "/home/konrad/BWI/DG Learner/frontend"
npm run build
```

Das Ergebnis liegt dann in:

[`frontend/dist`](/home/konrad/BWI/DG%20Learner/frontend/dist)

Diesen Ordner kannst du spaeter auf einem Webserver oder Hosting-Dienst ausliefern.

## 9. Optional: Backend starten

Das Backend ist aktuell nicht zwingend erforderlich, kann aber parallel gestartet werden:

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

## 10. Kurzfassung

### Desktop lokal testen

```bash
cd "/home/konrad/BWI/DG Learner/frontend"
npm install
npm run dev
```

Dann:

```text
http://localhost:5173
```

### Handy im gleichen WLAN testen

```bash
cd "/home/konrad/BWI/DG Learner/frontend"
npm run dev -- --host
```

Dann die angezeigte `Network`-Adresse im Handy-Browser oeffnen.

### Als installierbare App

- Desktop: direkt ueber `localhost` im kompatiblen Browser installierbar
- Handy: fuer eine saubere PWA-Installation am besten ueber `HTTPS` bereitstellen
