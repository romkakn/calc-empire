import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { PAYROLL_STATES, PAYROLL_STATE_SLUGS } from "../../../data/payroll-states.ts";
import catalog from "../../../data/calculators.json" with { type: "json" };

const states = Object.values(PAYROLL_STATES);

describe("PAYROLL_STATES entries", () => {
  test("every entry has a lowercase two-letter slug", () => {
    for (const s of states) {
      assert.match(
        s.slug,
        /^[a-z]{2}$/,
        `expected "${s.slug}" to be a lowercase two-letter slug`,
      );
    }
  });

  test("every entry has a non-empty name and sourceUrl", () => {
    for (const s of states) {
      assert.ok(typeof s.name === "string" && s.name.length > 0, `missing name for "${s.slug}"`);
      assert.ok(
        typeof s.sourceUrl === "string" && s.sourceUrl.length > 0,
        `missing sourceUrl for "${s.slug}"`,
      );
    }
  });

  test("every entry has a finite topRatePct between 0 and 20", () => {
    for (const s of states) {
      assert.ok(
        Number.isFinite(s.topRatePct),
        `topRatePct for "${s.slug}" is not a finite number: ${s.topRatePct}`,
      );
      assert.ok(
        s.topRatePct >= 0 && s.topRatePct <= 20,
        `topRatePct for "${s.slug}" (${s.topRatePct}) is out of the expected 0-20 range`,
      );
    }
  });

  test("slugs are unique", () => {
    const slugs = states.map((s) => s.slug);
    const unique = new Set(slugs);
    assert.equal(unique.size, slugs.length, "duplicate slug found in PAYROLL_STATES");
  });
});

describe("PAYROLL_STATE_SLUGS vs data/calculators.json programmatic.states", () => {
  test("the set of PAYROLL_STATE_SLUGS matches paycheck-calculator's programmatic.states", () => {
    const paycheck = catalog.calculators.find(
      (c: { slug: string }) => c.slug === "paycheck-calculator",
    ) as { programmatic?: { states: string[] } } | undefined;
    assert.ok(paycheck, "paycheck-calculator entry not found in data/calculators.json");
    assert.ok(paycheck?.programmatic, "paycheck-calculator has no programmatic field");

    const catalogStates = new Set(paycheck!.programmatic!.states);
    const ourStates = new Set(PAYROLL_STATE_SLUGS);

    const missingFromCatalog = [...ourStates].filter((s) => !catalogStates.has(s));
    const missingFromPayrollStates = [...catalogStates].filter((s) => !ourStates.has(s));

    assert.deepEqual(
      missingFromCatalog,
      [],
      `PAYROLL_STATES has slugs not present in calculators.json programmatic.states: ${missingFromCatalog.join(", ")}`,
    );
    assert.deepEqual(
      missingFromPayrollStates,
      [],
      `calculators.json programmatic.states has slugs missing from PAYROLL_STATES: ${missingFromPayrollStates.join(", ")}`,
    );
  });
});
