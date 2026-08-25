import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { SITE_URL, absUrl, calcUrl, LIVE_CALCULATORS } from "../site.ts";

describe("absUrl", () => {
  test("prefixes SITE_URL for a path with a leading slash", () => {
    assert.equal(absUrl("/foo"), `${SITE_URL}/foo`);
  });

  test("prefixes SITE_URL for a path with no leading slash", () => {
    assert.equal(absUrl("foo"), `${SITE_URL}/foo`);
  });

  test("never produces a double slash after the origin", () => {
    for (const input of ["/foo", "foo", "/", ""]) {
      const out = absUrl(input);
      // Strip the protocol's "//" so we only check for accidental extra
      // slashes in the path portion.
      const afterProtocol = out.replace(/^https?:\/\//, "");
      assert.equal(
        afterProtocol.includes("//"),
        false,
        `absUrl(${JSON.stringify(input)}) produced a double slash: ${out}`,
      );
    }
  });
});

describe("calcUrl", () => {
  test("builds an absolute calculator URL on SITE_URL from a bare slug", () => {
    assert.equal(calcUrl("tip-calculator"), `${SITE_URL}/tip-calculator`);
  });

  test("does not double the slash when given a slug with a leading slash", () => {
    const out = calcUrl("/tip-calculator");
    assert.equal(out, `${SITE_URL}/tip-calculator`);
    const afterProtocol = out.replace(/^https?:\/\//, "");
    assert.equal(afterProtocol.includes("//"), false);
  });
});

describe("LIVE_CALCULATORS", () => {
  test("is non-empty", () => {
    assert.ok(LIVE_CALCULATORS.length > 0);
  });

  test("every entry has status === 'live'", () => {
    for (const c of LIVE_CALCULATORS) {
      assert.equal(c.status, "live");
    }
  });
});
