# Capítulo 10: Flujos de Trabajo Avanzados

**Duración**: 75 minutos
**Dificultad**: Avanzado

---

## 🎯 Objetivos de Aprendizaje

Al final de este capítulo, podrás:
- Gestionar proyectos complejos de múltiples pasos
- Aplicar estrategias efectivas de depuración
- Usar Plan Mode vs Normal Mode apropiadamente
- Integrar todas las características de Claude Code
- Optimizar tu flujo de trabajo para máxima productividad
- Aplicar mejores prácticas a nivel profesional
- Completar proyectos end-to-end con Claude Code

---

## 📖 Lección 10.1: Proyectos de Múltiples Pasos

### Anatomía de un Proyecto Complejo

Un proyecto típico involucra:

```
1. Planificación  → Qué hacer
2. Investigación  → Cómo hacerlo
3. Implementación → Escribir código
4. Testing        → Verificar que funcione
5. Revisión       → Asegurar calidad
6. Documentación  → Explicar el código
7. Deployment     → Publicar cambios
```

### Estrategia: Divide y Conquistarás

**❌ Approach Malo:**
```
Tú: Implementa un sistema completo de autenticación con JWT, refresh tokens, OAuth social, rate limiting, y email verification
```

**✅ Approach Bueno:**
```
1. Tú: Planifiquemos un sistema de autenticación
   Claude: [crea plan detallado con TodoWrite]

2. Tú: Empecemos con la autenticación básica JWT
   Claude: [implementa JWT base]

3. Tú: Ahora agrega refresh tokens
   Claude: [extiende con refresh tokens]

4. Tú: Agrega OAuth para Google
   Claude: [integra OAuth]

5. Tú: Implementa rate limiting
   Claude: [agrega rate limiting]

6. Tú: Finalmente, email verification
   Claude: [completa con email verification]
```

### Usar TodoWrite para Tracking

**Proyecto: Implementar Dashboard de Analytics**

```
TodoWrite:
1. [in_progress] Diseñar esquema de base de datos
2. [pending] Crear API endpoints
3. [pending] Implementar queries de analytics
4. [pending] Crear componentes de UI
5. [pending] Integrar gráficas (Chart.js)
6. [pending] Agregar tests
7. [pending] Escribir documentación
8. [pending] Optimizar rendimiento
```

Claude marca cada tarea como completada antes de pasar a la siguiente.

### Ejemplo Completo

**Tú: Quiero implementar un sistema de notificaciones en tiempo real**

**Claude:**
```
Excelente proyecto. Usaré TodoWrite para organizarlo:

Tareas:
1. [in_progress] Investigar opciones (WebSockets vs SSE vs Polling)
2. [pending] Diseñar arquitectura
3. [pending] Implementar servidor WebSocket
4. [pending] Crear cliente de conexión
5. [pending] Implementar sistema de suscripciones
6. [pending] Agregar persistencia de notificaciones
7. [pending] Crear UI de notificaciones
8. [pending] Agregar tests
9. [pending] Documentar API

Empecemos investigando las opciones...
[usa general-purpose agent para investigar]
[completa tarea 1]
[marca tarea 2 como in_progress]
...
```

---

## 📖 Lección 10.2: Estrategias de Depuración

### Enfoque Sistemático de Debugging

**1. Reproducir el Bug**
```
Tú: Tengo un bug en el login

Claude:
- ¿Qué error ves exactamente?
- ¿Cuáles son los pasos para reproducirlo?
- ¿Qué comportamiento esperabas?
- ¿Tienes logs o mensajes de error?
```

**2. Aislar el Problema**
```
Claude:
1. [lee el archivo relevante]
2. [busca funciones relacionadas]
3. [revisa imports y dependencias]
4. [identifica punto de falla probable]
```

**3. Analizar el Código**
```
Claude:
[analiza la lógica]
[identifica posibles causas]
[propone hipótesis]
```

**4. Proponer Solución**
```
Claude:
Encontré el problema en línea 45:
- El token no se está validando correctamente
- Falta manejo de caso null

Soluciones:
1. Agregar null check
2. Mejorar validación de token
3. Agregar logging para debugging futuro
```

**5. Implementar Fix**
```
Claude:
[edita el archivo]
[agrega tests para el bug]
[verifica que el fix funciona]
```

### Técnicas de Debugging

**A. Análisis de Stack Traces**
```
Tú: [pega stack trace]

Claude:
1. [identifica línea exacta del error]
2. [lee contexto alrededor de esa línea]
3. [analiza qué causó el error]
4. [propone fix]
```

**B. Debugging por Binary Search**
```
Claude:
El bug está en esta función de 200 líneas.
1. [comenta mitad del código]
2. ¿Sigue fallando?
3. Si sí → bug en primera mitad
4. Si no → bug en segunda mitad
5. [repite hasta encontrar línea exacta]
```

**C. Agregar Logging Estratégico**
```
Claude:
[agrega console.log en puntos clave]
[ejecuta código]
[analiza output]
[identifica dónde falla]
[remueve logs temporales]
```

**D. Usar Debugging Tools**
```
Claude:
[configura debugger]
[agrega breakpoints]
[ejecuta paso a paso]
[inspecciona variables]
```

### Debugging con MCP

**Integración con Sentry:**
```
Tú: Debuggea el error #ERR-456 de Sentry

Claude:
1. [sentry__get_error id="ERR-456"]
2. [analiza stack trace y contexto]
3. [lee archivos relevantes]
4. [identifica causa root]
5. [implementa fix]
6. [actualiza issue en Sentry]
```

---

## 📖 Lección 10.3: Plan Mode vs Normal Mode

### ¿Qué es Plan Mode?

**Plan Mode** es cuando Claude planifica antes de ejecutar.

```
Plan Mode: Planifica → Usuario aprueba → Ejecuta
Normal Mode: Ejecuta directamente
```

### Cuándo Usar Plan Mode

**✅ Usar Plan Mode cuando:**
- Tarea compleja con múltiples pasos
- Cambios significativos al código
- No estás 100% seguro del approach
- Quieres revisar antes de ejecutar
- Proyecto con muchos archivos afectados

**❌ NO usar Plan Mode cuando:**
- Tarea simple de 1-2 pasos
- Solo lectura/investigación
- Cambios pequeños conocidos
- Iteración rápida

### Activar Plan Mode

```bash
# Iniciar en plan mode
claude --permission-mode plan

# Dentro de sesión
Tú: Entra en plan mode para esta tarea
```

### Ejemplo: Refactorización Grande

**Plan Mode:**
```
Tú: Refactoriza el sistema de auth para usar TypeScript

Claude: [PLAN MODE]

Plan de Refactorización:

1. Investigación (5 min)
   - Analizar código JavaScript actual
   - Identificar tipos necesarios

2. Configuración (10 min)
   - Agregar tsconfig.json
   - Instalar @types/node, @types/express
   - Configurar build pipeline

3. Conversión (30 min)
   - Convertir auth.js → auth.ts
   - Agregar interfaces para User, Token
   - Convertir middleware.js → middleware.ts
   - Agregar tipos para request/response

4. Testing (15 min)
   - Ejecutar tests existentes
   - Verificar tipos con tsc
   - Fix type errors

5. Documentation (10 min)
   - Actualizar README
   - Agregar comentarios de tipos

¿Aprobar este plan?

Tú: Aprobado, procede

Claude: [NORMAL MODE]
[ejecuta el plan paso a paso]
```

### Ventajas de Plan Mode

- 👁️ **Visibilidad**: Ves qué hará Claude antes de hacerlo
- 🛡️ **Seguridad**: Puedes cancelar si algo se ve mal
- 🎯 **Claridad**: Entiendes el approach completo
- 📋 **Tracking**: Plan sirve como checklist

---

## 📖 Lección 10.4: Integración de Todas las Características

### El Stack Completo de Claude Code

Combina todas las herramientas aprendidas:

```
Herramientas Base → Slash Commands → Agentes → Hooks → MCP
        ↓                ↓              ↓         ↓      ↓
    Todo List      Workflows     Specialist  Automation  External Data
```

### Proyecto Integrado: Sistema de Blog

**Setup Inicial:**

**1. Comandos Slash** (`.claude/commands/`)
```markdown
# blog-post.md
Create a new blog post:
1. Create markdown file
2. Add frontmatter (title, date, author)
3. Generate post template
4. Open in editor
```

**2. Agentes** (`.claude/agents/`)
```json
{
  "name": "seo-optimizer",
  "description": "Optimizes blog posts for SEO",
  "systemPrompt": "Analyze blog posts for SEO..."
}
```

**3. Hooks** (`.claude/settings.local.json`)
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write:blog/*.md",
        "hooks": [
          {
            "command": "prettier --write \"$TOOL_INPUT_file_path\""
          }
        ]
      }
    ]
  }
}
```

**4. MCP** (`.mcp.json`)
```json
{
  "servers": {
    "analytics": {
      "transport": "http",
      "url": "https://analytics.example.com"
    }
  }
}
```

**Workflow Completo:**

```
Tú: /blog-post

Claude:
1. [ejecuta comando slash blog-post]
2. [crea archivo con Write]
3. [Hook formatea automáticamente]
4. [lanza seo-optimizer agent]

SEO Optimizer Agent:
- Sugiere keywords
- Optimiza meta description
- Verifica heading structure
- [devuelve recomendaciones]

Claude:
5. [aplica optimizaciones SEO]
6. [consulta analytics via MCP]
7. [sugiere topics relacionados populares]

✅ Post creado y optimizado: blog/new-post.md
```

---

## 📖 Lección 10.5: Optimización de Rendimiento

### Uso Eficiente de Herramientas

**A. Ejecución Paralela**
```
✅ Rápido:
Claude: [ejecuta en paralelo]
- Read: file1.js
- Read: file2.js
- Read: file3.js
- Grep: "TODO"
- Bash: git status

❌ Lento:
Claude: [ejecuta secuencialmente]
- Read file1.js → espera
- Read file2.js → espera
- Read file3.js → espera
- Grep "TODO" → espera
- Bash git status → espera
```

**B. Usar Agentes Apropiadamente**
```
✅ Usar Agent:
- Búsqueda compleja multi-archivo
- Investigación que requiere múltiples intentos

❌ NO usar Agent:
- Conoces el archivo exacto → usa Read
- Búsqueda simple → usa Grep directamente
```

**C. Herramientas Especializadas**
```
✅ Usar herramientas especializadas:
- Read para leer archivos
- Edit para modificar
- Grep para buscar contenido

❌ NO usar bash:
- cat para leer → usa Read
- sed para editar → usa Edit
- grep para buscar → usa Grep
```

### Gestión de Contexto

**A. Compactar Regularmente**
```
/compact

Libera espacio en contexto manteniendo información importante.
```

**B. Clear Cuando Sea Apropiado**
```
/clear

Usa entre tareas completamente diferentes para empezar fresco.
```

**C. Verificar Uso de Contexto**
```
/context

Ve cuánto contexto estás usando y cuánto queda libre.
```

### Performance Tips

**1. Batch Operations**
```
✅ Bueno: "Edita estos 3 archivos [lista]"
❌ Malo: 3 prompts separados para cada archivo
```

**2. Específico > Vago**
```
✅ "Lee src/auth/login.js líneas 40-60"
❌ "Lee el archivo de login y busca la función"
```

**3. Usar Search Filters**
```
✅ Grep con type="js" glob="src/**"
❌ Grep sin filtros en todo el proyecto
```

---

## 📖 Lección 10.6: Mejores Prácticas Profesionales

### 1. Documentación Mientras Desarrollas

```
Claude approach:
- Escribe código
- Agrega comentarios inline
- Actualiza README si aplica
- Genera documentación de API
- Todo en una sesión
```

### 2. Testing Desde el Inicio

```
TDD con Claude:
1. Escribe test primero
2. Implementa feature
3. Verifica que test pasa
4. Refactoriza
5. Repite
```

### 3. Code Review Continuo

```
Durante desarrollo:
1. Implementa feature
2. /review-code (comando slash)
3. Claude revisa automáticamente
4. Aplica sugerencias
5. Continúa
```

### 4. Commits Atómicos

```
✅ Buenos commits:
- Un feature → un commit
- Mensaje descriptivo
- Tests incluidos

❌ Malos commits:
- "Update files"
- 10 features mezclados
- Sin tests
```

### 5. Iteración Rápida

```
Ciclo:
1. Intenta → 2. Prueba → 3. Ajusta → Repite

No busques perfección en primer intento.
```

### 6. Aprende de los Errores

```
Cuando algo falla:
1. Lee el error completamente
2. Entiende qué causó el problema
3. Aprende cómo evitarlo
4. Documenta la solución
```

### 7. Automatiza lo Repetitivo

```
Si haces algo 3+ veces:
→ Créalo como comando slash
→ O configura un hook
→ O crea un agente
```

---

## 📖 Lección 10.7: Proyecto End-to-End

### Ejemplo: API REST Completa

**Especificación:**
Sistema de gestión de tareas (TODO app) con API REST.

**Paso 1: Planificación**
```
Tú: Necesito crear una API REST para gestión de tareas

Claude: [usa TodoWrite]
Plan del Proyecto:
1. [in_progress] Diseñar schema de base de datos
2. [pending] Configurar proyecto (Express + TypeScript)
3. [pending] Implementar modelos de datos
4. [pending] Crear endpoints CRUD
5. [pending] Agregar autenticación
6. [pending] Implementar validación
7. [pending] Escribir tests
8. [pending] Agregar documentación
9. [pending] Setup CI/CD
```

**Paso 2: Database Design**
```
Claude:
[crea schema.sql]
- Users table
- Tasks table
- Categories table
- Tags table

[marca tarea 1 completada]
[tarea 2 in_progress]
```

**Paso 3: Project Setup**
```
Claude:
[ejecuta en paralelo]
- npm init
- npm install dependencies
- crea tsconfig.json
- estructura de carpetas
- configuración de linting

[Hook auto-formatea archivos]
[marca tarea 2 completada]
```

**Paso 4-6: Implementación**
```
Claude:
[para cada feature]
1. Implementa código
2. [lanza test-writer agent]
3. Agent escribe tests
4. Claude ejecuta tests
5. Fix si fallan
6. Marca tarea completada
```

**Paso 7: Code Review**
```
Claude:
[lanza code-reviewer agent]
- Revisa toda la implementación
- Sugiere mejoras
- Verifica best practices
```

**Paso 8: Documentation**
```
Claude:
[lanza documentation agent]
- README completo
- API documentation
- Setup instructions
- Deployment guide
```

**Paso 9: Deployment**
```
Claude:
1. [crea Dockerfile]
2. [configura CI/CD]
3. [crea scripts de deployment]
4. [documenta proceso]
```

**Resultado Final:**
- ✅ API REST funcional
- ✅ Tests completos (90%+ coverage)
- ✅ Documentación detallada
- ✅ Lista para deployment
- ⏱️ Completado en 2-3 horas vs días manualmente

---

## 🛠️ Ejercicios de Práctica

### Ejercicio 10.1: Proyecto Multi-Paso
Crea un pequeño proyecto con Claude usando TodoWrite:
1. CLI tool que lee un archivo CSV
2. Procesa los datos
3. Genera un reporte en HTML
4. Incluye tests
5. Documenta el uso

### Ejercicio 10.2: Debugging Challenge
1. Introduce un bug intencional en código existente
2. Pide a Claude que lo encuentre y arregle
3. Observa su metodología de debugging

### Ejercicio 10.3: Integración Completa
Crea un workflow que use:
- Comando slash personalizado
- Agente especializado
- Hook para formateo
- TodoWrite para tracking

### Ejercicio 10.4: Optimización
Toma una tarea que hiciste antes y:
1. Identifica pasos ineficientes
2. Optimízala con ejecución paralela
3. Mide la mejora en tiempo

---

## 📝 Examen Final: Proyecto Completo

### Especificaciones del Proyecto

Crea un **sistema completo de blog** con las siguientes características:

**Requerimientos Funcionales:**
1. CRUD de posts (Create, Read, Update, Delete)
2. Sistema de categorías
3. Búsqueda de posts
4. Sistema de tags
5. Autenticación básica
6. API REST

**Requerimientos Técnicos:**
1. TypeScript + Node.js + Express
2. Tests (Jest)
3. Documentación completa
4. Git con commits descriptivos
5. README con setup instructions

**Requerimientos de Claude Code:**
1. Usa TodoWrite para tracking de progreso
2. Crea al menos 2 comandos slash útiles
3. Crea al menos 1 agente especializado
4. Configura hooks para auto-formateo
5. Demuestra debugging de al menos 1 bug

### Criterios de Evaluación

**Funcionalidad (30 puntos)**
- Todas las features funcionan correctamente
- Código limpio y bien organizado
- Manejo de errores apropiado

**Testing (20 puntos)**
- Tests comprehensivos
- Coverage >70%
- Tests pasan

**Documentación (15 puntos)**
- README claro
- Código comentado
- API documentada

**Uso de Claude Code (25 puntos)**
- TodoWrite usado efectivamente
- Comandos slash útiles
- Agente bien diseñado
- Hooks configurados correctamente

**Best Practices (10 puntos)**
- Commits atómicos y descriptivos
- Estructura de proyecto clara
- Código siguiendo estándares

**Total: 100 puntos**

### Entrega

1. Repositorio Git completo
2. Demostración del proyecto funcionando
3. Explicación de cómo usaste cada feature de Claude Code
4. Reflexión: ¿Qué aprendiste? ¿Qué harías diferente?

---

## ✅ Cómo Enviar Tu Examen Final

1. Completa el proyecto
2. Haz push al repositorio
3. Proporciona link al repo
4. Demuestra funcionalidad key
5. Explica tu proceso de desarrollo

---

## 🎯 ¡Capítulo 10 Completo!

Has dominado los flujos de trabajo avanzados. Ahora estás listo para el Capítulo 11: Optimización y Uso Eficiente, donde aprenderás a maximizar tu productividad y minimizar costos.

**Anterior**: `capitulo_09.md`
**Siguiente**: `capitulo_11.md`
