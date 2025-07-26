import { s } from "@/utils/strings";
import { describe, expect, test } from "bun:test";
import { expectType } from "ts-expect";

describe("s template literal tag", () => {
  test("converts primitives to strings", () => {
    const result = s`Value: ${123}`;
    expect(result).toBe("Value: 123");
    expectType<string>(result);
  });

  test("correctly handles multiple values", () => {
    const num = 42;
    const bool = true;
    const nullVal = null;
    const undefinedVal = undefined;

    const result = s`Number: ${num}, Boolean: ${bool}, Null: ${nullVal}, Undefined: ${undefinedVal}`;
    expect(result).toBe(
      "Number: 42, Boolean: true, Null: null, Undefined: undefined",
    );
  });

  // This is a type-level test that doesn't actually run
  test("type constraints prevent objects and arrays", () => {
    // @ts-expect-error - Objects should be rejected by type checking
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    s`Object: ${{ key: "value" }}`;

    // @ts-expect-error - Arrays should be rejected by type checking
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    s`Array: ${[1, 2, 3]}`;
  });
});
