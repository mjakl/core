import { expectType } from "ts-expect";
import { describe, expect, test } from "vitest";
import { s } from "../src/utils/strings.js";

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

  test("type constraints prevent objects and arrays", () => {
    // @ts-expect-error - Objects should be rejected by type checking
    const objectResult = s`Object: ${{ key: "value" }}`;

    // @ts-expect-error - Arrays should be rejected by type checking
    const arrayResult = s`Array: ${[1, 2, 3]}`;

    // TypeScript prevents these calls, but runtime coercion remains predictable.
    expect(objectResult).toBe("Object: [object Object]");
    expect(arrayResult).toBe("Array: 1,2,3");
  });
});
