export type Clock = {
  /**
   * Returns the current wall-clock time.
   */
  now(): Date;
  /**
   * Resolves after at least the provided duration in milliseconds.
   */
  sleep(ms: number): Promise<void>;
  /**
   * Returns a monotonically increasing timestamp in integer milliseconds.
   */
  monotonicMs(): number;
};

export type ClockAdapter = Partial<Clock>;

const defaultSleep = async (ms: number): Promise<void> => {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
};

const defaultMonotonicMs = (): number => {
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    return Math.trunc(performance.now());
  }

  return Date.now();
};

export const systemClock: Clock = {
  now: () => new Date(),
  sleep: defaultSleep,
  monotonicMs: defaultMonotonicMs,
};

export function createClock(adapter: ClockAdapter = {}): Clock {
  return {
    now: adapter.now ?? (() => systemClock.now()),
    sleep: adapter.sleep ?? ((ms) => systemClock.sleep(ms)),
    monotonicMs: adapter.monotonicMs ?? (() => systemClock.monotonicMs()),
  } satisfies Clock;
}
