#!/usr/bin/env bash
# INV-10 — falla si aparece algo con forma de secreto fuera de .env
set -euo pipefail

PATRONES='(sk-ant-|sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)'

if git grep -nEI "$PATRONES" -- ':!*.md' ':!.env*' > /dev/null 2>&1; then
  echo "BLOQUEADO: posible secreto versionado" >&2
  git grep -nEI "$PATRONES" -- ':!*.md' ':!.env*' >&2
  exit 1
fi

if git ls-files --error-unmatch .env > /dev/null 2>&1; then
  echo "BLOQUEADO: .env está versionado" >&2
  exit 1
fi

echo "OK: sin secretos versionados"
