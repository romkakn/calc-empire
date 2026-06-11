"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Home insurance premium estimator.
// Premium = (Coverage / 1000) * BaseRate * DeductibleMult * RiskMult * CreditMult * BundlingDiscount
// BaseRate $3.50 per $1000 of dwelling coverage is a mid-market national average.
// TODO_VERIFY: NAIC dwelling-fire/HO national average rate per $1000.
//   Source: https://content.naic.org/cipr-topics/homeowners-insurance
// TODO_VERIFY: III average homeowners premium ~$1,428/yr (2021 data, latest published).
//   Source: https://www.iii.org/fact-statistic/facts-statistics-homeowners-and-renters-insurance

type Risk = "low" | "med" | "high";
type Credit = "excellent" | "good" | "fair" | "poor";

const BASE_RATE_PER_1000 = 3.5; // dollars per $1000 of dwelling coverage

const DEDUCTIBLE_MULT: Record<string, number> = {
  "500": 1.1,
  "1000": 1.0,
  "2500": 0.9,
  "5000": 0.82,
};

const RISK_MULT: Record<Risk, number> = {
  low: 1.0,
  med: 1.2,
  high: 1.55,
};

// Credit-based insurance scoring is allowed in most US states (banned in CA, MA, MD, HI for home).
// TODO_VERIFY: NAIC credit-based insurance scoring guidance.
//   Source: https://content.naic.org/cipr-topics/credit-based-insurance-scores
const CREDIT_MULT: Record<Credit, number> = {
  excellent: 0.9,
  good: 1.0,
  fair: 1.15,
  poor: 1.4,
};

const BUNDLING_DISCOUNT = 0.9; // ~10% multi-policy discount when bundling with auto

function fmtUSD(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function Calculator() {
  const [coverage, setCoverage] = useState(300000);
  const [deductible, setDeductible] = useState<string>("1000");
  const [risk, setRisk] = useState<Risk>("low");
  const [credit, setCredit] = useState<Credit>("good");
  const [bundling, setBundling] = useState(false);

  const { annual, monthly, base } = useMemo(() => {
    const cov = Number(coverage);
    if (!Number.isFinite(cov) || cov <= 0) {
      return { annual: NaN, monthly: NaN, base: NaN };
    }
    const baseline = (cov / 1000) * BASE_RATE_PER_1000;
    const dMult = DEDUCTIBLE_MULT[deductible] ?? 1.0;
    const rMult = RISK_MULT[risk];
    const cMult = CREDIT_MULT[credit];
    const bMult = bundling ? BUNDLING_DISCOUNT : 1.0;
    const total = baseline * dMult * rMult * cMult * bMult;
    return { annual: total, monthly: total / 12, base: baseline };
  }, [coverage, deductible, risk, credit, bundling]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational estimate.</strong> Not a binding quote. Actual premiums
        depend on the carrier, property details, and underwriting.
      </Card>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Dwelling coverage"
          type="number"
          inputMode="numeric"
          value={coverage}
          onChange={(e) => setCoverage(Number(e.target.value))}
          min={50000}
          max={5000000}
          step={10000}
          leading="$"
          supportingText="Rebuild cost of the home — not market value or land. Most owners need 100% replacement cost."
        />

        <div className="sm:col-span-1">
          <p className="md-label-medium mb-1 text-[var(--md-sys-color-on-surface-variant)]">
            Deductible
          </p>
          <select
            aria-label="Deductible"
            value={deductible}
            onChange={(e) => setDeductible(e.target.value)}
            className="w-full min-h-14 rounded-[var(--md-sys-shape-corner-extra-small)] border border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)] px-3 md-body-large text-[var(--md-sys-color-on-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]"
          >
            <option value="500">$500</option>
            <option value="1000">$1,000</option>
            <option value="2500">$2,500</option>
            <option value="5000">$5,000</option>
          </select>
          <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
            Higher deductible = lower premium, more out-of-pocket at claim time.
          </p>
        </div>
      </form>

      <div className="flex flex-wrap gap-3 mt-4">
        <Segment
          label="Location risk (FEMA zone)"
          value={risk}
          onChange={(v) => setRisk(v as Risk)}
          options={[
            { value: "low", label: "Low" },
            { value: "med", label: "Medium" },
            { value: "high", label: "High" },
          ]}
        />
        <Segment
          label="Credit tier"
          value={credit}
          onChange={(v) => setCredit(v as Credit)}
          options={[
            { value: "excellent", label: "Excellent" },
            { value: "good", label: "Good" },
            { value: "fair", label: "Fair" },
            { value: "poor", label: "Poor" },
          ]}
        />
      </div>

      <div className="mt-4">
        <label className="inline-flex items-center gap-3 min-h-12 cursor-pointer">
          <input
            type="checkbox"
            checked={bundling}
            onChange={(e) => setBundling(e.target.checked)}
            className="size-5 accent-[var(--md-sys-color-primary)]"
          />
          <span className="md-body-large">
            Bundle with auto insurance (~10% discount)
          </span>
        </label>
      </div>

      <Card variant="filled" className="mt-6 p-4">
        <div
          role="status"
          aria-live="polite"
          className="grid gap-x-6 gap-y-4 sm:grid-cols-2"
        >
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Estimated annual premium
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtUSD(annual)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Monthly equivalent
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtUSD(monthly)}
            </p>
          </div>
          <div className="sm:col-span-2 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
            Baseline before adjustments: {fmtUSD(base)} (rate $3.50 per $1,000 of
            dwelling coverage).
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Flood damage is not covered by a standard HO-3/HO-5 policy. Buy a separate
        NFIP or private flood policy if your address is in a flood zone.
      </p>
    </Card>
  );
}

function Segment({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <p className="md-label-medium mb-1 text-[var(--md-sys-color-on-surface-variant)]">
        {label}
      </p>
      <div
        role="radiogroup"
        aria-label={label}
        className="inline-flex rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] overflow-hidden"
      >
        {options.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              "min-h-12 px-4 md-label-large",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]",
              value === opt.value
                ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                : "text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
              i > 0 ? "border-l border-[var(--md-sys-color-outline)]" : "",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
