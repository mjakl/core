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
export declare const systemClock: Clock;
export declare function createClock(adapter?: ClockAdapter): Clock;
