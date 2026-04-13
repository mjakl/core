default:
    @just --list

test:
    pnpm exec vitest run --coverage

lint:
    pnpm exec oxfmt --check .
    pnpm exec oxlint .
    pnpm exec prettier --list-different "**/*.{md,sql}"
    pnpm exec tsc --noEmit

fix:
    pnpm exec oxfmt .
    pnpm exec oxlint --fix .
    pnpm exec prettier --write --list-different "**/*.{md,sql}"
    pnpm exec tsgo --noEmit

qa-only:
    just lint
    just test

qa:
    just fix
    just test

update:
    pnpm update --interactive
