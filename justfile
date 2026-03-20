default:
    @just --list

test:
    pnpm exec vitest run --coverage

lint:
    pnpm exec biome check .
    pnpm exec prettier --check "**/*.{md,sql}"
    pnpm exec eslint .
    pnpm exec tsc --noEmit

fix:
    pnpm exec biome check --write --unsafe .
    pnpm exec prettier --write --list-different "**/*.{md,sql}"
    pnpm exec eslint --fix .
    pnpm exec tsc --noEmit

update:
    pnpm update --interactive
    pnpm exec biome migrate --write
