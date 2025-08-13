/**
 * @see https://prettier.io/docs/configuration
 * @see https://github.com/IanVS/prettier-plugin-sort-imports
 * @see https://www.npmjs.com/package/prettier-plugin-sql
 * @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss
 * @type {import("prettier").Config}
 */
export default {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-sql",
    "prettier-plugin-tailwindcss",
  ],
  proseWrap: "preserve",
  overrides: [
    {
      files: "*.md",
      options: {
        proseWrap: "always",
        plugins: [],
      },
    },
    {
      files: "*.sql",
      plugins: [],
      options: {
        language: "postgresql",
        keywordCase: "upper",
        dataTypeCase: "upper",
        functionCase: "upper",
      },
    },
  ],
};
