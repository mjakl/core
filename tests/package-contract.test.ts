import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClock, invariant, s, systemClock } from "@mjakl/core";
import { describe, expect, test } from "vitest";
import packageJson from "../package.json" with { type: "json" };

const packageRoot = fileURLToPath(new URL("..", import.meta.url));

describe("package contract", () => {
  test("provides its public runtime API", () => {
    const clock = createClock({ monotonicMs: () => 3 });

    invariant(systemClock.now() instanceof Date);
    expect(s`Version: ${clock.monotonicMs()}`).toBe("Version: 3");
  });

  test("exports existing files", async () => {
    const exportTargets = Object.values(packageJson.exports).flatMap((value) =>
      typeof value === "string" ? [value] : Object.values(value),
    );

    expect(exportTargets.length).toBeGreaterThan(0);
    await Promise.all(
      exportTargets.map((target) => access(path.resolve(packageRoot, target))),
    );
  });

  test("ships generated runtime files without source tests", () => {
    expect(packageJson.files).toContain("dist");
    expect(packageJson.files).not.toContain("src");
    expect(packageJson.files).not.toContain("tests");
  });

  test("has no dependency lifecycle scripts", () => {
    expect(Object.hasOwn(packageJson, "prepare")).toBe(false);
    expect(Object.hasOwn(packageJson, "scripts")).toBe(false);
  });
});
