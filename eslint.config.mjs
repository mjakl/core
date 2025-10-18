import eslintConfigPrettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import-x";
import tseslint from "typescript-eslint";

const runHeavyChecks = process.env.ESLINT_HEAVY_CHECKS === "true";

export default tseslint.config(
  // ********** What not to lint **********
  {
    ignores: ["*", "!src/**", "!tests/**"],
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
      // Disable rules covered by Biome to avoid double-reporting
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-exports": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/explicit-member-accessibility": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },

  // ********** Additional import rules **********
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    rules: {
      // Prevent duplicate imports from the same module
      "import-x/no-duplicates": "warn",
      // Prevent circular dependencies between modules
      "import-x/no-cycle": runHeavyChecks ? "warn" : "off",
      // Ensure all imports appear at the top of the file
      "import-x/first": "warn",
      // Check namespaces export used functionality (redundant with tsc)
      "import-x/namespace": runHeavyChecks ? "warn" : "off",
    },
    settings: {
      "import-x/core-modules": ["bun:test"],
    },
  },

  // ********** Prettier settings **********
  // Prettier should come last to override other rules
  eslintConfigPrettier,
);
