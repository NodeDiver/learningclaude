#!/usr/bin/env bash
# session_end_master.sh - Orquestador principal del hook SessionEnd
# Ejecuta todas las tareas de cierre de sesión

set -euo pipefail

HOOKS_DIR="$(dirname "$0")"

# Leer input JSON desde stdin (Claude Code pasa datos al hook)
INPUT_JSON=$(cat)

echo "🔚 SessionEnd: ejecutando tareas de cierre..."

# Tarea 1: Usage snapshot (métricas de tokens/costos)
if [ -f "$HOOKS_DIR/usage_snapshot.sh" ]; then
  echo "$INPUT_JSON" | "$HOOKS_DIR/usage_snapshot.sh" || {
    echo "⚠️  usage_snapshot falló, continuando..."
  }
fi

# Tarea 2: Archivar conversación
if [ -f "$HOOKS_DIR/chat_archiver.sh" ]; then
  echo "$INPUT_JSON" | "$HOOKS_DIR/chat_archiver.sh" || {
    echo "⚠️  chat_archiver falló, continuando..."
  }
fi

echo "✅ SessionEnd completo"
