#!/usr/bin/env bash
set -euo pipefail

# Detect default branch (prefer master as per your workflow)
DEFAULT_BRANCH="master"
if ! git show-ref --verify --quiet refs/heads/"$DEFAULT_BRANCH"; then
  if git show-ref --verify --quiet refs/heads/main; then
    DEFAULT_BRANCH="main"
  fi
fi

# Ensure we're inside a git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[hook] Not a git repo here. Skipping."
  exit 0
fi

# Current branch
current="$(git rev-parse --abbrev-ref HEAD)"
if [ "$current" = "$DEFAULT_BRANCH" ]; then
  # Slug for the feature branch: try to use Claude's task/title if available
  raw_slug="${CLAUDE_TASK_SLUG:-${CLAUDE_TASK_TITLE:-change}}"
  # Normalize slug
  slug="$(echo "$raw_slug" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9-_' '-' | sed 's/^-//;s/-$//')"
  ts="$(date +%Y%m%d%H%M%S)"
  new_branch="feat/${slug:-change}-${ts}"

  echo "[hook] Creating and switching to $new_branch from $DEFAULT_BRANCH"
  git fetch origin "$DEFAULT_BRANCH" || true
  git switch -c "$new_branch" "origin/$DEFAULT_BRANCH" 2>/dev/null || git switch -c "$new_branch" "$DEFAULT_BRANCH"
else
  echo "[hook] Already on a non-default branch ($current). Keeping it."
fi

# Safe, handy permissions for Claude Code (auto-yes for Git; ask for risky stuff; deny secrets)
mkdir -p .claude
cat > .claude/settings.local.json <<'JSON'
{
  "permissions": {
    "allow": [
      "Read(*)","Glob(*)","Grep(*)","LS(*)",
      "Edit(*)","Write(*)",
      "Bash(git status:*)","Bash(git diff:*)","Bash(git add:*)",
      "Bash(git commit:*)","Bash(git push:*)"
    ],
    "ask": [
      "Bash(npm install:*)","Bash(docker *:*)","Bash(rm -rf:*)"
    ],
    "deny": [
      "Read(./.env*)","Read(./secrets/**)","Read(./**/*.key)","Read(./**/*.pem)"
    ]
  }
}
JSON

echo "[hook] Local Claude permissions written to .claude/settings.local.json"
