# Mobile Builds

Diese Dokumentation beschreibt den aktuellen Vorbereitungsstand fuer Android und iOS.

## Status

Das Projekt ist fuer Tauri-Desktop bereits eingerichtet. Android ist technisch anschlussfaehig und
ueber die vorhandene Tauri-CLI grundsaetzlich buildbar. iOS ist nur auf macOS mit Xcode lokal
moeglich.

## Android

### Bereits vorbereitet

- Tauri CLI mit Android-Unterstuetzung ist vorhanden
- Frontend-Build und Tauri-Konfiguration sind grundsaetzlich kompatibel
- in [frontend/package.json](/home/konrad/BWI/DG%20Learner/frontend/package.json) gibt es Skripte fuer Android
- lokaler Helfer: `./check_mobile_env.sh`
- lokaler Helfer: `./android_apk_build.sh`

### Noch lokal erforderlich

Fuer einen echten APK-Build auf diesem Rechner werden zusaetzlich benoetigt:

- Android SDK
- Android NDK
- Android Platform Tools inklusive `adb`
- gesetzte Umgebungsvariablen `ANDROID_HOME` und `NDK_HOME`
- passende Rust-Targets fuer Android

### Projektinitialisierung

Sobald SDK und NDK vorhanden sind, kann das Android-Projekt erzeugt werden mit:

```bash
cd frontend
npm run tauri:android:init
```

Danach erzeugt Tauri in der Regel Android-Dateien unter:

```text
frontend/src-tauri/gen/android/
```

### APK-Build

Empfohlener lokaler Ablauf:

```bash
./check_mobile_env.sh
./android_apk_build.sh
```

Alternativ direkt:

```bash
cd frontend
npm run tauri:android:apk
```

### Weitere Android-Skripte

- `npm run tauri:android:dev`
- `npm run tauri:android:apk`
- `npm run tauri:android:aab`
- `npm run tauri:android:apk:split`

## iOS / Apple

### Wichtige Grenze

iOS-Builds lassen sich nicht auf diesem Linux-System lokal erzeugen. Dafuer braucht ihr:

- macOS
- Xcode
- Apple Command Line Tools
- iOS-Simulator oder ein angeschlossenes Geraet
- Apple-Signing-Konfiguration

### Was bereits gilt

Das Frontend selbst ist portabel genug fuer eine spaetere iOS-Anbindung. Die eigentliche iOS-
Projektinitialisierung und der Build muessen aber auf einem Mac erfolgen.

### Sinnvoller naechster Schritt fuer iOS

Sobald ein Mac verfuegbar ist:

1. Repository dort klonen
2. Node, Rust und Xcode einrichten
3. pruefen, welche Tauri-iOS-Kommandos auf der Zielumgebung verfuegbar sind
4. iOS-Projekt initialisieren
5. Signierung und Bundle-Identifier festlegen

## Empfehlung

Die praktikable Reihenfolge fuer dieses Projekt ist:

1. zuerst Android-APK lokal oder auf einem Android-faehigen Build-Rechner vorbereiten
2. danach iOS separat auf macOS aufsetzen

So bleibt der mobile Ausbau in klar getrennten, beherrschbaren Schritten.
