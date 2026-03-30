# Frontend-Dokumentation

## Zweck

Das Frontend enthält den aktuell produktiven Kern der Anwendung.

Es übernimmt:

- UI und Navigation
- Auswahl von Modus, Teilstreitkräften und Kategorien
- Aufgabenerzeugung und Auswertung
- lokale Persistenz
- Spaced-Repetition-Logik
- PWA-Installation und Browser-Verhalten

## Technologien

- React 18
- Vite 5
- Tailwind CSS 3
- Tauri 2 für Desktop-Bundles
- `localStorage` für lokalen Zustand

## Relevante Dateien

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
- [frontend/src/components/ProgressPanel.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/ProgressPanel.jsx)
- [frontend/src/components/FeedbackMessage.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/FeedbackMessage.jsx)
- [frontend/src/components/StatsPage.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/StatsPage.jsx)
- [frontend/src/components/PwaInstallPanel.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/PwaInstallPanel.jsx)
- [frontend/src/components/CompletionDialog.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/CompletionDialog.jsx)
- [frontend/src/components/ShortcutButton.jsx](/home/konrad/BWI/DG%20Learner/frontend/src/components/ShortcutButton.jsx)

### Desktop-Build-Konfiguration

- [frontend/src-tauri/tauri.conf.json](/home/konrad/BWI/DG%20Learner/frontend/src-tauri/tauri.conf.json)
- [frontend/src-tauri/Cargo.toml](/home/konrad/BWI/DG%20Learner/frontend/src-tauri/Cargo.toml)

## Architektur

Die Anwendung verwendet bewusst keinen globalen Store.

Der Aufbau ist:

1. `App.jsx` hält den zentralen UI-Zustand und die View-Steuerung.
2. `usePersistentState` lädt und speichert den Zustand in `localStorage`.
3. `logic.js` kapselt die Fachlogik für Aufgaben, Bewertung und Spaced Repetition.
4. Komponenten bleiben weitgehend präsentationsorientiert und werden per Props versorgt.

## Persistierter Zustand

Der Initialzustand wird in `createInitialState()` aus
[frontend/src/utils/logic.js](/home/konrad/BWI/DG%20Learner/frontend/src/utils/logic.js) definiert.

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

Der Local-Storage-Key ist aktuell `dg-learner-state-v3`.

### Modi

- `image-input`
- `image-choice`
- `text-choice`
- `organigram`

### Lernlogik

- `standard`
- `spaced-repetition`

Im Organigramm-Modus wird Spaced Repetition automatisch deaktiviert.

## Rangdaten

Die Rohdaten liegen in [frontend/src/data/ranks.json](/home/konrad/BWI/DG%20Learner/frontend/src/data/ranks.json).

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

Bedeutung der Felder:

- `name`: Anzeigename des Dienstgrads
- `branch`: Teilstreitkraft
- `category`: Lernkategorie
- `group`: Ranggruppe
- `order`: Reihenfolge im Schema
- `image`: relativer Pfad aus `frontend/public`

In [frontend/src/data/ranks.js](/home/konrad/BWI/DG%20Learner/frontend/src/data/ranks.js) werden daraus:

- öffentliche Bildpfade mit `BASE_URL` aufgelöst
- interne IDs aus `branch`, `category` und normalisiertem Namen erzeugt

Das verhindert Kollisionen bei gleichlautenden Dienstgraden in mehreren Teilstreitkräften.

## Lernmodi

### Bild mit Texteingabe

- zeigt ein Rangabzeichen
- erwartet freie Eingabe
- normalisiert Groß-/Kleinschreibung, Umlaute und Sonderzeichen

### Bild mit Auswahl

- zeigt ein Rangabzeichen
- bietet vier Textoptionen
- wählt Distraktoren bevorzugt aus ähnlichem fachlichem Umfeld

### Text mit Bildauswahl

- zeigt den Dienstgrad als Text
- bietet mehrere Bildoptionen

### Organigramm einordnen

- zeigt ein Rangschema für die aktiven Teilstreitkräfte
- nutzt ausschließlich `standard`-Ränge
- verwaltet Platzierungen und Restkarten innerhalb der Aufgabe

## Spaced Repetition

Spaced Repetition ist für die drei Quiz-Modi aktivierbar.

Bewertungen:

- `again`
- `hard`
- `good`
- `easy`

Basisintervalle aus `logic.js`:

- `again`: 1 Minute
- `hard`: 6 Minuten
- `good`: 10 Minuten
- `easy`: 3 Tage

Zusätzlich:

- bestehende Intervalle werden bei `hard`, `good` und `easy` progressiv verlängert
- die zuletzt bewertete Karte wird nach Möglichkeit nicht sofort erneut gezeigt

## Aufgabenlogik

Die zentrale Fachlogik liegt in [frontend/src/utils/logic.js](/home/konrad/BWI/DG%20Learner/frontend/src/utils/logic.js).

Wichtige Funktionen:

- `normalizeAnswer`
- `getRanksForFilters`
- `createTask`
- `gradeTask`
- `revealOrganigramStep`
- `placeOnOrganigram`
- `autoPlaceNext`
- `applySpacedRepetitionRating`

Wesentliche Regeln:

- Organigramm erzwingt `standard` als Kategorie
- Spaced Repetition filtert auf fällige Karten
- Antwortoptionen werden zufällig gemischt

## URL-Parameter und Navigation

`App.jsx` unterstützt Startparameter über die URL:

- `view=stats`
- `view=training`
- `autostart=1`
- `mode=...`
- `branches=heer,marine,...`
- `categories=standard,...`
- `learning=standard|spaced-repetition`

Damit lassen sich Trainingsansichten direkt vorkonfigurieren.

## Bedienung und Feedback

Das Frontend enthält eine Desktop-orientierte Tastatursteuerung:

- `Enter`: nächste Aufgabe
- `L`: Lösung anzeigen
- `H`: zurück zur Startansicht

Feedback wird über `currentFeedback` verwaltet und enthält unter anderem:

- `status`
- `message`
- `solution`
- `awaitingReview`

Die Sitzungsstatistik erfasst:

- bearbeitete Aufgaben
- richtige Antworten
- falsche Antworten
- mit Hilfe gelöste Aufgaben
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
