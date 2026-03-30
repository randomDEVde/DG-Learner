# Veröffentlichung und Release

Diese Anleitung beschreibt den empfohlenen Weg, das Projekt samt Sourcecode auf GitHub zu
veröffentlichen und sowohl als Desktop-PWA als auch als nativen Desktop-Download bereitzustellen.

## 1. Zielbild

Empfohlen ist diese Kombination:

1. Sourcecode im GitHub-Repository veröffentlichen
2. Frontend zusätzlich automatisch über GitHub Pages deployen
3. native Desktop-Builds über GitHub Actions erzeugen

Damit gibt es:

- einen öffentlichen Code-Stand
- eine direkt nutzbare Anwendung ohne lokale Entwicklungsumgebung
- einen einfachen Installationsweg für Desktop über Browser-PWA
- native Installer und Desktop-Pakete für die drei Zielplattformen

## 2. Repository vorbereiten

Vor dem ersten Push sollte das Repository mindestens enthalten:

- den Sourcecode
- die Dokumentation
- das Startskript [start-test.sh](/home/konrad/BWI/DG%20Learner/start-test.sh)
- den Workflow [deploy-pages.yml](/home/konrad/BWI/DG%20Learner/.github/workflows/deploy-pages.yml)
- den Workflow [release-desktop.yml](/home/konrad/BWI/DG%20Learner/.github/workflows/release-desktop.yml)

## 3. Repository auf GitHub anlegen

Typischer Ablauf:

```bash
git init
git add .
git commit -m "Initial release"
git branch -M main
git remote add origin https://github.com/schmitzkonrad-hub/DG-Learner.git
git push -u origin main
```

## 4. GitHub Pages aktivieren

Im Repository auf GitHub:

1. `Settings`
2. `Pages`
3. bei `Source` die Option `GitHub Actions` wählen

Danach übernimmt der vorhandene Workflow das Deployment bei Pushes auf `main`.

## 5. GitHub Pages Workflow

Der Workflow unter [deploy-pages.yml](/home/konrad/BWI/DG%20Learner/.github/workflows/deploy-pages.yml):

- checkt das Repository aus
- installiert die Frontend-Abhängigkeiten
- baut das Frontend
- lädt `frontend/dist` als Pages-Artefakt hoch
- deployed die Seite nach GitHub Pages

## 6. Native Desktop-Releases

Für native Builds ist zusätzlich der Workflow
[release-desktop.yml](/home/konrad/BWI/DG%20Learner/.github/workflows/release-desktop.yml)
vorhanden.

Er erzeugt:

- Windows als `.exe`
- Linux als `.deb` und `AppImage`
- macOS als App-Bundle und `DMG`

Der Workflow läuft bei:

- Tags wie `v0.1.0`
- oder manuell über `workflow_dispatch`

Empfohlener Release-Ablauf:

```bash
./prepare-release.sh 0.1.0
git add .
git commit -m "Prepare release v0.1.0"
git push origin main
git tag v0.1.0
git push origin v0.1.0
```

Der Helfer [prepare-release.sh](/home/konrad/BWI/DG%20Learner/prepare-release.sh) synchronisiert die
Versionsnummer vor dem Tagging automatisch in:

- [frontend/src-tauri/tauri.conf.json](/home/konrad/BWI/DG%20Learner/frontend/src-tauri/tauri.conf.json)
- [frontend/src-tauri/Cargo.toml](/home/konrad/BWI/DG%20Learner/frontend/src-tauri/Cargo.toml)
- [frontend/package.json](/home/konrad/BWI/DG%20Learner/frontend/package.json)

Danach erstellt GitHub Actions einen Draft-Release mit den gebauten Desktop-Artefakten.

Für dieses Repository konkret:

- Repository: `https://github.com/schmitzkonrad-hub/DG-Learner`
- Workflow: `Actions` -> `Build Desktop Releases`
- EXE-Download nach erfolgreichem Lauf: `Releases` -> Draft-Release öffnen -> `.exe` herunterladen oder Release veröffentlichen

Wenn bereits ein Commit-Stand auf `main` liegt, reicht für den nächsten EXE-Build also:

```bash
./prepare-release.sh 0.1.0
git add .
git commit -m "Prepare release v0.1.0"
git push origin main
git tag v0.1.0
git push origin v0.1.0
```

## 7. Installation für Endnutzer

Nach dem Deployment können Nutzer:

1. die GitHub-Pages-URL öffnen
2. die App in Chrome oder Edge öffnen
3. `App installieren` wählen

Damit läuft die Anwendung als Desktop-PWA in einem eigenen Fenster.

Für native Downloads nutzen Endnutzer stattdessen die Release-Artefakte:

- unter Windows bevorzugt die `.exe`
- unter Linux `.deb` oder `AppImage`
- unter macOS das `DMG` oder das rohe App-Bundle

Empfohlen fuer externe Windows-Nutzer:

1. GitHub-Repository oeffnen
2. `Releases` aufrufen
3. die aktuelle `.exe` herunterladen
4. Installer ausfuehren

## 8. Lokaler Start für Entwickler

Wer das Repository lokal klont, startet am einfachsten so:

```bash
cd "<projektordner>"
./start-test.sh
```

Für Hot Reload:

```bash
./start-test.sh --dev
```

## 9. Wichtige Abgrenzung

Die native Build-Pipeline ist im Repository vorbereitet und für GitHub Actions ausgelegt.

Lokal gilt:

- für `tauri:build` werden Rust und die jeweiligen Plattform-Werkzeuge benötigt
- Windows-Builds inklusive `.exe` werden auf einem Windows-System oder dem Windows-GitHub-Runner erzeugt
- macOS-Builds werden auf macOS erzeugt
- Linux-Builds werden auf Linux erzeugt

Zusätzlicher Hinweis:

- der Windows-Installer wird jetzt als NSIS-Setup erzeugt und als `.exe` im GitHub-Release bereitgestellt
