# BranchBuddy

Pequeño set de dos hooks para sesiones con Claude Code que estandariza tu flujo local:

* al empezar, crea una rama segura desde master/main y configura permisos útiles;
* al terminar, corre tests rápidos, hace un commit "Conventional Commit" en una sola frase (≤140 chars) y, opcionalmente, intenta mergear a la rama por defecto.

## ¿Por qué BranchBuddy?

* Evita tocar master/main por accidente.
* Mantiene mensajes de commit limpios y cortos.
* Reduce fricción con Git durante sesiones "agentic" sin caer en YOLO total.
* Da estructura mínima y portátil (solo bash + git).

## Cómo funciona

### Start hook

* Detecta la rama por defecto (master; fallback a main).
* Si estás en esa rama, crea y cambia a `feat/<slug>-<timestamp>`.
* Escribe `.claude/settings.local.json` con permisos:
  * allow para operaciones Git comunes,
  * ask para acciones riesgosas (npm install, docker),
  * deny para secretos (.env, keys).

### Stop hook

* Si hay cambios, ejecuta tests rápidos (Node/Python autodetectado).
* Staging + commit con formato Conventional Commits:
  * tipos válidos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`
  * mensaje en una sola frase, truncado a 140 caracteres
  * opcionalmente soporta scope: `feat(scope): …` si lo habilitás
* Si `AUTO_MERGE=1`, intenta:
  * rebase de tu rama contra master/main
  * merge a master/main (FF si puede, o normal)
  * si hay conflicto, aborta merge y te deja en tu rama para resolver

## Instalación

1. Copiá los scripts a tu repo:

```
.claude/hooks/start_branch.sh
.claude/hooks/stop_autocommit_and_merge.sh
```

2. Marcá ejecutables:

```bash
chmod +x .claude/hooks/*.sh
```

3. (Opcional) Variables de entorno:

```bash
# por defecto 0 para seguridad
export AUTO_MERGE=0
# opcional, sugieren tipo y título de commit
export CLAUDE_TASK_TYPE=feat
export CLAUDE_TASK_TITLE="short one-liner"
```

4. Lanzá Claude Code en el repo como siempre. Los hooks se ejecutan al iniciar y finalizar la sesión.

## Convenciones de commit

* Formato: `type[: optional scope]: subject`
* Tipos permitidos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`
* Subject: una sola frase, sin punto final, máx. 140 caracteres
* Ejemplos:

```
feat: add retry to invoice polling
fix(albyhub): handle null pubkey on connect
chore: update local claude permissions
```

## Use cases recomendados

* Proyectos personales o equipos chicos que buscan rapidez local con control básico.
* Feature spikes y refactors acotados donde querés aislar cambios por rama sin pensarlo cada vez.
* Monorepos con muchas tareas paralelas: un guardrail simple para no tocar la rama por defecto.
* Sesiones con Claude Code donde querés:
  * rama de trabajo por defecto,
  * permisos auto-sí solo para Git,
  * commits consistentes y breves,
  * cierre ordenado con opción de merge controlado.

## Cuándo no conviene (o con ajustes)

* Repos críticos con requerimiento estricto de PR + CI obligatorio:
  * dejá `AUTO_MERGE=0` y preferí abrir PR (manual o con comando del agente).
* Equipos con políticas de branching más complejas (GitFlow completo, release/hotfix firmados):
  * adaptá el Start hook a esa convención, o integralo con tus pre-commits corporativos.
* Necesidad de mensajes de commit más largos y descriptivos:
  * mantené la regla de 140 en el subject y colocá detalles en la descripción del PR.

## Pros y contras

### Ventajas

* Flujo consistente y predecible.
* Historial limpio (nombres de ramas uniformes, Conventional Commits, una línea).
* Menos fricción con Git durante sesiones agentic.
* Ahorra tokens evitando que Claude lea secretos o directorios pesados por defecto.

### Limitaciones

* `AUTO_MERGE=1` puede saltar el proceso de PR si no hay branch protection (úsalo con cuidado).
* Bash simple: worktrees, submódulos o monorepos complejos pueden requerir pequeños ajustes.
* Mensajes estrictos (una frase, 140) pueden quedar cortos; usá el cuerpo del PR para contexto.

## Buenas prácticas

* Protegé master/main en el remoto (required checks, no fast-forward si tu proceso lo pide).
* Dejá `AUTO_MERGE=0` por defecto; solo activalo localmente cuando corresponda.
* Añadí una sección en `CONTRIBUTING.md` con los tipos permitidos de commit y ejemplos.
* Considerá scopes opcionales y un validador (Husky/pre-commit) si tu equipo ya usa Conventional Commits.

## Roadmap sugerido

* Flag `STRICT_SCOPES=1` para exigir `type(scope): msg`.
* Modo worktree opcional en el Start hook para aislar sesiones por carpeta.
* Comando para abrir PR automático (GitHub/GitLab) en lugar de merge directo.
* Matriz de tests configurable por stack (Node, Python, Go, etc.).

## Licencia

MIT (o la que prefieras).
