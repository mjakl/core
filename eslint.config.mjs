import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import-x";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // ********** What not to lint **********
  {
    ignores: ["*", "!src/**", "!tests/**"],
  },

  // ********** JavaScript settings **********
  eslint.configs.recommended,
  // Additional JavaScript settings
  {
    rules: {
      // Callbacks must be arrow functions
      "prefer-arrow-callback": "warn",
      // Disallow console.log
      "no-console": "warn",
      // Use template literals instead of string concatenation
      // Example: `Hello ${name}` // Good
      // Example: "Hello " + name // Bad
      "prefer-template": "warn",
      // Prevent modifying function parameters directly
      // This helps maintain function purity
      "no-param-reassign": "warn",
    },
  },

  // ********** TypeScript settings **********
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  // Additional TypeScript settings
  {
    languageOptions: {
      // Setup how ESLint finds the tsconfig.json
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      // Warn about inconsistent type/interface usage (included in
      // strict-type-checked, but with interface as default)
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      // Enforce consistent usage of type exports
      "@typescript-eslint/consistent-type-exports": "warn",
      // Enforce consistent usage of type imports
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      // Report unused variables, but allow unused ones starting with _
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
      // Require explicit accessibility modifiers unless public
      "@typescript-eslint/explicit-member-accessibility": [
        "warn",
        { accessibility: "no-public" },
      ],
    },
  },

  // ********** Additional import rules **********
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    rules: {
      // Exports should come last (Disabled)
      "import-x/exports-last": "off",
      // Prevent duplicate imports from the same module
      "import-x/no-duplicates": "warn",
      // Prevent circular dependencies between modules
      "import-x/no-cycle": "warn",
      // Ensure all imports appear at the top of the file
      "import-x/first": "warn",
    },
    settings: {
      "import-x/core-modules": ["bun:test"],
    },
  },

  // ********** Prettier settings **********
  // Prettier should come last to override other rules
  eslintConfigPrettier,
);
