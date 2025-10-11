#!/usr/bin/env bash
# usage_snapshot.sh - Captura métricas de uso de tokens y costos

set -euo pipefail

TOOLS_DIR="$(dirname "$0")/../tools"
USAGE_DIR="${SESSIONEND_USAGE_DIR:-$HOME/.local/share/sessionend-usage}"

# Leer input JSON desde stdin
INPUT_JSON=$(cat)

# Verificar que tenemos Node.js
if ! command -v node &> /dev/null; then
  echo "⚠️  Node.js no encontrado, saltando usage snapshot"
  exit 0
fi

# Crear directorio de salida si no existe
mkdir -p "$USAGE_DIR"

# Llamar al script Node.js que procesa el JSONL
echo "$INPUT_JSON" | node "$TOOLS_DIR/usage_snapshot.js" "$USAGE_DIR"

exit_code=$?

if [ $exit_code -eq 0 ]; then
  echo "📊 Usage snapshot guardado en $USAGE_DIR"
else
  echo "⚠️  Error al generar usage snapshot (código $exit_code)"
fi

exit 0
