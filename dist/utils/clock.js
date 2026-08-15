const defaultSleep = async (ms) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
};
const defaultMonotonicMs = () => {
    if (typeof performance !== "undefined" &&
        typeof performance.now === "function") {
        return Math.trunc(performance.now());
    }
    return Date.now();
};
export const systemClock = {
    now: () => new Date(),
    sleep: defaultSleep,
    monotonicMs: defaultMonotonicMs,
};
export function createClock(adapter = {}) {
    return {
        now: adapter.now ?? (() => systemClock.now()),
        sleep: adapter.sleep ?? ((ms) => systemClock.sleep(ms)),
        monotonicMs: adapter.monotonicMs ?? (() => systemClock.monotonicMs()),
    };
}
