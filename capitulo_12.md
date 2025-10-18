# Capítulo 12: Extensibilidad Avanzada - Skills y Plugins

**Duración**: 75 minutos
**Dificultad**: Avanzado

---

## 🎯 Objetivos de Aprendizaje

Al final de este capítulo, podrás:
- Entender qué son los Skills y cómo funcionan
- Crear Skills personalizados para tu flujo de trabajo
- Instalar y gestionar Plugins desde marketplaces
- Crear tu propio Plugin empaquetado
- Configurar y usar el Code Execution Tool (Beta)
- Trabajar con Checkpoints para versionado automático
- Diferenciar entre Skills, Plugins, Agentes y Comandos Slash

---

## 📖 Lección 12.1: Introducción a Skills

Los **Skills** son capacidades modulares que extienden la funcionalidad de Claude Code mediante carpetas organizadas con instrucciones, scripts y recursos.

### Concepto Fundamental

Piensa en Skills como **módulos de conocimiento especializado**:
- **Comandos Slash**: Ejecutan una tarea puntual
- **Agentes**: Trabajan autónomamente en contexto separado
- **Skills**: Conocimiento que Claude invoca cuando es relevante

### Características Clave

**1. Model-Invoked (Invocación por Modelo)**
- Claude decide automáticamente cuándo usar un Skill
- Basado en tu petición y la descripción del Skill
- No necesitas invocarlos manualmente

**2. Estructura Simple**
- Un directorio con un archivo `SKILL.md`
- Archivos opcionales de soporte (scripts, templates)
- YAML frontmatter con metadata

**3. Contexto Compartido**
- Skills operan en el mismo contexto que la conversación principal
- A diferencia de agentes, no tienen contexto separado
- Claude accede al contenido del Skill cuando es relevante

### Diferencias con Otras Features

| Feature | Invocación | Contexto | Persistencia |
|---------|-----------|----------|--------------|
| **Comandos Slash** | Manual (`/command`) | Principal | Una vez |
| **Agentes** | Manual o auto | Separado | Durante tarea |
| **Skills** | Automática | Principal | Siempre disponible |
| **Hooks** | Automática (eventos) | N/A | Por evento |

### Ejemplo Conceptual

```
Tú: "Necesito crear una API REST para usuarios"

Claude:
- Ve que tienes un Skill "api-design-patterns"
- Lee automáticamente las instrucciones del Skill
- Aplica los patrones y mejores prácticas del Skill
- Genera código siguiendo los guidelines del Skill
```

---

## 📖 Lección 12.2: Crear Skills Personalizados

### Estructura de un Skill

```
~/.claude/skills/mi-skill/
├── SKILL.md              # Archivo principal (requerido)
├── templates/            # Opcional: plantillas
├── scripts/              # Opcional: scripts de soporte
└── examples/             # Opcional: ejemplos
```

### Archivo SKILL.md

**Estructura básica:**
```markdown
---
name: api-design-patterns
description: Expert guidance for designing RESTful APIs following industry best practices
---

# API Design Patterns Skill

You are an expert in RESTful API design. When the user asks to create or review APIs, apply these patterns:

## REST Principles

1. **Resource-Based URLs**
   - Use nouns, not verbs: `/users` not `/getUsers`
   - Plural for collections: `/users`, `/posts`
   - Nested resources: `/users/123/posts`

2. **HTTP Methods Correctly**
   - GET: Retrieve resources (idempotent)
   - POST: Create new resources
   - PUT: Update entire resource
   - PATCH: Partial update
   - DELETE: Remove resource

3. **Status Codes**
   - 200 OK: Successful GET/PUT/PATCH
   - 201 Created: Successful POST
   - 204 No Content: Successful DELETE
   - 400 Bad Request: Client error
   - 401 Unauthorized: Authentication required
   - 403 Forbidden: Authenticated but no permission
   - 404 Not Found: Resource doesn't exist
   - 500 Internal Server Error: Server error

## API Response Format

Always use this JSON structure:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "metadata": {
    "timestamp": "ISO-8601",
    "version": "1.0"
  }
}
```

## Security Best Practices

- Always validate and sanitize input
- Use authentication (JWT recommended)
- Implement rate limiting
- Use HTTPS only
- Version your API: `/v1/users`

When designing APIs, always consider:
- Pagination for large datasets
- Filtering and sorting capabilities
- Clear error messages
- Comprehensive documentation
```

### Campos del YAML Frontmatter

**name** (requerido)
- Identificador único del Skill
- Kebab-case: `api-design-patterns`

**description** (requerido)
- Descripción clara de qué hace el Skill
- Claude usa esto para decidir cuándo invocar el Skill
- Sé específico: ayuda a Claude a elegir el Skill correcto

### Instalación de Skills

**Opción 1: Manual**
```bash
mkdir -p ~/.claude/skills/mi-skill
nano ~/.claude/skills/mi-skill/SKILL.md
```

**Opción 2: Desde un Plugin (ver Lección 12.3)**

**Opción 3: Clonar desde repositorio**
```bash
cd ~/.claude/skills
git clone https://github.com/user/awesome-skill.git
```

### Verificar Skills Instalados

```bash
# Listar skills disponibles
ls ~/.claude/skills/

# Ver contenido de un skill
cat ~/.claude/skills/api-design-patterns/SKILL.md
```

### Ejemplos de Skills Útiles

**1. Testing Patterns Skill**
```markdown
---
name: testing-patterns
description: Comprehensive testing strategies for unit, integration, and e2e tests
---

# Testing Patterns Skill

When writing tests, follow these patterns:

## Test Structure (AAA Pattern)
- **Arrange**: Set up test data and conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the results

## Naming Convention
```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // test
    });

    it('should throw error when email is invalid', async () => {
      // test
    });
  });
});
```

## Coverage Goals
- Unit tests: 80%+ coverage
- Integration tests: Critical paths
- E2E tests: Key user journeys
```

**2. Git Commit Messages Skill**
```markdown
---
name: conventional-commits
description: Generate commit messages following Conventional Commits specification
---

# Conventional Commits Skill

Format: `<type>(<scope>): <description>`

## Types
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- style: Formatting, missing semicolons, etc.
- refactor: Code change that neither fixes a bug nor adds a feature
- perf: Performance improvement
- test: Adding tests
- chore: Changes to build process or tools

## Examples
- `feat(auth): add JWT token refresh mechanism`
- `fix(api): resolve race condition in user creation`
- `docs(readme): update installation instructions`
```

**3. Security Review Skill**
```markdown
---
name: security-review
description: Security audit checklist for code review focusing on common vulnerabilities
---

# Security Review Skill

When reviewing code for security, check:

## OWASP Top 10

1. **Injection**
   - SQL injection: Use parameterized queries
   - Command injection: Sanitize shell inputs
   - NoSQL injection: Validate MongoDB queries

2. **Broken Authentication**
   - Password hashing: bcrypt with salt
   - Session management: Secure, HTTPOnly cookies
   - Multi-factor authentication for sensitive operations

3. **Sensitive Data Exposure**
   - Encrypt data at rest and in transit
   - No secrets in code or logs
   - Use environment variables for credentials
```

---

## 📖 Lección 12.3: Sistema de Plugins

Los **Plugins** son paquetes que agrupan múltiples extensiones de Claude Code: comandos slash, agentes, MCP servers, Skills y hooks.

### ¿Qué es un Plugin?

Un Plugin puede contener:
- 📝 Comandos Slash personalizados
- 🤖 Agentes especializados
- 🔌 Servidores MCP
- 🎓 Skills
- 🪝 Hooks preconfigurados

### Ventajas de los Plugins

✅ **Instalación con un solo comando**
- Todo se configura automáticamente
- No necesitas configurar cada componente

✅ **Compartir fácilmente**
- Distribución en equipo
- Publicación en marketplaces
- Versionado y actualizaciones

✅ **Consistencia**
- Todos en el equipo usan las mismas herramientas
- Configuración estandarizada

### Plugin Marketplaces

Los **marketplaces** son catálogos de plugins que facilitan descubrir, instalar y gestionar extensiones.

**Marketplace Oficial de Anthropic:**
```
anthropics/skills
```

**Marketplaces de la Comunidad:**
- `obra/superpowers` - Core skills library
- `jeremylongshore/claude-code-plugins-plus` - 227+ plugins
- Tu empresa puede tener su propio marketplace privado

### Gestionar Plugins

**Agregar un Marketplace:**
```bash
/plugin marketplace add anthropics/skills
```

**Listar Marketplaces:**
```bash
/plugin marketplace list
```

**Navegar Plugins:**
```bash
/plugin
```

Muestra un menú interactivo con todos los plugins disponibles.

**Instalar un Plugin:**
```bash
/plugin install nombre-del-plugin
```

**Listar Plugins Instalados:**
```bash
/plugin list
```

**Desinstalar un Plugin:**
```bash
/plugin uninstall nombre-del-plugin
```

### Ejemplo de Uso

```
Tú: /plugin marketplace add anthropics/skills

Claude: Marketplace 'anthropics/skills' agregado exitosamente.

Tú: /plugin

Claude: [Muestra menú interactivo]
Available Plugins:
1. test-automation - Automated testing workflows
2. api-toolkit - RESTful API development tools
3. devops-suite - DevOps automation and deployment
...

Tú: /plugin install test-automation

Claude: Installing 'test-automation'...
✓ Installed 2 skills
✓ Installed 3 slash commands
✓ Installed 1 agent
✓ Plugin 'test-automation' ready to use!
```

---

## 📖 Lección 12.4: Crear Tu Propio Plugin

### Estructura de un Plugin

```
my-plugin/
├── .claude-plugin/
│   ├── manifest.json          # Metadata del plugin
│   └── marketplace.json       # Info del marketplace (opcional)
├── skills/
│   └── my-skill/
│       └── SKILL.md
├── agents/
│   └── my-agent.md
├── commands/
│   └── my-command.md
└── README.md
```

### Archivo manifest.json

```json
{
  "name": "awesome-dev-toolkit",
  "version": "1.0.0",
  "description": "Comprehensive development toolkit with testing, API design, and security skills",
  "author": "Tu Nombre <email@example.com>",
  "repository": "https://github.com/user/awesome-dev-toolkit",
  "skills": [
    {
      "path": "skills/api-design"
    },
    {
      "path": "skills/testing-patterns"
    }
  ],
  "agents": [
    {
      "path": "agents/code-reviewer.md"
    }
  ],
  "commands": [
    {
      "path": "commands/review-pr.md"
    }
  ],
  "mcpServers": [],
  "hooks": []
}
```

### Publicar en un Marketplace

**Opción 1: GitHub Repository**
```bash
# Tu plugin en: https://github.com/user/awesome-dev-toolkit

# Los usuarios instalan con:
/plugin marketplace add user/awesome-dev-toolkit
/plugin install awesome-dev-toolkit
```

**Opción 2: Crear Marketplace Privado**

Archivo `.claude-plugin/marketplace.json`:
```json
{
  "name": "Mi Empresa Dev Tools",
  "description": "Internal development tools for our team",
  "plugins": [
    {
      "name": "company-standards",
      "version": "1.0.0",
      "description": "Company coding standards and best practices",
      "source": {
        "type": "git",
        "url": "https://github.com/company/claude-standards.git"
      }
    },
    {
      "name": "api-templates",
      "version": "2.1.0",
      "description": "Standard API templates and patterns",
      "source": {
        "type": "git",
        "url": "https://github.com/company/api-templates.git"
      }
    }
  ]
}
```

### Versionado de Plugins

Usa **Semantic Versioning** (semver):
- `1.0.0` → Primera versión estable
- `1.1.0` → Nueva feature (backwards compatible)
- `1.1.1` → Bug fix
- `2.0.0` → Breaking changes

---

## 📖 Lección 12.5: Code Execution Tool (Beta)

El **Code Execution Tool** permite a Claude ejecutar código Python en un entorno sandbox seguro.

### Características

✅ **Seguridad**
- Sandbox aislado sin acceso a internet
- No puede acceder al sistema de archivos externo
- Ambiente controlado y seguro

✅ **Capacidades**
- Ejecutar código Python
- Instalar paquetes (dentro del sandbox)
- Generar visualizaciones y gráficas
- Procesamiento de datos

### Requisitos

Para usar Code Execution Tool necesitas:
1. Claude Code con el modelo Sonnet 4.5+
2. Beta habilitada: `"anthropic-beta": "code-execution-2025-05-22"`

### Configuración

En `~/.claude/settings.json`:
```json
{
  "model": "claude-sonnet-4-5",
  "beta": ["code-execution-2025-05-22"]
}
```

### Ejemplo de Uso

```
Tú: Analiza este dataset CSV y genera una visualización

Claude: [usa Code Execution Tool]

import pandas as pd
import matplotlib.pyplot as plt

# Leer datos
df = pd.read_csv('data.csv')

# Análisis
print(df.describe())

# Visualización
df.plot(kind='bar', x='category', y='value')
plt.title('Análisis de Datos')
plt.savefig('analysis.png')

[Claude ejecuta el código en el sandbox]
[Claude muestra resultados y gráfica]
```

### Casos de Uso

**1. Análisis de Datos**
```python
import pandas as pd
import numpy as np

# Cargar y analizar datos
df = pd.read_csv('sales.csv')
monthly_avg = df.groupby('month')['sales'].mean()
print(f"Promedio mensual: {monthly_avg}")
```

**2. Procesamiento de Texto**
```python
from collections import Counter
import re

text = "..." # texto largo
words = re.findall(r'\w+', text.lower())
most_common = Counter(words).most_common(10)
print("Palabras más frecuentes:", most_common)
```

**3. Cálculos Matemáticos**
```python
import numpy as np
from scipy import stats

data = [12, 15, 14, 10, 18, 16, 11]
mean = np.mean(data)
std = np.std(data)
median = np.median(data)

print(f"Media: {mean}, Desv. Std: {std}, Mediana: {median}")
```

### Limitaciones

⚠️ **No disponible:**
- Acceso a internet
- Acceso al sistema de archivos del host
- Operaciones que requieren permisos elevados

⚠️ **Solo Python:**
- Actualmente solo soporta Python
- No ejecuta JavaScript, Ruby, etc.

---

## 📖 Lección 12.6: Checkpoints y Versionado Automático

Los **Checkpoints** guardan automáticamente el estado de tu código antes de cada cambio, permitiendo rollback instantáneo.

### Cómo Funcionan

**Guardado Automático:**
- Claude crea un checkpoint antes de cada modificación
- No necesitas hacer nada manualmente
- Histórico completo de cambios

**Rollback Rápido:**
```bash
# Presionar ESC dos veces
ESC ESC

# O usar comando
/rewind
```

### Comando /rewind

```
/rewind
```

Muestra lista de checkpoints recientes:
```
Recent Checkpoints:
1. 14:32 - Added user authentication
2. 14:25 - Created API endpoints
3. 14:18 - Set up database models
4. 14:10 - Initial project structure

Select checkpoint to restore (1-4):
```

### Casos de Uso

**1. Experimentación Segura**
```
Tú: Intenta refactorizar esta función usando async/await

[Claude hace cambios]
[No funciona como esperabas]

Tú: ESC ESC
[Código vuelve al estado anterior]
```

**2. Comparar Enfoques**
```
Tú: Implementa esta feature usando Redux

[Claude implementa]
[Guardas mentalmente cómo quedó]

Tú: /rewind

Tú: Ahora implementa lo mismo con Context API

[Comparas ambos enfoques]
```

**3. Recuperar de Errores**
```
[Claude hace cambios que rompen la app]

Tú: /rewind
[Seleccionas checkpoint antes del error]
[App funciona nuevamente]
```

### Configuración de Checkpoints

En `.claude/settings.json`:
```json
{
  "checkpoints": {
    "enabled": true,
    "maxCheckpoints": 50,
    "autoSave": true
  }
}
```

### Ver Historial Completo

```bash
/checkpoints list
```

Muestra todos los checkpoints guardados:
```
Checkpoint History (50 total):

Today 14:32 - Added user authentication [current]
Today 14:25 - Created API endpoints
Today 14:18 - Set up database models
Today 14:10 - Initial project structure
Today 13:55 - Updated dependencies
...
```

---

## 📖 Lección 12.7: Integración de Features Avanzadas

### Workflow Completo: Skills + Plugins + Execution

**Escenario:** Desarrollar un dashboard de análisis de datos

**1. Instalar Plugin de Data Science:**
```bash
/plugin marketplace add anthropics/skills
/plugin install data-science-toolkit
```

Esto instala:
- Skill: `pandas-patterns` - Mejores prácticas con Pandas
- Skill: `visualization-guide` - Guías de visualización
- Agent: `data-analyzer` - Agente para análisis de datos
- Comando: `/analyze-csv` - Análisis rápido de CSV

**2. Usar el Skill automáticamente:**
```
Tú: Analiza este archivo CSV de ventas y genera insights

Claude:
[Lee automáticamente el Skill 'pandas-patterns']
[Usa Code Execution Tool para ejecutar análisis]
[Aplica mejores prácticas del Skill]
[Genera visualizaciones siguiendo 'visualization-guide']
```

**3. Si algo sale mal, rewind:**
```
[El análisis tiene un error]

Tú: ESC ESC
[Vuelve a estado anterior]

Tú: Intenta de nuevo, pero usa groupby en lugar de pivot

[Claude intenta enfoque diferente]
```

**4. Delegar análisis profundo a agente:**
```
Tú: Usa el agente data-analyzer para encontrar correlaciones

[Claude lanza el agente 'data-analyzer' del plugin]
[Agente realiza análisis exhaustivo]
[Devuelve reporte con correlaciones encontradas]
```

### Arquitectura de Extensibilidad

```
┌─────────────────────────────────────────┐
│         CLAUDE CODE CORE                │
│  (Herramientas base, gestión de files)  │
└─────────────────┬───────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼──────┐        ┌──────▼──────┐
│  PLUGINS   │        │   SKILLS    │
│            │        │             │
│ - Commands │        │ Auto-loaded │
│ - Agents   │        │ Knowledge   │
│ - MCP      │        │ Modules     │
│ - Skills   │        └─────────────┘
│ - Hooks    │
└────────────┘
      │
      │ Uses
      ▼
┌──────────────────┐
│ CODE EXECUTION   │
│ (Sandbox)        │
└──────────────────┘
      │
      │ Saves state
      ▼
┌──────────────────┐
│  CHECKPOINTS     │
│ (Version History)│
└──────────────────┘
```

---

## 🛠️ Ejercicios de Práctica

### Ejercicio 12.1: Crear Tu Primer Skill
1. Crea un Skill llamado `react-hooks-guide`
2. Incluye mejores prácticas para `useState`, `useEffect`, `useMemo`
3. Agrega ejemplos de errores comunes y cómo evitarlos
4. Pruébalo pidiendo a Claude que revise componentes React

### Ejercicio 12.2: Instalar y Usar Plugins
1. Agrega el marketplace `anthropics/skills`
2. Explora los plugins disponibles con `/plugin`
3. Instala un plugin que te parezca útil
4. Prueba los comandos/skills que incluye

### Ejercicio 12.3: Experimentar con Code Execution
1. Pide a Claude que analice un dataset (CSV o JSON)
2. Genera una visualización con matplotlib
3. Observa cómo Claude usa el Code Execution Tool
4. Intenta diferentes tipos de análisis

### Ejercicio 12.4: Trabajar con Checkpoints
1. Haz que Claude modifique un archivo
2. Haz varios cambios consecutivos
3. Usa `/rewind` para ver el historial
4. Vuelve a un checkpoint anterior
5. Experimenta con un enfoque diferente

### Ejercicio 12.5: Crear un Plugin Simple
1. Crea la estructura de directorios para un plugin
2. Incluye al menos 1 Skill y 1 comando slash
3. Crea el archivo `manifest.json`
4. Documenta tu plugin en un README
5. Compártelo con un compañero (opcional)

---

## 📝 Examen 12: Proyecto Integrador de Extensibilidad

### Parte 1: Preguntas Teóricas (4 puntos)

**Pregunta 1:** ¿Cuál es la diferencia principal entre un Skill y un Agente en términos de contexto e invocación?

**Pregunta 2:** ¿Qué componentes puede incluir un Plugin de Claude Code? (nombra al menos 4)

**Pregunta 3:** ¿Qué limitaciones tiene el Code Execution Tool y por qué existen?

**Pregunta 4:** ¿Cómo funcionan los Checkpoints y cuándo son especialmente útiles?

### Parte 2: Diseño de Skill (3 puntos)

Diseña un Skill completo para uno de estos escenarios:

**Opción A: Database Design Skill**
- Propósito: Guiar en diseño de schemas de bases de datos
- Debe incluir: Normalización, índices, relaciones, mejores prácticas
- Escribe el archivo `SKILL.md` completo con YAML frontmatter

**Opción B: Frontend Accessibility Skill**
- Propósito: Asegurar accesibilidad en componentes web
- Debe incluir: ARIA labels, keyboard navigation, screen readers
- Escribe el archivo `SKILL.md` completo con YAML frontmatter

### Parte 3: Creación de Plugin (3 puntos)

Crea un Plugin que incluya:

1. Al menos 2 Skills relacionados
2. 1 comando slash útil
3. 1 agente especializado
4. Archivo `manifest.json` completo
5. README con documentación

Tema sugerido: "Web Development Essentials" o elige tu propio tema

### Parte 4: Implementación Práctica (Bonus +3 puntos)

Implementa y demuestra:

1. Instala al menos 2 plugins del marketplace
2. Crea tu propio Skill personalizado
3. Usa Code Execution Tool para un análisis de datos real
4. Demuestra el uso de Checkpoints con rollback
5. Documenta todo el proceso con screenshots o texto

Explica cómo estas features mejoran tu flujo de trabajo.

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
Muestra el archivo `SKILL.md` completo que creaste.

### Para la Parte 3:
Muestra:
1. Estructura de directorios del plugin
2. Contenido de `manifest.json`
3. Contenido de al menos 1 Skill y 1 comando
4. README del plugin

### Para la Parte 4:
Documenta cada paso con capturas o descripciones detalladas.

---

## 🎯 ¡Capítulo 12 Completo!

Una vez que apruebes este examen, dominarás las features más avanzadas de extensibilidad de Claude Code y estarás listo para crear tu propio ecosistema de herramientas personalizadas.

**Anterior**: `capitulo_11.md`
**Siguiente**: ¡Has completado el curso! 🎉

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Claude Code Skills Documentation](https://docs.claude.com/en/docs/claude-code/skills)
- [Plugin Marketplaces Guide](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
- [Code Execution Tool API](https://docs.anthropic.com/en/docs/build-with-claude/code-execution)

### Repositorios de la Comunidad
- [obra/superpowers](https://github.com/obra/superpowers) - Core skills library
- [jeremylongshore/claude-code-plugins-plus](https://github.com/jeremylongshore/claude-code-plugins-plus) - 227+ plugins
- [anthropics/skills](https://github.com/anthropics/skills) - Official skills marketplace

### Artículos y Guías
- [Claude Skills: Customize AI for your workflows](https://www.anthropic.com/news/skills)
- [Equipping agents with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Enabling Claude Code to work more autonomously](https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously)
