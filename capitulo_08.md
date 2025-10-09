# Capítulo 8: Estilos de Salida

**Duración**: 45 minutos
**Dificultad**: Intermedio

---

## 🎯 Objetivos de Aprendizaje

Al final de este capítulo, podrás:
- Entender qué son los estilos de salida y cómo funcionan
- Conocer los estilos integrados (default, explanatory, learning)
- Cambiar entre estilos usando `/output-style`
- Crear tus propios estilos personalizados
- Diferenciar estilos de otras características (CLAUDE.md, system prompts, agentes)
- Aplicar estilos efectivamente para diferentes contextos

---

## 📖 Lección 8.1: ¿Qué Son los Estilos de Salida?

Los **estilos de salida** modifican el system prompt de Claude Code para adaptar su comportamiento y personalidad.

### Concepto Fundamental

- Cambian cómo Claude se comporta y comunica
- **Reemplazan** completamente el system prompt (no agregan)
- Preservan capacidades core (herramientas, gestión de archivos)
- Se guardan localmente por sesión

### ¿Qué NO Son?

**Estilos de Salida ≠ CLAUDE.md**
- CLAUDE.md: Instrucciones específicas del proyecto
- Estilos: Cambio de personalidad/comportamiento de Claude

**Estilos de Salida ≠ System Prompts Personalizados**
- `--append-system-prompt`: Agrega al prompt
- Estilos: Reemplazan el prompt

**Estilos de Salida ≠ Agentes**
- Agentes: Contextos separados para tareas específicas
- Estilos: Mismo contexto, diferente comportamiento

**Estilos de Salida ≠ Comandos Slash**
- Slash commands: Prompts predefinidos para tareas
- Estilos: Cambio persistente de comportamiento

### Casos de Uso

- 🎓 **Modo aprendizaje**: Claude como tutor interactivo
- 📖 **Modo explicativo**: Respuestas educativas detalladas
- ⚙️ **Modo ingeniero**: Enfoque técnico directo
- 🎨 **Modo creativo**: Respuestas más expresivas
- 🔍 **Modo revisor**: Enfoque en revisión crítica

---

## 📖 Lección 8.2: Estilos Integrados

Claude Code incluye 3 estilos predefinidos:

### 1. Default

**Descripción:** Asistente estándar de ingeniería de software.

**Comportamiento:**
- Profesional y técnico
- Respuestas concisas y directas
- Enfocado en soluciones
- Asume conocimiento técnico

**Cuándo usar:**
- Desarrollo diario
- Tareas técnicas estándar
- Cuando quieres eficiencia

**Ejemplo de interacción:**
```
Tú: ¿Cómo leo un archivo?

Default: Use the Read tool with the file path:
read('/path/to/file')

The tool supports offset and limit parameters for large files.
```

### 2. Explanatory

**Descripción:** Proporciona insights educativos sobre el código.

**Comportamiento:**
- Explica el "por qué" además del "qué"
- Más contexto en respuestas
- Considera implicaciones
- Menciona alternativas

**Cuándo usar:**
- Aprendiendo nuevas tecnologías
- Entendiendo código complejo
- Explorando arquitecturas
- Revisión de código educativa

**Ejemplo de interacción:**
```
Tú: ¿Cómo leo un archivo?

Explanatory: To read files in Claude Code, use the Read tool. This tool is optimized for reading file contents with several advantages over bash commands like 'cat':

1. It provides line numbers automatically
2. Supports reading specific sections (offset/limit)
3. Can read images, PDFs, and Jupyter notebooks
4. Better formatted output for code analysis

The Read tool is preferred because it's more efficient and provides richer information for AI analysis.
```

### 3. Learning

**Descripción:** Modo colaborativo e interactivo para aprender.

**Comportamiento:**
- Hace preguntas para entender tu nivel
- Proporciona explicaciones paso a paso
- Sugiere experimentación
- Fomenta el aprendizaje activo

**Cuándo usar:**
- Aprendiendo a programar
- Nuevos frameworks/tecnologías
- Entendiendo conceptos complejos
- Tutorización interactiva

**Ejemplo de interacción:**
```
Tú: ¿Cómo leo un archivo?

Learning: Great question! Let's explore file reading together.

In Claude Code, there are several ways to read files, but the most common is the Read tool. Before we dive in:

1. Are you familiar with file paths (absolute vs relative)?
2. What type of file are you trying to read?

Let me show you a simple example:
read('example.txt')

This reads the entire file. The tool will show line numbers, which is helpful for referencing specific parts.

Would you like to try reading a file in your project? I can guide you through it step by step!
```

---

## 📖 Lección 8.3: Cambiar Estilos

### Usar el Menú Interactivo

```
/output-style
```

Muestra un menú con todos los estilos disponibles:
```
Available Output Styles:
1. default (current)
2. explanatory
3. learning
4. my-custom-style

Select a style by number or name
```

### Cambiar Directamente

```
/output-style explanatory
```

Claude cambia inmediatamente al estilo explanatory.

```
/output-style learning
```

Claude cambia al estilo learning.

### Volver al Default

```
/output-style default
```

### Ver Estilo Actual

El estilo actual se muestra en:
```
/output-style

Current style: explanatory
```

### Persistencia

Los estilos se guardan en `.claude/settings.local.json`:
```json
{
  "outputStyle": "explanatory"
}
```

El estilo persiste entre sesiones del mismo proyecto.

---

## 📖 Lección 8.4: Crear Estilos Personalizados

### Crear Nuevo Estilo

```
/output-style:new
```

Claude te guiará:
```
Let's create a new output style!

Name: my-coding-tutor
Description: Patient coding tutor for beginners

I'll help you create the style configuration...
```

### Ubicación de Estilos

Los estilos personalizados se guardan en:
```
~/.claude/output-styles/my-coding-tutor.md
```

### Estructura de un Estilo

Un estilo es un archivo Markdown que define el system prompt:

```markdown
<!-- my-coding-tutor.md -->

# Coding Tutor Output Style

You are a patient, encouraging coding tutor helping beginners learn to program.

## Behavior Guidelines

- Always explain concepts in simple terms
- Use analogies to make complex ideas relatable
- Encourage experimentation and learning from mistakes
- Break down problems into small, manageable steps
- Celebrate small wins and progress
- Ask questions to gauge understanding

## Communication Style

- Friendly and approachable tone
- Use emojis occasionally to keep it light 😊
- Provide examples for every concept
- Offer to explain further if something is unclear

## Code Examples

When showing code:
- Start with the simplest version
- Explain each line
- Show what the output would be
- Suggest modifications to try

Remember: There are no stupid questions. Every expert was once a beginner!
```

### Ejemplos de Estilos Personalizados

**Estilo: Senior Code Reviewer**
```markdown
# Senior Code Reviewer

You are a senior engineer performing code reviews with high standards.

## Review Criteria
- Code quality and maintainability
- Performance implications
- Security vulnerabilities
- Test coverage
- Documentation

## Tone
- Direct and constructive
- Point out both issues AND good patterns
- Suggest specific improvements with examples
- Explain the reasoning behind each suggestion

Be thorough but respectful. The goal is to improve code quality while helping the developer grow.
```

**Estilo: DevOps Engineer**
```markdown
# DevOps Engineer

You are a DevOps engineer focused on deployment, infrastructure, and automation.

## Priorities
- Scalability and reliability
- CI/CD pipelines
- Infrastructure as Code
- Monitoring and observability
- Cost optimization

## Approach
- Consider production implications
- Think about failure scenarios
- Automate repetitive tasks
- Document deployment procedures

Every decision should consider: "How will this work at scale?"
```

**Estilo: Accessibility Specialist**
```markdown
# Accessibility Specialist

You are an accessibility expert ensuring inclusive design.

## Focus Areas
- WCAG compliance
- Screen reader compatibility
- Keyboard navigation
- Color contrast
- ARIA labels

## Methodology
- Test with assistive technologies in mind
- Consider diverse user needs
- Provide specific ARIA attributes
- Explain accessibility impact

Accessibility is not optional—it's essential for reaching all users.
```

---

## 📖 Lección 8.5: Mejores Prácticas

### 1. Estilos para Contextos Específicos

```
Desarrollo general → default
Aprendiendo → learning/explanatory
Revisando código → custom "code-reviewer"
Deployment → custom "devops-engineer"
```

### 2. Nombres Descriptivos

```
✅ Buenos nombres:
- python-tutor
- security-focused
- frontend-specialist
- api-designer

❌ Nombres vagos:
- style1
- test
- my-style
```

### 3. System Prompts Claros

```markdown
✅ Claro y específico:
You are a React specialist helping with component design.
Focus on:
- Component composition
- Hooks best practices
- Performance optimization
- Testing strategies

❌ Vago:
You are a developer who helps with React.
```

### 4. Consistencia de Tono

Mantén un tono consistente en todo el estilo:
```
✅ Consistente:
"Let's explore...", "We can improve...", "Consider..."

❌ Inconsistente:
"You must do...", "Let's try...", "Just add..."
```

### 5. Documentar Estilos

Incluye comentarios en tus estilos:
```markdown
<!--
Style: Python Beginner Tutor
Purpose: Teaching Python to absolute beginners
Tone: Patient, encouraging, simple explanations
Use when: Working with programming newcomers
-->

# Python Beginner Tutor
...
```

### 6. Probar Estilos

Después de crear un estilo:
```
1. Actívalo: /output-style mi-estilo
2. Haz varias preguntas diferentes
3. Verifica que el comportamiento es consistente
4. Ajusta el system prompt si es necesario
5. Itera hasta lograr el comportamiento deseado
```

### 7. Versionar Estilos

Si compartes estilos en un equipo:
```bash
# Copyar estilo al proyecto
cp ~/.claude/output-styles/team-style.md .claude/output-styles/

# Commitear
git add .claude/output-styles/team-style.md
git commit -m "Add team output style"
```

---

## 📖 Lección 8.6: Casos de Uso Avanzados

### Estilos para Diferentes Roles

**Para Team Lead:**
```markdown
# Team Lead Style

Focus on:
- Architecture decisions
- Team coordination
- Code review from high-level perspective
- Technical debt management
- Sprint planning considerations
```

**Para Junior Developer:**
```markdown
# Junior Developer Mentor

Approach:
- Explain fundamentals thoroughly
- Show best practices step-by-step
- Provide resources for learning
- Encourage questions
- Build confidence
```

### Estilos para Diferentes Lenguajes

**Python Specialist:**
```markdown
# Python Expert

Emphasize:
- Pythonic idioms
- PEP 8 compliance
- Type hints
- Standard library usage
- Performance with Python-specific tools
```

**Rust Expert:**
```markdown
# Rust Expert

Focus on:
- Memory safety
- Ownership and borrowing
- Lifetime annotations
- Zero-cost abstractions
- Idiomatic Rust patterns
```

### Estilos para Diferentes Fases

**Development Phase:**
```markdown
# Development Mode
- Fast iteration
- Quick prototypes
- Explore possibilities
- Don't over-engineer
```

**Production Preparation:**
```markdown
# Production Ready
- Error handling
- Logging and monitoring
- Performance optimization
- Security hardening
- Documentation
```

---

## 🛠️ Ejercicios de Práctica

### Ejercicio 8.1: Explorar Estilos Integrados
1. Usa `/output-style` para ver estilos disponibles
2. Cambia a "explanatory"
3. Pregunta: "¿Qué es un closure en JavaScript?"
4. Cambia a "learning"
5. Pregunta lo mismo y compara las respuestas
6. Vuelve a "default"

### Ejercicio 8.2: Crear Tu Primer Estilo
1. Crea un estilo llamado "spanish-tutor"
2. Su propósito: Explicar programación en español con paciencia
3. Tono: Amigable, usa analogías, ejemplos claros
4. Actívalo y pruébalo con preguntas de programación

### Ejercicio 8.3: Estilo Especializado
1. Crea un estilo para tu tecnología favorita (React, Python, etc.)
2. Define comportamiento específico para esa tecnología
3. Incluye mejores prácticas y patrones comunes
4. Pruébalo con preguntas técnicas

### Ejercicio 8.4: Comparar Comportamientos
1. Con estilo "default", pide: "Revisa este código"
2. Cambia a "explanatory" y pide lo mismo
3. Nota las diferencias en la respuesta
4. ¿Cuál prefieres para cada situación?

---

## 📝 Examen 8: Desafío de Configuración de Estilos

### Parte 1: Preguntas Teóricas (4 puntos)

**Pregunta 1:** ¿Cuál es la diferencia entre un estilo de salida y un comando slash?

**Pregunta 2:** ¿Los estilos de salida agregan al system prompt o lo reemplazan? ¿Por qué es importante?

**Pregunta 3:** Nombra los 3 estilos integrados y explica cuándo usarías cada uno.

**Pregunta 4:** ¿Dónde se guardan los estilos personalizados y dónde se guarda la configuración del estilo activo?

### Parte 2: Creación de Estilos (6 puntos)

Crea 2 estilos personalizados completos:

**Estilo 1 (3 puntos): Technical Writer**
- Propósito: Generar documentación técnica clara
- Comportamiento: Formal, estructurado, ejemplos completos
- Debe incluir:
  - Guías de comportamiento
  - Estilo de comunicación
  - Formato de documentación
- Crea el archivo .md completo

**Estilo 2 (3 puntos): Debugging Assistant**
- Propósito: Ayudar a debuggear código sistemáticamente
- Comportamiento: Metódico, hace preguntas, divide problemas
- Debe incluir:
  - Metodología de debugging
  - Preguntas para hacer
  - Approach paso a paso
- Crea el archivo .md completo

### Parte 3: Uso Práctico (Bonus +2 puntos)

Demuestra el uso de tus estilos:

1. Activa el estilo "Technical Writer"
2. Pídele que documente una función que hayas escrito
3. Cambia al estilo "Debugging Assistant"
4. Presenta un bug y observa su approach
5. Compara cómo cada estilo maneja las mismas tareas

Explica: ¿Cuándo usarías cada uno en tu flujo de trabajo real?

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
1. Crea los 2 archivos .md con los estilos
2. Muéstrame el contenido completo de cada uno
3. Explica tus decisiones de diseño

### Para la Parte 3:
1. Demuestra el uso de ambos estilos
2. Muéstrame las interacciones
3. Proporciona tu análisis comparativo

---

## 🎯 ¡Capítulo 8 Completo!

Una vez que apruebes este examen, dominarás los estilos de salida y estarás listo para el Capítulo 9: Protocolo de Configuración de Modelos (MCP).

**Anterior**: `capitulo_07.md`
**Siguiente**: `capitulo_09.md`
