# Changelog

## 0.3.0 - 2026-08-15

### Changed

- Replace the TypeScript 7 preview with the stable compiler and keep TypeScript
  6 available for legacy ESLint tooling.
- Upgrade Oxlint, its TypeScript engine, Oxfmt, Vitest, Prettier, the Tailwind
  Prettier plugin, and CI actions.
- Enable stricter TypeScript 7 checks and validate warnings, unused lint
  directives, legacy configurations, generated files, and the packed artifact.
- Ship generated JavaScript and declarations instead of raw TypeScript source.
- Keep tests outside the published package and smoke-test utilities through the
  package's public export.
- Resolve shared Prettier plugins from Core while requiring consumers to own the
  Prettier host.
- Remove the Husky `prepare` lifecycle script so Git-tag consumers do not need
  to approve dependency build scripts.

### Migration

- Use Node.js 24 or newer.
- Pin the package as `github:mjakl/core#v0.3.0`.
- Add `options.typeAware: true` and `options.typeCheck: true` to each consumer's
  root Oxlint configuration. Oxlint only supports these options at the root, so
  they are no longer part of the extended base configuration.
- Install Prettier 3.9 or newer directly when using Core's Prettier
  configurations.
- TypeScript 7 projects retaining the legacy ESLint configuration must keep the
  TypeScript 6 compiler API under the `typescript` package name, as documented
  in the README.
- Contributors to Core should run `just setup` once after cloning. Existing
  consumers may remove `@mjakl/core` from pnpm's `allowBuilds` or
  `onlyBuiltDependencies` list.

## 0.2.0 - 2026-08-15

- First tagged release.
