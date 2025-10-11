#!/usr/bin/env bash
set -euo pipefail

# Configuración
DEFAULT_BRANCH="master"
if ! git show-ref --verify --quiet refs/heads/"$DEFAULT_BRANCH"; then
  if git show-ref --verify --quiet refs/heads/main; then
    DEFAULT_BRANCH="main"
  fi
fi

# Cambiá a 1 si querés que al terminar intente mergear automáticamente a master/main
AUTO_MERGE="${AUTO_MERGE:-0}"

# Tipos válidos Conventional Commits
VALID_TYPES="feat fix chore docs refactor test perf ci build"

# Detectar repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[hook] Not a git repo here. Skipping."
  exit 0
fi

current_branch="$(git rev-parse --abbrev-ref HEAD)"

# 1) Si hay cambios, correr tests rápidos (ajustá a tu stack), stage y commit formateado
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "[hook] Running quick tests..."
  if [ -f package.json ]; then
    # Node/TS typical quick test; ignore failures to not block commit
    npm test -w || true 2>/dev/null || npm test || true
  elif [ -f pyproject.toml ] || [ -f pytest.ini ]; then
    pytest -q || true
  fi

  echo "[hook] Staging changes..."
  git add -A

  # Construir mensaje convencional: usa vars de Claude si existen
  raw_title="${CLAUDE_TASK_TITLE:-${CLAUDE_GOAL:-Auto commit}}"
  raw_type="${CLAUDE_TASK_TYPE:-chore}"
  # Normalizar tipo
  type_lc="$(echo "$raw_type" | tr '[:upper:]' '[:lower:]')"
  if ! echo "$VALID_TYPES" | grep -qw "$type_lc"; then
    type_lc="chore"
  fi

  # Quedarnos con una sola frase del título (hasta primer . ! ?)
  one_sentence="$(echo "$raw_title" | sed 's/[.!?].*//')"
  # Colapsar espacios
  one_sentence="$(echo "$one_sentence" | tr -s '[:space:]' ' ' | sed 's/^ *//;s/ *$//')"
  # Truncar a 140 chars
  subject="$(echo "$one_sentence" | cut -c1-140)"

  commit_msg="${type_lc}: ${subject}"

  # Si ya hay algo staged, commitear
  if ! git diff --cached --quiet; then
    echo "[hook] Committing with Conventional Commit (<=140 chars, single sentence):"
    echo "       $commit_msg"
    git commit -m "$commit_msg" || true
  else
    echo "[hook] No staged changes to commit."
  fi
else
  echo "[hook] No changes to commit."
fi

# 2) Opcional: intentar merge a DEFAULT_BRANCH
if [ "$AUTO_MERGE" = "1" ]; then
  echo "[hook] Auto-merge enabled: attempting to merge '$current_branch' -> '$DEFAULT_BRANCH'"

  # Asegurar refs frescas
  git fetch origin || true

  # Traer último default branch
  if git show-ref --verify --quiet refs/remotes/origin/"$DEFAULT_BRANCH"; then
    base_ref="origin/$DEFAULT_BRANCH"
  else
    base_ref="$DEFAULT_BRANCH"
  fi

  # Rebase rápido para minimizar conflictos (opcional; comentá si no lo querés)
  echo "[hook] Rebase current branch onto $base_ref (to reduce conflicts)..."
  git pull --rebase origin "$current_branch" || true
  git rebase "$base_ref" || {
    echo "[hook] Rebase conflict. Aborting rebase and skipping merge."
    git rebase --abort || true
    exit 0
  }

  # Cambiar a default branch actualizado
  git switch "$DEFAULT_BRANCH"
  git pull --ff-only origin "$DEFAULT_BRANCH" || true

  # Intento de merge fast-forward preferido; si no se puede, merge con commit automático
  echo "[hook] Merging $current_branch into $DEFAULT_BRANCH..."
  if git merge --ff-only "$current_branch"; then
    echo "[hook] Fast-forward merge succeeded."
  else
    # No FF posible: intentar merge con commit
    if git merge --no-ff --no-edit "$current_branch"; then
      echo "[hook] Non-FF merge succeeded."
    else
      echo "[hook] Merge conflict detected. Aborting merge and restoring state."
      git merge --abort || true
      # Volver a la rama de trabajo para que lo resuelvas ahí
      git switch "$current_branch"
      echo "[hook] Please resolve conflicts on '$current_branch' and re-run the stop hook."
      exit 0
    fi
  fi

  # Push a remoto si existe origin
  if git remote get-url origin >/dev/null 2>&1; then
    echo "[hook] Pushing $DEFAULT_BRANCH to origin..."
    git push origin "$DEFAULT_BRANCH" || true
  fi

  # Volver a la rama de trabajo (por si querés seguir)
  git switch "$current_branch" || true
else
  echo "[hook] Auto-merge disabled. Skipping merge step."
fi
