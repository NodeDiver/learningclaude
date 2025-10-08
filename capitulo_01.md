# Capítulo 1: Primeros Pasos

**Duración**: 30 minutos
**Dificultad**: Principiante

---

## 🎯 Objetivos de Aprendizaje

Al final de este capítulo, podrás:
- Entender qué es Claude Code y qué puede hacer
- Conocer todos los comandos básicos de consola
- Navegar el modo interactivo
- Tener una conversación exitosa con Claude

---

## 📖 Lección 1.1: ¿Qué es Claude Code?

Claude Code es una herramienta CLI interactiva que te ayuda con tareas de ingeniería de software. ¡Piensa en ello como tener un programador de IA en tu terminal!

**Lo que Claude Code Puede Hacer:**
- Leer, editar y crear archivos
- Ejecutar comandos bash
- Trabajar con Git (commits, PRs, ramas)
- Buscar código en tu proyecto
- Ejecutar tareas complejas de múltiples pasos
- Usar agentes especializados para diferentes trabajos
- Integrarse con herramientas externas vía MCP

**Lo que lo Hace Especial:**
- Tiene acceso a herramientas (no solo generación de texto)
- Puede ver y modificar tus archivos reales
- Recuerda el contexto durante tu sesión
- Puede ejecutar comandos y ver los resultados

---

## 📖 Lección 1.2: Comandos Básicos de Consola

Estos son comandos integrados que puedes usar en Claude Code:

### Comandos Esenciales

| Comando | Lo Que Hace |
|---------|-------------|
| `/help` | Muestra información de ayuda |
| `/clear` | Limpia el historial de conversación |
| `/reset` | Reinicia la sesión completamente |
| `/exit` o `/quit` | Sale de Claude Code |
| `/undo` | Deshace el último mensaje del asistente |
| `/bashes` | Lista todos los shells bash en segundo plano |
| `/history` | Muestra el historial de conversación |

### Comandos de Información

| Comando | Lo Que Hace |
|---------|-------------|
| `/cost` | Muestra los costos de uso de la API |
| `/model` | Muestra el modelo actual en uso |
| `/tokens` | Muestra estadísticas de uso de tokens |

### Comandos de Utilidad

| Comando | Lo Que Hace |
|---------|-------------|
| `/settings` | Abre el archivo de configuración |
| `/config` | Muestra la configuración |
| `/commands` | Lista todos los comandos slash disponibles |

---

## 📖 Lección 1.3: Cómo Interactuar con Claude

### Patrón Básico de Interacción

1. **Tú escribes un mensaje** (como "lee el archivo main.py")
2. **Claude usa herramientas** (llama a la herramienta Read)
3. **Claude responde** (te muestra el contenido)
4. **Continúa la conversación** (haz preguntas de seguimiento)

### Ejemplo de Conversación

```
Tú: ¿Qué archivos hay en este directorio?
Claude: [ejecuta ls vía herramienta Bash]
      COURSE_OUTLINE.md
      capitulo_01.md
      README.md

Tú: Lee el archivo README
Claude: [usa herramienta Read]
      [muestra el contenido]

Tú: ¿Puedes agregar una sección sobre instalación?
Claude: [usa herramienta Edit para modificar README]
      ¡Listo! Agregué la sección de instalación a README.md
```

---

## 📖 Lección 1.4: Entendiendo el Uso de Herramientas

Claude no solo genera texto—usa **herramientas** para realmente hacer cosas:

### Herramientas Comunes

- **Read**: Lee contenido de archivos
- **Write**: Crea archivos nuevos
- **Edit**: Modifica archivos existentes
- **Bash**: Ejecuta comandos de terminal
- **Grep**: Busca texto en archivos
- **Glob**: Encuentra archivos por patrón
- **Task**: Lanza agentes especializados
- **WebFetch**: Obtiene contenido de URLs
- **WebSearch**: Busca en internet

¡No necesitas decirle a Claude qué herramienta usar—lo descubre basándose en lo que pides!

---

## 📖 Lección 1.5: Consejos para Buenos Prompts

### ✅ Buenos Prompts
- "Lee el archivo config.json"
- "Busca la función llamada getUserData"
- "Arregla el bug en src/auth.py línea 45"
- "Crea un nuevo archivo llamado utils.js con funciones auxiliares"

### ❌ Prompts Menos Efectivos
- "Haz algo con ese archivo" (¿cuál archivo?)
- "Hazlo mejor" (¿qué significa mejor?)
- "Arregla todo" (demasiado vago)

**Consejo Pro**: Sé específico, pero no necesitas sobre-explicar. ¡Claude entiende el contexto de programación!

---

## 🛠️ Ejercicios de Práctica

Prueba estos ejercicios para sentirte cómodo:

### Ejercicio 1.1: Comandos Básicos
Prueba cada uno de estos comandos en tu terminal:
1. Escribe `/help` y lee la salida
2. Escribe `/model` para ver qué modelo estás usando
3. Escribe `/commands` para ver todos los comandos disponibles

### Ejercicio 1.2: Primera Interacción
Pídele a Claude que:
1. Liste todos los archivos en el directorio actual
2. Lea el archivo COURSE_OUTLINE.md
3. Te diga cuántos capítulos hay

### Ejercicio 1.3: Operación Simple con Archivos
Pídele a Claude que:
1. Cree un nuevo archivo llamado `mi_primera_prueba.txt`
2. Agregue el texto "¡Hola desde el Capítulo 1!" a él
3. Te lo lea de vuelta

---

## 📝 Examen 1: Quiz de Comandos Básicos

Responde estas preguntas (¡puedes pedirme ayuda si la necesitas!):

### Pregunta 1 (Fácil)
¿Qué comando usarías para ver cuántos tokens has usado en esta sesión?

### Pregunta 2 (Fácil)
Si quieres empezar de nuevo con una conversación fresca, ¿qué comando usarías?

### Pregunta 3 (Media)
¿Cuáles son los TRES tipos principales de cosas que Claude Code puede hacer? (Pista: piensa en herramientas)

### Pregunta 4 (Media)
Le pediste a Claude que hiciera algo, pero no te gusta el resultado. ¿Qué comando te permite deshacer la última respuesta de Claude?

### Pregunta 5 (Media)
Verdadero o Falso: Necesitas decirle a Claude qué herramienta usar (como "usa la herramienta Read para leer este archivo")

### Pregunta 6 (Desafío)
Escribe un buen prompt que le pida a Claude:
- Encontrar todos los archivos Python en un directorio llamado `src`
- Buscar archivos que contengan la palabra "database"
- Mostrarte los resultados

---

## ✅ Cómo Enviar Tu Examen

Simplemente escribe tus respuestas en el chat así:

```
¡Estoy listo para enviar mi examen del Capítulo 1!

P1: [tu respuesta]
P2: [tu respuesta]
P3: [tu respuesta]
P4: [tu respuesta]
P5: [tu respuesta]
P6: [tu respuesta]
```

¡Las revisaré y te diré si puedes avanzar al Capítulo 2!

---

## 🎯 ¡Capítulo 1 Completo!

Una vez que apruebes el examen, avanzarás al Capítulo 2: Operaciones con Archivos, ¡donde aprenderás a trabajar con archivos como un profesional!

**Siguiente**: `capitulo_02.md`
