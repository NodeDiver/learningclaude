# Subcapítulo 9.J: MCP de Sentry - Monitoreo de Errores y Debugging Inteligente

**Duración**: 50 minutos
**Dificultad**: Intermedio
**Prerrequisito**: Capítulo 9 (MCP Básico)

---

## 🎯 Objetivos de Aprendizaje

Al final de este subcapítulo, podrás:
- Entender qué es Sentry y su rol en monitoreo de errores
- Configurar el MCP de Sentry con Claude Code
- Recuperar y analizar issues de Sentry
- Interpretar stacktraces automáticamente
- Diagnosticar errores con ayuda de IA
- Priorizar bugs basándote en métricas
- Integrar Sentry en tu flujo de desarrollo
- Automatizar análisis de errores de producción

---

## 📖 Lección 9.J.1: ¿Qué es Sentry y Sentry MCP?

El **MCP de Sentry** conecta Claude Code con tu cuenta de **Sentry.io**, una plataforma líder de monitoreo de errores y performance, permitiéndote analizar bugs con ayuda de IA.

### Concepto Fundamental

Piensa en Sentry como tu **detective de errores 24/7**:

**Sin MCP de Sentry:**
```
Tú: Veo un error en producción
  ↓ (abres Sentry manualmente)
  ↓ (copias el stacktrace)
  ↓ (pegas en Claude)
  ↓ (analizas manualmente)
Proceso fragmentado y lento
```

**Con MCP de Sentry:**
```
Tú: "Analiza el issue #12345 de Sentry"

Claude: [usa MCP Sentry]
  → Recupera issue completo
  → Analiza stacktrace
  → Identifica causa raíz
  → Sugiere fix

✓ Análisis en 5 segundos
✓ Solución propuesta
```

### ¿Qué es Sentry?

**Sentry.io** es una plataforma de **Application Monitoring** que:
- **Captura errores** en tiempo real (JavaScript, Python, Java, etc.)
- **Agrupa issues** similares automáticamente
- **Rastreo de performance** (lentitud, cuellos de botella)
- **Release tracking** (errores por versión)
- **Alertas** configurables

### ¿Qué Puede Hacer el MCP de Sentry?

✅ **Recuperación de Issues**
- Obtener detalles completos de un error
- Ver título, status, severidad
- Revisar timestamps (primera/última ocurrencia)
- Contador de eventos

✅ **Análisis de Stacktraces**
- Stacktrace completo con líneas de código
- Contexto de archivos afectados
- Variables en el momento del error
- Breadcrumbs (pasos antes del error)

✅ **Debugging Asistido por IA**
- Claude interpreta el stacktrace
- Identifica causa raíz
- Sugiere fixes
- Explica por qué ocurrió el error

✅ **Priorización**
- Frecuencia de ocurrencia
- Impacto en usuarios
- Severidad (fatal, error, warning)
- Tendencias temporales

### Ventajas Clave

| Sin MCP Sentry | Con MCP Sentry |
|---------------|----------------|
| Copy-paste manual de errores | Análisis automático |
| Interpretar stacktraces manualmente | La IA explica el problema |
| Cambiar entre apps | Todo desde Claude |
| Análisis ad-hoc | Debugging sistemático |
| **Lento y tedioso** | **Rápido e inteligente** ⚡ |

---

## 📖 Lección 9.J.2: Configuración de Sentry MCP

### Paso 1: Obtener Auth Token de Sentry

1. **Inicia sesión en Sentry.io**
```
https://sentry.io
```

2. **Ir a Settings → Auth Tokens**
```
https://sentry.io/settings/account/api/auth-tokens/
```

3. **Crear nuevo token**
```
Nombre: "Claude Code MCP"
Scopes:
  ✓ project:read
  ✓ event:read
  ✓ org:read
```

4. **Copiar token**
```
sntrys_abc123def456...
```

**⚠️ IMPORTANTE**: Guarda el token de forma segura, no se puede ver después.

### Paso 2: Configurar Variables de Entorno

Crea `.env` (o usa system environment):

```bash
# .env
SENTRY_AUTH_TOKEN=sntrys_abc123def456...
```

Agrega a `.gitignore`:
```bash
echo ".env" >> .gitignore
```

### Paso 3: Configurar .claude/mcp.json

**Opción A: Usando uvx (Recomendado)**

```json
{
  "servers": {
    "sentry": {
      "transport": "stdio",
      "command": "uvx",
      "args": ["mcp-server-sentry"],
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}"
      }
    }
  }
}
```

**Opción B: Usando pip**

Primero instala:
```bash
pip install mcp-server-sentry
```

Luego configura:
```json
{
  "servers": {
    "sentry": {
      "transport": "stdio",
      "command": "python",
      "args": ["-m", "mcp_server_sentry"],
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}"
      }
    }
  }
}
```

**Opción C: Usando Docker**

```json
{
  "servers": {
    "sentry": {
      "transport": "stdio",
      "command": "docker",
      "args": ["run", "-i", "--rm", "mcp/sentry"],
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}"
      }
    }
  }
}
```

### Paso 4: Verificar Instalación

1. **Reinicia Claude Code**
```bash
exit
# Vuelve a abrir
```

2. **Prueba conexión**
```
Tú: ¿Está conectado el MCP de Sentry?

Claude: Sí, el MCP de Sentry está conectado.

Herramientas disponibles:
- get_sentry_issue: Recuperar y analizar issues

Estado: ✓ CONECTADO
```

---

## 📖 Lección 9.J.3: Recuperar y Analizar Issues

### Analizar Issue por ID

```
Tú: Analiza el issue de Sentry #12345

Claude: [usa get_sentry_issue]

📊 Sentry Issue #12345

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Título: TypeError: Cannot read property 'map' of undefined
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estado: 🔴 OPEN
Nivel: ERROR
Proyecto: my-web-app

📅 Timeline:
- Primera vez: 2024-10-15 08:23:15 UTC (hace 3 días)
- Última vez: 2024-10-18 14:45:32 UTC (hace 2 horas)
- Eventos: 156 ocurrencias

👥 Impacto:
- Usuarios afectados: 89
- Navegadores: Chrome (45%), Firefox (30%), Safari (25%)

📍 Stacktrace:
  at UserList.render (components/UserList.js:45:12)
    → users.map is not a function

  at renderComponent (react-dom.js:234:18)
  at updateComponent (react-dom.js:789:11)
  at performUnitOfWork (react-dom.js:1234:5)

🔍 Análisis de Claude:
El error ocurre cuando `users` es undefined o null.
En UserList.js línea 45, se intenta hacer .map() sobre
un valor que no es un array.

Causa raíz probable:
- API retorna null en vez de array vacío []
- Falta validación de datos
- Race condition en fetch de datos

💡 Fix sugerido:
```javascript
// Antes (línea 45)
return users.map(user => <UserCard key={user.id} {...user} />)

// Después
return (users || []).map(user => <UserCard key={user.id} {...user} />)

// O mejor aún:
if (!Array.isArray(users)) {
  return <div>No users found</div>
}
return users.map(user => <UserCard key={user.id} {...user} />)
```
```

### Analizar Issue por URL

```
Tú: Analiza https://sentry.io/organizations/myorg/issues/67890/

Claude: [extrae ID de URL y analiza]

📊 Sentry Issue #67890

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Título: Database connection timeout
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estado: 🔴 OPEN (crítico)
Nivel: FATAL
Proyecto: api-backend

📅 Timeline:
- Primera vez: 2024-10-18 13:00:00 UTC
- Última vez: 2024-10-18 15:30:00 UTC
- Eventos: 2,345 ocurrencias (trending ↗️)

⚠️ ALERTA: Spike repentino de errores (últimas 2 horas)

🔍 Análisis:
Error de timeout en conexión a PostgreSQL.
Pool de conexiones agotado.

Recomendación urgente:
1. Revisar pool size (actual: 10, puede ser insuficiente)
2. Investigar queries lentos
3. Posible conexión no cerrada (memory leak)

🚨 Acción inmediata:
- Reiniciar pool de conexiones
- Aumentar timeout temporalmente
- Monitorear active connections
```

### Comparar Múltiples Issues

```
Tú: Compara los issues #111 y #222 de Sentry

Claude: [analiza ambos]

📊 Comparación de Issues

Issue #111: "Null pointer exception"
- Eventos: 45
- Primera vez: hace 7 días
- Status: OPEN
- Severidad: ERROR

Issue #222: "API timeout"
- Eventos: 892
- Primera vez: hace 2 días
- Status: OPEN
- Severidad: FATAL

🎯 Priorización:
1. Issue #222 (API timeout) - URGENTE
   - 20x más frecuente
   - Severidad FATAL vs ERROR
   - Tendencia creciente

2. Issue #111 (Null pointer)
   - Menor frecuencia
   - No crítico
   - Puede esperar

Recomendación: Ataca #222 primero.
```

---

## 📖 Lección 9.J.4: Debugging Asistido por IA

Claude puede ayudarte a debuggear errores complejos con contexto completo.

### Caso 1: Error de JavaScript

```
Tú: Ayúdame a debuggear el issue #555 y dame los pasos para reproducirlo

Claude: [analiza issue]

🐛 Issue #555: "Uncaught ReferenceError: formatDate is not defined"

📍 Ubicación:
  File: src/utils/dates.js
  Line: 23
  Function: renderDateDisplay()

📋 Pasos para reproducir:
1. Navegar a /dashboard
2. Seleccionar rango de fechas
3. Hacer clic en "Export Report"
4. ❌ Error: formatDate is not defined

🔍 Causa raíz:
El módulo dates.js importa formatDate de una librería
que no está incluida en el bundle de producción.

Razón: formatDate está en devDependencies, no dependencies.

💡 Fix:
```bash
# 1. Mover date-fns a dependencies
npm uninstall date-fns --save-dev
npm install date-fns --save

# 2. Verificar import
# src/utils/dates.js
import { format } from 'date-fns'  // ✓ correcto

# 3. Rebuild
npm run build
```

🧪 Verificación:
- Build exitoso sin warnings
- Probar export en /dashboard
- Verificar bundle includes date-fns
```

### Caso 2: Error de Backend

```
Tú: El issue #777 está causando 500 errors. ¿Cuál es el problema?

Claude: [analiza]

🐛 Issue #777: "Internal Server Error - Division by zero"

📍 Stacktrace:
  File: /app/services/analytics.py
  Line: 145
  Function: calculate_conversion_rate()

  ZeroDivisionError: division by zero
    conversions / total_visitors
                  ^^^^^^^^^^^^^^
                  = 0

🔍 Causa:
La función calculate_conversion_rate() no valida
que total_visitors > 0 antes de dividir.

Escenario:
- Nuevo usuario sin visitas aún
- total_visitors = 0
- conversions / 0 → ZeroDivisionError

💡 Fix:
```python
# Antes (línea 145)
def calculate_conversion_rate(conversions, total_visitors):
    return (conversions / total_visitors) * 100

# Después
def calculate_conversion_rate(conversions, total_visitors):
    if total_visitors == 0:
        return 0.0
    return (conversions / total_visitors) * 100
```

🧪 Tests a agregar:
```python
def test_conversion_rate_zero_visitors():
    assert calculate_conversion_rate(0, 0) == 0.0
    assert calculate_conversion_rate(5, 0) == 0.0
```
```

### Caso 3: Memory Leak

```
Tú: El issue #999 muestra "Out of memory". ¿Qué está pasando?

Claude: [analiza breadcrumbs y contexto]

🐛 Issue #999: "JavaScript heap out of memory"

📊 Patrón detectado:
- Ocurre solo en páginas con scroll infinito
- Memoria crece linealmente con tiempo
- No se libera al salir de la página

🔍 Breadcrumbs (últimas acciones):
1. User loaded /feed
2. Scrolled down (loaded 10 items)
3. Scrolled down (loaded 10 items)
4. Scrolled down (loaded 10 items)
... (30 veces)
5. 💥 Out of memory

Causa: Memory leak en scroll infinito
- Items no se eliminan del DOM
- Event listeners no se limpian
- Imágenes no se liberan de memoria

💡 Fix:
```javascript
// Implementar virtualización
import { FixedSizeList } from 'react-window'

// En vez de renderizar TODO:
<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <FeedItem item={items[index]} />
    </div>
  )}
</FixedSizeList>

// Cleanup de listeners
useEffect(() => {
  window.addEventListener('scroll', handleScroll)
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}, [])
```

📈 Impacto esperado:
- Memoria constante vs creciente
- Mejor performance en scrolls largos
- Sin crashes
```

---

## 📖 Lección 9.J.5: Priorización de Bugs

Usa métricas de Sentry para priorizar qué arreglar primero.

### Dashboard de Priorización

```
Tú: Dame los top 5 issues críticos de Sentry

Claude: [analiza múltiples issues]

🎯 Top 5 Issues Críticos (Prioridad Alta → Baja)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 🔴 Issue #2234 - Database timeout
   Severidad: FATAL
   Eventos: 5,678 (últimas 24h)
   Usuarios afectados: 1,234
   Tendencia: ↗️ Creciendo 45%/hora

   Impacto: Bloqueante para toda la app
   Prioridad: 🚨 URGENTE - Atender YA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. 🟠 Issue #1123 - Payment gateway error
   Severidad: ERROR
   Eventos: 234 (últimas 24h)
   Usuarios afectados: 89
   Tendencia: → Estable

   Impacto: Revenue loss ($$$)
   Prioridad: 🔥 Alta - Atender hoy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. 🟠 Issue #998 - Image upload fails
   Severidad: ERROR
   Eventos: 456 (últimas 24h)
   Usuarios afectados: 156
   Tendencia: → Estable

   Impacto: Feature rota, no crítica
   Prioridad: 🟡 Media - Atender esta semana

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. 🟡 Issue #777 - Slow page load
   Severidad: WARNING
   Eventos: 1,234 (últimas 24h)
   Usuarios afectados: 456
   Tendencia: ↘️ Decreciendo

   Impacto: UX degradada
   Prioridad: 🟡 Media - Atender este sprint

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. 🟢 Issue #555 - Missing icon
   Severidad: INFO
   Eventos: 89 (últimas 24h)
   Usuarios afectados: 34
   Tendencia: → Estable

   Impacto: Visual minor
   Prioridad: ⚪ Baja - Backlog

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Recomendación:
1. All-hands on #2234 (DB timeout)
2. Asignar dev senior a #1123 (payments)
3. Planificar #998, #777 para próximo sprint
4. #555 puede esperar
```

### Análisis de Tendencias

```
Tú: ¿Hay algún issue con tendencia creciente preocupante?

Claude: [analiza históricos]

📈 Issues con Tendencia Creciente

⚠️ ALERTA: 3 issues mostrando growth exponencial

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue #3456: "API rate limit exceeded"

  Hace 7 días: 10 eventos/día
  Hace 3 días: 45 eventos/día
  Hoy: 890 eventos/día

  Crecimiento: +8,800% en 7 días 📈

  🔍 Posible causa:
  - Nuevo feature lanzado hace 7 días
  - Loop infinito en polling
  - Bot malicioso

  🚨 Acción: Investigar URGENTE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue #3457: "Session expired unexpectedly"

  Antes: 5-10 eventos/día
  Últimas 48h: 456 eventos/día

  Correlación: Coincide con deploy v2.3.1

  🔍 Posible causa:
  - Bug en nueva versión
  - Cambio en auth cookies

  🚨 Acción: Considerar rollback

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue #3458: "Checkout incomplete"

  Crecimiento: +340% últimas 72h
  Revenue impact: ~$12,000 perdidos

  🔍 Correlación:
  - Coincide con cambio en payment provider

  🚨 Acción: MÁXIMA PRIORIDAD
```

---

## 📖 Lección 9.J.6: Integración con Workflow de Desarrollo

### Workflow: Issue → Fix → Verify

```
Tú: Crea un branch para arreglar el issue #1234 de Sentry

Claude: [workflow completo]

🔧 Workflow de Fix

1️⃣ Análisis de Issue
[recupera issue #1234]

Issue: "Invalid email format not caught"
Archivo: src/validators/email.js
Línea: 23

2️⃣ Crear Branch
```bash
git checkout -b fix/sentry-1234-email-validation
```

3️⃣ Implementar Fix
```javascript
// src/validators/email.js
export function validateEmail(email) {
  // Regex mejorado
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email || typeof email !== 'string') {
    return false
  }

  return regex.test(email.trim())
}
```

4️⃣ Agregar Tests
```javascript
// tests/validators/email.test.js
describe('validateEmail', () => {
  test('rechaza emails inválidos', () => {
    expect(validateEmail('')).toBe(false)
    expect(validateEmail('notanemail')).toBe(false)
    expect(validateEmail('@domain.com')).toBe(false)
  })

  test('acepta emails válidos', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })
})
```

5️⃣ Commit con referencia a Sentry
```bash
git add .
git commit -m "Fix: Email validation regex

Fixes Sentry issue #1234
- Improved email regex pattern
- Added validation for empty/null
- Added comprehensive tests

Sentry-Issue: #1234"
```

6️⃣ Push y crear PR
```bash
git push origin fix/sentry-1234-email-validation

# Crear PR con gh cli
gh pr create \
  --title "Fix: Email validation (Sentry #1234)" \
  --body "Fixes Sentry issue #1234

## Problem
Email validation regex was too permissive

## Solution
- Updated regex pattern
- Added null checks
- Added tests

## Sentry Link
https://sentry.io/issues/1234"
```

7️⃣ Deploy y Verificar
Después de merge:
```
Tú: ¿Se resolvió el issue #1234 después del deploy?

Claude: [monitorea Sentry]

✅ Issue #1234: RESOLVED

📊 Verificación post-deploy:
- Última ocurrencia: hace 3 días (pre-fix)
- Nuevas ocurrencias: 0
- Status en Sentry: ✓ Resolved

El fix fue exitoso 🎉
```
```

### Automatizar Alertas

```
Tú: Notifícame cuando haya un nuevo issue FATAL en Sentry

Claude: [configura monitoring]

🔔 Alerta de Sentry Configurada

Filtro:
- Nivel: FATAL
- Proyecto: my-app-production
- Frecuencia: Tiempo real

Notificación:
- Slack: #incidents
- Email: team@example.com
- Claude Code: Alert en sesión activa

Testing:
[simula alerta]

🚨 NUEVO ISSUE FATAL DETECTADO

Issue #9999: "Database connection lost"
Ocurrencias: 5 (últimos 2 minutos)
Usuarios afectados: 234

¿Analizar ahora? [y/n]
```

---

## 📖 Lección 9.J.7: Mejores Prácticas de Monitoreo

### 1. Organización de Issues

```
Configuración recomendada en Sentry:

📁 Proyectos:
- frontend-production
- frontend-staging
- backend-api-production
- backend-api-staging
- mobile-ios-production
- mobile-android-production

🏷️ Tags personalizados:
- environment: production/staging/dev
- release: v2.3.1
- user_type: free/premium/enterprise
- region: us-east/eu-west/ap-south

🔔 Alertas:
- FATAL: Notificación inmediata
- ERROR: Resumen cada hora
- WARNING: Resumen diario
```

### 2. Release Tracking

```
Tú: Compara errores entre release v2.3.0 y v2.3.1

Claude: [analiza releases]

📦 Comparación de Releases

Release v2.3.0 (current):
- Total issues: 45
- Nuevos issues: 3
- Resolved issues: 12
- Error rate: 0.23%

Release v2.3.1 (new):
- Total issues: 67 (+48%)
- Nuevos issues: 25 🚨
- Resolved issues: 3
- Error rate: 0.51% (+121%)

⚠️ ALERTA: v2.3.1 introdujo regresiones

Top 3 nuevos issues:
1. #5555: "Cannot connect to new API endpoint"
   (234 eventos)
2. #5556: "Auth token refresh fails"
   (156 eventos)
3. #5557: "Image compression error"
   (89 eventos)

Recomendación: 🛑 ROLLBACK a v2.3.0
```

### 3. Contexto Personalizado

```
Agrega contexto rico a tus errores:

```javascript
// En tu código
import * as Sentry from '@sentry/browser'

Sentry.setContext('user', {
  id: user.id,
  email: user.email,
  plan: user.subscription.plan,
  tenure: user.daysSinceSignup
})

Sentry.setContext('device', {
  browser: navigator.userAgent,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  connection: navigator.connection?.effectiveType
})

Sentry.setContext('feature_flags', {
  new_checkout: featureFlags.newCheckout,
  dark_mode: featureFlags.darkMode
})
```

Beneficio: Claude puede ver contexto completo:
```
Tú: ¿Por qué el issue #777 solo afecta a usuarios premium?

Claude: [analiza contexto]

🔍 Análisis Contextual

Issue #777: "Payment processing error"

Patrón detectado en contexto:
- 100% de ocurrencias: plan=premium
- 0% ocurrencias: plan=free

Feature flags:
- new_checkout: true (en premium)
- new_checkout: false (en free)

Causa raíz:
El nuevo checkout (solo premium) tiene un bug
en el procesamiento de pagos recurrentes.

El checkout legacy (free) funciona correctamente.

Recomendación:
1. Rollback feature flag new_checkout
2. Fix bug en nuevo checkout
3. Re-enable cuando esté arreglado
```
```

---

## 📖 Lección 9.J.8: Casos de Uso Avanzados

### Análisis de Performance

```
Tú: ¿Qué páginas son más lentas según Sentry?

Claude: [analiza performance data]

📊 Performance Report

Top 5 páginas más lentas:

1. /checkout
   P50: 2.3s
   P95: 8.9s 🐌
   P99: 15.2s 🔴

   Cuellos de botella:
   - Payment gateway API: 4.5s
   - Image loading: 2.1s
   - Bundle size: 890KB (muy grande)

2. /dashboard
   P50: 1.8s
   P95: 4.2s
   P99: 7.8s

   Problemas:
   - Query SQL lento (N+1)
   - Múltiples API calls secuenciales

3. /search
   P50: 3.1s
   P95: 9.5s 🔴
   P99: 18.3s 🔴

   Problema crítico:
   - Full-text search sin índice
   - Timeout en queries complejas

Recomendaciones:
1. Checkout: Lazy load images, code split
2. Dashboard: Batch API calls, fix N+1
3. Search: Agregar índices, implementar cache
```

### Debugging de Producción

```
Tú: Un usuario reporta error en producción pero no tengo su Sentry ID. Email: john@example.com

Claude: [busca por contexto de usuario]

🔍 Búsqueda de Issues por Usuario

Buscando: john@example.com
Timeframe: Últimas 48 horas

Encontrados 3 issues:

1. Issue #4444: "Checkout fails at payment step"
   Timestamp: 2024-10-18 14:23:45 UTC
   User: john@example.com
   Session ID: sess_abc123

   Breadcrumbs:
   1. Landed on /products
   2. Added item to cart
   3. Clicked checkout
   4. Filled shipping info
   5. Clicked "Pay Now"
   6. 💥 Error: "Card declined"

2. Issue #4445: "Image upload timeout"
   Timestamp: 2024-10-18 10:15:32 UTC
   User: john@example.com

3. Issue #4446: "Search no results"
   Timestamp: 2024-10-17 16:45:12 UTC
   User: john@example.com

Más reciente y relevante: Issue #4444

¿Analizar en detalle? [y/n]
```

### Análisis de Root Cause

```
Tú: Multiple issues parecen relacionados. ¿Hay una causa común?

Claude: [correlación de issues]

🔗 Análisis de Correlación

Detectados 5 issues potencialmente relacionados:

Issues:
- #1111: "API timeout"
- #1112: "Database connection lost"
- #1113: "Cache miss"
- #1114: "Queue overflow"
- #1115: "Worker process crash"

📊 Correlación temporal:
Todos ocurrieron en ventana de 15 minutos
2024-10-18 13:00 - 13:15 UTC

🔍 Root Cause Analysis:

Secuencia de eventos:
1. 13:00 - Database CPU spike (externa a Sentry)
2. 13:02 - Issue #1112 (DB connection lost)
3. 13:03 - Issue #1111 (API timeout por DB)
4. 13:05 - Issue #1114 (Queue overflow por requests retry)
5. 13:10 - Issue #1115 (Workers crash por queue)
6. 13:12 - Issue #1113 (Cache miss por workers down)

Causa raíz: 🎯 Database CPU spike
Efecto cascada en toda la infraestructura

Prevención:
- Database query optimization
- Connection pool limits
- Circuit breaker pattern
- Better monitoring de DB resources
```

---

## 🏋️ Ejercicios Prácticos

### Ejercicio 9.J.1: Configuración Básica
1. Crea una cuenta en Sentry.io (gratis)
2. Genera un auth token
3. Configura Sentry MCP en Claude Code
4. Verifica la conexión
5. Instala Sentry SDK en un proyecto de prueba

### Ejercicio 9.J.2: Análisis de Issues
1. Genera un error de prueba en tu app
2. Recupera el issue desde Claude
3. Analiza el stacktrace
4. Identifica la causa raíz
5. Implementa el fix sugerido por Claude

### Ejercicio 9.J.3: Priorización
1. Genera 5 errores diferentes (varios niveles)
2. Pide a Claude que los priorice
3. Analiza las métricas (frecuencia, severidad)
4. Crea un plan de acción
5. Documenta el proceso

### Ejercicio 9.J.4: Workflow Completo
1. Selecciona un issue real de tu proyecto
2. Crea un branch de fix
3. Implementa la solución con ayuda de Claude
4. Agrega tests
5. Crea PR con referencia al issue
6. Verifica resolución post-deploy

### Ejercicio 9.J.5: Monitoreo Avanzado
1. Configura release tracking en Sentry
2. Agrega contexto personalizado (user, device)
3. Configura alertas para issues críticos
4. Compara dos releases
5. Genera un reporte de performance

---

## 📝 Examen 9.J: Maestría del MCP de Sentry

### Parte 1: Preguntas Teóricas (3 puntos)

**Pregunta 1:** ¿Qué es Sentry.io y cuál es su propósito principal?

**Pregunta 2:** Explica la diferencia entre los niveles de severidad: INFO, WARNING, ERROR y FATAL.

**Pregunta 3:** ¿Por qué es importante el contexto (user, device, feature flags) en los issues de Sentry?

### Parte 2: Configuración (2 puntos)

1. Muestra cómo configurarías Sentry MCP en `.claude/mcp.json`
2. ¿Dónde obtienes el auth token de Sentry?
3. ¿Cómo protegerías el token en tu configuración?

### Parte 3: Práctica - Debugging (5 puntos)

**Escenario:**
Tienes un issue de Sentry #7777 con:
- Título: "Payment processing failed"
- Eventos: 1,234 (últimas 24h)
- Severidad: ERROR
- Stacktrace: Error en stripe.createCharge()

Muestra cómo usarías Claude + Sentry MCP para:
1. Recuperar el issue completo
2. Analizar el stacktrace
3. Identificar la causa raíz
4. Proponer un fix
5. Crear un plan de verificación post-deploy

### Parte 4: Casos de Uso (5 puntos)

Diseña soluciones con Sentry MCP para:

1. **Priorización automática**: Script que analiza todos los issues abiertos y crea un reporte de prioridad
2. **Alertas inteligentes**: Sistema que detecta spikes anormales de errores y alerta al equipo
3. **Análisis de releases**: Comparar errores antes/después de cada deploy
4. **Root cause analysis**: Correlacionar múltiples issues para encontrar causas comunes
5. **Performance monitoring**: Dashboard de páginas más lentas con sugerencias de optimización

### Bonus (2 puntos extra)

Implementa un bot que:
- Monitoree Sentry cada hora
- Detecte issues nuevos FATAL
- Analice automáticamente cada uno
- Cree un GitHub issue con el análisis
- Notifique al equipo en Slack
- Sugiera el mejor dev para asignarlo (basado en archivos tocados)

---

## ✅ Checklist de Dominio

Marca cada skill al dominarla:

**Configuración**
- [ ] Tengo cuenta en Sentry.io
- [ ] Sé generar auth tokens
- [ ] Puedo configurar Sentry MCP en Claude Code
- [ ] Sé instalar Sentry SDK en mi stack
- [ ] Entiendo cómo proteger credenciales

**Análisis de Issues**
- [ ] Puedo recuperar issues por ID o URL
- [ ] Sé interpretar stacktraces
- [ ] Entiendo breadcrumbs y contexto
- [ ] Puedo identificar causas raíz
- [ ] Sé usar métricas para priorizar

**Debugging**
- [ ] Puedo debuggear errores de JavaScript
- [ ] Sé analizar errores de backend
- [ ] Entiendo memory leaks y performance
- [ ] Puedo proponer fixes efectivos
- [ ] Sé verificar resoluciones

**Workflow**
- [ ] Integro Sentry en mi flujo de desarrollo
- [ ] Uso release tracking
- [ ] Configuro alertas apropiadas
- [ ] Agrego contexto rico a errores
- [ ] Hago post-mortems de incidents

**Avanzado**
- [ ] Puedo analizar correlaciones entre issues
- [ ] Sé hacer análisis de performance
- [ ] Entiendo patrones de errores
- [ ] Puedo automatizar monitoring
- [ ] Optimizo basándome en datos de Sentry

---

## 🎯 Mejores Prácticas

### Configuración de Proyectos

1. **Separa ambientes**
   ```
   ✓ frontend-production
   ✓ frontend-staging
   ✓ backend-production
   ✓ backend-staging

   ✗ No mezcles production y staging en mismo proyecto
   ```

2. **Source maps en producción**
   ```javascript
   // webpack.config.js
   module.exports = {
     devtool: 'source-map',
     plugins: [
       new SentryWebpackPlugin({
         authToken: process.env.SENTRY_AUTH_TOKEN,
         org: 'my-org',
         project: 'my-project',
         include: './dist',
         urlPrefix: '~/static/js'
       })
     ]
   }
   ```

3. **Sampling apropiado**
   ```javascript
   Sentry.init({
     dsn: 'https://....',
     // Solo 10% de transactions en producción
     tracesSampleRate: 0.1,
     // 100% de errors
     sampleRate: 1.0
   })
   ```

### Gestión de Alerts

1. **No sobre-alertes**
   ```
   ✓ FATAL → PagerDuty (24/7)
   ✓ ERROR crítico → Slack inmediato
   ✓ ERROR normal → Resumen cada hora
   ✓ WARNING → Resumen diario
   ✗ INFO → No alertar
   ```

2. **Alert fatigue**
   ```
   Si recibes >10 alertas/día:
   1. Revisa severity levels
   2. Agrupa issues similares
   3. Ignora ruido conocido
   4. Sube thresholds
   ```

### Análisis Eficiente

1. **Usa breadcrumbs**
   ```javascript
   // Agrega breadcrumbs útiles
   Sentry.addBreadcrumb({
     category: 'checkout',
     message: 'User selected payment method',
     data: {
       method: 'credit_card',
       provider: 'stripe'
     },
     level: 'info'
   })
   ```

2. **Contexto rico**
   ```javascript
   Sentry.setContext('business', {
     order_value: cart.total,
     items_count: cart.items.length,
     coupon_used: cart.coupon?.code,
     is_first_purchase: user.orders.length === 0
   })
   ```

3. **Tags útiles**
   ```javascript
   Sentry.setTags({
     'environment': 'production',
     'region': 'us-east-1',
     'deployment': 'blue-green-blue',
     'feature.new_checkout': 'true'
   })
   ```

---

## 📚 Recursos Adicionales

### Documentación Oficial

- **Sentry.io**: https://sentry.io
- **Sentry Docs**: https://docs.sentry.io
- **Sentry MCP GitHub**: https://github.com/modelcontextprotocol/servers-archived/tree/main/src/sentry
- **MCP Spec**: https://modelcontextprotocol.io

### SDKs de Sentry

- **JavaScript/TypeScript**: https://docs.sentry.io/platforms/javascript/
- **Python**: https://docs.sentry.io/platforms/python/
- **Java**: https://docs.sentry.io/platforms/java/
- **Ruby**: https://docs.sentry.io/platforms/ruby/
- **PHP**: https://docs.sentry.io/platforms/php/
- **Go**: https://docs.sentry.io/platforms/go/

### Herramientas Complementarias

- **Sentry CLI**: https://docs.sentry.io/cli/
- **Sentry Webpack Plugin**: https://github.com/getsentry/sentry-webpack-plugin
- **Sentry Release CLI**: Para automatizar releases

### Integraciones

- **Slack**: https://docs.sentry.io/product/integrations/slack/
- **Jira**: https://docs.sentry.io/product/integrations/jira/
- **GitHub**: https://docs.sentry.io/product/integrations/github/
- **PagerDuty**: https://docs.sentry.io/product/integrations/pagerduty/

### Guías Avanzadas

- **Performance Monitoring**: https://docs.sentry.io/product/performance/
- **Release Health**: https://docs.sentry.io/product/releases/health/
- **Issue Grouping**: https://docs.sentry.io/product/data-management-settings/event-grouping/
- **Source Maps**: https://docs.sentry.io/platforms/javascript/sourcemaps/

---

## 🎓 Próximos Pasos

1. **Practica en un proyecto real**
   - Instala Sentry en tu app
   - Genera errores de prueba
   - Practica análisis con Claude

2. **Automatiza tu workflow**
   - Scripts de análisis de issues
   - Alertas inteligentes
   - Reportes automáticos

3. **Integra con otras herramientas**
   - Sentry + GitHub (crear issues automáticos)
   - Sentry + Slack (notificaciones)
   - Sentry + PostgreSQL MCP (query error patterns)

4. **Profundiza en performance**
   - Transaction monitoring
   - Web Vitals tracking
   - Custom instrumentation

5. **Aprende mejores prácticas**
   - Error budgets
   - SLOs y SLIs
   - Incident management
   - Post-mortem analysis

---

**Anterior**: [Nostr MCP (9.I)](./capitulo_09_mcp_nostr.md)
**Siguiente**: [Canva MCP (9.K)](./capitulo_09_mcp_canva.md)
**Inicio**: [Curso Principal](../README.md)

---

**¿Listo para debuggear como un pro?** Conecta Sentry y deja que la IA te ayude a encontrar y arreglar bugs más rápido. 🐛🔍
