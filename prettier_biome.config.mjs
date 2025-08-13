/**
 * @see https://prettier.io/docs/configuration
 * @see https://www.npmjs.com/package/prettier-plugin-sql
 * @type {import("prettier").Config}
 */
export default {
  plugins: ["prettier-plugin-sql"],
  proseWrap: "preserve",
  overrides: [
    {
      files: "*.md",
      options: {
        proseWrap: "always",
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
