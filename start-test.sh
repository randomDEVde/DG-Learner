#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"
BACKEND_VENV_DIR="$BACKEND_DIR/.venv"

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

require_command() {
  local command_name="$1"
  local help_text="$2"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Fehlender Befehl: $command_name"
    echo "$help_text"
    exit 1
  fi
}

ensure_frontend_dependencies() {
  require_command "node" "Bitte Node.js installieren."
  require_command "npm" "Bitte npm installieren."

  if [[ ! -d "$FRONTEND_DIR/node_modules" ]] || [[ "$FRONTEND_DIR/package.json" -nt "$FRONTEND_DIR/node_modules" ]]; then
    echo "Installiere Frontend-Abhaengigkeiten..."
    (cd "$FRONTEND_DIR" && npm install)
  fi
}

ensure_backend_dependencies() {
  if [[ ! -f "$BACKEND_DIR/requirements.txt" ]]; then
    return
  fi

  require_command "python3" "Bitte Python 3 installieren."

  if [[ ! -d "$BACKEND_VENV_DIR" ]]; then
    echo "Erstelle Backend-Virtualenv..."
    python3 -m venv "$BACKEND_VENV_DIR"
  fi

  if [[ ! -x "$BACKEND_VENV_DIR/bin/uvicorn" ]] || [[ "$BACKEND_DIR/requirements.txt" -nt "$BACKEND_VENV_DIR" ]]; then
    echo "Installiere Backend-Abhaengigkeiten..."
    "$BACKEND_VENV_DIR/bin/pip" install -r "$BACKEND_DIR/requirements.txt"
  fi
}

start_backend() {
  if [[ ! -f "$BACKEND_DIR/requirements.txt" ]]; then
    echo "Backend uebersprungen: keine requirements.txt gefunden."
    return
  fi

  (
    cd "$BACKEND_DIR"
    "$BACKEND_VENV_DIR/bin/uvicorn" app.main:app --reload
  ) &
  BACKEND_PID=$!
  echo "Backend gestartet: http://127.0.0.1:8000"
}

ensure_frontend_dependencies
ensure_backend_dependencies

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
  echo "Frontend konnte nicht vorbereitet werden."
  exit 1
fi

start_backend
echo "Frontend startet gleich auf:"
echo "  Lokal: http://localhost:5173"
echo "  Im WLAN: http://<deine-ip>:5173"

cd "$FRONTEND_DIR"
exec npm run dev -- --host
