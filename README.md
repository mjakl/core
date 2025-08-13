# @mjakl/core

Shared ESLint, Prettier, and Biome configurations, plus common utilities for
@mjakl projects.

## Installation

```bash
bun add @mjakl/core
```

All necessary ESLint and Prettier plugins are included as dependencies, so you
don't need to install them separately.

## Usage

### ESLint Configuration (JavaScript)

The ESLint config is exported as a JavaScript module. In your
`eslint.config.mjs`:

```javascript
import coreConfig from "@mjakl/core/eslint.config.mjs";

export default [
  ...coreConfig,
  // Your custom rules here
];
```

### Prettier Configuration

Two Prettier configurations are available:

#### For projects using Biome (recommended)

```json
{
  "prettier": "@mjakl/core/prettier_biome.config.mjs"
}
```

Or create your own `prettier.config.mjs`:

```javascript
import coreConfig from "@mjakl/core/prettier_biome.config.mjs";

export default {
  ...coreConfig,
  // Your custom rules here
};
```

#### For projects not using Biome

```json
{
  "prettier": "@mjakl/core/prettier_nobiome.config.mjs"
}
```

Or create your own `prettier.config.mjs`:

```javascript
import coreConfig from "@mjakl/core/prettier_nobiome.config.mjs";

export default {
  ...coreConfig,
  // Your custom rules here
};
```

### Biome Configuration

For projects using Biome for linting and formatting:

```json
{
  "extends": ["@mjakl/core/biome.json"]
}
```

### Utilities

```typescript
import { sleep } from "@mjakl/core";

// Sleep for 1 second
await sleep(1000);
```

## Peer Dependencies

This package requires TypeScript 5+ as a peer dependency.

## Features

### ESLint Configuration

- TypeScript strict mode with type checking
- Import sorting and validation
- No relative import paths (enforces `@/` prefix)
- Prettier integration
- Sensible defaults for modern TypeScript projects

### Biome Configuration

- Fast, comprehensive linting and formatting
- TypeScript support with strict rules
- Import organization and validation
- Consistent code style enforcement

### Prettier Configuration

Two variants available:

#### Biome-compatible version

- Minimal configuration that works with Biome
- Focused on non-overlapping formatting rules

#### Standalone version

- Import sorting with `@ianvs/prettier-plugin-sort-imports`
- SQL formatting support for PostgreSQL
- Markdown prose wrapping
- Comprehensive formatting rules

### Utilities

Currently includes:

- `sleep(ms)` - Promise-based sleep function
- String utilities (check src/utils/strings.ts for available functions)

## Development Notes

### Dependencies Architecture

This package includes ESLint and Prettier plugins as regular dependencies rather
than peer dependencies. While this means the package isn't truly
"zero-dependency" for users who only need the utilities, this approach was
chosen because:

1. The ESLint and Prettier configs directly import their required plugins
2. This ensures configs work immediately upon installation without manual plugin
   setup
3. It simplifies the developer experience - one install gets everything working

If the dependency footprint becomes a concern as more tools are added, the
package can be migrated to a monorepo structure with separate packages for
utilities (@mjakl/core) and configurations (@mjakl/core-config).
