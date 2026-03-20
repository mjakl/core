default:
    @just --list

test:
    pnpm exec vitest run --coverage

lint:
    pnpm exec biome check .
    pnpm exec prettier --list-different "**/*.{md,sql}"
    pnpm exec eslint .
    pnpm exec tsc --noEmit

fix:
    pnpm exec eslint --fix .
    pnpm exec prettier --write --list-different "**/*.{md,sql}"
    pnpm exec biome check --write --unsafe .
    pnpm exec tsgo --noEmit

qa-only:
    just lint
    just test

qa:
    just fix
    just test

update:
    pnpm update --interactive
    pnpm exec biome migrate --write
