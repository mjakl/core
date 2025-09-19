import { describe, expect, test } from "bun:test";
import { createClock, systemClock } from "./clock";

describe("clock", () => {
  test("systemClock exposes concrete implementations", async () => {
    const start = systemClock.monotonicMs();
    await systemClock.sleep(0);
    const end = systemClock.monotonicMs();

    expect(systemClock.now()).toBeInstanceOf(Date);
    expect(end).toBeGreaterThanOrEqual(start);
  });

  test("createClock uses adapter overrides", async () => {
    const expectedDate = new Date("2025-01-01T00:00:00.000Z");
    let sleptFor: number | undefined;

    const adapted = createClock({
      now: () => expectedDate,
      sleep: async (ms) => {
        sleptFor = ms;
        await Promise.resolve();
      },
      monotonicMs: () => 123,
    });

    expect(adapted.now()).toBe(expectedDate);
    await adapted.sleep(50);
    expect(sleptFor).toBe(50);
    expect(adapted.monotonicMs()).toBe(123);
  });
});
