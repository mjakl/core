type Stringable = string | number | boolean | null | undefined;
/**
 * Tagged template literal to safely convert primitives to strings.
 * Prevents objects and arrays from being coerced to strings.
 */
export declare function s(strings: TemplateStringsArray, ...values: Stringable[]): string;
export {};
