# Capítulo 5: Comandos Slash

**Duración**: 45 minutos
**Dificultad**: Intermedio

---

## 🎯 Objetivos de Aprendizaje

Al final de este capítulo, podrás:
- Entender qué son los comandos slash y cómo funcionan
- Usar todos los comandos integrados efectivamente
- Crear tus propios comandos slash personalizados
- Organizar comandos para flujos de trabajo específicos
- Aplicar mejores prácticas de comandos slash

---

## 📖 Lección 5.1: ¿Qué Son los Comandos Slash?

Los **comandos slash** son atajos que ejecutan prompts predefinidos en Claude Code.

### Conceptos Básicos

- Comienzan con `/` (ej: `/help`, `/clear`)
- Ejecutan prompts almacenados como archivos markdown
- Pueden aceptar argumentos
- Ahorran tiempo evitando repetir prompts largos

### Cómo Funcionan

```
Tú escribes:  /review-code
Claude lee:   .claude/commands/review-code.md
Claude ejecuta el prompt que contiene ese archivo
```

### Tipos de Comandos Slash

1. **Comandos Integrados**: Incluidos con Claude Code
   - `/help`, `/clear`, `/model`, etc.

2. **Comandos Personalizados**: Creados por ti
   - `/review-pr`, `/add-tests`, `/deploy`, etc.

### Ventajas

- ⚡ **Velocidad**: Un comando en lugar de párrafos
- 🔄 **Reutilización**: Define una vez, usa muchas veces
- 📦 **Compartibles**: Commitea comandos al repo
- 🎯 **Consistencia**: Mismo comportamiento cada vez

---

## 📖 Lección 5.2: Comandos Integrados

### Comandos de Gestión de Sesión

| Comando | Función |
|---------|---------|
| `/help` | Muestra ayuda y comandos disponibles |
| `/clear` | Limpia el historial de conversación |
| `/reset` | Reinicia la sesión completamente |
| `/exit` o `/quit` | Sale de Claude Code |
| `/undo` | Deshace el último mensaje del asistente |

**Ejemplos:**
```
# Empezar fresco
/clear

# Deshacer última respuesta
/undo

# Ver ayuda
/help
```

### Comandos de Información

| Comando | Función |
|---------|---------|
| `/model` | Muestra el modelo actual |
| `/cost` | Muestra costos de uso de API |
| `/context` | Muestra uso de tokens y contexto |
| `/history` | Muestra historial de conversación |
| `/config` | Muestra configuración actual |

**Ejemplos:**
```
# Ver uso de tokens
/context

Output:
Context Usage
████████████░░░░░░░░  60k/200k tokens (30%)

# Ver costos
/cost

Total session cost: $0.45
```

### Comandos de Desarrollo

| Comando | Función |
|---------|---------|
| `/bashes` | Lista shells bash en background |
| `/agents` | Gestiona subagentes |
| `/memory` | Edita archivos de memoria |
| `/commands` | Lista todos los comandos disponibles |
| `/compact` | Compacta historial para liberar contexto |

**Ejemplos:**
```
# Ver procesos background
/bashes

Shell ID: abc123 (running)
Command: npm run dev

# Compactar contexto
/compact

✅ Context compacted: 80k → 45k tokens
```

### Comandos de Configuración

| Comando | Función |
|---------|---------|
| `/settings` | Abre archivo de configuración |
| `/output-style` | Cambia estilo de salida |
| `/mcp` | Gestiona servidores MCP |

**Ejemplos:**
```
# Cambiar estilo
/output-style learning

# Ver servidores MCP
/mcp list
```

---

## 📖 Lección 5.3: Crear Comandos Personalizados

### Estructura de Directorios

Comandos personalizados se almacenan en:
```
.claude/commands/          # Comandos a nivel de proyecto
~/.claude/commands/        # Comandos a nivel de usuario
```

### Crear Tu Primer Comando

**Paso 1: Crea el archivo**
```
.claude/commands/review-code.md
```

**Paso 2: Escribe el prompt**
```markdown
Please review this code for:
- Code quality and best practices
- Potential bugs or issues
- Performance improvements
- Security concerns

Provide specific, actionable feedback.
```

**Paso 3: Usa el comando**
```
/review-code
```

Claude ejecutará el prompt del archivo automáticamente.

### Comandos con Argumentos

Los comandos pueden aceptar argumentos:

**Archivo: `.claude/commands/add-tests.md`**
```markdown
Add comprehensive unit tests for the following file or function.

Include:
- Happy path tests
- Edge cases
- Error handling
- Mock external dependencies

Use the project's existing testing framework.
```

**Uso:**
```
/add-tests src/auth.js
```

El argumento `src/auth.js` se pasa como contexto adicional.

### Ejemplos de Comandos Útiles

**1. Optimizar Código**
```markdown
# .claude/commands/optimize.md

Optimize this code for:
- Performance
- Readability
- Memory usage

Explain each optimization you make.
```

**2. Agregar Documentación**
```markdown
# .claude/commands/document.md

Add comprehensive JSDoc/docstring comments to this code.

Include:
- Function/class description
- Parameter descriptions
- Return value description
- Usage examples
```

**3. Refactorizar**
```markdown
# .claude/commands/refactor.md

Refactor this code to improve:
- Modularity
- Testability
- Maintainability

Follow SOLID principles and current best practices.
```

**4. Revisar PR**
```markdown
# .claude/commands/review-pr.md

Review this pull request comprehensively:

1. Read all changed files
2. Check for:
   - Code quality issues
   - Potential bugs
   - Security vulnerabilities
   - Performance problems
   - Missing tests
3. Provide specific, actionable feedback
4. Suggest improvements

Be thorough but constructive.
```

---

## 📖 Lección 5.4: Comandos a Nivel de Proyecto vs Usuario

### Comandos de Proyecto

**Ubicación:** `.claude/commands/` (en el repo)

**Cuándo usar:**
- Comandos específicos del proyecto
- Workflows del equipo
- Estándares del proyecto
- Comandos que otros developers necesitan

**Ventajas:**
- Se commitean al repo
- Todo el equipo los puede usar
- Consistencia entre developers
- Versionados con Git

**Ejemplo:**
```markdown
# .claude/commands/deploy-staging.md

Deploy to staging environment:

1. Run tests
2. Build production bundle
3. Deploy to staging server
4. Run smoke tests
5. Report deployment status
```

### Comandos de Usuario

**Ubicación:** `~/.claude/commands/` (tu home directory)

**Cuándo usar:**
- Preferencias personales
- Workflows privados
- Comandos que usas en múltiples proyectos
- Experimentos personales

**Ejemplo:**
```markdown
# ~/.claude/commands/my-review.md

Review code with my preferred checklist:
- TypeScript strict mode compliance
- No console.logs
- Proper error handling
- Tests included
```

### Prioridad de Comandos

Si existe el mismo comando en ambos lugares:
```
.claude/commands/review.md     ← Prioridad 1 (proyecto)
~/.claude/commands/review.md   ← Prioridad 2 (usuario)
```

El comando del proyecto **siempre gana**.

---

## 📖 Lección 5.5: Mejores Prácticas

### 1. Nombres Descriptivos

```
✅ Buenos nombres:
/review-security
/add-unit-tests
/deploy-production

❌ Nombres vagos:
/check
/do-stuff
/fix
```

### 2. Prompts Claros y Específicos

```markdown
✅ Bueno:
Analyze this React component for:
1. Props validation
2. Proper hooks usage
3. Performance optimizations
4. Accessibility issues

❌ Vago:
Make this component better
```

### 3. Estructura Organizada

```
.claude/commands/
├── code-review/
│   ├── security.md
│   ├── performance.md
│   └── style.md
├── testing/
│   ├── add-unit-tests.md
│   └── add-e2e-tests.md
└── deployment/
    ├── deploy-staging.md
    └── deploy-prod.md
```

### 4. Documentar Comandos

Incluye comentarios en archivos:
```markdown
<!--
Command: /review-security
Purpose: Security-focused code review
Usage: /review-security [file]
-->

Perform a security audit of the code...
```

### 5. Mantener Comandos Actualizados

- Revisa comandos regularmente
- Elimina comandos obsoletos
- Actualiza para nuevas mejores prácticas
- Versiona con el proyecto

### 6. Comandos Reutilizables

```markdown
✅ Reutilizable:
Add tests using the project's testing framework.
Follow existing test patterns in the codebase.

❌ Muy específico:
Add Jest tests with supertest for the user.controller.ts file
```

### 7. Ver Comandos Disponibles

```
# Listar todos los comandos
/commands

# Ver contenido de un comando
cat .claude/commands/review-code.md
```

---

## 📖 Lección 5.6: Casos de Uso Avanzados

### Comandos Encadenados

Puedes ejecutar múltiples comandos:
```
/review-code
[Claude analiza el código]

/add-tests
[Claude agrega tests basándose en la revisión]
```

### Comandos con Contexto

```markdown
# .claude/commands/fix-with-context.md

Before fixing this issue:
1. Read related files
2. Check test files
3. Review recent commits
4. Then fix the issue properly
```

### Comandos para Flujos Complejos

```markdown
# .claude/commands/complete-feature.md

Complete feature implementation:

1. Read the issue/ticket description
2. Plan the implementation
3. Write the code
4. Add tests
5. Update documentation
6. Create a commit
7. Suggest PR description
```

### Comandos de Aprendizaje

```markdown
# .claude/commands/explain-code.md

Explain this code as if teaching to a junior developer:

1. What it does (high-level)
2. How it works (step-by-step)
3. Why it's structured this way
4. Potential improvements
5. Common pitfalls to avoid
```

---

## 🛠️ Ejercicios de Práctica

### Ejercicio 5.1: Explorar Comandos Integrados
1. Ejecuta `/help` y lee todos los comandos disponibles
2. Ejecuta `/context` para ver tu uso de tokens
3. Ejecuta `/model` para ver qué modelo estás usando
4. Ejecuta `/commands` para ver comandos personalizados

### Ejercicio 5.2: Crear Tu Primer Comando
1. Crea un comando `/saludar` que haga que Claude te salude con tu nombre
2. Pruébalo ejecutando `/saludar`
3. Verifica que funciona correctamente

### Ejercicio 5.3: Comando de Revisión
1. Crea un comando `/revisar-capitulo` que:
   - Lea un archivo de capítulo
   - Revise la ortografía
   - Verifique la estructura
   - Sugiera mejoras
2. Pruébalo con `capitulo_01.md`

### Ejercicio 5.4: Comando con Contexto
1. Crea un comando `/analizar-proyecto` que:
   - Liste todos los archivos .md
   - Cuente cuántos capítulos hay
   - Resuma el progreso del curso
2. Ejecútalo y verifica los resultados

---

## 📝 Examen 5: Proyecto de Comando Slash Personalizado

### Parte 1: Preguntas Teóricas (4 puntos)

**Pregunta 1:** ¿Cuál es la diferencia entre comandos en `.claude/commands/` vs `~/.claude/commands/`?

**Pregunta 2:** ¿Qué sucede cuando ejecutas `/review-code` y existe el archivo `.claude/commands/review-code.md`?

**Pregunta 3:** Nombra 3 comandos integrados de Claude Code y explica qué hace cada uno.

**Pregunta 4:** ¿Por qué es mejor usar `/compact` en lugar de `/clear` cuando quieres liberar contexto pero mantener información importante?

### Parte 2: Proyecto Práctico (6 puntos)

Crea 3 comandos slash personalizados:

**Comando 1 (2 puntos): `/mis-tareas`**
Crea un comando que:
- Liste todos los archivos de capítulos
- Muestre cuáles has completado
- Sugiera qué hacer a continuación

**Comando 2 (2 puntos): `/crear-resumen`**
Crea un comando que tome un archivo y:
- Lea el contenido
- Cree un resumen en 5 puntos
- Guarde el resumen en un nuevo archivo `resumen-[nombre].md`

**Comando 3 (2 puntos): `/preparar-examen`**
Crea un comando que:
- Lea un capítulo específico
- Genere 5 preguntas de práctica adicionales
- Las guarde en un archivo de práctica

### Parte 3: Mejores Prácticas (Bonus +2 puntos)

Explica tu estrategia para organizar comandos slash en un proyecto grande con:
- 10+ developers
- Múltiples equipos
- Diferentes roles (frontend, backend, DevOps)

¿Cómo estructurarías los comandos para máxima eficiencia y reusabilidad?

---

## ✅ Cómo Enviar Tu Examen

### Para la Parte 1:
```
Parte 1:
P1: [respuesta]
P2: [respuesta]
P3: [respuesta]
P4: [respuesta]
```

### Para la Parte 2:
1. Crea los 3 comandos
2. Ejecuta cada uno y muéstrame los resultados
3. Yo verificaré que funcionan correctamente

### Para la Parte 3:
```
Bonus: [tu explicación estratégica]
```

---

## 🎯 ¡Capítulo 5 Completo!

Una vez que apruebes este examen, dominarás los comandos slash y estarás listo para el Capítulo 6: Agentes y Sub-agentes.

**Anterior**: `capitulo_04.md`
**Siguiente**: `capitulo_06.md`
