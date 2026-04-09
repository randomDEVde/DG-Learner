# Veröffentlichung und Release

Diese Anleitung beschreibt den aktuellen Deployment- und Release-Stand des Projekts.

## Zielbild

Das Projekt wird über zwei Kanäle bereitgestellt:

1. Web-App über GitHub Pages
2. native Desktop-Builds über GitHub Actions

Ein dritter Pfad fuer Mobile-Builds wird lokal vorbereitet und separat dokumentiert unter
[Docs/mobile.md](/home/konrad/BWI/DG%20Learner/Docs/mobile.md).

Damit können Nutzer:

- die Anwendung direkt im Browser öffnen
- sie als PWA installieren
- oder Desktop-Artefakte aus GitHub Releases herunterladen

## Relevante Dateien

- Pages-Workflow: [deploy-pages.yml](/home/konrad/BWI/DG%20Learner/.github/workflows/deploy-pages.yml)
- Desktop-Workflow: [release-desktop.yml](/home/konrad/BWI/DG%20Learner/.github/workflows/release-desktop.yml)
- optionaler lokaler Deploy-Helfer: `./deploy_pages.sh`
- optionaler lokaler Desktop-Helfer: `./desktop_build.sh`

## GitHub Pages

### Aktivierung

Im GitHub-Repository unter `Settings` -> `Pages` muss als Quelle `GitHub Actions` gewählt sein.

### Verhalten

Der Workflow [deploy-pages.yml](/home/konrad/BWI/DG%20Learner/.github/workflows/deploy-pages.yml):

- läuft bei Pushes auf `main`
- kann zusätzlich manuell über `workflow_dispatch` gestartet werden
- installiert Frontend-Abhängigkeiten mit `npm ci`
- baut das Frontend
- veröffentlicht `frontend/dist` nach GitHub Pages

### Erneutes Deployment

Ein erneutes Pages-Deployment kann auf drei Wegen angestoßen werden:

1. neuer Push auf `main`
2. `Run workflow` in GitHub Actions
3. `Re-run jobs` für einen vorhandenen Lauf

Ein leerer Commit reicht dafür aus:

```bash
git checkout main
git pull origin main
git commit --allow-empty -m "Trigger pages redeploy"
git push origin main
```

Wenn der lokale Helfer verwendet wird, genügt:

```bash
./deploy_pages.sh
```

Für ein Redeploy ohne inhaltliche Änderung:

```bash
./deploy_pages.sh --empty-commit
```

## Native Desktop-Releases

Der Workflow [release-desktop.yml](/home/konrad/BWI/DG%20Learner/.github/workflows/release-desktop.yml)
baut:

- Windows als NSIS-Installer `.exe`
- Linux als `.deb` und `AppImage`
- macOS als universelle `.app` und `DMG` fuer Intel und Apple Silicon

### Trigger

Der Workflow startet:

- automatisch bei Git-Tags im Format `v*`
- optional manuell über GitHub Actions

Der verlässlichste Release-Weg im Projekt ist aktuell der Tag-basierte Ablauf.

### Release-Vorbereitung

Vor dem Release müssen die Versionsnummern synchron in diesen Dateien aktualisiert werden:

- [frontend/src-tauri/tauri.conf.json](/home/konrad/BWI/DG%20Learner/frontend/src-tauri/tauri.conf.json)
- [frontend/src-tauri/Cargo.toml](/home/konrad/BWI/DG%20Learner/frontend/src-tauri/Cargo.toml)
- [frontend/package.json](/home/konrad/BWI/DG%20Learner/frontend/package.json)

`desktop_build.sh` übernimmt diese Synchronisierung bereits automatisch.

### Empfohlener Release-Ablauf

Mit lokalem Helferskript:

```bash
./deploy_pages.sh
./desktop_build.sh 0.1.2
```

Manueller Fallback:

```bash
perl -0pi -e 's/"version":\s*"[^"]+"/"version": "0.1.2"/' frontend/src-tauri/tauri.conf.json
perl -0pi -e 's/version = "[^"]+"/version = "0.1.2"/' frontend/src-tauri/Cargo.toml
perl -0pi -e 's/"version":\s*"[^"]+"/"version": "0.1.2"/' frontend/package.json
git add frontend/src-tauri/tauri.conf.json frontend/src-tauri/Cargo.toml frontend/package.json
git commit -m "Prepare release v0.1.2"
git push origin main
git tag v0.1.2
git push origin v0.1.2
```

Danach erstellt GitHub Actions einen Draft-Release mit den erzeugten Artefakten.

### Wo liegen die Artefakte?

Nach erfolgreichem Lauf:

1. GitHub-Repository öffnen
2. `Releases` aufrufen
3. Draft-Release `DG Learner v<version>` öffnen
4. gewünschtes Artefakt herunterladen

Typische Download-Ziele:

- Windows: `.exe`
- Linux: `.deb` oder `AppImage`
- macOS: `.dmg`

Hinweis zu macOS:

- der Workflow baut macOS mit `--target universal-apple-darwin`
- dadurch ist der Download fuer Intel-Macs und Apple-Silicon-Macs geeignet

## Lokale Builds

Lokale Tauri-Builds sind möglich, aber nicht der primäre dokumentierte Release-Weg.

Dafür werden zusätzlich benötigt:

- Rust-Toolchain
- Tauri-CLI
- plattformspezifische Systemabhängigkeiten

Der CI-Workflow installiert die Linux-Abhängigkeiten bereits selbst auf dem Runner. Für Releases ist
deshalb GitHub Actions die bevorzugte Variante.
