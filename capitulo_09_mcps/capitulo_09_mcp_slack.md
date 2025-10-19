# Subcapítulo 9.C: MCP de Slack - Automatiza Comunicación de Equipo

**Duración**: 50 minutos
**Dificultad**: Intermedio
**Prerrequisito**: Capítulo 9 (MCP Básico)

---

## 🎯 Objetivos de Aprendizaje

Al final de este subcapítulo, podrás:
- Entender qué es el MCP de Slack y su potencial de automatización
- Configurar el servidor MCP de Slack con autenticación OAuth
- Enviar mensajes y notificaciones a canales y usuarios
- Buscar y analizar conversaciones históricas
- Automatizar notificaciones de CI/CD y deployments
- Crear workflows de comunicación para equipos
- Integrar Slack en tu pipeline de desarrollo
- Gestionar canales, hilos y reacciones programáticamente

---

## 📖 Lección 9.C.1: ¿Qué es el MCP de Slack?

El **MCP de Slack** es un servidor que conecta Claude Code directamente con Slack, permitiéndote automatizar comunicaciones, enviar notificaciones, buscar mensajes y crear workflows de equipo sin salir de tu conversación con Claude.

### Concepto Fundamental

Piensa en el MCP de Slack como un **asistente de comunicación automática**:

**Sin MCP de Slack:**
```
Tú ←→ Claude Code
       ↓ (manualmente)
   Navegador ←→ Slack
   (envías mensajes manualmente)
```

**Con MCP de Slack:**
```
Tú ←→ Claude Code ←→ MCP Slack ←→ Slack API
     ("notifica al equipo que deployé" → mensaje automático)
```

### ¿Qué Puede Hacer?

El MCP de Slack proporciona **herramientas poderosas** para:

✅ **Mensajería Automatizada**
- Enviar mensajes a canales específicos
- Mensajes directos a usuarios
- Formateo rico (bold, code blocks, listas)
- Adjuntar archivos y snippets de código

✅ **Gestión de Conversaciones**
- Crear y responder en hilos (threads)
- Buscar mensajes históricos
- Listar canales y miembros
- Agregar reacciones (emojis)

✅ **Notificaciones de CI/CD**
- Alertas de builds exitosos/fallidos
- Notificaciones de deployments
- Reportes de tests automáticos
- Mensajes de status de pipelines

✅ **Workflows de Equipo**
- Daily standups automatizados
- Reportes de progreso
- Alertas de issues críticos
- Recordatorios y seguimientos

✅ **Búsqueda y Análisis**
- Buscar información en canales
- Analizar conversaciones pasadas
- Extraer decisiones técnicas
- Encontrar snippets de código compartidos

✅ **Gestión de Canales**
- Crear canales automáticamente
- Invitar usuarios a canales
- Archivar/desarchivar canales
- Configurar tópicos y descripciones

### Ventajas Clave

| Sin MCP Slack | Con MCP Slack |
|---------------|---------------|
| Cambiar entre editor y Slack | Todo desde Claude Code |
| Copy/paste mensajes manualmente | Generación automática |
| Buscar info en Slack manualmente | Claude busca y resume |
| Notificaciones manuales | Automatización completa |
| Contexto fragmentado | Flujo de trabajo integrado |
| **Interrupciones constantes** | **Automatización fluida** ⚡ |

---

## 📖 Lección 9.C.2: Instalación y Configuración

### Paso 1: Crear Slack App

Antes de configurar el MCP, necesitas crear una aplicación en Slack:

**1. Ir a [api.slack.com/apps](https://api.slack.com/apps)**

**2. Click "Create New App" → "From scratch"**
```
App Name: Claude Code Notifier
Workspace: [Tu workspace]
```

**3. Configurar OAuth & Permissions**

Agregar estos scopes en **Bot Token Scopes**:
```
chat:write          - Enviar mensajes
chat:write.public   - Enviar a canales públicos sin unirse
channels:read       - Listar canales
channels:history    - Leer historial de canales
groups:read         - Listar canales privados
groups:history      - Leer historial privados
im:write           - Enviar DMs
users:read         - Listar usuarios
files:write        - Subir archivos
reactions:write    - Agregar reacciones
```

**4. Instalar App al Workspace**
```
Click "Install to Workspace"
Autorizar permisos
Copiar "Bot User OAuth Token" (xoxb-...)
```

### Paso 2: Instalar el Servidor MCP

```bash
# Instalar el MCP de Slack
npm install -g @modelcontextprotocol/server-slack

# O usando Claude Code CLI
claude mcp add --transport stdio \
  --name slack \
  --command "npx" \
  --args "-y @modelcontextprotocol/server-slack"
```

### Paso 3: Configuración Manual

**Archivo: `.claude/mcp.json`** (proyecto específico)
```json
{
  "servers": {
    "slack": {
      "transport": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-slack"
      ],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token-here",
        "SLACK_TEAM_ID": "T01234567"
      }
    }
  }
}
```

O en **`~/.claude/mcp.json`** (global - todos los proyectos)

### Paso 4: Usar Variables de Entorno (Recomendado)

Para seguridad, usa variables de entorno:

**Archivo: `.env`**
```bash
SLACK_BOT_TOKEN=xoxb-YOUR-BOT-TOKEN-HERE
SLACK_TEAM_ID=T01234567
```

**Actualiza `mcp.json`:**
```json
{
  "servers": {
    "slack": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    }
  }
}
```

### Paso 5: Configuración Multi-Workspace

Si trabajas con múltiples workspaces de Slack:

```json
{
  "servers": {
    "slack-empresa": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_TOKEN_EMPRESA}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_EMPRESA}"
      }
    },
    "slack-personal": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_TOKEN_PERSONAL}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_PERSONAL}"
      }
    }
  }
}
```

### Verificar Instalación

```bash
# Listar servidores MCP
claude mcp list

# Salida esperada:
# slack (stdio) - @modelcontextprotocol/server-slack [connected ✓]
```

### Probar Conexión

```
Tú: ¿Puedes conectarte a Slack?

Claude: [usa slack_test_connection]
✓ Conexión exitosa a Slack
Workspace: Mi Empresa
Bot User: @claude-code-bot
Team ID: T01234567
Canales accesibles: 23
```

---

## 📖 Lección 9.C.3: Envío de Mensajes

### Herramienta: slack_post_message

Envía mensajes a canales o usuarios directamente.

**Sintaxis básica:**
```
Tú: Envía un mensaje al canal #general diciendo "Deploy completado"

Claude: [usa slack_post_message]
✓ Mensaje enviado a #general

Mensaje:
Deploy completado

URL: https://myworkspace.slack.com/archives/C01234567/p1697654400
```

### Formateo Rico

Slack soporta formato Markdown:

```
Tú: Envía un mensaje al #dev-team con el reporte del build

Claude: [genera mensaje formateado]

✓ Mensaje enviado a #dev-team:

*Build Status Report* 🚀

*Environment:* Production
*Branch:* main
*Commit:* abc1234
*Status:* ✅ Success

*Changes:*
• Fixed authentication bug
• Updated dependencies
• Improved performance

*Metrics:*
• Build time: 3m 45s
• Tests passed: 145/145
• Coverage: 87%

*Next steps:*
1. Monitor production metrics
2. Update changelog
3. Notify stakeholders

Deploy link: https://app.example.com
```

### Código y Snippets

```
Tú: Comparte este código con el equipo en #backend

const getUserById = async (id) => {
  const user = await db.users.findUnique({
    where: { id },
    include: { profile: true }
  });
  return user;
};

Claude: [formatea como code block]

✓ Mensaje enviado a #backend:

Aquí está la función para obtener usuario por ID:

```javascript
const getUserById = async (id) => {
  const user = await db.users.findUnique({
    where: { id },
    include: { profile: true }
  });
  return user;
};
```

Usar con:
`const user = await getUserById(123);`
```

### Mensajes Directos

```
Tú: Envía un DM a @maria recordándole el code review

Claude: [usa slack_post_message con DM]
✓ Mensaje directo enviado a @maria

Hola María 👋

Recordatorio amistoso: el PR #245 está esperando tu review.

Link: https://github.com/empresa/proyecto/pull/245

Gracias!
```

---

## 📖 Lección 9.C.4: Gestión de Hilos (Threads)

### Crear y Responder en Hilos

**Herramienta: slack_post_thread_reply**

```
Tú: El mensaje del deploy creó conversación, responde en el hilo con detalles

Claude: [responde en thread del mensaje original]

✓ Respuesta agregada al hilo:

Detalles del deployment:

*Performance Improvements:*
• API response time: 450ms → 180ms (60% faster)
• Page load time: 2.3s → 1.1s (52% faster)
• Database queries: Reduced by 35%

*Changes Deployed:*
1. Implemented Redis caching
2. Optimized database indexes
3. Lazy loading for images
4. Code splitting for bundles

*Rollback Plan:*
Si hay problemas: `./scripts/rollback.sh v2.4.1`

Monitoring: https://grafana.company.com/dashboard
```

### Mantener Conversaciones Organizadas

```
Tú: Cuando envíes notificaciones de builds, usa siempre threads

Claude: Configurado. Ahora los reportes de build se organizan así:

Mensaje principal (en canal):
"🔨 Build iniciado - Branch: feature/new-auth"

Respuestas en hilo:
  ↳ "✅ Tests passed (2m 15s)"
  ↳ "✅ Linting passed"
  ↳ "✅ Build successful (3m 45s)"
  ↳ "🚀 Deployed to staging"

Esto mantiene el canal limpio y organizado.
```

---

## 📖 Lección 9.C.5: Búsqueda de Mensajes

### Herramienta: slack_search_messages

Busca mensajes históricos en canales.

**Ejemplo 1: Buscar decisiones técnicas**
```
Tú: Busca en #arquitectura conversaciones sobre "migración a PostgreSQL"

Claude: [usa slack_search_messages]

Encontrados 8 mensajes sobre "migración a PostgreSQL":

1. @carlos (2025-09-15):
   "Propongo migrar a PostgreSQL por mejor soporte JSON
    y performance en queries complejas"
   💡 Reacciones: 5 👍

2. @maria (2025-09-16):
   "Analicé el impacto. Estimado: 2 semanas de migración.
    Principales tablas: users (50k), orders (200k)"
   📊 Archivo adjunto: migration-plan.pdf

3. @pedro (2025-09-18):
   "Migración completada en staging. Tests pasando.
    Performance mejoró 40%"
   ✅ 3 reacciones

Resumen de decisión:
- Aprobada por equipo
- Completada en staging
- Performance mejorada significativamente
```

### Buscar Código Compartido

```
Tú: Busca en #backend ejemplos de autenticación JWT que hayamos compartido

Claude: [busca code snippets]

Encontrados 3 snippets de JWT:

1. @juan (2025-08-20):
```javascript
const generateToken = (userId) => {
  return jwt.sign(
    { userId, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};
```

2. @ana (2025-09-05):
```javascript
const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError();
  }
};
```

¿Quieres que combine estos en una solución completa?
```

### Extraer Información de Reuniones

```
Tú: Resume las decisiones del daily standup de hoy en #daily

Claude: [busca y analiza mensajes de hoy]

📋 Resumen Daily Standup - 2025-10-18

*Participantes:* @carlos, @maria, @pedro, @ana

*Completado ayer:*
✅ @carlos: Implementó cache en API
✅ @maria: Code review de 3 PRs
✅ @pedro: Arreglé bug de login
✅ @ana: Actualicé documentación

*Plan para hoy:*
🎯 @carlos: Deploy a staging
🎯 @maria: Iniciar feature de notificaciones
🎯 @pedro: Optimizar queries lentas
🎯 @ana: Tests E2E para checkout

*Blockers:*
⚠️ @pedro: Necesita acceso a DB de producción
   → @maria le dará acceso read-only

*Decisiones:*
• Feature freeze el viernes para release
• Code review obligatorio antes de mergear
• Próximo sprint planning: lunes 10am
```

---

## 📖 Lección 9.C.6: Automatización de CI/CD

### Notificaciones de Build

**Workflow automático:**
```
Tú: Cuando haga commits, notifica al equipo el estado del build

Claude: Configuraré notificaciones automáticas de CI/CD.

Cuando hagas commit, monitorizaré GitHub Actions y:

✅ Build exitoso:
"✅ Build successful
Branch: feature/auth
Commit: abc1234 - 'Add JWT authentication'
Time: 3m 45s
Tests: 145/145 passed
Deploy: Staging actualizado
https://staging.app.com"

❌ Build fallido:
"❌ Build failed
Branch: feature/auth
Commit: abc1234
Failed at: Run tests
Error: TypeError: Cannot read property...
Logs: https://github.com/repo/actions/runs/123
@developer por favor revisa"

¿En qué canal quieres las notificaciones?
```

### Reporte de Deployment

```
Tú: Acabé de hacer deploy a producción, notifica al equipo

Claude: [genera reporte detallado]

✓ Mensaje enviado a #deploys:

🚀 *DEPLOYMENT TO PRODUCTION*

*Release:* v2.5.0
*Deployed by:* @developer
*Time:* 2025-10-18 14:30:00 UTC
*Duration:* 5m 12s

*What's New:*
✨ JWT Authentication System
✨ User Profile Management
✨ Password Reset Flow
🐛 Fixed login redirect bug
🐛 Resolved session timeout issue
⚡ Performance improvements (40% faster)

*Database Migrations:*
• Added table: user_sessions
• Added column: users.last_login
• Created index: idx_sessions_user

*Metrics (last 5 min):*
📊 Response time: 185ms avg
📊 Error rate: 0.02%
📊 Active users: 1,234

*Monitoring:*
https://grafana.company.com/prod

*Rollback:*
If issues: `kubectl rollout undo deployment/api`

cc: @tech-lead @product-manager
```

### Alertas de Tests Fallidos

```
Tú: Si los tests fallan en CI, notifícame inmediatamente

Claude: Configuraré alertas inmediatas.

Cuando tests fallen, enviaré a #dev-alerts:

⚠️ *TEST FAILURE ALERT*

*Branch:* feature/checkout
*Commit:* def5678
*Failed tests:* 3/145

*Failed:*
❌ PaymentService.processPayment
   Error: Stripe API timeout
   File: src/services/payment.spec.ts:45

❌ OrderController.createOrder
   Error: Validation failed for amount
   File: src/controllers/order.spec.ts:78

❌ CartService.calculateTotal
   Error: Tax calculation incorrect
   File: src/services/cart.spec.ts:23

*Action required:*
@developer please fix before merging

*Logs:*
https://github.com/repo/actions/runs/456
```

---

## 📖 Lección 9.C.7: Workflows de Equipo

### Daily Standup Automatizado

```
Tú: Crea un recordatorio diario para el standup a las 9am

Claude: Configuraré recordatorio automático.

Cada día a las 9:00 AM enviaré a #daily:

🌅 *Good morning team!*

Time for daily standup. Please share:

1️⃣ *What you completed yesterday*
2️⃣ *What you're working on today*
3️⃣ *Any blockers?*

Format:
```
✅ Yesterday: [tu trabajo]
🎯 Today: [tu plan]
⚠️ Blockers: [si hay alguno]
```

Empecemos! 👇

cc: @dev-team
```

### Reporte Semanal de Progreso

```
Tú: Cada viernes genera un reporte de lo que logramos en la semana

Claude: Programaré reporte semanal automático.

Cada viernes a las 5pm en #weekly-reports:

📊 *WEEKLY PROGRESS REPORT*
Week of Oct 14-18, 2025

*Development Velocity:*
• PRs merged: 23
• Issues closed: 18
• Code reviews: 45
• Commits: 156

*Top Contributors:*
🥇 @maria - 8 PRs merged
🥈 @carlos - 6 PRs merged
🥉 @pedro - 5 PRs merged

*Features Shipped:*
✅ JWT Authentication System
✅ User Profile Management
✅ Email Notifications
✅ Admin Dashboard v1

*Bug Fixes:*
🐛 Login redirect issue (#234)
🐛 Session timeout bug (#245)
🐛 Mobile menu not responsive (#256)

*Performance:*
⚡ API response: 450ms → 180ms
⚡ Page load: 2.3s → 1.1s
⚡ Test suite: 8m → 4m

*Next Week Goals:*
🎯 Payment integration
🎯 Order management system
🎯 Mobile app release

*Blockers:*
None 🎉

Great week team! 🚀
```

### Alertas de Issues Críticos

```
Tú: Si se crea un issue con label "critical" en GitHub, notifica urgente

Claude: Configurado. Monitorearé issues críticos.

Cuando detecte issue crítico, enviaré a #alerts:

🚨 *CRITICAL ISSUE DETECTED*

*Issue #267*
Title: Production API returning 500 errors

*Severity:* 🔴 Critical
*Created:* 2 minutes ago
*Reporter:* @customer-support

*Description:*
Multiple users reporting 500 errors when trying to checkout.
Error rate spiked from 0.1% to 15% in last 10 minutes.

*Impact:*
• ~500 users affected
• Revenue impact: ~$5,000/hour
• User experience severely degraded

*Monitoring:*
https://grafana.company.com/alerts

*Logs:*
https://sentry.io/issues/123456

*Action Required:*
@on-call-engineer please investigate IMMEDIATELY

Issue URL: https://github.com/repo/issues/267
```

---

## 📖 Lección 9.C.8: Gestión de Canales

### Listar Canales

**Herramienta: slack_list_channels**

```
Tú: Muéstrame todos los canales del workspace

Claude: [usa slack_list_channels]

Canales en Mi Empresa Workspace (23 canales):

*Engineering:*
• #dev-team (45 miembros) - Main dev channel
• #backend (12 miembros) - Backend discussions
• #frontend (15 miembros) - Frontend discussions
• #devops (8 miembros) - Infrastructure & deployment
• #code-reviews (20 miembros) - PR reviews

*Operations:*
• #deploys (10 miembros) - Deployment notifications
• #monitoring (8 miembros) - System alerts
• #incidents (15 miembros) - Incident response

*General:*
• #general (78 miembros) - Company-wide
• #random (56 miembros) - Off-topic
• #announcements (78 miembros) - Important news

*Projects:*
• #project-auth (6 miembros) - Auth system project
• #project-mobile (8 miembros) - Mobile app project
```

### Crear Canal Automáticamente

```
Tú: Crea un canal para el nuevo proyecto de e-commerce

Claude: [usa slack_create_channel]

✓ Canal creado exitosamente

*Channel:* #project-ecommerce
*Purpose:* Development and discussion for e-commerce platform
*Topic:* Sprint 1: Cart & Checkout | Next standup: Mon 9am
*Privacy:* Public
*Members:* Invité a @dev-team

Canal configurado y listo para usar 🎉

Link: https://myworkspace.slack.com/archives/C04567890
```

### Invitar Usuarios a Canal

```
Tú: Invita a @maria, @carlos y @pedro al canal #project-ecommerce

Claude: [usa slack_invite_to_channel]

✓ Usuarios invitados al canal #project-ecommerce:
• @maria ✓
• @carlos ✓
• @pedro ✓

Mensaje de bienvenida enviado al canal 👋
```

---

## 🛠️ Ejercicios Prácticos

### Ejercicio 9.C.1: Configuración Básica
1. Crea una Slack App con los permisos necesarios
2. Configura el MCP de Slack en tu proyecto
3. Verifica la conexión exitosa
4. Lista todos los canales disponibles
5. Envía un mensaje de prueba a un canal de testing

### Ejercicio 9.C.2: Notificaciones de CI/CD
1. Configura notificaciones automáticas de builds
2. Haz un commit y verifica que se notifique el build
3. Simula un build fallido y verifica la alerta
4. Crea una notificación de deployment exitoso
5. Documenta el flujo de notificaciones

### Ejercicio 9.C.3: Búsqueda y Análisis
1. Busca conversaciones sobre un tema técnico específico
2. Extrae decisiones de arquitectura de canales relevantes
3. Encuentra código compartido en los últimos 30 días
4. Genera un resumen de una discusión importante
5. Crea un documento con findings

### Ejercicio 9.C.4: Automatización de Workflows
1. Crea un recordatorio automático diario
2. Configura un reporte semanal de progreso
3. Implementa alertas para issues críticos
4. Automatiza notificaciones de code reviews
5. Prueba todos los workflows durante una semana

### Ejercicio 9.C.5: Gestión de Equipo
1. Crea un canal nuevo para un proyecto
2. Invita a miembros del equipo automáticamente
3. Configura topic y descripción del canal
4. Envía mensaje de bienvenida con guidelines
5. Documenta la estructura de canales del proyecto

---

## 📝 Examen 9.C: Maestría del MCP de Slack

### Parte 1: Preguntas Teóricas (3 puntos)

**Pregunta 1:** ¿Cuáles son las 3 principales ventajas de automatizar Slack desde Claude Code en lugar de usar Slack manualmente?

**Pregunta 2:** Explica para qué usarías cada herramienta:
- a) slack_post_message vs slack_post_thread_reply
- b) slack_search_messages vs slack_list_channels
- c) Notificación en canal público vs mensaje directo
- d) Thread reply vs mensaje nuevo en canal

**Pregunta 3:** ¿Qué consideraciones de seguridad debes tener al configurar el MCP de Slack para un equipo?

### Parte 2: Configuración (2 puntos)

1. Muestra cómo configurarías el MCP de Slack con OAuth token
2. Lista los scopes necesarios para funcionalidad completa
3. Explica cómo proteger el token de Slack en un repositorio
4. ¿Cómo configurarías múltiples workspaces?

### Parte 3: Práctica - Automatización Completa (5 puntos)

Escenario: Eres responsable de automatizar comunicaciones de un equipo de desarrollo.

**Tareas:**
1. Configura notificaciones automáticas de CI/CD a #deploys
2. Crea un sistema de alertas para issues críticos
3. Implementa reporte semanal automático de métricas
4. Configura búsqueda y extracción de decisiones técnicas
5. Documenta todos los workflows implementados

Demuestra cada automatización funcionando con ejemplos reales.

### Parte 4: Proyecto Real (Bonus +3 puntos)

Elige uno de estos proyectos:

**Opción A: Bot de Productividad de Equipo**
1. Crea un bot que:
   - Envía daily standup reminders
   - Recopila respuestas del equipo
   - Genera resumen automático
   - Identifica blockers y notifica leads
   - Genera métricas de participación
2. Demuestra funcionando durante 5 días
3. Documenta resultados y mejoras

**Opción B: Sistema de Notificaciones Inteligente**
1. Implementa notificaciones contextuales para:
   - Builds (success/failure con detalles)
   - Deployments (con rollback plan)
   - Security alerts (con severity)
   - Performance issues (con métricas)
2. Usa threads para mantener canales organizados
3. Incluye menciones inteligentes (@on-call, @team-lead)
4. Documenta el sistema completo

---

## ✅ Cómo Enviar Tu Examen

### Para la Parte 1:
```
Parte 1:
P1: [respuesta detallada]
P2: [respuestas para cada inciso]
P3: [consideraciones de seguridad]
```

### Para la Parte 2:
Muestra la configuración completa de mcp.json y las variables de entorno.

### Para la Parte 3:
Documenta cada automatización con:
- Código de configuración
- Screenshots de mensajes enviados
- Explicación del workflow
- Casos de uso

### Para la Parte 4:
Proporciona:
- Código completo del bot/sistema
- Screenshots de funcionamiento
- Métricas de uso
- Feedback del equipo
- Lecciones aprendidas

---

## 🎯 Checklist de Dominio

Marca cuando domines cada aspecto:

**Configuración**
- [ ] Crear Slack App con OAuth
- [ ] Configurar permisos correctos
- [ ] Instalar MCP de Slack
- [ ] Proteger tokens de forma segura

**Mensajería**
- [ ] Enviar mensajes a canales
- [ ] Enviar mensajes directos
- [ ] Formatear mensajes (markdown, code)
- [ ] Crear y responder en threads

**Búsqueda**
- [ ] Buscar mensajes históricos
- [ ] Filtrar por canal y fecha
- [ ] Extraer información relevante
- [ ] Analizar conversaciones

**Automatización**
- [ ] Notificaciones de CI/CD
- [ ] Alertas de errores/issues
- [ ] Reportes programados
- [ ] Recordatorios automáticos

**Gestión**
- [ ] Listar canales y usuarios
- [ ] Crear canales automáticamente
- [ ] Invitar usuarios a canales
- [ ] Configurar topics y descripciones

**Workflows**
- [ ] Daily standups automatizados
- [ ] Reportes semanales
- [ ] Sistema de alertas
- [ ] Integración con CI/CD

**Avanzado**
- [ ] Bots interactivos
- [ ] Análisis de comunicaciones
- [ ] Métricas de equipo
- [ ] Workflows personalizados

---

## 💡 Mejores Prácticas

### 1. Mantén Canales Organizados

```
✅ Bueno:
- Usa threads para conversaciones relacionadas
- Mensajes principales concisos
- Detalles en threads
- Canales específicos para tipos de notificación

❌ Evita:
- Spam de mensajes individuales
- Notificaciones sin contexto
- Mezclar tipos de mensajes en un canal
- Mensajes sin formato (wall of text)
```

### 2. Notificaciones Inteligentes

```
✅ Bueno:
- Solo notificar eventos importantes
- Incluir contexto suficiente
- Mencionar personas relevantes (@on-call)
- Proveer links a logs/dashboards

❌ Evita:
- Notificar cada commit
- Mensajes sin acción clara
- Menciones innecesarias (@channel)
- Falta de información para actuar
```

### 3. Seguridad de Tokens

```
✅ Bueno:
- Usar variables de entorno
- Nunca commitar tokens
- Rotar tokens regularmente
- Permisos mínimos necesarios

❌ Evita:
- Hardcodear tokens en código
- Compartir tokens en Slack
- Usar tokens de producción en dev
- Dar permisos excesivos
```

### 4. Formateo de Mensajes

```
✅ Bueno:
- Usar markdown para estructura
- Code blocks para código
- Emojis para status visual
- Bullets/números para listas

❌ Evita:
- Mensajes sin formato
- Bloques de texto densos
- Falta de separación visual
- Uso excesivo de @mentions
```

### 5. Automatización Progresiva

```
✅ Bueno:
- Empezar con notificaciones simples
- Iterar basado en feedback
- Medir utilidad de cada notificación
- Ajustar frecuencia según necesidad

❌ Evita:
- Sobre-automatizar desde el inicio
- Ignorar feedback del equipo
- Notificaciones que nadie lee
- Falta de revisión periódica
```

---

## 🚀 Siguiente Nivel

Una vez que domines el MCP de Slack, explora:

1. **Bots Interactivos**
   - Slash commands personalizados
   - Interactive buttons y menus
   - Modal dialogs
   - Workflows con Slack API avanzada

2. **Integraciones Complejas**
   - Combinar con GitHub MCP (PR reviews en Slack)
   - Integrar con PostgreSQL MCP (reportes de DB)
   - Jira/Linear para tracking
   - Analytics y visualizaciones

3. **Análisis de Comunicaciones**
   - Sentiment analysis de conversaciones
   - Métricas de participación
   - Detección de blockers
   - Insights de productividad

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Slack API Documentation](https://api.slack.com/docs)
- [Slack Block Kit](https://api.slack.com/block-kit)
- [Slack OAuth Guide](https://api.slack.com/authentication/oauth-v2)

### Tutoriales
- [Building Slack Bots](https://slack.dev/bolt-js/tutorial/getting-started)
- [Slack App Quickstart](https://api.slack.com/quickstart)
- [Interactive Messages](https://api.slack.com/messaging/interactivity)

### Tools
- [Block Kit Builder](https://app.slack.com/block-kit-builder)
- [Slack API Tester](https://api.slack.com/methods)
- [Workspace Apps Manager](https://api.slack.com/apps)

---

**¡Subcapítulo 9.C Completo!**

Has aprendido a automatizar Slack con Claude Code. Ahora puedes enviar notificaciones, buscar información, crear workflows de equipo y mantener comunicaciones organizadas sin salir de tu editor.

**Anterior**: `capitulo_09_mcp_postgresql.md` (PostgreSQL MCP)
**Siguiente**: `capitulo_09_mcp_azure.md` (Azure MCP)
