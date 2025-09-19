export type Clock = {
  now(): Date;
  sleep(ms: number): Promise<void>;
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
    return performance.now();
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
