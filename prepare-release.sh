#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION_INPUT="${1:-}"
TAG_OPTION="${2:-}"

usage() {
  cat <<'EOF'
Verwendung:
  ./prepare-release.sh <version> [--tag]

Beispiel:
  ./prepare-release.sh 0.1.1
  ./prepare-release.sh 0.1.1 --tag

Die Versionsnummer wird synchron aktualisiert in:
  - frontend/src-tauri/tauri.conf.json
  - frontend/src-tauri/Cargo.toml
  - frontend/package.json

Optional wird zusaetzlich ein Git-Tag im Format v<version> erzeugt.
EOF
}

if [[ -z "$VERSION_INPUT" ]]; then
  usage
  exit 1
fi

if [[ ! "$VERSION_INPUT" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Ungueltige Versionsnummer: $VERSION_INPUT"
  echo "Erwartet wird semantische Versionierung wie 0.1.1"
  exit 1
fi

if [[ -n "$TAG_OPTION" && "$TAG_OPTION" != "--tag" ]]; then
  usage
  exit 1
fi

TAURI_CONF="$ROOT_DIR/frontend/src-tauri/tauri.conf.json"
CARGO_TOML="$ROOT_DIR/frontend/src-tauri/Cargo.toml"
PACKAGE_JSON="$ROOT_DIR/frontend/package.json"
GIT_TAG="v$VERSION_INPUT"

replace_version_line() {
  local file_path="$1"
  local search_pattern="$2"
  local replacement="$3"

  perl -0pi -e "s/$search_pattern/$replacement/" "$file_path"
}

replace_version_line \
  "$TAURI_CONF" \
  '"version":\s*"[^"]+"' \
  "\"version\": \"$VERSION_INPUT\""

replace_version_line \
  "$CARGO_TOML" \
  'version = "[^"]+"' \
  "version = \"$VERSION_INPUT\""

replace_version_line \
  "$PACKAGE_JSON" \
  '"version":\s*"[^"]+"' \
  "\"version\": \"$VERSION_INPUT\""

echo "Versionsnummer aktualisiert auf $VERSION_INPUT"
echo "  - $TAURI_CONF"
echo "  - $CARGO_TOML"
echo "  - $PACKAGE_JSON"

if [[ "$TAG_OPTION" == "--tag" ]]; then
  if git -C "$ROOT_DIR" rev-parse "$GIT_TAG" >/dev/null 2>&1; then
    echo "Git-Tag existiert bereits: $GIT_TAG"
    exit 1
  fi

  git -C "$ROOT_DIR" tag "$GIT_TAG"
  echo "Git-Tag erstellt: $GIT_TAG"
fi

cat <<EOF

Naechste Schritte:
  1. Aenderungen pruefen: git diff
  2. Commit erstellen: git add . && git commit -m "Prepare release $GIT_TAG"
  3. Branch pushen: git push origin main
EOF

if [[ "$TAG_OPTION" == "--tag" ]]; then
  echo "  4. Tag pushen: git push origin $GIT_TAG"
else
  echo "  4. Tag erzeugen und pushen:"
  echo "     git tag $GIT_TAG"
  echo "     git push origin $GIT_TAG"
fi
