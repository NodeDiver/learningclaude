# Capítulo 3: Trabajando con Git

**Duración**: 45 minutos
**Dificultad**: Principiante-Intermedio

---

## 🎯 Objetivos de Aprendizaje

Al final de este capítulo, podrás:
- Entender cómo Claude integra con Git
- Hacer commits siguiendo las mejores prácticas
- Crear pull requests con Claude
- Usar GitHub CLI (`gh`) para gestionar issues y PRs
- Trabajar con ramas y git worktrees
- Seguir el protocolo de seguridad de Git

---

## 📖 Lección 3.1: Integración de Git con Claude Code

Claude Code tiene integración nativa con Git, lo que significa que puede ayudarte con todo tu flujo de trabajo Git.

### Capacidades de Git

Claude puede:
- Ver el estado de tu repositorio (`git status`)
- Revisar cambios (`git diff`)
- Crear commits con mensajes descriptivos
- Gestionar ramas
- Crear pull requests
- Usar `gh` CLI para interactuar con GitHub

### Ver el Estado de Git

```
Tú: ¿Cuál es el estado actual de mi repositorio?

Claude: [ejecuta git status]
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/main.py
  modified:   README.md

Untracked files:
  newfile.txt
```

### Verificar Cambios

```
Tú: Muéstrame qué cambié en main.py

Claude: [ejecuta git diff src/main.py]
[muestra los cambios línea por línea]
```

---

## 📖 Lección 3.2: Hacer Commits con Claude

Claude puede crear commits automáticamente siguiendo las mejores prácticas.

### Protocolo de Seguridad de Git

Claude sigue reglas estrictas:
- ⚠️ **NUNCA** actualiza la configuración de git
- ⚠️ **NUNCA** ejecuta comandos destructivos sin confirmación
- ⚠️ **NUNCA** omite hooks (--no-verify)
- ⚠️ **NUNCA** hace force push a main/master
- **Solo crea commits cuando se lo pides explícitamente**

### Proceso de Commit

Cuando pides un commit, Claude:
1. Ejecuta `git status` para ver archivos modificados
2. Ejecuta `git diff` para ver cambios
3. Revisa `git log` para seguir el estilo de mensajes
4. Crea un mensaje de commit descriptivo
5. Agrega archivos al staging
6. Crea el commit
7. Verifica con `git status`

### Ejemplo de Commit

```
Tú: Haz un commit de los cambios en main.py y README.md

Claude: [ejecuta git status, git diff, git log en paralelo]

Veo que:
- main.py: agregaste validación de email
- README.md: actualizaste la sección de instalación

[ejecuta comandos]
git add src/main.py README.md
git commit -m "Add email validation and update installation docs

- Implement email validation in user registration
- Update README with clearer installation steps

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

[verifica con git status]
✅ Commit creado exitosamente!
```

### Formato de Mensajes de Commit

Claude usa este formato:
```
<título corto y descriptivo>

<descripción detallada opcional>
- Punto 1
- Punto 2

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commits con Pre-commit Hooks

Si tienes pre-commit hooks que modifican archivos:
1. Claude intenta el commit
2. Si el hook modifica archivos, Claude verifica:
   - ¿Es seguro hacer amend? (autoría, no pusheado)
3. Si es seguro: `git commit --amend`
4. Si no: crea un nuevo commit

---

## 📖 Lección 3.3: Crear Pull Requests

Claude puede crear PRs completos con descripciones bien estructuradas.

### Flujo de Trabajo de PR

```
Tú: Crea un pull request para esta feature

Claude:
1. [ejecuta git status]
2. [ejecuta git diff origin/main...HEAD]
3. [revisa TODOS los commits en la rama]
4. [crea resumen de cambios]
5. [pushea a remote si es necesario]
6. [usa gh pr create]
```

### Ejemplo de PR

```
Tú: Crea un PR para la funcionalidad de login

Claude: [analiza los cambios]

Veo que esta rama incluye:
- Implementación de sistema de autenticación
- Formulario de login con validación
- Tests para el flujo de login

[ejecuta comandos]
git push -u origin feature/user-login
gh pr create --title "Add user authentication system" --body "$(cat <<'EOF'
## Summary
- Implement JWT-based authentication
- Add login form with email/password validation
- Create protected route middleware

## Test plan
- [ ] Test successful login
- [ ] Test invalid credentials
- [ ] Test token expiration
- [ ] Run integration tests

🤖 Generated with Claude Code
EOF
)"

✅ PR creado: https://github.com/user/repo/pull/42
```

### Estructura de PR

Claude incluye:
- **Summary**: 1-3 bullet points de cambios principales
- **Test plan**: Checklist de pruebas
- Firma de Claude Code

---

## 📖 Lección 3.4: Gestión de Ramas

### Crear y Cambiar Ramas

```
Tú: Crea una nueva rama llamada feature/dark-mode

Claude: [ejecuta]
git checkout -b feature/dark-mode
Switched to a new branch 'feature/dark-mode'
```

### Git Worktrees

Para trabajar en múltiples tareas simultáneamente:

```
Tú: Crea un worktree para trabajar en el bugfix

Claude: [ejecuta]
git worktree add ../proyecto-bugfix -b bugfix/login-error

✅ Worktree creado en ../proyecto-bugfix
Ahora puedes trabajar en el bugfix sin afectar tu rama actual.
```

### Ventajas de Worktrees

- Directorios de trabajo separados
- Estado de archivos aislado
- Historia de Git compartida
- Trabaja en múltiples ramas simultáneamente

### Listar y Gestionar Worktrees

```
# Ver worktrees
git worktree list

# Eliminar worktree
git worktree remove ../proyecto-bugfix
```

---

## 📖 Lección 3.5: GitHub CLI (`gh`)

Claude usa `gh` para interactuar con GitHub directamente desde la terminal.

### Comandos Comunes de `gh`

| Comando | Función |
|---------|---------|
| `gh pr create` | Crear pull request |
| `gh pr list` | Listar PRs |
| `gh pr view <number>` | Ver detalles de PR |
| `gh pr checks` | Ver estado de checks |
| `gh issue create` | Crear issue |
| `gh issue list` | Listar issues |
| `gh repo view` | Ver info del repositorio |

### Ejemplos

```
# Ver PR específico
Tú: Muéstrame el PR #123

Claude: [ejecuta gh pr view 123]
[muestra título, descripción, estado, checks]

# Listar PRs abiertos
Tú: ¿Qué PRs están abiertos?

Claude: [ejecuta gh pr list --state open]
#125  feat: Add dark mode       feature/dark-mode
#123  fix: Login error          bugfix/login
#120  docs: Update README        docs/readme-update

# Ver checks de CI/CD
Tú: ¿Pasaron los tests del PR 123?

Claude: [ejecuta gh pr checks 123]
✓ Build
✓ Tests
✓ Lint
All checks passed!
```

### Trabajar con Issues

```
Tú: Crea un issue para trackear el bug de logout

Claude: [ejecuta]
gh issue create --title "Fix logout redirect bug" --body "Users are not redirected to home after logout"

✅ Issue creado: https://github.com/user/repo/issues/126
```

---

## 📖 Lección 3.6: Mejores Prácticas de Git con Claude

### 1. Commits Frecuentes y Pequeños

```
✅ Bueno: "Fix email validation regex"
❌ Malo: "Update everything"
```

### 2. Mensajes Descriptivos

```
✅ Bueno: "Add user authentication with JWT tokens"
❌ Malo: "Add feature"
```

### 3. Revisar Antes de Commitear

Siempre pide a Claude que:
```
Tú: Muéstrame qué cambios voy a commitear
```

### 4. No Commitear Secretos

Claude te advertirá si intentas commitear:
- Archivos `.env`
- `credentials.json`
- Tokens o API keys

### 5. Push Solo Cuando Estés Listo

Claude **NO** hace push automáticamente. Debes pedirlo:
```
Tú: Pushea los commits al remote
```

---

## 🛠️ Ejercicios de Práctica

### Ejercicio 3.1: Primer Commit
1. Modifica el archivo `notas.txt` que creaste en el Capítulo 2
2. Agrega una línea: "Aprendiendo Git con Claude"
3. Pide a Claude que haga un commit con un buen mensaje

### Ejercicio 3.2: Múltiples Archivos
1. Crea dos archivos nuevos: `feature.js` y `test.js`
2. Agrega contenido a ambos
3. Haz un commit de ambos archivos con un mensaje descriptivo

### Ejercicio 3.3: Ver Historial
1. Pide a Claude que muestre los últimos 5 commits
2. Pide que muestre el diff del último commit
3. Pide que muestre cuántos commits has hecho hoy

### Ejercicio 3.4: Trabajar con Ramas
1. Crea una nueva rama llamada `ejercicio/cap3`
2. Haz un cambio en cualquier archivo
3. Commitea el cambio
4. Vuelve a la rama `main`

---

## 📝 Examen 3: Ejercicio de Flujo de Trabajo Git

### Parte 1: Preguntas Teóricas (4 puntos)

**Pregunta 1:** ¿Qué comandos ejecuta Claude ANTES de crear un commit? (nombra al menos 3)

**Pregunta 2:** Verdadero o Falso: Claude puede hacer `git push --force` a la rama main si se lo pides.

**Pregunta 3:** ¿Qué es un git worktree y para qué sirve?

**Pregunta 4:** ¿Qué herramienta usa Claude para crear pull requests en GitHub?

### Parte 2: Desafío Práctico (6 puntos)

Completa este flujo de trabajo completo:

**Tarea 1 (2 puntos): Setup**
- Verifica el estado actual de tu repositorio
- Crea una nueva rama llamada `examen/capitulo3`
- Cambia a esa rama

**Tarea 2 (2 puntos): Cambios y Commit**
- Crea un archivo llamado `git-flow.md`
- Agrega este contenido:
```markdown
# Mi Flujo de Trabajo Git

1. Crear rama
2. Hacer cambios
3. Commitear
4. Crear PR
```
- Haz un commit con el mensaje: "Add git workflow documentation"

**Tarea 3 (2 puntos): Historial y Verificación**
- Muestra el diff del commit que acabas de crear
- Muestra el log de commits en la rama actual
- Verifica el estado del repositorio

### Parte 3: Pregunta de Comprensión (Bonus +1 punto)

Explica en tus propias palabras: ¿Por qué es importante que Claude siga un "Protocolo de Seguridad de Git"? Da al menos 2 razones.

---

## ✅ Cómo Enviar Tu Examen

### Para la Parte 1 (Teórica):
```
Parte 1:
P1: [tu respuesta]
P2: [tu respuesta]
P3: [tu respuesta]
P4: [tu respuesta]
```

### Para la Parte 2 (Práctica):
Realiza las tareas y dime "Completé la tarea X". Verificaré los resultados.

### Para la Parte 3 (Bonus):
```
Bonus: [tu explicación]
```

---

## 🎯 ¡Capítulo 3 Completo!

Una vez que apruebes este examen, dominarás los flujos de trabajo Git con Claude y estarás listo para el Capítulo 4: Uso Avanzado de Herramientas.

**Anterior**: `capitulo_02.md`
**Siguiente**: `capitulo_04.md`
