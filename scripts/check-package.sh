#!/usr/bin/env bash
set -euo pipefail

root_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
package_manager=$(node -p "require('$root_dir/package.json').packageManager")
oxlint_version=$(node -p "require('$root_dir/package.json').devDependencies.oxlint")
tsgolint_version=$(node -p "require('$root_dir/package.json').devDependencies['oxlint-tsgolint']")
prettier_version=$(node -p "require('$root_dir/package.json').devDependencies.prettier")
temp_dir=$(mktemp -d)
trap 'rm -rf "$temp_dir"' EXIT

"$root_dir/scripts/check-generated.sh"
pnpm --dir "$root_dir" pack --pack-destination "$temp_dir" >/dev/null

tarball=$(find "$temp_dir" -maxdepth 1 -name '*.tgz' -print -quit)
contents=$(tar -tzf "$tarball")

for required_file in \
  package/CHANGELOG.md \
  package/README.md \
  package/dist/index.d.ts \
  package/dist/index.js \
  package/oxlint.base.json \
  package/oxlint.example.json \
  package/package.json \
  package/prettier_biome.config.mjs \
  package/prettier_nobiome.config.mjs; do
  grep -qx "$required_file" <<<"$contents"
done

if grep -Eq '^package/(src|tests|scripts)/' <<<"$contents"; then
  echo "Package contains development source, tests, or scripts" >&2
  exit 1
fi

consumer_dir="$temp_dir/consumer"
mkdir "$consumer_dir"
cat >"$consumer_dir/package.json" <<JSON
{
  "name": "core-package-check",
  "private": true,
  "type": "module",
  "dependencies": {
    "@mjakl/core": "file:$tarball"
  },
  "devDependencies": {
    "oxlint": "$oxlint_version",
    "oxlint-tsgolint": "$tsgolint_version",
    "prettier": "$prettier_version",
    "typescript": "5.9.3"
  },
  "packageManager": "$package_manager"
}
JSON
cat >"$consumer_dir/check.mjs" <<'JS'
import { invariant, s, systemClock } from "@mjakl/core";
import compatibleConfig from "@mjakl/core/prettier_biome.config.mjs";
import standaloneConfig from "@mjakl/core/prettier_nobiome.config.mjs";

invariant(s`Value: ${3}` === "Value: 3");
invariant(systemClock.now() instanceof Date);
invariant(compatibleConfig.plugins.length > 0);
invariant(standaloneConfig.plugins.length > compatibleConfig.plugins.length);
JS
cat >"$consumer_dir/.oxlintrc.json" <<'JSON'
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": ["./node_modules/@mjakl/core/oxlint.base.json"],
  "plugins": ["typescript", "import"],
  "options": {
    "typeAware": true,
    "typeCheck": true
  },
  "ignorePatterns": ["*", "!src/**"]
}
JSON
cat >"$consumer_dir/tsconfig.json" <<'JSON'
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true
  },
  "include": ["src"]
}
JSON
cat >"$consumer_dir/example.sql" <<'SQL'
select * from users where id=1;
SQL
mkdir "$consumer_dir/src"
cat >"$consumer_dir/src/example.ts" <<'TS'
import { s } from "@mjakl/core";

export const value=s`Count: ${1}`;
TS

pnpm --dir "$consumer_dir" install --reporter=silent
node "$consumer_dir/check.mjs"
pnpm --dir "$consumer_dir" exec prettier \
  --config "$consumer_dir/node_modules/@mjakl/core/prettier_biome.config.mjs" \
  --write "$consumer_dir/example.sql" >/dev/null
pnpm --dir "$consumer_dir" exec prettier \
  --config "$consumer_dir/node_modules/@mjakl/core/prettier_nobiome.config.mjs" \
  --write "$consumer_dir/src/example.ts" >/dev/null
pnpm --dir "$consumer_dir" exec tsc --noEmit
pnpm --dir "$consumer_dir" exec oxlint .

node - "$root_dir/package.json" "$consumer_dir/node_modules/@mjakl/core/package.json" <<'JS'
const expected = require(process.argv[2]);
const packed = require(process.argv[3]);
if (packed.version !== expected.version || packed.scripts) {
  process.exitCode = 1;
}
JS
