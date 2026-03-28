# Frontend-Dokumentation

## 1. Zweck des Frontends

Das Frontend enthält aktuell den gesamten produktiven Kern der Anwendung.

Es übernimmt:

- Rendering der Oberfläche
- Auswahl von Modus, Teilstreitkräften und Kategorien
- Generierung der Aufgaben
- Auswertung der Antworten
- lokale Lernstandsverwaltung
- Spaced-Repetition-Logik
- PWA-Verhalten

Technologien:

- React
- Vite
- Tailwind CSS
- Tauri für native Desktop-Builds
- lokaler Browser-Speicher über `localStorage`

## 2. Relevante Frontend-Dateien

### Einstieg

- [frontend/src/main.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/main.jsx)
- [frontend/src/App.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/App.jsx)

### Daten und Logik

- [frontend/src/data/ranks.json](/home/konrad/BWI/DG%20Learner/frontend/src/data/ranks.json)
- [frontend/src/data/ranks.js](/home/konrad/BWI/DG%20Learner/frontend/src/data/ranks.js)
- [frontend/src/utils/logic.js](/home/konrad/BWI/DG%20Learner/frontend/src/utils/logic.js)

### Hooks

- [frontend/src/hooks/usePersistentState.js](/home/konrad/BWI/DG%20Learner/frontend/src/hooks/usePersistentState.js)
- [frontend/src/hooks/usePwaInstall.js](/home/konrad/BWI/DG%20Learner/frontend/src/hooks/usePwaInstall.js)

### Komponenten

- [frontend/src/components/ModeSelector.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/ModeSelector.jsx)
- [frontend/src/components/BranchSelector.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/BranchSelector.jsx)
- [frontend/src/components/CategorySelector.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/CategorySelector.jsx)
- [frontend/src/components/LearningModeSwitch.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/LearningModeSwitch.jsx)
- [frontend/src/components/RankImage.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/RankImage.jsx)
- [frontend/src/components/OrganigramBoard.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/OrganigramBoard.jsx)
- [frontend/src/components/ReviewPanel.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/ReviewPanel.jsx)
- [frontend/src/components/StatsPage.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/StatsPage.jsx)
- [frontend/src/components/PwaInstallPanel.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/PwaInstallPanel.jsx)
- [frontend/src/components/CompletionDialog.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/CompletionDialog.jsx)
- [frontend/src-tauri](/home/konrad/BWI/DG%20Learner/frontend/src-tauri)

## 3. Architektur

Das Frontend folgt keinem komplizierten globalen Store, sondern einer bewusst kompakten Architektur:

1. `App.jsx` hält den zentralen UI-Zustand.
2. `usePersistentState` lädt und speichert diesen Zustand in `localStorage`.
3. `logic.js` kapselt die wichtigste Fachlogik.
4. Die UI-Komponenten sind weitgehend zustandsarm und werden über Props angesteuert.

## 4. Zustandsmodell

Der persistierte Zustand wird in `logic.js` über `createInitialState()` definiert.

Wichtige Felder:

- `selectedMode`
- `selectedLearningMode`
- `selectedBranches`
- `selectedCategories`
- `currentTask`
- `session`
- `spacedRepetition`
- `currentFeedback`
- `currentView`

### `selectedMode`

Definiert den aktiven Lernmodus:

- `image-input`
- `image-choice`
- `text-choice`
- `organigram`

### `selectedLearningMode`

Definiert die Lernlogik:

- `standard`
- `spaced-repetition`

Wichtig:

- Im Organigramm-Modus wird Spaced Repetition deaktiviert.

### `selectedBranches`

Auswahl der Teilstreitkräfte:

- `heer`
- `marine`
- `luftwaffe`

### `selectedCategories`

Auswahl der Rangkategorien:

- `standard`
- `offizieranwärter`
- `sanitätsdienst`

### `session`

Enthält Sitzungs- und Statistikdaten:

- `answered`
- `correct`
- `wrong`
- `helped`
- `history`

### `spacedRepetition`

Enthält den lokalen Wiederholungsplan:

- `cards`
- `lastCardKey`

Jede Karte speichert dort z. B.:

- `dueAt`
- `intervalMinutes`
- `lastRating`
- `lastReviewedAt`

## 5. Datenmodell der Rangdaten

Die Rangdaten liegen in [frontend/src/data/ranks.json](/home/konrad/BWI/DG%20Learner/frontend/src/data/ranks.json).

Beispiel:

```json
{
  "name": "Hauptmann",
  "branch": "heer",
  "category": "standard",
  "group": "offiziere",
  "order": 16,
  "image": "/images/heer/hauptmann.png"
}
```

### Bedeutung der Felder

- `name`: Anzeigename des Dienstgrads
- `branch`: Teilstreitkraft
- `category`: inhaltliche Kategorie
- `group`: Ranggruppe
- `order`: Position innerhalb der Kategorie-/Teilstruktur
- `image`: relativer Bildpfad aus dem `public`-Ordner

## 6. IDs und Eindeutigkeit

Interne IDs werden in [frontend/src/data/ranks.js](/home/konrad/BWI/DG%20Learner/frontend/src/data/ranks.js) erzeugt.

Das ist wichtig, weil gleiche Namen mehrfach vorkommen können, z. B.:

- `Gefreiter` in Heer, Marine und Luftwaffe
- `Leutnant` in Heer und Luftwaffe

Die interne `id` basiert daher nicht nur auf dem Namen, sondern auf:

- Teilstreitkraft
- Kategorie
- normalisiertem Namen

Dadurch bleiben Karten fachlich eindeutig.

## 7. Lernmodi

### Modus 1: Bild mit Texteingabe

Dateien:

- [frontend/src/App.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/App.jsx)
- [frontend/src/utils/logic.js](/home/konrad/BWI/DG%20Learner/frontend/src/utils/logic.js)

Verhalten:

- zeigt ein Bild eines Dienstgrads
- erwartet freie Texteingabe
- Groß-/Kleinschreibung wird ignoriert
- Umlaute werden robust normalisiert
- `Lösung anzeigen` füllt das Textfeld automatisch mit der korrekten Lösung

### Modus 2: Bild mit Auswahl

Verhalten:

- zeigt ein Bild
- bietet vier Textantworten
- markiert die richtige Lösung bei Bedarf

Distraktoren werden bevorzugt aus:

- derselben Teilstreitkraft
- derselben Kategorie
- ähnlicher Ranggruppe
- ähnlicher Rangnähe

### Modus 3: Text mit Bildauswahl

Verhalten:

- zeigt den Dienstgrad als Text
- bietet vier Bildoptionen
- bei `Lösung anzeigen` wird das richtige Bild deutlich markiert

### Modus 4: Organigramm einordnen

Verhalten:

- zeigt ein Rangschema
- Karten werden einem festen Slot zugeordnet
- Desktop: Drag-and-Drop oder Karte anklicken und Zielslot wählen

Wichtig:

- dieser Modus nutzt immer nur `category: standard`
- Spezialkategorien werden hier bewusst ausgeschlossen

## 8. Spaced Repetition

Spaced Repetition ist für die drei Quiz-Modi aktiviert, nicht für das Organigramm.

### Aktivierung

Die Aktivierung erfolgt über [LearningModeSwitch.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/LearningModeSwitch.jsx).

### Bewertungsoptionen

Die Bewertung erfolgt über [ReviewPanel.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/ReviewPanel.jsx).

Optionen:

- `Nochmal`
- `Schlecht`
- `Gut`
- `Einfach`

### Grundintervalle

Aktuell in `logic.js` definiert:

- `Nochmal` → 1 Minute
- `Schlecht` → 6 Minuten
- `Gut` → 10 Minuten
- `Einfach` → 3 Tage

Zusätzlich:

- bessere Bewertungen verlängern bestehende Intervalle progressiv
- die gleiche Karte wird nach Möglichkeit nicht direkt zweimal hintereinander gezeigt

## 9. Aufgabenlogik

Die Aufgabenlogik liegt zentral in [frontend/src/utils/logic.js](/home/konrad/BWI/DG%20Learner/frontend/src/utils/logic.js).

Wichtige Funktionen:

- `normalizeAnswer`
- `shuffle`
- `getRanksForFilters`
- `createTask`
- `gradeTask`
- `revealOrganigramStep`
- `placeOnOrganigram`
- `autoPlaceNext`
- `applySpacedRepetitionRating`

### `createTask`

Diese Funktion erzeugt je nach Modus eine neue Aufgabe.

Eingaben:

- Modus
- gewählte Teilstreitkräfte
- gewählte Kategorien
- optionale Lernmodus-Information

Besonderheiten:

- Organigramm erzwingt Standardränge
- Spaced Repetition filtert auf fällige Karten

## 10. Feedback- und Statistiksystem

Feedback wird in `currentFeedback` gespeichert.

Es enthält z. B.:

- `status`
- `message`
- `solution`
- `slotKey`
- `awaitingReview`

Die Statistikansicht zeigt:

- Gesamtanzahl bearbeiteter Aufgaben
- richtige Antworten
- falsche Antworten
- mit Hilfe bearbeitete Aufgaben
- Quoten nach Teilstreitkraft
- Quoten nach Modus
- Quoten nach Kategorie

## 11. Bilder und Bildpfade

Die Bilddateien liegen im `public`-Ordner:

- [frontend/public/images/heer](/home/konrad/BWI/DG%20Learner/frontend/public/images/heer)
- [frontend/public/images/marine](/home/konrad/BWI/DG%20Learner/frontend/public/images/marine)
- [frontend/public/images/luftwaffe](/home/konrad/BWI/DG%20Learner/frontend/public/images/luftwaffe)

`RankImage` rendert echte PNG-Dateien und fällt nur bei Ladefehlern auf eine Platzhalteransicht zurück.

## 12. PWA

Relevante Dateien:

- [frontend/public/manifest.webmanifest](/home/konrad/BWI/DG%20Learner/frontend/public/manifest.webmanifest)
- [frontend/public/sw.js](/home/konrad/BWI/DG%20Learner/frontend/public/sw.js)
- [frontend/src/hooks/usePwaInstall.js](/home/konrad/BWI/DG%20Learner/frontend/src/hooks/usePwaInstall.js)
- [frontend/public/pwa-icon-192.png](/home/konrad/BWI/DG%20Learner/frontend/public/pwa-icon-192.png)
- [frontend/public/pwa-icon-512.png](/home/konrad/BWI/DG%20Learner/frontend/public/pwa-icon-512.png)

Wichtig:

- der Service Worker wird nur im Produktionsbetrieb registriert
- im Entwicklungsmodus werden alte Service Worker aktiv entfernt
- dadurch werden Probleme mit veralteten Chunks vermieden
- für die Desktop-Installation werden echte PNG-Icons und passende Manifest-Farben ausgeliefert

## 13. Tastatursteuerung

Auf Desktop existieren Tastenkürzel:

- `Enter` → nächste Aufgabe
- `L` → Lösung anzeigen
- `H` → Startseite

Die Buttons mit Kürzeln erhalten Tooltips über [ShortcutButton.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/ShortcutButton.jsx).

## 14. Organigramm-Abschluss

Wenn das Organigramm vollständig ist:

- erscheint ein Fertig-Hinweis
- zusätzlich öffnet sich ein Abschlussdialog

Relevante Komponente:

- [frontend/src/components/CompletionDialog.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/CompletionDialog.jsx)

## 15. Design

Das Frontend nutzt ein reduziertes BWI-inspiriertes Farbschema:

- Rot
- Grau
- Weiß

Die Tailwind-Konfiguration liegt in:

- [frontend/tailwind.config.js](/home/konrad/BWI/DG%20Learner/frontend/tailwind.config.js)

Globale Styles liegen in:

- [frontend/src/styles/index.css](/home/konrad/BWI/DG%20Learner/frontend/src/styles/index.css)

## 16. Lokaler Start des Frontends

Empfohlen:

```bash
cd "/home/konrad/BWI/DG Learner"
./start-test.sh
```

Das Skript startet das Frontend standardmäßig als installierbare Vorschau.

Alternativ nur Frontend:

```bash
cd "/home/konrad/BWI/DG Learner/frontend"
npm install
npm run dev -- --host
```

Der reine Vite-Entwicklungsmodus ist für Hot Reload gedacht. Der PWA-Installationsbutton
erscheint dort im Browser oft nicht.

## 17. Native Desktop-Builds

Für native Pakete ist zusätzlich ein Tauri-Setup vorhanden.

Zielplattformen:

- Windows als `.exe`
- Linux als `.deb` und `AppImage`
- macOS als `DMG`

Wichtige Dateien:

- [frontend/src-tauri/Cargo.toml](/home/konrad/BWI/DG%20Learner/frontend/src-tauri/Cargo.toml)
- [frontend/src-tauri/tauri.conf.json](/home/konrad/BWI/DG%20Learner/frontend/src-tauri/tauri.conf.json)
- [frontend/src-tauri/src/main.rs](/home/konrad/BWI/DG%20Learner/frontend/src-tauri/src/main.rs)

Wichtige npm-Skripte:

- `npm run tauri:dev`
- `npm run tauri:build`

Wichtig:

- lokale native Builds benötigen Rust und die jeweiligen Plattform-Abhängigkeiten
- im aktuellen Linux-Container konnte ich das Gerüst vorbereiten, aber ohne Rust nicht lokal fertig bauen
- für veröffentlichte Artefakte ist deshalb der GitHub-Workflow der verlässlichste Weg

## 18. Typische Erweiterungspunkte

Sinnvolle nächste Ausbaustufen:

- echte Backend-API für Rangdaten
- Import/Export des Lernstands
- serverseitige Nutzerkonten
- feinere Spaced-Repetition-Regeln
- Admin-Oberfläche zur Datenpflege
- zusätzliche Speziallaufbahnen

## 19. Wichtige Hinweise für Änderungen

- Bildpfade immer mit `ranks.json` synchron halten
- bei Änderungen am Zustandsmodell ggf. `STORAGE_KEY` erhöhen
- Organigramm nur für fachlich passende Standardränge verwenden
- doppelte Rangnamen immer über interne IDs trennen
