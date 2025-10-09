# Capítulo 6: Agentes y Sub-agentes

**Duración**: 60 minutos
**Dificultad**: Avanzado

---

## 🎯 Objetivos de Aprendizaje

Al final de este capítulo, podrás:
- Entender qué son los agentes y cómo funcionan
- Identificar cuándo usar agentes vs conversación principal
- Usar la herramienta Task para lanzar agentes
- Crear agentes especializados personalizados
- Configurar permisos y herramientas para agentes
- Aplicar mejores prácticas de diseño de agentes

---

## 📖 Lección 6.1: ¿Qué Son los Agentes?

Los **agentes** (o sub-agentes) son instancias especializadas de Claude que operan en contextos separados.

### Concepto Fundamental

Piensa en agentes como **colegas especializados**:
- **Conversación Principal**: Tú trabajando con un generalista
- **Agente**: Llamar a un especialista para una tarea específica

### Características Clave

**1. Contexto Separado**
- Cada agente tiene su propia ventana de contexto
- No ve el historial de la conversación principal
- Recibe solo la información que necesita

**2. Especialización**
- Configurados para tareas específicas
- System prompts personalizados
- Herramientas limitadas según necesidad

**3. Autonomía**
- Trabajan independientemente
- Pueden ejecutar múltiples pasos
- Devuelven un resultado final

### Ventajas de Usar Agentes

✅ **Preservan Contexto Principal**
- No llenan tu conversación con detalles de subtareas
- Mantienes el foco en la tarea principal

✅ **Especialización**
- Agentes diseñados para tareas específicas
- Mejores resultados que un generalista

✅ **Reutilizabilidad**
- Define una vez, usa muchas veces
- Consistencia en resultados

✅ **Eficiencia**
- Contexto enfocado = mejor rendimiento
- Menos tokens desperdiciados

### Ejemplo Simple

```
Tú: Necesito revisar este código y buscar información sobre React 19

Claude (conversación principal):
- Delega "revisar código" a agente code-reviewer
- Delega "buscar info React 19" a agente general-purpose

Agente code-reviewer:
- Lee el código
- Analiza calidad
- Devuelve reporte de revisión

Agente general-purpose:
- Busca documentación
- Resume features de React 19
- Devuelve resumen

Claude (conversación principal):
- Combina ambos resultados
- Te presenta información integrada
```

---

## 📖 Lección 6.2: Tipos de Agentes

### 1. General-Purpose Agent

**Descripción:** Agente para tareas complejas de investigación y búsqueda.

**Cuándo usar:**
- Búsquedas de código complejas
- Investigación que requiere múltiples intentos
- Análisis de múltiples archivos
- Cuando no estás seguro de encontrar algo en el primer intento

**Herramientas disponibles:** Todas (*)

**Ejemplo:**
```
Tú: Encuentra dónde se implementa la autenticación JWT

Claude: [lanza general-purpose agent]
Agent: [busca en múltiples archivos]
Agent: [revisa imports y dependencias]
Agent: [encuentra implementación]
Agent: [devuelve ubicación y resumen]
```

### 2. Statusline-Setup Agent

**Descripción:** Configura la barra de estado de Claude Code.

**Herramientas disponibles:** Read, Edit

**Uso automático:** Claude lo usa cuando necesita configurar statusline.

### 3. Output-Style-Setup Agent

**Descripción:** Crea estilos de salida personalizados.

**Herramientas disponibles:** Read, Write, Edit, Glob, Grep

**Uso automático:** Claude lo usa al crear output styles.

### 4. Agentes Personalizados

**Descripción:** Agentes que tú creas para necesidades específicas.

**Ejemplos comunes:**
- `code-reviewer`: Revisión de código
- `debugger`: Análisis de bugs
- `test-writer`: Escritura de tests
- `documentation`: Generar documentación
- `security-audit`: Auditoría de seguridad

---

## 📖 Lección 6.3: La Herramienta Task

La herramienta **Task** lanza agentes para ejecutar tareas autónomas.

### Sintaxis

```javascript
Task {
  subagent_type: "general-purpose",
  description: "Find authentication code",
  prompt: "Search for JWT authentication implementation..."
}
```

### Parámetros

**subagent_type** (required)
- Tipo de agente a usar
- Opciones: "general-purpose", "statusline-setup", "output-style-setup", o agente personalizado

**description** (required)
- Descripción corta de 3-5 palabras
- Ejemplo: "Search for config files"

**prompt** (required)
- Instrucciones detalladas para el agente
- Debe ser autónomo y completo
- Especifica qué devolver

### Ejemplo Completo

```
Tú: Encuentra todos los archivos que usan la función getUserData

Claude: [usa Task tool]
{
  subagent_type: "general-purpose",
  description: "Find getUserData usage",
  prompt: "Search the codebase for all files that import or use the getUserData function. For each file found:
  1. Show the file path
  2. Show how it's being used
  3. Note any important patterns

  Return a comprehensive list with usage examples."
}

[Agente trabaja...]
[Agente devuelve resultados]

Claude: Encontré getUserData usado en 8 archivos:
1. src/auth/login.js - Llamado después de login
2. src/profile/page.js - Carga datos de perfil
...
```

### Cuándo Usar Task

**Usar Task cuando:**
- ✅ La búsqueda puede requerir múltiples intentos
- ✅ Necesitas investigación profunda
- ✅ La tarea puede ejecutarse autónomamente
- ✅ No necesitas interacción durante la tarea

**NO usar Task cuando:**
- ❌ Sabes el path exacto del archivo → usa Read
- ❌ Buscas una clase específica → usa Glob
- ❌ Buscas en 2-3 archivos conocidos → usa Read
- ❌ La tarea requiere decisiones interactivas

---

## 📖 Lección 6.4: Crear Agentes Personalizados

### Estructura de Directorios

```
.claude/agents/              # Agentes de proyecto
~/.claude/agents/            # Agentes de usuario
```

### Método 1: Comando Interactivo

```
Tú: Crea un agente para revisar código

Claude: [usa comando /agents]
[interfaz interactiva]

Nombre: code-reviewer
Descripción: Reviews code for quality and best practices
Herramientas: Read, Grep, Glob
Modelo: inherit
System prompt: [Claude genera uno]

✅ Agente creado en .claude/agents/code-reviewer.json
```

### Método 2: Crear Archivo Manualmente

**Archivo: `.claude/agents/code-reviewer.json`**
```json
{
  "name": "code-reviewer",
  "description": "Expert code reviewer focused on quality and best practices",
  "systemPrompt": "You are an expert code reviewer. When reviewing code:\n\n1. Check for bugs and potential issues\n2. Evaluate code quality and readability\n3. Suggest improvements\n4. Identify security concerns\n5. Check performance implications\n\nProvide specific, actionable feedback with examples.",
  "tools": ["Read", "Grep", "Glob"],
  "model": "inherit"
}
```

### Campos de Configuración

**name** (requerido)
- Identificador único del agente
- Kebab-case recomendado: "code-reviewer"

**description** (requerido)
- Breve descripción de qué hace el agente
- Claude usa esto para decidir cuándo usar el agente

**systemPrompt** (opcional)
- Instrucciones para el agente
- Define comportamiento y expertise
- Sé específico sobre qué hacer y cómo

**tools** (opcional)
- Array de herramientas permitidas
- Si se omite, agente tiene acceso a todas
- Restringe para seguridad y enfoque

**model** (opcional)
- "inherit": Usa el modelo de la sesión principal (default)
- "claude-sonnet-4": Especifica modelo específico

### Ejemplos de Agentes

**Test Writer**
```json
{
  "name": "test-writer",
  "description": "Writes comprehensive unit and integration tests",
  "systemPrompt": "You are a testing expert. Write thorough tests that cover:\n- Happy paths\n- Edge cases\n- Error handling\n- Mock external dependencies\n\nFollow the project's testing conventions.",
  "tools": ["Read", "Grep", "Write", "Edit"],
  "model": "inherit"
}
```

**Security Auditor**
```json
{
  "name": "security-auditor",
  "description": "Performs security analysis and vulnerability assessment",
  "systemPrompt": "You are a security expert. Audit code for:\n- SQL injection risks\n- XSS vulnerabilities\n- Authentication issues\n- Data exposure\n- Insecure dependencies\n\nProvide severity ratings and remediation steps.",
  "tools": ["Read", "Grep", "Glob", "WebSearch"],
  "model": "inherit"
}
```

**Documentation Generator**
```json
{
  "name": "doc-generator",
  "description": "Generates comprehensive documentation",
  "systemPrompt": "You are a technical writer. Create clear documentation including:\n- API reference\n- Usage examples\n- Common patterns\n- Troubleshooting tips\n\nWrite for developers of all skill levels.",
  "tools": ["Read", "Grep", "Glob", "Write"],
  "model": "inherit"
}
```

---

## 📖 Lección 6.5: Usar Agentes Personalizados

### Delegación Automática

Claude decide automáticamente cuándo usar agentes:

```
Tú: Revisa este código para problemas de seguridad

Claude: [ve que hay agente "security-auditor"]
Claude: [lanza agente automáticamente]

Security Auditor Agent:
[analiza código]
[identifica vulnerabilidades]
[devuelve reporte]

Claude: El análisis de seguridad encontró:
1. Posible SQL injection en línea 45
2. Falta validación de input en línea 67
...
```

### Invocación Explícita

Puedes invocar agentes específicamente:

```
Tú: Usa el agente code-reviewer para revisar auth.js

Claude: [lanza code-reviewer agent específicamente]
```

### Encadenamiento de Agentes

Los agentes pueden llamar a otros agentes:

```
Workflow Agent → Code Reviewer Agent → Test Writer Agent
```

**Ejemplo:**
```
Tú: Implementa feature de login completa

Claude (main):
- Planifica implementación
- Lanza code-writer agent

Code Writer Agent:
- Escribe código
- Devuelve implementación

Claude (main):
- Lanza code-reviewer agent

Code Reviewer Agent:
- Revisa código
- Sugiere mejoras
- Devuelve feedback

Claude (main):
- Aplica mejoras
- Lanza test-writer agent

Test Writer Agent:
- Escribe tests
- Devuelve tests

Claude (main):
- Integra todo
- Reporta resultado final
```

---

## 📖 Lección 6.6: Mejores Prácticas de Agentes

### 1. Responsabilidad Única

Cada agente debe tener UN propósito claro:

```
✅ Bueno:
- code-reviewer: Solo revisa código
- test-writer: Solo escribe tests
- security-auditor: Solo audita seguridad

❌ Malo:
- do-everything: Revisa, escribe tests, documenta, etc.
```

### 2. System Prompts Detallados

```
✅ Bueno:
"You are a code reviewer specializing in React. Check:
1. Proper hooks usage (no rules of hooks violations)
2. Component performance (useMemo, useCallback usage)
3. Props validation with TypeScript
4. Accessibility (ARIA labels, keyboard navigation)
5. Error boundaries

Provide specific line numbers and code examples."

❌ Vago:
"Review React code and make it better."
```

### 3. Limitar Herramientas

Da solo las herramientas necesarias:

```
✅ Code Reviewer: Read, Grep, Glob
✅ Test Writer: Read, Write, Edit, Bash (para run tests)
✅ Documentation: Read, Write, Glob

❌ Doc Generator con Bash, WebSearch, etc. (innecesario)
```

### 4. Nombres Descriptivos

```
✅ Buenos nombres:
- react-code-reviewer
- api-test-writer
- security-vulnerability-scanner

❌ Nombres vagos:
- agent1
- helper
- tool
```

### 5. Descripción Clara

La descripción ayuda a Claude decidir cuándo usar el agente:

```
✅ Buena descripción:
"Performs comprehensive security audit focusing on OWASP Top 10 vulnerabilities"

❌ Descripción vaga:
"Checks code"
```

### 6. Versionado con Git

Commitea tus agentes al repositorio:

```bash
git add .claude/agents/
git commit -m "Add code review and test writing agents"
```

### 7. Documentar Agentes

Crea un README para tus agentes:

```markdown
# .claude/agents/README.md

## Available Agents

### code-reviewer
Reviews code for quality, bugs, and best practices.
Usage: Automatically invoked when asking for code review.

### test-writer
Writes unit and integration tests.
Usage: "Write tests for [file]"

### security-auditor
Performs security analysis.
Usage: "Audit [file] for security issues"
```

### 8. Probar Agentes

```
# Probar agente específico
Tú: Usa code-reviewer para revisar src/auth.js

# Verificar que funciona correctamente
# Ajustar system prompt si es necesario
# Iterar hasta lograr el comportamiento deseado
```

---

## 🛠️ Ejercicios de Práctica

### Ejercicio 6.1: Explorar Agentes Existentes
1. Ejecuta `/agents` para ver agentes disponibles
2. Inspecciona los agentes integrados
3. Lee la configuración de general-purpose agent

### Ejercicio 6.2: Usar General-Purpose Agent
1. Pide a Claude que busque todos los archivos que contienen "TODO"
2. Observa cómo delega a un agente
3. Analiza los resultados devueltos

### Ejercicio 6.3: Crear Tu Primer Agente
1. Crea un agente llamado "doc-checker"
2. Su propósito: Verificar que archivos tienen documentación adecuada
3. System prompt: Revisar comentarios, JSDoc, README, etc.
4. Herramientas: Read, Grep, Glob
5. Pruébalo con un archivo del proyecto

### Ejercicio 6.4: Agente Especializado
1. Crea un agente "spanish-reviewer"
2. Propósito: Revisar archivos en español para ortografía y gramática
3. Pruébalo con los archivos de capítulos
4. Pídele que revise este capítulo

---

## 📝 Examen 6: Ejercicio de Diseño de Agentes

### Parte 1: Preguntas Teóricas (5 puntos)

**Pregunta 1:** ¿Cuál es la principal ventaja de usar agentes en lugar de la conversación principal?

**Pregunta 2:** ¿Qué herramienta se usa para lanzar agentes y cuáles son sus 3 parámetros requeridos?

**Pregunta 3:** Verdadero o Falso: Un agente puede acceder al historial completo de la conversación principal.

**Pregunta 4:** ¿Cuándo deberías usar el general-purpose agent en lugar de usar herramientas como Read o Grep directamente?

**Pregunta 5:** ¿Por qué es mejor limitar las herramientas disponibles para un agente?

### Parte 2: Diseño de Agentes (5 puntos)

Diseña 3 agentes para los siguientes escenarios:

**Agente 1 (2 puntos): Performance Auditor**
- Propósito: Analizar código para problemas de rendimiento
- Debe revisar: loops ineficientes, memory leaks, cálculos repetidos
- ¿Qué herramientas necesita?
- Escribe un system prompt efectivo

**Agente 2 (2 puntos): Accessibility Checker**
- Propósito: Verificar accesibilidad en componentes web
- Debe revisar: ARIA labels, keyboard navigation, semantic HTML
- ¿Qué herramientas necesita?
- Escribe un system prompt efectivo

**Agente 3 (1 punto): Dependency Updater**
- Propósito: Sugerir actualizaciones de dependencias
- Debe revisar: package.json, vulnerabilidades conocidas
- ¿Qué herramientas necesita?

### Parte 3: Implementación Práctica (Bonus +3 puntos)

Implementa uno de los agentes que diseñaste:

1. Crea el archivo JSON de configuración
2. Escribe el system prompt completo
3. Configura las herramientas apropiadas
4. Pruébalo con un archivo real
5. Muéstrame los resultados
6. Explica qué ajustes harías para mejorarlo

---

## ✅ Cómo Enviar Tu Examen

### Para la Parte 1:
```
Parte 1:
P1: [respuesta]
P2: [respuesta]
P3: [respuesta]
P4: [respuesta]
P5: [respuesta]
```

### Para la Parte 2:
```
Parte 2:

Agente 1 - Performance Auditor:
Herramientas: [lista]
System Prompt: [tu prompt]

Agente 2 - Accessibility Checker:
Herramientas: [lista]
System Prompt: [tu prompt]

Agente 3 - Dependency Updater:
Herramientas: [lista]
```

### Para la Parte 3:
Crea el agente y muéstrame los resultados de probarlo.

---

## 🎯 ¡Capítulo 6 Completo!

Una vez que apruebes este examen, dominarás los agentes y sub-agentes, y estarás listo para el Capítulo 7: Hooks.

**Anterior**: `capitulo_05.md`
**Siguiente**: `capitulo_07.md`
