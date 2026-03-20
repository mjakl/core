#!/usr/bin/env sh

old_ref="$1"
new_ref="$2"

if [ -z "$old_ref" ] || [ -z "$new_ref" ]; then
  if git rev-parse --verify -q ORIG_HEAD >/dev/null 2>&1; then
    old_ref="ORIG_HEAD"
  else
    old_ref="HEAD@{1}"
  fi
  new_ref="HEAD"
fi

if ! command -v pnpm >/dev/null 2>&1; then
  exit 0
fi

set -- pnpm-lock.yaml pnpm-workspace.yaml
while IFS= read -r manifest; do
  set -- "$@" "$manifest"
done <<EOF
$(find . -path "./node_modules" -prune -o -name package.json -print 2>/dev/null | sed 's#^\./##' || true)
EOF

changed="$(git diff --name-only "$old_ref" "$new_ref" -- "$@" 2>/dev/null || true)"
if [ -n "$changed" ]; then
  echo "Dependencies changed; running pnpm install..."
  if ! pnpm install; then
    echo "Warning: pnpm install failed"
  fi
fi
