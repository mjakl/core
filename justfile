default:
    @just --list

test:
    bun test --coverage

lint:
    bun run biome check .
    bun run prettier --check "**/*.{md,sql}"
    bun run eslint .
    bun run tsc --noEmit

fix:
    bun run biome check --write --unsafe .
    bun run prettier --write --list-different "**/*.{md,sql}"
    bun run eslint --fix .
    bun run tsc --noEmit

update:
    bun update --interactive
    bun run bimee migrate --write
