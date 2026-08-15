#!/usr/bin/env bash
set -euo pipefail

root_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
temp_dir=$(mktemp -d)
trap 'rm -rf "$temp_dir"' EXIT

pnpm --dir "$root_dir" exec tsc \
  --project "$root_dir/tsconfig.build.json" \
  --outDir "$temp_dir"

diff --recursive --unified "$root_dir/dist" "$temp_dir"
