import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { isValidPreference } from "../theme.ts";

describe("isValidPreference", () => {
  test("accepts exactly 'system', 'light', 'dark'", () => {
    assert.equal(isValidPreference("system"), true);
    assert.equal(isValidPreference("light"), true);
    assert.equal(isValidPreference("dark"), true);
  });

  test("rejects junk values", () => {
    const junk: unknown[] = [
      null,
      undefined,
      "",
      "SYSTEM",
      "Light",
      "auto",
      0,
      1,
      42,
      {},
      { value: "dark" },
      [],
      ["dark"],
      true,
      false,
    ];
    for (const v of junk) {
      assert.equal(
        isValidPreference(v),
        false,
        `expected isValidPreference(${JSON.stringify(v)}) to be false`,
      );
    }
  });
});
