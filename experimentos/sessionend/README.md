# SessionEnd - Hooks Automáticos para Claude Code

Sistema de hooks que se ejecutan automáticamente al cerrar sesiones de Claude Code (`/exit`), capturando métricas de uso y archivando conversaciones.

## Características

✅ **Usage Tracking con datos reales**: Suma tokens/costos directamente desde el JSONL de Claude Code
✅ **Resumen automático**: Extrae el primer prompt como descripción (≤140 chars)
✅ **Chat Archiver**: Guarda conversaciones en formato texto plano legible
✅ **Protección Git**: Verifica/agrega `previousclaudechat/` a `.gitignore` automáticamente
✅ **Cero configuración manual**: Solo `/exit` y listo
✅ **Sin consumo de tokens**: Todo desde archivos locales

---

## Instalación Rápida

### 1. Copiar archivos al proyecto

```bash
cp -r experimentos/sessionend/.claude /path/to/tu/proyecto/
```

### 2. Configurar el hook

Copiar o fusionar con tu `.claude/settings.json`:

```bash
cp experimentos/sessionend/.claude/settings.example.json /path/to/tu/proyecto/.claude/settings.json
```

O agregar manualmente:

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/session_end_master.sh"
          }
        ]
      }
    ]
  }
}
```

### 3. Dar permisos de ejecución

```bash
chmod +x .claude/hooks/*.sh
chmod +x .claude/tools/*.js
```

### 4. ¡Listo!

Ahora cada vez que cierres Claude Code con `/exit`, se ejecutarán automáticamente:
- 📊 Usage snapshot → `~/.local/share/sessionend-usage/YYYY-MM-DD.json`
- 💾 Chat archivado → `./previousclaudechat/chat-YYYY-MM-DDTHH-MM-SS.txt`

---

## Estructura del Proyecto

```
.claude/
├── settings.json              # Configuración del hook
├── hooks/
│   ├── session_end_master.sh  # Orquestador principal
│   ├── usage_snapshot.sh      # Wrapper para usage tracking
│   └── chat_archiver.sh       # Wrapper para chat archive
└── tools/
    ├── usage_snapshot.js      # Procesa JSONL → métricas
    └── export_conversation.js # Procesa JSONL → texto plano
```

---

## Salidas Generadas

### 1. Usage Snapshot (métricas diarias)

**Ubicación**: `~/.local/share/sessionend-usage/2025-01-15.json`

```json
{
  "date": "2025-01-15",
  "sessions": [
    {
      "summary": "Implement SessionEnd hooks for usage tracking",
      "repo": "/home/motoko/dev/learningclaude",
      "branch": "main",
      "model": "claude-sonnet-4-5-20250929",
      "closedAt": "2025-01-15T14:30:22Z",
      "stats": {
        "message_count": 24,
        "input_tokens": 45230,
        "output_tokens": 18450,
        "cache_read_tokens": 12000,
        "cache_creation_tokens": 3200,
        "cost_usd": 0.4127
      }
    }
  ],
  "totals": {
    "message_count": 24,
    "input_tokens": 45230,
    "output_tokens": 18450,
    "cache_read_tokens": 12000,
    "cost_usd": 0.4127
  }
}
```

**Features**:
- Acumula múltiples sesiones del mismo día
- Tokens y costos **reales** (no estimados)
- Resumen automático desde primer prompt
- Totales diarios calculados

### 2. Chat Archive (conversaciones guardadas)

**Ubicación**: `./previousclaudechat/chat-2025-01-15T14-30-22.txt`

```
================================================================================
Conversación con Claude Code
================================================================================

📅 Fecha: 1/15/2025, 2:30:22 PM
📁 Directorio: /home/motoko/dev/learningclaude
🌿 Branch: main

================================================================================

### [1] Usuario
*2:15:00 PM*

Quiero implementar un sistema de hooks...

--------------------------------------------------------------------------------

### [2] Claude
*2:15:45 PM*

¡Por supuesto! Vamos a crear...
```

**Features**:
- Formato markdown legible
- Timestamps y metadata
- Tool calls incluidos
- Fácil búsqueda con `grep`

---

## Configuración Avanzada

### Variables de Entorno (opcional)

```bash
# Cambiar ubicación de usage logs
export SESSIONEND_USAGE_DIR="$HOME/mis-metricas"

# Cambiar ubicación de chat archives
export SESSIONEND_ARCHIVE_DIR="./mis-chats"
```

### Pricing Personalizado

Editar `.claude/tools/usage_snapshot.js` para agregar modelos:

```javascript
const PRICING = {
  'claude-sonnet-4-5-20250929': { in: 3.0, out: 15.0 },
  'tu-modelo-custom': { in: 5.0, out: 20.0 }
};
```

---

## Tabla Comparativa: Tareas Comunes en SessionEnd

| Tarea | Este Proyecto | Complejidad | Pros | Contras | Popularidad |
|-------|---------------|-------------|------|---------|-------------|
| **📊 Usage Tracking** | ✅ | Media | Datos reales, historial completo, análisis de costos | Requiere Node.js | ⭐⭐⭐⭐ |
| **💾 Chat Archiver** | ✅ | Baja | Backup automático, formato legible, protección .gitignore | Espacio en disco | ⭐⭐⭐⭐⭐ |
| **🔄 Git Auto-Commit** | ❌ | Baja | Rollback fácil, historial granular | Commits "sucios" | ⭐⭐⭐⭐⭐ |
| **🧹 Temp File Cleanup** | 📋 Roadmap | Muy Baja | Espacio liberado, repo limpio | Puede borrar cosas útiles | ⭐⭐⭐⭐ |
| **🔐 Secrets Scan** | 📋 Roadmap | Media | Seguridad, previene leaks | Falsos positivos | ⭐⭐⭐ |
| **📤 Push to Remote** | ❌ | Baja | Backup remoto | Puede romper CI | ⭐⭐ |
| **🧪 Quick Test Run** | ❌ | Media | Detección temprana de bugs | Demora el cierre | ⭐⭐⭐ |
| **📊 Observability Push** | ❌ | Alta | Dashboards, alertas | Requiere infra | ⭐⭐ |
| **📝 TODO Extractor** | 📋 Roadmap | Media | Tracking deuda técnica | Noise | ⭐⭐⭐ |

**Leyenda**: ✅ Incluido | ❌ No incluido | 📋 Roadmap

---

## Roadmap

### Versión 1.1 (próximamente)

- [ ] **🧹 Temp Cleanup**: Script opcional para limpiar `.tmp`, `__pycache__`, caches
- [ ] **🔐 Secrets Scan**: Verificar que no quedaron `.env` o keys sin proteger
- [ ] **📊 Dashboard HTML**: Generador de reportes visuales desde los JSONs
- [ ] **📧 Notificaciones**: Opcional Slack/Discord webhook al cerrar sesión

### Versión 1.2 (futuro)

- [ ] **📝 TODO Extractor**: Buscar `TODO:`, `FIXME:` y generar lista
- [ ] **🔄 Git Auto-Commit**: Integración opcional (modo experimental)
- [ ] **📈 Trending Analysis**: Script para analizar patrones de uso semanales
- [ ] **🗜️ Log Compression**: Auto-comprimir chats antiguos (>7 días)

---

## Buenas Prácticas

### ✅ Hacer

- Revisar periódicamente `~/.local/share/sessionend-usage/` para análisis de costos
- Usar `grep` en `previousclaudechat/` para buscar contexto de sesiones pasadas
- Commitear `.claude/hooks/` y `.claude/tools/` al repo (compartir con equipo)
- Revisar el `.gitignore` generado automáticamente

### ❌ Evitar

- No borrar `previousclaudechat/` sin backup (son tus únicos registros locales)
- No editar manualmente los JSONs de usage (se sobrescriben automáticamente)
- No desactivar la verificación de `.gitignore` (protección contra leaks)

---

## Troubleshooting

### "Node.js no encontrado"

Instalar Node.js:

```bash
# Ubuntu/Debian
sudo apt install nodejs

# macOS
brew install node

# O usar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

### "No se recibió transcript_path"

El hook solo funciona en sesiones de Claude Code reales. No funciona si ejecutás los scripts manualmente. Para testear:

```bash
# Simular input del hook
echo '{"transcript_path":"~/.claude/projects/abc/conversation.jsonl"}' | .claude/hooks/session_end_master.sh
```

### "Transcript no encontrado"

Claude Code guarda los transcripts en `~/.claude/projects/<project-id>/`. Si no existe, verificá que:
1. Estás usando Claude Code >= 1.0.85
2. La sesión tuvo al menos un mensaje
3. La ruta en `transcript_path` es correcta

### "previousclaudechat/ no se agregó a .gitignore"

Verificar que:
1. Estás en la raíz del repo Git
2. Tenés permisos de escritura en `.gitignore`
3. El script `chat_archiver.sh` tiene permisos de ejecución

---

## Preguntas Frecuentes

### ¿Funciona con Claude Max/Pro?

Sí, extrae tokens del JSONL independientemente del plan de suscripción.

### ¿Consume tokens adicionales?

No, todo se lee desde archivos locales.

### ¿Puedo usar solo Usage Tracking sin Chat Archiver?

Sí, comentá la línea correspondiente en `session_end_master.sh`.

### ¿Los chats se suben a GitHub?

No si el hook funciona correctamente (agrega a `.gitignore` automáticamente). Verificá siempre con `git status` antes de hacer push.

### ¿Puedo ver usage de múltiples días?

Sí, hay un JSON por día en `~/.local/share/sessionend-usage/`. Podés crear un script que los agregue:

```bash
jq -s 'map(.totals) | add' ~/.local/share/sessionend-usage/*.json
```

---

## Compatibilidad

| Feature | Claude Code | Requisitos |
|---------|-------------|------------|
| SessionEnd Hook | >= 1.0.85 | ✅ |
| transcript_path | >= 1.0.85 | ✅ |
| Node.js | >= 14.x | ✅ |
| Bash | >= 4.0 | ✅ |
| Git | >= 2.0 | ⚠️ Solo para .gitignore check |

**Plataformas**: Linux, macOS, WSL2

---

## Contribuir

Este es un proyecto experimental dentro de `learningclaude`. Para mejoras:

1. Testear cambios localmente
2. Agregar ejemplos en `examples/`
3. Actualizar este README
4. Documentar en el commit

---

## Licencia

MIT (o la que prefieras)

---

## Créditos

Desarrollado como parte del curso de Claude Code en español.

**Inspirado por**:
- [claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)
- [ccusage](https://github.com/ryoppippi/ccusage)
- Comunidad de Claude Code en GitHub

---

## Changelog

### v1.0.0 (2025-01-15)

- ✅ Implementación inicial
- ✅ Usage tracking con datos reales desde JSONL
- ✅ Chat archiver con formato markdown
- ✅ Protección automática .gitignore
- ✅ Resumen automático desde primer prompt
- ✅ Documentación completa

---

**¿Preguntas? ¿Bugs?** Reportá en el repo o creá un issue.
