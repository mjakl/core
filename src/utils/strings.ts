type Stringable = string | number | boolean | null | undefined;

/**
 * Tagged template literal to safely convert primitives to strings.
 * Prevents objects and arrays from being coerced to strings.
 */
export const s = (
  strings: TemplateStringsArray,
  ...values: Stringable[]
): string => {
  return strings.reduce((result, str, i) => {
    if (i > 0) {
      // We can safely use String() because we've already constrained the type
      return result + String(values[i - 1]) + str;
    }
    return result + str;
  }, "");
};
