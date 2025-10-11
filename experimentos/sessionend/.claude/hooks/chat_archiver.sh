#!/usr/bin/env bash
# chat_archiver.sh - Archiva la conversación y verifica .gitignore

set -euo pipefail

TOOLS_DIR="$(dirname "$0")/../tools"
ARCHIVE_DIR="${SESSIONEND_ARCHIVE_DIR:-./previousclaudechat}"

# Leer input JSON desde stdin
INPUT_JSON=$(cat)

# Verificar que tenemos Node.js
if ! command -v node &> /dev/null; then
  echo "⚠️  Node.js no encontrado, saltando chat archiver"
  exit 0
fi

# Crear directorio de archivo si no existe
mkdir -p "$ARCHIVE_DIR"

# Verificar/agregar a .gitignore
GITIGNORE_FILE=".gitignore"

if [ -f "$GITIGNORE_FILE" ]; then
  # Verificar si ya está en .gitignore
  if ! grep -q "^previousclaudechat/$" "$GITIGNORE_FILE" 2>/dev/null; then
    echo "" >> "$GITIGNORE_FILE"
    echo "# SessionEnd chat archives (auto-added)" >> "$GITIGNORE_FILE"
    echo "previousclaudechat/" >> "$GITIGNORE_FILE"
    echo "✅ Agregado 'previousclaudechat/' a .gitignore"
  fi
else
  # Crear .gitignore si no existe
  cat > "$GITIGNORE_FILE" <<EOF
# SessionEnd chat archives
previousclaudechat/
EOF
  echo "✅ Creado .gitignore con 'previousclaudechat/'"
fi

# Llamar al script Node.js que exporta la conversación
echo "$INPUT_JSON" | node "$TOOLS_DIR/export_conversation.js" "$ARCHIVE_DIR"

exit_code=$?

if [ $exit_code -eq 0 ]; then
  echo "💾 Chat archivado en $ARCHIVE_DIR"
else
  echo "⚠️  Error al archivar chat (código $exit_code)"
fi

exit 0
