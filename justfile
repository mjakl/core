default:
    @just --list

test:
    bun test --coverage

lint:
    bun run syncpack lint
    bun run prettier --check .
    bun run eslint .

fix:
    bun run syncpack fix-mismatches
    bun run syncpack format
    bun run prettier --write --list-different .
    bun run eslint --fix .

update:
    bun run syncpack update
    bun install

