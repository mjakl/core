# @mjakl/core

Shared oxlint and Prettier configurations, plus common utilities for @mjakl
projects.

## Installation

Pin a Git tag so dependency updates are deliberate and reproducible:

```json
{
  "dependencies": {
    "@mjakl/core": "github:mjakl/core#v0.3.0"
  }
}
```

Git tags and the `version` in `package.json` use the same version number. Core
requires Node.js 24 or newer.

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
  "options": {
    "typeAware": true,
    "typeCheck": true
  },
  "ignorePatterns": ["*", "!src/**", "!tests/**"]
}
```

> **Note:** `plugins` must be declared in each project — oxlint overrides (does
> not merge) the `plugins` field from the base config. Type-aware options belong
> in the root configuration, so declare them there explicitly too.

Add project-specific rules or architecture boundary overrides as needed. See
[`oxlint.example.json`](./oxlint.example.json) for a minimal working example
with a `no-restricted-imports` override.

#### What the base includes

- **Categories:** `correctness` and `suspicious` at `error` level (~250 rules)
- **Plugins:** `typescript` and `import`, with type-aware rules activated by the
  root options shown above
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

The utility types require TypeScript 5.9 or newer. Projects using the shared
Oxlint configuration should install Oxlint 1.78 or newer and `oxlint-tsgolint`
7.0.2001 or newer. Projects using a shared Prettier configuration should install
Prettier 3.9 or newer. These tooling peers are optional for utility-only
consumers.

Legacy Biome and ESLint peers remain optional while consumers migrate away from
those configurations. TypeScript 7 does not expose the compiler API required by
`typescript-eslint`; projects that need both should install the toolchains
side-by-side:

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@^7.0.2",
    "typescript": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

## Features

### Oxlint Configuration

- Type-aware TypeScript rules when enabled in the consumer's root config
- `correctness` and `suspicious` categories enabled (~250 safety rules)
- 55 curated pedantic, style, and restriction rules
- Import ordering and validation via the `import` plugin
- Extensible per-project via `extends` and `overrides`

### Prettier Configuration

Two variants available:

#### Formatter-compatible version

- Minimal configuration that works alongside oxfmt or Biome
- Focused on non-overlapping SQL and Markdown formatting

#### Standalone version

- Import sorting with `@ianvs/prettier-plugin-sort-imports`
- SQL formatting support for PostgreSQL
- Markdown prose wrapping
- Tailwind class sorting
- Comprehensive formatting rules

### Utilities

Currently includes:

- `systemClock` — default implementation with `now`, `sleep`, and `monotonicMs`
- `createClock(adapter)` — helper for building testable clock adapters
- `invariant(condition, message?)` — assertion helper with TypeScript narrowing
- String utilities, including the safe interpolation tag `s`

## Development Notes

### Development Commands

- `just setup` — install dependencies and configure this checkout's Git hooks
- `just build` — generate the committed JavaScript and declaration files
- `just fix` — auto-fix files, run TypeScript 7, and regenerate the package
- `just qa` — mutating verification flow for local development
- `just qa-only` — read-only verification flow for pre-push / CI-style checks
- `just package-check` — verify the packed artifact in an isolated consumer

### Git Hooks

Run `just setup` once after cloning to install Husky's hooks. The `pre-push`
hook runs `just qa-only`; post-checkout, post-merge, and post-rewrite hooks run
`pnpm install` when dependency manifests change.

Core intentionally has no dependency lifecycle script. This keeps installation
from a Git tag non-executable and avoids pnpm build-script approval in every
consumer.
