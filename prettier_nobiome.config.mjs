/**
 * @see https://prettier.io/docs/configuration
 * @see https://github.com/IanVS/prettier-plugin-sort-imports
 * @see https://www.npmjs.com/package/prettier-plugin-sql
 * @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss
 * @type {import("prettier").Config}
 */
export default {
  plugins: [
    import.meta.resolve("@ianvs/prettier-plugin-sort-imports"),
    import.meta.resolve("prettier-plugin-sql"),
    import.meta.resolve("prettier-plugin-tailwindcss"),
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
