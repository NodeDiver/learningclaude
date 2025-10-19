# Subcapítulo 9.H: MCP de Discord - Automatiza Comunidades y Comunicación

**Duración**: 55 minutos
**Dificultad**: Intermedio
**Prerrequisito**: Capítulo 9 (MCP Básico)

---

## 🎯 Objetivos de Aprendizaje

Al final de este subcapítulo, podrás:
- Entender qué es el MCP de Discord y sus capacidades
- Crear y configurar un bot de Discord
- Conectar Claude Code con servidores de Discord
- Enviar y leer mensajes en canales
- Gestionar servidores y miembros
- Automatizar moderación de comunidades
- Crear workflows de notificaciones
- Integrar Discord en tu flujo de desarrollo

---

## 📖 Lección 9.H.1: ¿Qué es el MCP de Discord?

El **MCP de Discord** conecta Claude Code con servidores de Discord a través de un bot, permitiéndote gestionar comunidades, automatizar comunicación y moderar canales usando lenguaje natural.

### Concepto Fundamental

Piensa en el MCP de Discord como un **asistente de comunidad automatizado**:

**Sin MCP de Discord:**
```
Tú: Necesito enviar una actualización a mi comunidad
  ↓ (abres Discord manualmente)
  ↓ (escribes el mensaje)
  ↓ (lo envías en cada canal)
Trabajo manual repetitivo
```

**Con MCP de Discord:**
```
Tú: "Envía una actualización sobre el nuevo release a todos los canales de anuncios"

Claude: [usa MCP Discord]
  → Se conecta al servidor
  → Identifica canales de anuncios
  → Envía mensajes personalizados
  → Confirma entrega

✓ Mensajes enviados en 3 canales
```

### ¿Qué Puede Hacer?

El MCP de Discord proporciona herramientas para:

✅ **Mensajería Automática**
- Enviar mensajes a canales específicos
- Leer historial de mensajes
- Agregar reacciones
- Responder en hilos

✅ **Gestión de Servidores**
- Listar canales y categorías
- Ver información del servidor
- Gestionar permisos
- Organizar canales

✅ **Moderación**
- Monitorear mensajes
- Detectar spam o contenido inapropiado
- Aplicar acciones de moderación
- Generar reportes

✅ **Automatización**
- Notificaciones de CI/CD
- Alertas de monitoreo
- Updates de releases
- Recordatorios automáticos

### Ventajas Clave

| Sin MCP Discord | Con MCP Discord |
|----------------|-----------------|
| Mensajes manuales en Discord | Automatización con lenguaje natural |
| Cambiar entre apps | Todo desde Claude |
| Moderación manual | Moderación asistida por IA |
| Notificaciones manuales | Notificaciones automáticas |
| **Manual y lento** | **Automático y rápido** ⚡ |

---

## 📖 Lección 9.H.2: Crear y Configurar Bot de Discord

### Paso 1: Crear Aplicación en Discord

1. **Ir al Discord Developer Portal**
```
https://discord.com/developers/applications
```

2. **Crear Nueva Aplicación**
```
Click "New Application"
→ Nombre: "Claude Code Bot"
→ Click "Create"
```

3. **Configurar Bot**
```
Left sidebar → "Bot"
→ Click "Add Bot"
→ Confirm "Yes, do it!"
```

### Paso 2: Configurar Permisos del Bot

**Permisos Requeridos:**

```
MESSAGE CONTENT INTENT (CRÍTICO):
☑ Message Content Intent
☑ Server Members Intent
☑ Presence Intent
```

**Bot Permissions:**
```
General Permissions:
☑ View Channels
☑ Manage Channels (opcional)

Text Permissions:
☑ Send Messages
☑ Send Messages in Threads
☑ Manage Messages
☑ Embed Links
☑ Attach Files
☑ Read Message History
☑ Add Reactions
```

### Paso 3: Obtener Token del Bot

```
Bot section → "Token"
→ Click "Reset Token"
→ Confirm
→ Click "Copy"

⚠️ IMPORTANTE: Guarda este token de forma segura
Nunca lo compartas públicamente
```

### Paso 4: Invitar Bot al Servidor

1. **Generar URL de Invitación**
```
Left sidebar → "OAuth2" → "URL Generator"

Scopes:
☑ bot

Bot Permissions:
☑ (Seleccionar los mismos de arriba)

→ Copy "Generated URL"
```

2. **Agregar Bot al Servidor**
```
Pega la URL en tu navegador
→ Selecciona tu servidor
→ Click "Authorize"
→ Completa captcha si es necesario
```

### Paso 5: Verificar Bot en Servidor

```
Abre Discord
→ Ve a tu servidor
→ Deberías ver el bot en la lista de miembros
→ Aparecerá como "OFFLINE" (normal, aún no está conectado)
```

---

## 📖 Lección 9.H.3: Instalación del MCP de Discord

### Opción 1: NPX (Más Rápida)

```bash
# No requiere instalación
# Se ejecutará directamente con npx
```

**Configuración en `.claude/mcp.json`:**
```json
{
  "servers": {
    "discord": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-discord"],
      "env": {
        "DISCORD_TOKEN": "tu_token_aquí",
        "DISCORD_GUILD_ID": "id_servidor_opcional"
      }
    }
  }
}
```

### Opción 2: Instalación Global

```bash
# Instalar globalmente
npm install -g mcp-discord

# Verificar instalación
which mcp-discord
```

**Configuración en `.claude/mcp.json`:**
```json
{
  "servers": {
    "discord": {
      "transport": "stdio",
      "command": "mcp-discord",
      "env": {
        "DISCORD_TOKEN": "tu_token_del_bot"
      }
    }
  }
}
```

### Opción 3: Desde Código Fuente

```bash
# Clonar repositorio
git clone https://github.com/barryyip0625/mcp-discord.git
cd mcp-discord

# Instalar dependencias
npm install

# Compilar
npm run build
```

**Configuración en `.claude/mcp.json`:**
```json
{
  "servers": {
    "discord": {
      "transport": "stdio",
      "command": "node",
      "args": ["/ruta/completa/a/mcp-discord/build/index.js"],
      "env": {
        "DISCORD_TOKEN": "tu_token_aquí"
      }
    }
  }
}
```

### Configuración Segura con Variables de Entorno

**Archivo: `.env`**
```bash
DISCORD_TOKEN=YOUR-DISCORD-BOT-TOKEN-HERE
DISCORD_GUILD_ID=123456789012345678
```

**Archivo: `.claude/mcp.json`**
```json
{
  "servers": {
    "discord": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-discord"],
      "env": {
        "DISCORD_TOKEN": "${DISCORD_TOKEN}",
        "DISCORD_GUILD_ID": "${DISCORD_GUILD_ID}"
      }
    }
  }
}
```

### Obtener Guild ID (ID del Servidor)

**Método 1: Desde Discord (Modo Desarrollador)**
```
1. Abre Discord → Settings → Advanced
2. Activa "Developer Mode"
3. Right-click en tu servidor
4. Click "Copy Server ID"
```

**Método 2: Desde URL**
```
URL de canal: discord.com/channels/GUILD_ID/CHANNEL_ID
                                 ↑ Este es el Guild ID
```

### Verificar Conexión

```bash
# Listar MCPs configurados
claude mcp list

# Deberías ver:
# discord (stdio) - mcp-discord

# Verificar que el bot está online
# Abre Discord y verifica que el bot aparece como "ONLINE"
```

---

## 📖 Lección 9.H.4: Enviar Mensajes

### Mensajes Simples

```
Tú: Envía un mensaje "Hola equipo!" al canal #general

Claude: [usa discord_send_message]
✓ Mensaje enviado a #general

"Hola equipo!"
```

### Mensajes Formateados

```
Tú: Envía un mensaje sobre el nuevo release al canal #announcements

Claude: [usa discord_send_message con formato]
✓ Mensaje enviado a #announcements

📢 **Nuevo Release v2.1.0**

Cambios principales:
• Mejoras de performance
• Corrección de bugs críticos
• Nueva interfaz de usuario

Documentación: https://docs.example.com
```

### Mensajes con Menciones

```
Tú: Notifica a @developers sobre el bug crítico en #tech

Claude: [usa discord_send_message]
✓ Mensaje enviado a #tech

@developers 🚨 Bug Crítico Detectado

Sistema de autenticación caído.
Prioridad: ALTA
Requiere atención inmediata.

Detalles: https://github.com/org/repo/issues/123
```

### Mensajes con Embeds (Ricos)

```
Tú: Crea un embed bonito para anunciar el evento en #events

Claude: [usa discord_send_message con embed]
✓ Embed enviado a #events

┌─────────────────────────────────┐
│ 🎉 Hackathon 2024               │
├─────────────────────────────────┤
│ Fecha: 25 de Octubre            │
│ Hora: 9:00 AM - 6:00 PM        │
│ Ubicación: Discord Virtual      │
│                                 │
│ Premios:                        │
│ 🥇 $1000                        │
│ 🥈 $500                         │
│ 🥉 $250                         │
│                                 │
│ Registro: hackathon.com/2024    │
└─────────────────────────────────┘
```

### Mensajes Programados

```
Tú: Envía un recordatorio diario a las 9 AM en #standup

Claude: [configura workflow]
✓ Recordatorio configurado

Se enviará todos los días a las 9:00 AM:
"🌅 Buenos días equipo! Hora del standup diario.
¿Qué hiciste ayer? ¿Qué harás hoy? ¿Algún blocker?"
```

---

## 📖 Lección 9.H.5: Leer y Analizar Mensajes

### Leer Historial de Canal

```
Tú: Muéstrame los últimos 10 mensajes de #support

Claude: [usa discord_get_messages]

Últimos 10 mensajes en #support:

1. @user1 (hace 5 min): "Mi app no arranca"
2. @moderator (hace 4 min): "¿Revisaste los logs?"
3. @user1 (hace 3 min): "Sí, error en línea 45"
4. @moderator (hace 2 min): "Envía el stack trace"
5. @user1 (hace 1 min): [archivo: error.log]
...

¿Quieres que analice el problema?
```

### Buscar Mensajes Específicos

```
Tú: Busca mensajes que mencionen "bug" en #tech

Claude: [busca en historial]

Encontrados 15 mensajes con "bug" en #tech (últimas 24h):

1. @alice (hace 3h): "Bug crítico en producción"
2. @bob (hace 2h): "Arreglé el bug de autenticación"
3. @charlie (hace 1h): "Nuevo bug reportado por cliente"
...

¿Quieres que los analice para encontrar patrones?
```

### Analizar Sentimiento

```
Tú: Analiza el sentimiento general en #feedback

Claude: [lee mensajes recientes y analiza]

Análisis de sentimiento en #feedback (últimos 50 mensajes):

😊 Positivo: 32 mensajes (64%)
  - "¡Excelente actualización!"
  - "Funciona perfecto ahora"

😐 Neutral: 12 mensajes (24%)
  - Preguntas técnicas
  - Discusiones generales

😞 Negativo: 6 mensajes (12%)
  - "La nueva UI es confusa"
  - "Performance ha empeorado"

Tendencia general: POSITIVA ✓
Temas recurrentes: UI, Performance
```

### Detectar Spam o Contenido Inapropiado

```
Tú: Revisa si hay spam en #general

Claude: [analiza mensajes]

⚠️ 3 mensajes sospechosos detectados en #general:

1. @suspicious_user (hace 10 min)
   - Mensaje repetido 5 veces
   - Contiene enlaces externos
   - Acción sugerida: Advertencia

2. @spam_bot (hace 5 min)
   - Patrón de bot detectado
   - Promociona servicios externos
   - Acción sugerida: Ban inmediato

3. @new_user (hace 2 min)
   - Lenguaje inapropiado
   - Primera infracción
   - Acción sugerida: Advertencia

¿Quieres que tome acción?
```

---

## 📖 Lección 9.H.6: Gestión de Servidores

### Listar Canales

```
Tú: Lista todos los canales del servidor

Claude: [usa discord_list_channels]

Servidor: "Mi Comunidad" (1,234 miembros)

📁 CATEGORÍAS Y CANALES:

📋 GENERAL
  #welcome
  #rules
  #announcements
  #general

💻 DESARROLLO
  #dev-chat
  #code-review
  #bugs
  #feature-requests

🎮 COMUNIDAD
  #off-topic
  #gaming
  #media

🔊 VOICE CHANNELS
  General Voice
  Dev Voice
  Gaming Voice

Total: 12 canales de texto, 3 de voz
```

### Ver Información del Servidor

```
Tú: Dame información completa del servidor

Claude: [usa discord_get_guild_info]

## Información del Servidor

**Nombre:** Mi Comunidad
**ID:** 123456789012345678
**Owner:** @admin
**Región:** US West
**Creado:** 15 de Enero 2023

**Estadísticas:**
- Miembros totales: 1,234
- Miembros online: 234
- Bots: 12
- Roles: 15
- Canales: 12 texto, 3 voz
- Emojis personalizados: 45

**Configuración:**
- Nivel de verificación: Medium
- Filtro de contenido: All Members
- Notificaciones: Only Mentions
- 2FA requerido: No

**Boosts:**
- Nivel: 2
- Boosts: 15
- Features: Banner, More Emojis, Better Audio
```

### Gestionar Miembros

```
Tú: Muéstrame los 10 miembros más activos esta semana

Claude: [analiza actividad]

Top 10 Miembros Más Activos (últimos 7 días):

1. @alice - 145 mensajes, 67 reacciones
   - Canales activos: #dev-chat, #general

2. @bob - 123 mensajes, 54 reacciones
   - Canales activos: #code-review, #bugs

3. @charlie - 98 mensajes, 43 reacciones
   - Canales activos: #feature-requests

4. @diana - 87 mensajes, 38 reacciones
   - Canales activos: #dev-chat, #general

[...]

Tendencia: +23% actividad vs semana anterior
```

### Gestionar Roles

```
Tú: Lista todos los roles y sus permisos

Claude: [usa discord_list_roles]

Roles en "Mi Comunidad":

👑 Admin (2 miembros)
   Permisos: ALL

🛡️ Moderator (5 miembros)
   Permisos: Manage Messages, Kick Members, Ban Members

💻 Developer (45 miembros)
   Permisos: Send Messages, Attach Files, Use External Emojis

🌟 VIP (12 miembros)
   Permisos: Priority Speaker, Skip Queue

👤 Member (1,170 miembros)
   Permisos: Send Messages, Read Messages

Total: 15 roles
```

---

## 📖 Lección 9.H.7: Moderación Automática

### Sistema de Advertencias

```
Tú: Implementa un sistema de advertencias automático

Claude: [configura moderación]

Sistema de Moderación Configurado:

📜 Reglas Automáticas:
1. Spam (3+ mensajes idénticos en 1 min)
   → Advertencia automática

2. Enlaces sospechosos
   → Mensaje eliminado + advertencia

3. Lenguaje inapropiado (lista de palabras)
   → Advertencia + timeout 10 min

4. Flood (10+ mensajes en 30 seg)
   → Timeout 5 minutos

Escalación:
- 1ra advertencia: Mensaje privado
- 2da advertencia: Timeout 1 hora
- 3ra advertencia: Kick
- 4ta advertencia: Ban permanente

Estado: ✓ ACTIVO
Monitoreando: #general, #off-topic
```

### Análisis de Moderación

```
Tú: Dame un reporte de moderación de la última semana

Claude: [genera reporte]

## Reporte de Moderación - Última Semana

**Acciones Tomadas:**
- Advertencias: 23
- Timeouts: 7
- Kicks: 2
- Bans: 1

**Infracciones por Tipo:**
📊 Spam: 45% (15 casos)
📊 Lenguaje inapropiado: 30% (10 casos)
📊 Enlaces sospechosos: 15% (5 casos)
📊 Flood: 10% (3 casos)

**Usuarios Problemáticos:**
1. @spammer123 - 5 advertencias (banned)
2. @toxic_user - 3 advertencias (kicked)
3. @flood_bot - 2 advertencias (timeout activo)

**Canales con Más Incidentes:**
1. #general - 45%
2. #off-topic - 32%
3. #gaming - 23%

**Recomendaciones:**
- Aumentar moderación en #general
- Revisar reglas sobre spam
- Considerar slow-mode en #off-topic
```

### Auto-Respuestas y FAQs

```
Tú: Configura respuestas automáticas para preguntas frecuentes

Claude: [configura bot de FAQ]

Auto-Respuestas Configuradas:

Trigger: "¿cómo instalar?"
Respuesta: →
"📦 Guía de Instalación

1. npm install @myapp/cli
2. myapp init
3. myapp login

Documentación completa: https://docs.myapp.com/install"

---

Trigger: "¿dónde reporto bugs?"
Respuesta: →
"🐛 Reportar Bugs

GitHub Issues: https://github.com/org/repo/issues
O usa /bug-report en #bugs

Por favor incluye:
- Descripción del problema
- Pasos para reproducir
- Versión de la app"

---

Trigger: "¿cuándo es el próximo release?"
Respuesta: →
"📅 Próximo Release

v2.2.0 - 1 de Noviembre 2024

Roadmap completo: https://roadmap.myapp.com
Únete a #announcements para updates"

Total: 10 auto-respuestas configuradas
Estado: ✓ ACTIVO
```

---

## 📖 Lección 9.H.8: Integraciones con Desarrollo

### Notificaciones de CI/CD

```
Tú: Notifica en #deployments cuando haya un nuevo deploy

Claude: [configura webhook de CI/CD]

Integración Configurada:

Trigger: GitHub Actions - Deploy Workflow
Canal: #deployments

Formato del mensaje:
"🚀 **Deploy Exitoso**

Ambiente: Production
Version: v2.1.3
Commit: abc1234 - "Fix critical bug"
Author: @alice
Duration: 2m 34s

Status: ✅ LIVE
URL: https://app.example.com

Changelog: https://github.com/org/repo/releases/v2.1.3"

Estado: ✓ CONECTADO
```

### Alertas de Monitoreo

```
Tú: Envía alertas críticas de monitoreo a #incidents

Claude: [configura alertas]

Alertas de Monitoreo → Discord:

🔴 CRÍTICO (respuesta inmediata)
→ #incidents + mention @on-call

🟡 WARNING (monitorear)
→ #monitoring

🟢 INFO (solo registro)
→ #monitoring (sin notificación)

Fuentes integradas:
- Datadog
- Sentry
- PagerDuty
- AWS CloudWatch

Formato:
"🚨 **ALERTA CRÍTICA**

Servicio: API Gateway
Error: High Response Time (>5s)
Severity: CRITICAL
Started: 2024-10-18 14:23:45 UTC

Impact: 45% requests afectadas
Region: us-east-1

Dashboard: [link]
Runbook: [link]

@on-call"
```

### Notificaciones de Pull Requests

```
Tú: Notifica en #code-review cuando hay PRs nuevos

Claude: [configura GitHub webhook]

GitHub → Discord Configurado:

Eventos:
✓ Pull Request Opened
✓ Pull Request Review Requested
✓ Pull Request Merged
✓ Pull Request Comments

Canal: #code-review

Ejemplo de notificación:
"📝 **Nuevo Pull Request**

#245 - Add user authentication system
Por: @alice
Review requested: @bob, @charlie

Changes:
+450 -120 líneas
5 archivos modificados

Labels: enhancement, backend

Ver PR: https://github.com/org/repo/pull/245"

Estado: ✓ ACTIVO
```

---

## 🛠️ Ejercicios Prácticos

### Ejercicio 9.H.1: Configuración Básica
1. Crea un bot de Discord en Developer Portal
2. Configura los permisos necesarios
3. Invita el bot a un servidor de prueba
4. Configura el MCP de Discord en Claude
5. Verifica que el bot aparezca online

### Ejercicio 9.H.2: Mensajería
1. Envía un mensaje simple a un canal
2. Envía un mensaje formateado con markdown
3. Crea un embed rico con información
4. Lee los últimos 20 mensajes de un canal
5. Busca mensajes que contengan una palabra clave

### Ejercicio 9.H.3: Gestión de Servidor
1. Lista todos los canales de tu servidor
2. Obtén información completa del servidor
3. Identifica los 5 miembros más activos
4. Lista todos los roles y sus permisos
5. Analiza la actividad por canal

### Ejercicio 9.H.4: Moderación
1. Configura un sistema de detección de spam
2. Implementa filtro de palabras inapropiadas
3. Crea auto-respuestas para 3 FAQs
4. Genera un reporte de moderación semanal
5. Configura escalación de advertencias

### Ejercicio 9.H.5: Integración CI/CD
1. Conecta notificaciones de GitHub Actions
2. Configura alertas de monitoreo
3. Implementa notificaciones de PRs
4. Crea un canal de releases automático
5. Configura reportes diarios de actividad

---

## 📝 Examen 9.H: Maestría del MCP de Discord

### Parte 1: Preguntas Teóricas (3 puntos)

**Pregunta 1:** ¿Cuáles son los 3 permisos más importantes que debe tener un bot de Discord para funcionar con el MCP?

**Pregunta 2:** ¿Cuál es la diferencia entre usar Discord MCP vs gestionar Discord manualmente?

**Pregunta 3:** ¿Qué medidas de seguridad debes tomar al configurar el token del bot?

### Parte 2: Configuración (2 puntos)

1. Muestra cómo configurarías Discord MCP en `.claude/mcp.json`
2. ¿Cómo obtendrías de forma segura el token del bot?
3. Explica el proceso completo de creación e invitación del bot

### Parte 3: Práctica - Automatización (5 puntos)

**Tareas:**
1. Crea un sistema de bienvenida automático para nuevos miembros
2. Implementa detección de spam en #general
3. Configura notificaciones de deploy en #announcements
4. Crea un comando de FAQ automático
5. Genera un reporte semanal de actividad

Documenta todo el proceso con ejemplos.

### Parte 4: Proyecto Real (Bonus +3 puntos)

**Opción A: Sistema de Moderación Completo**
1. Implementa un sistema de moderación con 5 reglas
2. Configura escalación de advertencias
3. Crea reportes automáticos para moderadores
4. Implementa auto-respuestas para 10 FAQs
5. Genera métricas de efectividad

**Opción B: Centro de Notificaciones DevOps**
1. Integra GitHub (PRs, Issues, Releases)
2. Conecta sistema de monitoring (alerts)
3. Configura notificaciones de CI/CD
4. Implementa resúmenes diarios automáticos
5. Crea dashboard de métricas en Discord

---

## ✅ Checklist de Dominio

**Configuración**
- [ ] Crear bot en Discord Developer Portal
- [ ] Configurar permisos correctos
- [ ] Invitar bot al servidor
- [ ] Instalar Discord MCP
- [ ] Verificar conexión

**Mensajería**
- [ ] Enviar mensajes simples
- [ ] Crear mensajes formateados
- [ ] Usar embeds
- [ ] Leer historial de mensajes
- [ ] Buscar en mensajes

**Gestión**
- [ ] Listar canales y categorías
- [ ] Ver información del servidor
- [ ] Analizar actividad de miembros
- [ ] Gestionar roles
- [ ] Organizar canales

**Moderación**
- [ ] Detectar spam
- [ ] Filtrar contenido
- [ ] Sistema de advertencias
- [ ] Auto-respuestas FAQ
- [ ] Reportes de moderación

**Integraciones**
- [ ] Notificaciones de CI/CD
- [ ] Alertas de monitoring
- [ ] GitHub webhooks
- [ ] Reportes automáticos

---

## 💡 Mejores Prácticas

### 1. Seguridad del Token

```
✅ Bueno:
- Usar variables de entorno
- Nunca commitear tokens
- Regenerar si se compromete
- Usar .env para desarrollo

❌ Evitar:
- Hardcodear tokens en código
- Compartir tokens públicamente
- Subir .env a Git
- Usar mismo token en múltiples bots
```

### 2. Permisos del Bot

```
✅ Bueno:
- Dar solo permisos necesarios
- Revisar permisos periódicamente
- Documentar qué hace cada permiso
- Usar roles específicos

❌ Evitar:
- Dar permisos de Administrator
- Permisos innecesarios
- Permisos en todos los canales
- No documentar permisos
```

### 3. Moderación Responsable

```
✅ Bueno:
- Reglas claras y públicas
- Sistema de escalación justo
- Logs de todas las acciones
- Revisión humana para bans

❌ Evitar:
- Bans automáticos sin revisión
- Reglas ambiguas
- No registrar acciones
- Moderación inconsistente
```

### 4. Notificaciones

```
✅ Bueno:
- Mensajes concisos y claros
- Usar canales específicos
- Respetar @mentions
- Incluir links relevantes

❌ Evitar:
- Spam de notificaciones
- @everyone innecesario
- Mensajes sin contexto
- Notificaciones duplicadas
```

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Discord MCP Server (GitHub)](https://github.com/barryyip0625/mcp-discord)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord.js Guide](https://discordjs.guide/)
- [Discord API Documentation](https://discord.com/developers/docs)

### Tutoriales
- [Creating Your First Bot](https://discord.com/developers/docs/getting-started)
- [Discord Bot Best Practices](https://discord.com/developers/docs/topics/community-resources)

### Herramientas
- [Discord Bot List](https://top.gg/)
- [Discord Permissions Calculator](https://discordapi.com/permissions.html)

---

**¡Subcapítulo 9.H Completo!**

Has aprendido a automatizar Discord con Claude Code usando el MCP de Discord.

**Anterior**: [Alby MCP (9.G)](./capitulo_09_mcp_alby.md)
**Siguiente**: [README - Índice MCPs](./README.md)
**Índice**: [Carpeta MCPs](./README.md)
