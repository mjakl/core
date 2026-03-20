import { expectType } from "ts-expect";
import { describe, expect, test } from "vitest";
import { invariant } from "./invariant";

describe("invariant", () => {
  test("does nothing when condition is truthy", () => {
    expect(() => {
      invariant(true);
    }).not.toThrow();
    expect(() => {
      invariant(1);
    }).not.toThrow();
    expect(() => {
      invariant("ok");
    }).not.toThrow();
  });

  test("throws with default message when condition is falsy", () => {
    expect(() => {
      invariant(false);
    }).toThrow("Invariant failed");
  });

  test("throws with provided message when condition is falsy", () => {
    expect(() => {
      invariant(0, "Nope");
    }).toThrow("Nope");
  });

  test("narrows types for truthy values", () => {
    const value: string | undefined = "value";
    invariant(value);
    expectType<string>(value);
  });
});
