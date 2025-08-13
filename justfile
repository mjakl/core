default:
    @just --list

test:
    bun test --coverage

lint:
    bun run biome check .
    bun run syncpack lint
    bun run prettier --check "**/*.{md,sql}"
    bun run eslint .
    bun run tsc --noEmit

fix:
    bun run biome check --write --unsafe .
    bun run syncpack fix-mismatches
    bun run syncpack format
    bun run prettier --write --list-different "**/*.{md,sql}"
    bun run eslint --fix .
    bun run tsc --noEmit

update:
    bun run syncpack update
    bun install

