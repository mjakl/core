/**
 * Tagged template literal to safely convert primitives to strings.
 * Prevents objects and arrays from being coerced to strings.
 */
export function s(strings, ...values) {
    return strings.reduce((result, str, i) => {
        if (i > 0) {
            // We can safely use String() because we've already constrained the type
            return result + String(values[i - 1]) + str;
        }
        return result + str;
    }, "");
}
