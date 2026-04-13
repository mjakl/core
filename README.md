# @mjakl/core

Shared oxlint and Prettier configurations, plus common utilities for @mjakl
projects.

## Installation

```bash
pnpm add @mjakl/core
```

## Usage

### Oxlint Configuration

The shared oxlint baseline provides strict TypeScript linting with the
`correctness` and `suspicious` categories enabled, curated pedantic / style /
restriction rules, and sensible defaults for the `typescript` and `import`
plugins.

Create a project-level `.oxlintrc.json` that extends the shared base:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": ["./node_modules/@mjakl/core/oxlint.base.json"],
  "plugins": ["typescript", "import"],
  "ignorePatterns": ["*", "!src/**", "!tests/**"]
}
```

> **Note:** `plugins` must be declared in each project — oxlint overrides (does
> not merge) the `plugins` field from the base config.

Add project-specific rules or architecture boundary overrides as needed. See
[`oxlint.example.json`](./oxlint.example.json) for a minimal working example
with a `no-restricted-imports` override.

#### What the base includes

- **Categories:** `correctness` and `suspicious` at `error` level (~250 rules)
- **Plugins:** `typescript`, `import` with full type-aware checking
- **Curated rules:** 55 additional pedantic, style, and restriction rules
- **TS-file overrides:** disables JS-only rules redundant in TypeScript
- **Disabled false-positive rules:**
  - `no-unsafe-type-assertion` — too noisy for real-world `as` usage
  - `no-unnecessary-type-arguments` — auto-fix breaks type inference
  - `consistent-return` — conflicts with exhaustive TypeScript switches
  - `no-shadow` — false positives on Kysely, vitest, and callback patterns
  - `no-unmodified-loop-condition` — misses mutations in closures/callbacks
  - `no-extraneous-class` — flags intentional prototype-only test classes

### Prettier Configuration

Two Prettier configurations are available:

#### For projects using oxfmt (recommended)

```javascript
import coreConfig from "@mjakl/core/prettier_biome.config.mjs";

export default {
  ...coreConfig,
  // Your custom rules here
};
```

#### For standalone Prettier

```javascript
import coreConfig from "@mjakl/core/prettier_nobiome.config.mjs";

export default {
  ...coreConfig,
  // Your custom rules here
};
```

### ESLint and Biome (deprecated)

The ESLint (`eslint.config.mjs`) and Biome (`biome.json`) configurations are
still included for existing projects that have not yet migrated to oxlint /
oxfmt. **New projects should use the oxlint baseline above.** These
configurations will be removed in a future version once all projects have
migrated.

### Utilities

```typescript
import { createClock, systemClock } from "@mjakl/core";

const clock = createClock({
  now: () => new Date("2024-12-31T23:59:59.000Z"),
});

// Use the injected adapter in tests or other environments
const valueBefore = clock.monotonicMs();
await clock.sleep(100);
const valueAfter = clock.monotonicMs();

// Use the default system clock when you do not need to override behavior
const current = systemClock.now();
```

`monotonicMs()` always returns integer milliseconds (no fractional values).

## Peer Dependencies

This package requires TypeScript 5+ as a peer dependency.

## Features

### Oxlint Configuration

- TypeScript strict mode with full type-aware checking
- `correctness` and `suspicious` categories enabled (~250 safety rules)
- 55 curated pedantic, style, and restriction rules
- Import ordering and validation via the `import` plugin
- Extensible per-project via `extends` and `overrides`

### Prettier Configuration

Two variants available:

#### Formatter-compatible version

- Minimal configuration that works alongside oxfmt or Biome
- Focused on non-overlapping formatting rules (SQL, Tailwind, etc.)

#### Standalone version

- Import sorting with `@ianvs/prettier-plugin-sort-imports`
- SQL formatting support for PostgreSQL
- Markdown prose wrapping
- Comprehensive formatting rules

### Utilities

Currently includes:

- `systemClock` — default implementation with `now`, `sleep`, and `monotonicMs`
- `createClock(adapter)` — helper for building testable clock adapters
- `sleep(ms)` — Promise-based sleep function (**deprecated**; use
  `systemClock.sleep` or `createClock`)
- String utilities (check src/utils/strings.ts for available functions)

## Development Notes

### Development Commands

- `just fix` — auto-fix formatting and lint issues, then run fast type checks
  via `tsgo`
- `just qa` — mutating verification flow for local development (`fix` + tests)
- `just qa-only` — read-only verification flow for pre-push / CI-style checks
  (`lint` + tests, using `tsc`)

### Git Hooks

Husky installs a `pre-push` hook that runs `just qa-only` and post-checkout,
post-merge, and post-rewrite hooks that run `pnpm install` automatically when
`package.json` or lockfile changes are detected across the ref change.
