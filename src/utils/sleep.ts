import { systemClock } from "@/utils/clock.js";

/**
 * @deprecated Use `systemClock.sleep(ms)` or a custom clock created with `createClock` instead.
 */
export async function sleep(ms: number): Promise<void> {
  await systemClock.sleep(ms);
}
