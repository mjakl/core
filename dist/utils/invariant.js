export function invariant(condition, message = "Invariant failed") {
    if (!condition) {
        throw new Error(message);
    }
}
