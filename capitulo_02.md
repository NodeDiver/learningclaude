# Capítulo 2: Operaciones con Archivos

**Duración**: 45 minutos
**Dificultad**: Principiante

---

## 🎯 Objetivos de Aprendizaje

Al final de este capítulo, podrás:
- Leer archivos con la herramienta Read
- Editar archivos existentes con la herramienta Edit
- Crear nuevos archivos con la herramienta Write
- Buscar archivos con Glob
- Buscar contenido en archivos con Grep
- Entender rutas absolutas vs relativas

---

## 📖 Lección 2.1: Leer Archivos

Claude puede leer cualquier archivo en tu sistema usando la herramienta **Read**.

### Sintaxis Básica

```
Lee el archivo README.md
```

### Características de Read

- Lee hasta 2000 líneas por defecto
- Muestra números de línea (formato `cat -n`)
- Puede leer archivos de cualquier tipo (texto, código, JSON, etc.)
- Puede leer imágenes, PDFs y notebooks de Jupyter
- Soporta offset y límite para archivos grandes

### Ejemplos

```
Tú: Lee el archivo package.json
Claude: [usa Read tool]
     1→{
     2→  "name": "mi-proyecto",
     3→  "version": "1.0.0"
     4→}

Tú: Lee solo las primeras 10 líneas de server.js
Claude: [usa Read con limit=10]
```

### Rutas de Archivo

- **Ruta absoluta**: `/home/usuario/proyecto/src/main.py`
- **Ruta relativa al directorio actual**: `src/main.py`

Claude entiende ambas, pero las rutas absolutas son más explícitas.

---

## 📖 Lección 2.2: Editar Archivos

La herramienta **Edit** modifica archivos existentes mediante reemplazos exactos de texto.

### Cómo Funciona Edit

1. **DEBES leer el archivo primero** (Edit fallará si no lo has leído)
2. Especificas el texto `old_string` (lo que quieres reemplazar)
3. Especificas el texto `new_string` (el reemplazo)
4. Claude hace el cambio

### Reglas Importantes

- ⚠️ **Debes leer el archivo antes de editar**
- El `old_string` debe ser único en el archivo (o usar `replace_all`)
- Debes preservar la indentación exacta
- No incluyas números de línea en las cadenas

### Ejemplo

```
Tú: En config.js, cambia el puerto de 3000 a 8080

Claude: [primero lee config.js]
     1→const config = {
     2→  port: 3000,
     3→  host: 'localhost'
     4→}

Claude: [usa Edit tool]
old_string: "port: 3000"
new_string: "port: 8080"

¡Listo! Cambié el puerto a 8080.
```

### Opción replace_all

Si quieres reemplazar todas las ocurrencias:

```
Tú: Renombra la variable oldName a newName en todo el archivo

Claude: [usa Edit con replace_all: true]
```

---

## 📖 Lección 2.3: Crear Archivos Nuevos

La herramienta **Write** crea archivos nuevos (o sobrescribe existentes).

### Sintaxis

```
Tú: Crea un archivo llamado hello.py con un script simple

Claude: [usa Write tool]
```

### Reglas Importantes

- Write **sobrescribirá** archivos existentes
- Si el archivo existe, Claude debe leerlo primero
- **Preferir Edit sobre Write** para archivos existentes
- No crear archivos .md o README sin que lo pidas explícitamente

### Ejemplo

```
Tú: Crea un archivo utils.js con una función para formatear fechas

Claude: [usa Write]
file_path: /home/usuario/proyecto/utils.js
content:
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

module.exports = { formatDate };

Archivo creado: utils.js
```

---

## 📖 Lección 2.4: Buscar Archivos con Glob

**Glob** encuentra archivos por patrones de nombre.

### Patrones Comunes

| Patrón | Encuentra |
|--------|-----------|
| `*.js` | Todos los archivos .js en el directorio actual |
| `**/*.py` | Todos los archivos .py en cualquier subdirectorio |
| `src/**/*.test.js` | Todos los archivos de test en src/ |
| `*.{ts,tsx}` | Archivos .ts o .tsx |

### Ejemplos

```
Tú: Encuentra todos los archivos TypeScript en src/

Claude: [usa Glob]
pattern: "src/**/*.ts"

Resultados:
src/main.ts
src/utils/helper.ts
src/components/Button.ts
```

### Cuándo Usar Glob

- Cuando necesitas encontrar archivos por **nombre o extensión**
- Para ver la estructura del proyecto
- Antes de buscar contenido específico

---

## 📖 Lección 2.5: Buscar Contenido con Grep

**Grep** busca texto **dentro** de archivos usando expresiones regulares.

### Sintaxis Básica

```
Tú: Busca la palabra "TODO" en todos los archivos JavaScript

Claude: [usa Grep]
pattern: "TODO"
type: "js"
```

### Parámetros Útiles

| Parámetro | Función |
|-----------|---------|
| `pattern` | El texto o regex a buscar |
| `type` | Tipo de archivo (js, py, rust, etc.) |
| `glob` | Patrón de archivos (ej: "*.tsx") |
| `output_mode` | "content", "files_with_matches", "count" |
| `-i` | Búsqueda sin importar mayúsculas |
| `-n` | Mostrar números de línea |
| `-A`, `-B`, `-C` | Líneas de contexto (después/antes/ambos) |

### Ejemplos

```
# Buscar función específica
Tú: Encuentra dónde se define la función getUserData

Claude: [usa Grep]
pattern: "function getUserData"
output_mode: "content"

# Buscar con contexto
Tú: Busca "ERROR" en logs y muéstrame 3 líneas antes y después

Claude: [usa Grep]
pattern: "ERROR"
glob: "*.log"
output_mode: "content"
-C: 3
```

### Grep vs Glob

- **Glob**: Busca archivos por **nombre**
- **Grep**: Busca **contenido dentro** de archivos

---

## 📖 Lección 2.6: Rutas de Archivos

### Tipos de Rutas

**Ruta Absoluta** (desde la raíz del sistema):
```
/home/motoko/dev/learningclaude/capitulo_02.md
```

**Ruta Relativa** (desde el directorio actual):
```
capitulo_02.md
./src/main.py
../otros-proyectos/config.json
```

### Directorio de Trabajo Actual

Claude siempre trabaja desde un directorio específico. Puedes verlo con:

```
Tú: ¿Cuál es mi directorio actual?

Claude: [ejecuta pwd via Bash]
/home/motoko/dev/learningclaude
```

### Mejores Prácticas

- Usa rutas **relativas** cuando trabajas en el proyecto actual
- Usa rutas **absolutas** cuando referencias archivos fuera del proyecto
- Verifica tu directorio actual si no estás seguro

---

## 🛠️ Ejercicios de Práctica

### Ejercicio 2.1: Leer y Explorar
1. Lista todos los archivos .md en el directorio actual
2. Lee el archivo COURSE_OUTLINE.md
3. Pide a Claude que te resuma el contenido en 3 puntos

### Ejercicio 2.2: Crear y Editar
1. Crea un archivo llamado `notas.txt` con el texto "Mis notas del capítulo 2"
2. Léelo para confirmar
3. Edita el archivo para agregar una segunda línea: "Claude es increíble"
4. Léelo de nuevo

### Ejercicio 2.3: Buscar con Glob
1. Encuentra todos los archivos de texto (.txt) en el directorio
2. Encuentra todos los archivos Markdown (.md)
3. Cuenta cuántos archivos hay en total

### Ejercicio 2.4: Buscar con Grep
1. Busca la palabra "Capítulo" en todos los archivos .md
2. Busca cuántas veces aparece la palabra "Claude" en CLAUDE.md
3. Encuentra en qué archivos se menciona "git"

---

## 📝 Examen 2: Desafío de Operaciones con Archivos

### Parte 1: Preguntas Teóricas (3 puntos)

**Pregunta 1:** ¿Cuál es la diferencia principal entre las herramientas Glob y Grep?

**Pregunta 2:** Verdadero o Falso: Puedes usar la herramienta Edit sin haber leído el archivo primero.

**Pregunta 3:** ¿Qué herramienta usarías para cada tarea?
- a) Encontrar todos los archivos Python: ___
- b) Buscar la palabra "import" dentro de archivos: ___
- c) Cambiar una línea específica en un archivo: ___

### Parte 2: Desafío Práctico (7 puntos)

Completa estas tareas y muéstrame los resultados:

**Tarea 1 (2 puntos):**
- Crea un archivo llamado `mi_proyecto.json`
- Agrega este contenido:
```json
{
  "nombre": "Mi Primer Proyecto",
  "version": "1.0.0",
  "descripcion": "Aprendiendo Claude Code"
}
```

**Tarea 2 (2 puntos):**
- Lee el archivo que acabas de crear
- Edítalo para cambiar la versión a "2.0.0"
- Agrégale un campo nuevo: `"autor": "Tu Nombre"`

**Tarea 3 (2 puntos):**
- Usa Glob para encontrar todos los archivos .md en el directorio
- Usa Grep para buscar cuántos archivos mencionan la palabra "Examen"

**Tarea 4 (1 punto):**
- Escribe un buen prompt que le pida a Claude buscar todos los archivos TypeScript (.ts) en una carpeta src/ que contengan la palabra "interface"

---

## ✅ Cómo Enviar Tu Examen

### Para la Parte 1 (Teórica):
```
Parte 1:
P1: [tu respuesta]
P2: [tu respuesta]
P3: a) ___, b) ___, c) ___
```

### Para la Parte 2 (Práctica):
Simplemente realiza las tareas y dime "Completé la tarea X". Yo verificaré los resultados leyendo los archivos.

---

## 🎯 ¡Capítulo 2 Completo!

Una vez que apruebes este examen, dominarás las operaciones con archivos y estarás listo para el Capítulo 3: Trabajando con Git.

**Siguiente**: `capitulo_03.md`
