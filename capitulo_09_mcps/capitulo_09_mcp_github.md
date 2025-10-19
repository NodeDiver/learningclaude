# Subcapítulo 9.A: MCP de GitHub - Domina GitHub desde Claude Code

**Duración**: 60 minutos
**Dificultad**: Intermedio
**Prerrequisito**: Capítulo 9 (MCP Básico)

---

## 🎯 Objetivos de Aprendizaje

Al final de este subcapítulo, podrás:
- Entender qué es el MCP de GitHub y por qué es poderoso
- Configurar el servidor MCP de GitHub correctamente
- Usar herramientas para leer y explorar repositorios
- Gestionar issues y pull requests desde Claude Code
- Analizar código y seguridad de proyectos
- Monitorear CI/CD y workflows
- Automatizar tareas comunes de GitHub
- Integrar el MCP de GitHub en tu flujo de trabajo diario

---

## 📖 Lección 9.A.1: ¿Qué es el MCP de GitHub?

El **MCP de GitHub** es un servidor oficial de GitHub que conecta Claude Code directamente con la plataforma GitHub, dándole acceso programático a repositorios, issues, PRs, workflows y más.

### Concepto Fundamental

Piensa en el MCP de GitHub como un **puente directo** entre Claude y GitHub:

**Sin MCP de GitHub:**
```
Tú ←→ Claude Code
       ↓ (manualmente)
   Navegador ←→ GitHub
```

**Con MCP de GitHub:**
```
Tú ←→ Claude Code ←→ MCP GitHub ←→ GitHub API
     (conversación fluida)
```

### ¿Qué Puede Hacer?

El MCP de GitHub proporciona **más de 25 herramientas** para:

✅ **Exploración de Código**
- Leer archivos de cualquier repositorio
- Navegar estructura de carpetas
- Buscar código en repos públicos/privados
- Analizar commits y cambios

✅ **Gestión de Issues**
- Crear, actualizar, cerrar issues
- Listar issues filtrados
- Agregar comentarios y labels
- Asignar issues a usuarios

✅ **Pull Requests**
- Crear PRs automáticamente
- Listar PRs pendientes de review
- Mergear PRs
- Comentar en code reviews

✅ **CI/CD y Workflows**
- Monitorear GitHub Actions
- Analizar fallos de builds
- Ver logs de workflows
- Gestionar releases

✅ **Seguridad**
- Listar alertas de Dependabot
- Analizar vulnerabilidades
- Revisar security advisories

### Ventajas Clave

| Sin MCP GitHub | Con MCP GitHub |
|----------------|----------------|
| Cambias entre navegador y Claude | Todo en una conversación |
| Copy/paste de código | Acceso directo a archivos |
| Revisar issues manualmente | Claude filtra y resume |
| Debuggear CI manualmente | Análisis automático de fallos |
| Contexto fragmentado | Contexto completo del proyecto |
| **Lento y tedioso** | **Rápido y fluido** ⚡ |

---

## 📖 Lección 9.A.2: Instalación y Configuración

### Opción 1: Configuración Rápida (Recomendada)

```bash
claude mcp add --transport http \
  --name github \
  --url https://mcp.github.com
```

Claude Code agregará automáticamente el servidor a tu configuración.

### Opción 2: Configuración Manual

**Archivo: `.claude/mcp.json`** (proyecto)
```json
{
  "servers": {
    "github": {
      "transport": "http",
      "url": "https://mcp.github.com",
      "headers": {
        "User-Agent": "ClaudeCode/1.0"
      }
    }
  }
}
```

O en **`~/.claude/mcp.json`** (global - todos los proyectos)

### Autenticación con GitHub

Para acceder a repositorios privados y tener más rate limit, necesitas autenticarte:

**Paso 1: Iniciar autenticación**
```bash
claude mcp auth github
```

**Paso 2: Autorizar en el navegador**
```
1. Se abre tu navegador automáticamente
2. Login en GitHub (si no estás logueado)
3. Autoriza "Claude Code MCP"
4. Permisos solicitados:
   ✓ repo (acceso a repositorios)
   ✓ read:user (info de usuario)
   ✓ workflow (GitHub Actions)
5. Click "Authorize"
```

**Paso 3: Confirmación**
```
✓ Autenticación exitosa
Token guardado en: ~/.claude/mcp-credentials.json
```

### Verificar Instalación

```bash
# Listar servidores MCP
claude mcp list

# Salida esperada:
# github (http) - https://mcp.github.com [authenticated ✓]
```

### Permisos Recomendados

Para funcionalidad completa, asegúrate de tener estos scopes:

```
repo              - Acceso completo a repositorios
read:org          - Leer info de organizaciones
workflow          - Gestionar GitHub Actions
read:packages     - Leer packages
read:discussion   - Leer discusiones
```

---

## 📖 Lección 9.A.3: Exploración de Repositorios

### Herramienta: github_read_file

Lee el contenido de cualquier archivo en un repositorio.

**Sintaxis:**
```
Tú: Lee el archivo README.md del repo facebook/react

Claude: [usa github_read_file]
```

**Ejemplo práctico:**
```
Tú: Muéstrame el package.json de vercel/next.js

Claude: [lee archivo]
{
  "name": "next",
  "version": "14.1.0",
  "dependencies": {
    "react": "^18.2.0",
    ...
  }
}
```

**Parámetros:**
- `owner`: Dueño del repo (usuario u organización)
- `repo`: Nombre del repositorio
- `path`: Ruta al archivo
- `ref` (opcional): Branch, tag o commit SHA

### Herramienta: github_browse_repository

Explora la estructura de carpetas de un repositorio.

**Ejemplo:**
```
Tú: ¿Qué estructura tiene el repo microsoft/vscode?

Claude: [usa github_browse_repository]

Estructura de microsoft/vscode:
├── .github/
├── build/
├── extensions/
├── out/
├── resources/
├── scripts/
├── src/
│   ├── vs/
│   │   ├── base/
│   │   ├── editor/
│   │   ├── platform/
│   │   └── workbench/
├── test/
├── package.json
├── tsconfig.json
└── README.md
```

### Herramienta: github_search_code

Busca código en GitHub usando queries avanzadas.

**Ejemplo 1: Buscar en un repo específico**
```
Tú: Busca cómo implementan autenticación JWT en el repo nestjs/nest

Claude: [usa github_search_code]
Encontré 15 archivos con "JWT authentication":

1. src/auth/jwt.strategy.ts
   - Implementa JwtStrategy con Passport
   - Valida tokens en requests

2. src/auth/jwt-auth.guard.ts
   - Guard para proteger rutas
   - Usa @UseGuards(JwtAuthGuard)

¿Quieres que lea alguno en detalle?
```

**Ejemplo 2: Buscar en todos los repos públicos**
```
Tú: Busca ejemplos de implementación de rate limiting con Redis

Claude: [busca en repos públicos]
Top 5 implementaciones:
1. expressjs/express-rate-limit
2. animir/node-rate-limiter-flexible
3. nfriedly/express-slow-down
...
```

### Herramienta: github_list_commits

Analiza el historial de commits.

**Ejemplo:**
```
Tú: Muestra los últimos 10 commits de mi-usuario/mi-proyecto

Claude: [usa github_list_commits]

Commits recientes:
1. abc1234 (2 horas) - Fix authentication bug
   por @developer1

2. def5678 (5 horas) - Add user profile page
   por @developer2

3. ghi9012 (1 día) - Update dependencies
   por @developer1

Patrón detectado: Alta actividad en autenticación
```

---

## 📖 Lección 9.A.4: Gestión de Issues

### Crear Issues

**Herramienta: github_create_issue**

```
Tú: Crea un issue en mi-usuario/proyecto sobre el bug de login

Claude: [usa github_create_issue]
✓ Issue #123 creado exitosamente

Título: "Bug: Login fails with valid credentials"
URL: https://github.com/mi-usuario/proyecto/issues/123
Estado: Open
Labels: bug, priority-high
Asignado a: @mi-usuario
```

**Parámetros:**
```javascript
{
  owner: "mi-usuario",
  repo: "proyecto",
  title: "Bug: Login fails with valid credentials",
  body: "Descripción detallada del bug...",
  labels: ["bug", "priority-high"],
  assignees: ["mi-usuario"]
}
```

### Listar Issues

**Herramienta: github_list_issues**

```
Tú: Muéstrame todos los bugs abiertos en mi proyecto

Claude: [usa github_list_issues con filter: label=bug, state=open]

Issues abiertos con label "bug":

#123 - Login fails with valid credentials
  Creado hace 2 horas
  Asignado a @developer1
  🔴 priority-high

#118 - Dashboard loads slowly
  Creado hace 1 día
  Sin asignar
  🟡 priority-medium

#112 - Mobile menu not responsive
  Creado hace 3 días
  Asignado a @developer2
  🟢 priority-low

Total: 3 bugs abiertos
```

### Actualizar Issues

**Herramienta: github_update_issue**

```
Tú: Cierra el issue #123 y agrega un comentario

Claude: [usa github_update_issue]
✓ Issue #123 actualizado

Cambios:
- Estado: Open → Closed
- Comentario agregado: "Fixed in PR #125"
- Label agregado: "resolved"
```

### Filtros Avanzados

```
Tú: Muestra issues que:
- Están abiertos
- Tienen label "enhancement"
- Fueron creados en los últimos 7 días
- No están asignados a nadie

Claude: [aplica filtros múltiples]
Encontré 5 issues que cumplen los criterios:
[lista filtrada]
```

---

## 📖 Lección 9.A.5: Pull Requests

### Crear Pull Requests

**Herramienta: github_create_pr**

```
Tú: Tengo cambios en la rama feature/auth, crea un PR para mergear a main

Claude: [usa github_create_pr]
✓ Pull Request #125 creado

Título: "Add JWT authentication system"
Base: main ← Head: feature/auth
URL: https://github.com/usuario/proyecto/pull/125

Cambios:
  +450 -120 líneas
  5 archivos modificados

Descripción generada automáticamente:
## Changes
- Implemented JWT token generation
- Added refresh token mechanism
- Updated tests for auth flow

## Test Plan
- ✓ Unit tests passing
- ✓ Integration tests passing
```

### Listar Pull Requests

**Herramienta: github_list_prs**

```
Tú: ¿Qué PRs necesitan mi review?

Claude: [usa github_list_prs con filtro: requested-reviewer=@me]

Pull Requests esperando tu review:

#125 - Add JWT authentication
  por @developer1
  +450 -120 líneas
  Creado hace 2 horas
  ⚠️ Urgente: label "hotfix"

#124 - Update user profile UI
  por @developer2
  +80 -45 líneas
  Creado hace 1 día
  2 comentarios sin resolver

¿Quieres revisar el código del más urgente?
```

### Code Review Asistido

```
Tú: Revisa el código del PR #125

Claude:
1. [Lee archivos modificados]
2. [Analiza cambios]
3. [Genera review]

Revisión de PR #125:

✅ Aspectos positivos:
- Implementación sólida de JWT
- Tests comprehensivos
- Manejo de errores apropiado

⚠️ Sugerencias de mejora:
1. src/auth/jwt.service.ts:45
   - Considera usar constantes para token expiry
   - Actual: expiresIn: '1h'
   - Sugerido: expiresIn: JWT_ACCESS_TOKEN_EXPIRY

2. src/auth/refresh.strategy.ts:78
   - Falta validación de token expirado
   - Agregar: if (isTokenExpired(token)) throw new Error()

¿Quieres que agregue estos comentarios al PR?
```

### Mergear Pull Requests

**Herramienta: github_merge_pr**

```
Tú: El PR #125 se ve bien, mergealo

Claude: [verifica que tests pasen]
✓ Todos los checks pasaron
✓ No hay conflictos

[usa github_merge_pr]
✓ PR #125 mergeado exitosamente
Método: squash and merge
Branch feature/auth eliminado automáticamente
```

---

## 📖 Lección 9.A.6: CI/CD y Workflows

### Monitorear GitHub Actions

**Herramienta: github_list_workflows**

```
Tú: ¿Qué workflows tiene mi proyecto?

Claude: [usa github_list_workflows]

Workflows configurados:

1. CI (ci.yml)
   - Trigger: push, pull_request
   - Jobs: lint, test, build
   - Último run: ✓ Pasó (hace 1 hora)

2. Deploy Production (deploy-prod.yml)
   - Trigger: push to main
   - Jobs: build, test, deploy
   - Último run: ✓ Pasó (hace 3 horas)

3. Nightly Tests (nightly.yml)
   - Trigger: schedule (2:00 AM)
   - Jobs: integration-tests
   - Último run: ❌ Falló (hace 5 horas)
```

### Analizar Fallos de Build

**Herramienta: github_check_runs**

```
Tú: ¿Por qué falló el último build?

Claude: [usa github_check_runs para el último commit]

Workflow "CI" falló en commit abc1234
Commit: "Add user authentication"

Fallos detectados:

❌ Job: test
   Step: Run unit tests
   Error:
   ```
   FAIL src/auth/auth.service.spec.ts
     AuthService
       ✓ should be defined
       ✗ should generate valid JWT token

   TypeError: Cannot read property 'sign' of undefined
       at JwtService.sign (src/auth/jwt.service.ts:45:12)
   ```

Causa probable:
- JwtService no está siendo mockeado correctamente en el test
- Línea 45 de jwt.service.ts intenta usar un método undefined

¿Quieres que revise el test para sugerir un fix?
```

### Ver Logs Completos

```
Tú: Muéstrame los logs completos del job que falló

Claude: [extrae logs del workflow run]

Logs del job "test":

[00:00] Setting up Node.js 18.x
[00:15] Installing dependencies
[00:45] Running tests
[01:20] ✓ auth.controller.spec.ts (5 tests)
[01:35] ✗ auth.service.spec.ts (2/3 tests)
[01:40]   Error: TypeError: Cannot read property 'sign'...
[01:42] Tests failed
[01:43] Process exited with code 1

El error está en la línea 45 de tu test.
```

---

## 📖 Lección 9.A.7: Seguridad y Dependencias

### Analizar Alertas de Seguridad

**Herramienta: github_security_alerts**

```
Tú: ¿Tengo vulnerabilidades en mi proyecto?

Claude: [usa github_security_alerts]

⚠️ Encontradas 3 alertas de seguridad:

🔴 CRÍTICO - lodash 4.17.15
  Vulnerabilidad: Prototype Pollution
  CVSS Score: 9.8
  Afecta: src/utils/helper.js
  Fix disponible: Actualizar a lodash 4.17.21

🟡 MEDIO - axios 0.19.2
  Vulnerabilidad: SSRF (Server-Side Request Forgery)
  CVSS Score: 6.5
  Afecta: src/api/client.js
  Fix disponible: Actualizar a axios 0.21.2

🟢 BAJO - moment 2.24.0
  Vulnerabilidad: ReDoS
  CVSS Score: 3.7
  Afecta: src/utils/date.js
  Fix disponible: Migrar a date-fns o actualizar

¿Quieres que actualice las dependencias automáticamente?
```

### Actualización Automática de Dependencias

```
Tú: Sí, actualiza las dependencias vulnerables

Claude:
1. [Lee package.json]
2. [Actualiza versiones]
3. [Ejecuta tests]
4. [Crea PR]

✓ PR #126 creado: "Security: Update vulnerable dependencies"

Cambios en package.json:
- lodash: 4.17.15 → 4.17.21
- axios: 0.19.2 → 0.21.2
- moment removido, reemplazado por date-fns

Tests: ✓ Todos pasaron
```

### Revisar Dependencias

```
Tú: Lista todas las dependencias desactualizadas

Claude: [analiza package.json y versiones disponibles]

Dependencias desactualizadas:

🔄 Actualizaciones mayores (breaking changes):
- react: 17.0.2 → 18.2.0
- typescript: 4.5.0 → 5.3.0

🔄 Actualizaciones menores (features):
- express: 4.17.1 → 4.18.2
- jest: 27.0.0 → 27.5.1

🔄 Patches (bug fixes):
- eslint: 8.10.0 → 8.10.3

Recomendación: Actualizar patches y menores primero.
```

---

## 📖 Lección 9.A.8: Gestión de Releases

### Crear Releases

**Herramienta: github_create_release**

```
Tú: Crea un release v2.1.0 con los últimos cambios

Claude: [usa github_create_release]

Analizando commits desde v2.0.0...
Encontrados 23 commits.

✓ Release v2.1.0 creado:

Tag: v2.1.0
Título: "Version 2.1.0 - Authentication Improvements"
URL: https://github.com/usuario/proyecto/releases/tag/v2.1.0

Release Notes generados:

## 🚀 Features
- Add JWT authentication system (#125)
- Implement refresh token mechanism (#127)
- Add user profile endpoints (#130)

## 🐛 Bug Fixes
- Fix login error handling (#123)
- Resolve dashboard loading issue (#118)

## 📦 Dependencies
- Update lodash to 4.17.21 (security fix)
- Update axios to 0.21.2 (security fix)

## Contributors
@developer1, @developer2, @developer3
```

### Listar Releases

```
Tú: Muéstrame los últimos 5 releases

Claude: [usa github_list_releases]

Releases recientes:

1. v2.1.0 (hace 1 hora) - Latest
   - 23 commits
   - 450+ líneas agregadas
   - Downloads: 0

2. v2.0.0 (hace 2 semanas)
   - 156 commits
   - Mayor refactor
   - Downloads: 1,234

3. v1.5.2 (hace 1 mes)
   - 8 commits
   - Bug fixes
   - Downloads: 3,456
```

---

## 📖 Lección 9.A.9: Workflows Avanzados

### Workflow 1: Code Review Completo

```
Tú: Hazme un code review completo del PR #125

Claude: Iniciando code review exhaustivo...

Paso 1: [Analiza estructura]
✓ 5 archivos modificados
✓ +450 -120 líneas
✓ Archivos: src/auth/*.ts

Paso 2: [Revisa lógica de negocio]
✓ Implementación de JWT correcta
⚠️ Falta rate limiting en login endpoint
✓ Refresh tokens implementados bien

Paso 3: [Revisa tests]
✓ 15 tests agregados
⚠️ Falta test para token expiration
✓ Coverage: 87% → 92%

Paso 4: [Revisa seguridad]
✓ Passwords hasheados con bcrypt
✓ Tokens firmados correctamente
⚠️ Sugerencia: Agregar helmet.js para headers

Paso 5: [Revisa documentación]
⚠️ Falta documentar endpoints en README
✓ JSDoc comments presentes

Paso 6: [Verifica CI]
✓ Todos los checks pasaron
✓ No hay conflictos con main

Resumen:
Score: 8.5/10
Recomendación: ✅ APROBAR con sugerencias menores

¿Quieres que agregue los comentarios al PR?
```

### Workflow 2: Análisis de Proyecto

```
Tú: Dame un análisis completo del estado de mi proyecto

Claude: Analizando usuario/proyecto...

📊 Estadísticas Generales:
- Commits: 1,234 (último hace 2 horas)
- Contributors: 12 activos
- Stars: 456
- Forks: 89
- Issues abiertos: 23
- PRs abiertos: 5

🔥 Actividad Reciente (últimos 7 días):
- 45 commits
- 12 PRs mergeados
- 8 issues cerrados
- 3 releases

⚠️ Áreas de Atención:
1. Seguridad:
   - 3 alertas Dependabot (1 crítica)
   - Requiere acción inmediata

2. CI/CD:
   - 2 workflows fallando
   - Nightly tests con problemas

3. Code Review:
   - 3 PRs esperando review >3 días
   - Bottleneck en reviews

4. Issues:
   - 5 bugs prioritarios sin asignar
   - 8 issues >30 días sin actividad

📈 Tendencias:
- Velocidad: +15% vs mes anterior
- Quality: Code coverage 85% ✓
- Deuda técnica: Estable

Recomendaciones:
1. Arreglar vulnerabilidades críticas HOY
2. Asignar reviewers a PRs antiguos
3. Triagear issues estancados
```

### Workflow 3: Migración de Dependencias

```
Tú: Ayúdame a migrar de moment.js a date-fns

Claude: Iniciando migración de moment → date-fns...

Paso 1: [Analiza uso de moment]
Encontrados 24 archivos usando moment:
- src/utils/date.js (12 usos)
- src/components/Calendar.tsx (8 usos)
- src/services/report.ts (4 usos)

Paso 2: [Genera plan de migración]
Conversiones necesarias:
moment() → new Date()
moment(date).format() → format(date, pattern)
moment(date).add() → addDays(date, n)
[... lista completa ...]

Paso 3: [Actualiza package.json]
✓ Removido: moment
✓ Agregado: date-fns

Paso 4: [Refactoriza código]
[Muestra diff de cada archivo]

Paso 5: [Ejecuta tests]
✓ Todos los tests pasaron

Paso 6: [Crea PR]
✓ PR #127 creado: "Migrate from moment.js to date-fns"
  Bundle size reducido: -67KB

¿Quieres revisar los cambios antes de mergear?
```

---

## 🛠️ Ejercicios Prácticos

### Ejercicio 9.A.1: Exploración Básica
1. Configura el MCP de GitHub
2. Autentica tu cuenta
3. Explora un repositorio público (ej: facebook/react)
4. Lee 3 archivos diferentes del repositorio
5. Lista los últimos 10 commits

### Ejercicio 9.A.2: Gestión de Issues
1. Crea un nuevo repositorio de prueba en GitHub
2. Desde Claude Code, crea 3 issues con diferentes labels
3. Lista todos los issues
4. Actualiza un issue agregando un comentario
5. Cierra uno de los issues

### Ejercicio 9.A.3: Pull Request Workflow
1. Crea una nueva rama en tu repo de prueba
2. Haz algunos cambios (puede ser con Claude Code)
3. Pide a Claude que cree un PR de esa rama a main
4. Lista los PRs abiertos
5. Mergea el PR usando Claude

### Ejercicio 9.A.4: Análisis de Seguridad
1. Usa un proyecto existente con dependencias
2. Pide a Claude que analice vulnerabilidades
3. Si encuentra alguna, pide que las actualice
4. Verifica que los tests pasen
5. Crea un PR con las actualizaciones

### Ejercicio 9.A.5: Monitoreo de CI/CD
1. Configura un GitHub Action simple en tu repo
2. Haz un commit que rompa los tests (intencionalmente)
3. Pide a Claude que analice por qué falló el build
4. Pide que sugiera un fix
5. Implementa el fix y verifica que pase

---

## 📝 Examen 9.A: Maestría del MCP de GitHub

### Parte 1: Preguntas Teóricas (3 puntos)

**Pregunta 1:** ¿Cuáles son las 3 principales ventajas de usar el MCP de GitHub vs gestionar GitHub manualmente desde el navegador?

**Pregunta 2:** ¿Qué herramienta usarías para cada uno de estos casos?
- a) Ver el código de un archivo específico en un repo
- b) Encontrar todas las referencias a una función en un repo
- c) Crear un nuevo issue
- d) Ver por qué falló el último build

**Pregunta 3:** ¿Qué permisos (scopes) necesitas para que el MCP de GitHub funcione completamente?

### Parte 2: Configuración (2 puntos)

1. Muestra cómo configurarías el MCP de GitHub manualmente en `.claude/mcp.json`
2. Explica el proceso de autenticación paso a paso
3. ¿Dónde se guarda el token de autenticación?

### Parte 3: Práctica - Code Review (5 puntos)

Escenario: Un compañero creó el PR #123 agregando una nueva feature.

**Tareas:**
1. Pide a Claude que analice el PR #123
2. Pide un code review completo
3. Si encuentra issues, pide que agregue comentarios al PR
4. Verifica que los tests pasen
5. Si todo está bien, mergea el PR

Documenta todos los comandos que uses y los resultados.

### Parte 4: Proyecto Real (Bonus +3 puntos)

Elige uno de estos proyectos:

**Opción A: Security Audit**
1. Analiza un proyecto real tuyo con el MCP
2. Identifica todas las vulnerabilidades
3. Crea issues para cada vulnerabilidad
4. Actualiza las dependencias
5. Crea un PR con los fixes
6. Documenta el proceso completo

**Opción B: PR Workflow Automation**
1. Crea un script/workflow que:
   - Lista PRs pendientes de review
   - Analiza cada PR automáticamente
   - Genera un reporte de code review
   - Sugiere aprobación o cambios
2. Demuestra el workflow con al menos 2 PRs
3. Documenta los resultados

---

## ✅ Cómo Enviar Tu Examen

### Para la Parte 1:
```
Parte 1:
P1: [respuesta]
P2: [respuesta]
P3: [respuesta]
```

### Para la Parte 2:
Muestra la configuración completa y explica cada paso.

### Para la Parte 3:
Documenta cada paso con los comandos usados y resultados obtenidos.

### Para la Parte 4:
Proporciona:
- Screenshots o logs del proceso
- Código del workflow (si aplica)
- Análisis de resultados
- Lecciones aprendidas

---

## 🎯 Checklist de Dominio

Marca cuando domines cada aspecto:

**Configuración**
- [ ] Instalar MCP de GitHub
- [ ] Autenticar con GitHub
- [ ] Verificar conexión

**Exploración**
- [ ] Leer archivos de repos
- [ ] Navegar estructura de proyectos
- [ ] Buscar código en repos
- [ ] Analizar historial de commits

**Gestión de Issues**
- [ ] Crear issues
- [ ] Listar y filtrar issues
- [ ] Actualizar issues
- [ ] Cerrar issues

**Pull Requests**
- [ ] Crear PRs
- [ ] Listar PRs
- [ ] Revisar código de PRs
- [ ] Mergear PRs

**CI/CD**
- [ ] Monitorear workflows
- [ ] Analizar fallos de builds
- [ ] Ver logs de GitHub Actions

**Seguridad**
- [ ] Identificar vulnerabilidades
- [ ] Actualizar dependencias
- [ ] Gestionar alertas de Dependabot

**Avanzado**
- [ ] Code reviews automáticos
- [ ] Análisis de proyectos
- [ ] Workflows personalizados

---

## 💡 Mejores Prácticas

### 1. Usa Contexto Completo

```
✅ Bueno:
"Analiza el PR #123, revisa seguridad, performance y tests"

❌ Limitado:
"Muéstrame el PR #123"
```

### 2. Combina Múltiples Herramientas

```
Workflow efectivo:
1. Lista PRs pendientes
2. Para cada PR: analiza código
3. Ejecuta tests automáticamente
4. Genera reporte consolidado
```

### 3. Automatiza Tareas Repetitivas

```
En lugar de:
- Revisar manualmente cada PR
- Copiar/pegar código para análisis
- Verificar builds uno por uno

Pide:
"Analiza todos los PRs abiertos y dame un reporte"
```

### 4. Mantén Seguridad en Mente

```
✅ Bueno:
- Revisa vulnerabilidades semanalmente
- Actualiza dependencias regularmente
- Monitorea alertas de Dependabot

⚠️ Evita:
- Ignorar alertas de seguridad
- Postponer actualizaciones críticas
```

### 5. Documenta Decisiones

```
Al mergear PRs importantes:
- Pide a Claude que documente cambios
- Genera release notes automáticas
- Crea issues de seguimiento si es necesario
```

---

## 🚀 Siguiente Nivel

Una vez que domines el MCP de GitHub, explora:

1. **Combinar con otros MCPs**
   - Slack MCP: Notificaciones de PRs
   - Jira MCP: Sincronizar issues
   - Database MCP: Gestionar migraciones

2. **Crear Workflows Personalizados**
   - Scripts de automatización
   - Bots de code review
   - Sistemas de CI/CD custom

3. **Integración con tu equipo**
   - Compartir configuraciones
   - Estandarizar workflows
   - Documentar mejores prácticas

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [GitHub MCP Server](https://github.com/github/github-mcp-server)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [MCP Protocol Spec](https://modelcontextprotocol.io)

### Ejemplos de la Comunidad
- [Awesome MCP Servers](https://github.com/wong2/awesome-mcp-servers)
- [GitHub MCP Examples](https://github.com/modelcontextprotocol/servers/tree/main/src/github)

### Tutoriales
- [GitHub MCP Quickstart](https://docs.claude.com/en/docs/claude-code/mcp-servers)
- [Advanced GitHub Workflows](https://github.blog/changelog/2025-04-04-github-mcp-server-public-preview/)

---

**¡Subcapítulo 9.A Completo!**

Has aprendido a usar el MCP de GitHub como un profesional. Ahora puedes gestionar repositorios, issues, PRs, CI/CD y seguridad directamente desde Claude Code.

**Anterior**: `capitulo_09.md` (MCP Básico)
**Siguiente**: `capitulo_09_mcp_[otro-servicio].md` (Próximo MCP)
