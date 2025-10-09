# Capítulo 4: Uso Avanzado de Herramientas

**Duración**: 60 minutos
**Dificultad**: Intermedio

---

## 🎯 Objetivos de Aprendizaje

Al final de este capítulo, podrás:
- Ejecutar comandos bash con control de timeout y modo background
- Usar herramientas en paralelo para máxima eficiencia
- Realizar búsquedas web y obtener contenido de URLs
- Trabajar con Jupyter Notebooks
- Gestionar tareas con TodoWrite
- Entender cuándo usar cada herramienta

---

## 📖 Lección 4.1: Ejecutar Comandos Bash

La herramienta **Bash** ejecuta comandos en una shell persistente.

### Sintaxis Básica

```
Tú: Ejecuta npm install

Claude: [usa Bash]
[muestra salida del comando]
```

### Características Importantes

**1. Shell Persistente**
- La sesión de bash se mantiene entre comandos
- Las variables de entorno persisten
- El directorio actual se mantiene

**2. Timeout**
- Timeout predeterminado: 2 minutos (120000ms)
- Máximo: 10 minutos (600000ms)
- Especificar timeout: `timeout: 300000` (5 minutos)

**3. Ejecución en Background**
- Usa `run_in_background: true`
- Permite continuar trabajando mientras el comando se ejecuta
- Monitorea con `BashOutput` tool

### Ejemplos de Timeout

```
# Comando largo
Tú: Ejecuta los tests, puede tomar tiempo

Claude: [usa Bash con timeout: 300000]
npm test
[espera hasta 5 minutos]
```

### Ejecución en Background

```
Tú: Inicia el servidor de desarrollo en background

Claude: [usa Bash con run_in_background: true]
npm run dev

✅ Servidor iniciado en background (bash_id: abc123)
Puedes continuar trabajando mientras se ejecuta.
```

### Monitorear Procesos Background

```
# Ver output
Tú: ¿Qué está mostrando el servidor?

Claude: [usa BashOutput con bash_id]
Server running on http://localhost:3000

# Listar shells background
Tú: ¿Qué procesos tengo corriendo?

Claude: [ejecuta /bashes]
abc123: npm run dev (running)

# Detener proceso
Tú: Detén el servidor

Claude: [usa KillShell con shell_id]
✅ Proceso detenido
```

### Comandos Secuenciales vs Paralelos

**Secuencial (con &&):**
```bash
mkdir newdir && cd newdir && touch file.txt
```

**Paralelo (múltiples llamadas Bash):**
```
Claude: [ejecuta múltiples Bash tools en paralelo]
- git status
- git diff
- git log
```

### Buenas Prácticas

**✅ Usar Bash para:**
- Comandos de terminal (npm, docker, git)
- Operaciones del sistema
- Scripts de build

**❌ NO usar Bash para:**
- Leer archivos → usar **Read**
- Editar archivos → usar **Edit**
- Buscar archivos → usar **Glob**
- Buscar contenido → usar **Grep**
- Comunicación → escribir texto directo

### Manejo de Rutas con Espacios

```bash
# ✅ Correcto
cd "/path/with spaces/folder"
python "/path/with spaces/script.py"

# ❌ Incorrecto (fallará)
cd /path/with spaces/folder
python /path/with spaces/script.py
```

---

## 📖 Lección 4.2: Ejecución Paralela de Herramientas

Claude puede ejecutar **múltiples herramientas simultáneamente** para máxima eficiencia.

### ¿Cuándo Ejecutar en Paralelo?

**Ejecutar en Paralelo cuando:**
- Los comandos son **independientes**
- No hay dependencias entre resultados
- Quieres máximo rendimiento

**Ejecutar Secuencialmente cuando:**
- Un comando depende del resultado del anterior
- Necesitas tomar decisiones basadas en resultados

### Ejemplos de Ejecución Paralela

**Ejemplo 1: Análisis de Repositorio**
```
Tú: Analiza el estado del repositorio

Claude: [ejecuta en paralelo]
- Bash: git status
- Bash: git diff
- Bash: git log -5
- Glob: **/*.js
[todos ejecutan simultáneamente]
```

**Ejemplo 2: Búsqueda Múltiple**
```
Tú: Encuentra todas las referencias a "authenticate"

Claude: [ejecuta en paralelo]
- Grep: pattern="authenticate" type="js"
- Grep: pattern="authenticate" type="py"
- Grep: pattern="authenticate" glob="*.md"
```

**Ejemplo 3: Leer Múltiples Archivos**
```
Tú: Lee los archivos de configuración

Claude: [ejecuta en paralelo]
- Read: package.json
- Read: tsconfig.json
- Read: .env.example
```

### Ejemplo de Ejecución Secuencial

```
Tú: Crea un directorio y luego un archivo dentro

Claude: [ejecuta secuencialmente]
1. Bash: mkdir newfolder
2. [espera resultado]
3. Write: newfolder/file.txt
```

### Ventajas de Ejecución Paralela

- ⚡ **Rendimiento**: Hasta 10x más rápido
- 📊 **Eficiencia**: Usa mejor los recursos
- ⏱️ **Tiempo**: Completa tareas complejas más rápido

---

## 📖 Lección 4.3: WebSearch y WebFetch

Claude puede buscar en internet y obtener contenido de URLs.

### WebSearch

Busca información actualizada en la web.

**Sintaxis:**
```
Tú: Busca información sobre React 19

Claude: [usa WebSearch]
query: "React 19 features"
[muestra resultados de búsqueda]
```

**Filtrar Dominios:**
```
# Solo de dominios específicos
Tú: Busca información sobre Next.js solo en la documentación oficial

Claude: [usa WebSearch]
query: "Next.js App Router"
allowed_domains: ["nextjs.org"]

# Bloquear dominios
Tú: Busca tutoriales de Python pero no de W3Schools

Claude: [usa WebSearch]
query: "Python tutorial"
blocked_domains: ["w3schools.com"]
```

### WebFetch

Obtiene y procesa contenido de una URL específica.

**Sintaxis:**
```
Tú: Lee el contenido de https://example.com/docs

Claude: [usa WebFetch]
url: "https://example.com/docs"
prompt: "Extract main documentation sections"
[procesa y resume el contenido]
```

**Características:**
- Convierte HTML a Markdown
- Procesa el contenido con IA
- Cache de 15 minutos (automático)
- Sigue redirects automáticamente

### Casos de Uso

```
# Investigar error
Tú: Busca información sobre este error: "TypeError: Cannot read property"

Claude: [usa WebSearch]
[encuentra soluciones de Stack Overflow, docs, etc.]

# Obtener documentación
Tú: ¿Cómo uso el hook useEffect de React?

Claude: [usa WebFetch]
url: "https://react.dev/reference/react/useEffect"
prompt: "Explain useEffect hook with examples"

# Comparar tecnologías
Tú: Compara Vue vs React en 2025

Claude: [usa WebSearch]
[busca artículos recientes y compara]
```

### Limitaciones

- Solo disponible en US (WebSearch)
- No modifica contenido (read-only)
- Resultados pueden estar resumidos si son muy largos

---

## 📖 Lección 4.4: Trabajar con Jupyter Notebooks

Claude puede leer y editar notebooks de Jupyter (.ipynb).

### Leer Notebooks

```
Tú: Lee el notebook analysis.ipynb

Claude: [usa Read]
[muestra todas las celdas con outputs, código, texto y visualizaciones]
```

### Editar Celdas

Usa la herramienta **NotebookEdit**:

**Reemplazar contenido de celda:**
```
Tú: En analysis.ipynb, cambia la primera celda de código

Claude: [usa NotebookEdit]
notebook_path: "/path/to/analysis.ipynb"
cell_id: "abc123"
edit_mode: "replace"
cell_type: "code"
new_source: "import pandas as pd\nimport numpy as np"
```

**Insertar nueva celda:**
```
Claude: [usa NotebookEdit]
edit_mode: "insert"
cell_type: "markdown"
cell_id: "xyz789"  # insertar después de esta celda
new_source: "## Análisis de Datos"
```

**Eliminar celda:**
```
Claude: [usa NotebookEdit]
edit_mode: "delete"
cell_id: "old123"
```

### Tipos de Celdas

- **code**: Celdas de código Python
- **markdown**: Celdas de texto con formato

### Ejemplo Completo

```
Tú: Crea un notebook nuevo con análisis de datos

Claude: [usa Write para crear notebook]
[crea estructura .ipynb con celdas de código y markdown]

Tú: Agrega una celda para visualización

Claude: [usa NotebookEdit]
edit_mode: "insert"
cell_type: "code"
new_source: "plt.figure(figsize=(10,6))\nplt.plot(data)\nplt.show()"
```

---

## 📖 Lección 4.5: Gestión de Tareas con TodoWrite

La herramienta **TodoWrite** gestiona listas de tareas durante tu sesión.

### ¿Cuándo Usar TodoWrite?

**Usar para:**
- Tareas complejas con múltiples pasos (3+)
- Tareas no triviales que requieren planificación
- Múltiples tareas que el usuario solicita
- Tracking de progreso en proyectos grandes

**NO usar para:**
- Tareas simples de 1-2 pasos
- Tareas triviales
- Conversaciones informativas

### Estados de Tareas

- **pending**: No iniciada
- **in_progress**: Trabajando actualmente (solo UNA a la vez)
- **completed**: Terminada exitosamente

### Formato de Tareas

Cada tarea requiere:
- **content**: Forma imperativa ("Run tests")
- **activeForm**: Forma continua ("Running tests")
- **status**: pending/in_progress/completed

### Ejemplo de Uso

```
Tú: Implementa autenticación de usuarios

Claude: [crea lista de tareas]
TodoWrite:
1. "Create user model in database" (in_progress)
2. "Implement login endpoint" (pending)
3. "Add JWT token generation" (pending)
4. "Create authentication middleware" (pending)
5. "Write tests for auth flow" (pending)

[comienza tarea 1]
[completa tarea 1, marca como completed]
[marca tarea 2 como in_progress]
[continúa...]
```

### Mejores Prácticas

1. **Una tarea in_progress a la vez**
```
✅ Correcto: 1 in_progress, 4 pending
❌ Incorrecto: 3 in_progress
```

2. **Completar inmediatamente**
```
✅ Completa tarea → marca completed → siguiente tarea
❌ Completar 3 tareas → marcar todas juntas
```

3. **Tareas específicas y accionables**
```
✅ "Implement login endpoint with JWT"
❌ "Do authentication stuff"
```

4. **Solo marcar completed si está TERMINADO**
```
✅ Tests pasan, código funciona → completed
❌ Tests fallan, errores → keep in_progress
```

### Ejemplo Completo

```
Tú: Agrega dark mode, tests, y build

Claude: [usa TodoWrite]
Todos:
1. Creating dark mode toggle component (in_progress)
2. Adding dark mode state management (pending)
3. Implementing dark theme styles (pending)
4. Running tests (pending)
5. Building project (pending)

[implementa componente]
✅ Tarea 1 completada

[marca tarea 2 como in_progress]
[implementa state management]
✅ Tarea 2 completada

[continúa hasta completar todas...]
```

---

## 📖 Lección 4.6: Estrategia de Selección de Herramientas

### Matriz de Decisión

| Necesitas | Herramienta | Ejemplo |
|-----------|-------------|---------|
| Leer archivo | Read | "Lee config.json" |
| Editar archivo | Edit | "Cambia el puerto a 8080" |
| Crear archivo | Write | "Crea utils.js" |
| Buscar archivos | Glob | "Encuentra todos los .tsx" |
| Buscar contenido | Grep | "Busca 'TODO'" |
| Comando terminal | Bash | "npm install" |
| Buscar en web | WebSearch | "Busca info sobre X" |
| Obtener URL | WebFetch | "Lee esta documentación" |
| Editar notebook | NotebookEdit | "Cambia esta celda" |
| Gestionar tareas | TodoWrite | "Track progreso" |

### Optimización

**Prefiere herramientas especializadas:**
```
✅ Read para leer archivos
❌ Bash: cat archivo.txt

✅ Grep para buscar
❌ Bash: grep "pattern" **/*.js

✅ Edit para modificar
❌ Bash: sed -i 's/old/new/' file
```

**Usa paralelización:**
```
✅ Múltiples Read en paralelo
✅ Múltiples Grep en paralelo
✅ Múltiples Bash independientes
```

---

## 🛠️ Ejercicios de Práctica

### Ejercicio 4.1: Bash Avanzado
1. Verifica la versión de Node.js instalada
2. Lista los packages instalados globalmente con npm
3. Crea un directorio `test-bash` y navega a él en un solo comando

### Ejercicio 4.2: Ejecución Paralela
1. Pide a Claude que lea estos 3 archivos en paralelo:
   - README.md
   - COURSE_OUTLINE.md
   - capitulo_02.md
2. Observa cómo se ejecutan simultáneamente

### Ejercicio 4.3: WebSearch
1. Busca información sobre las últimas features de Claude Code
2. Busca tutoriales de TypeScript solo de sitios oficiales

### Ejercicio 4.4: TodoWrite
1. Pide a Claude que cree una lista de tareas para:
   - Crear 3 archivos nuevos
   - Editar 2 archivos existentes
   - Ejecutar tests
2. Observa cómo va marcando el progreso

---

## 📝 Examen 4: Desafío de Maestría de Herramientas

### Parte 1: Preguntas Teóricas (5 puntos)

**Pregunta 1:** ¿Cuál es el timeout predeterminado para comandos Bash y cuál es el máximo?

**Pregunta 2:** Nombra 3 casos donde es mejor usar herramientas especializadas en lugar de Bash.

**Pregunta 3:** ¿Cuántas tareas pueden estar en estado "in_progress" simultáneamente en TodoWrite?

**Pregunta 4:** ¿Cuál es la diferencia entre WebSearch y WebFetch?

**Pregunta 5:** ¿Cuándo debe Claude ejecutar herramientas en paralelo vs secuencialmente?

### Parte 2: Desafío Práctico (5 puntos)

**Tarea 1 (2 puntos): Investigación Web**
- Busca información sobre las mejores prácticas de React en 2025
- Usa WebFetch para leer contenido de la documentación oficial de React
- Resume lo que encontraste

**Tarea 2 (2 puntos): Operaciones Complejas**
Pide a Claude que ejecute estas tareas en paralelo:
- Verificar el estado de git
- Listar todos los archivos .md
- Buscar la palabra "Examen" en todos los archivos

**Tarea 3 (1 punto): Bash Background**
- Inicia un comando largo en background (puede ser `sleep 30`)
- Verifica que esté corriendo
- Detenlo antes de que termine

### Parte 3: Proyecto Integrador (Bonus +2 puntos)

Crea un proyecto completo que:
1. Use TodoWrite para planificar las tareas
2. Cree 2 archivos nuevos con Write
3. Edite 1 archivo existente con Edit
4. Ejecute un comando bash para verificar los cambios
5. Todo debe completarse correctamente con tracking de progreso

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

### Para la Parte 2 y 3:
Realiza las tareas y muéstrame los resultados. Yo verificaré el progreso.

---

## 🎯 ¡Capítulo 4 Completo!

Una vez que apruebes este examen, dominarás el uso avanzado de herramientas y estarás listo para el Capítulo 5: Comandos Slash.

**Anterior**: `capitulo_03.md`
**Siguiente**: `capitulo_05.md`
