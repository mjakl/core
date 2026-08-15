default:
    @just --list

setup:
    pnpm install
    pnpm exec husky

build:
    rm -rf dist
    pnpm exec tsc --project tsconfig.build.json

test:
    pnpm exec vitest run --coverage --coverage.exclude="dist/**"

lint:
    pnpm exec oxfmt --check .
    pnpm exec oxlint .
    pnpm exec prettier --list-different "**/*.{md,sql}"
    pnpm exec tsc --noEmit

lint-legacy-configs:
    pnpm exec biome check src tests
    pnpm exec eslint .

check-generated:
    scripts/check-generated.sh

package-check:
    scripts/check-package.sh

fix:
    pnpm exec oxfmt .
    pnpm exec oxlint --fix .
    pnpm exec prettier --write --list-different "**/*.{md,sql}"
    pnpm exec tsc --noEmit
    just build

qa-only:
    just lint
    just lint-legacy-configs
    just check-generated
    just test
    just package-check

qa:
    just fix
    just lint-legacy-configs
    just test
    just package-check

update:
    pnpm update --interactive
