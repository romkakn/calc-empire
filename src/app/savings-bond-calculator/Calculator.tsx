"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// EE bonds: Treasury guarantees value doubles after 20 years from issue.
//   Effective rate to double in 20 yrs = 2^(1/20) - 1 ≈ 3.526% APR.
//   Reference: https://www.treasurydirect.gov/savings-bonds/ee-bonds/
// I bonds: composite rate = fixed + 2*semi + (fixed * semi), reset every 6 months.
//   For a steady-state estimate we hold the composite constant.
//   Reference: https://www.treasurydirect.gov/savings-bonds/i-bonds/i-bonds-interest-rates/
// Both series compound semi-annually from the issue month.
// Before 5 years, redemption forfeits the last 3 months of interest.

type Series = "ee" | "i";

// TODO_VERIFY: EE 20-year doubling — https://www.treasurydirect.gov/savings-bonds/ee-bonds/
const EE_DOUBLE_RATE = Math.pow(2, 1 / 20) - 1; // ≈ 0.035264924

// TODO_VERIFY: I bond composite rate formula — https://www.treasurydirect.gov/savings-bonds/i-bonds/i-bonds-interest-rates/
function iComposite(fixedPct: number, semiPct: number) {
  const f = fixedPct / 100;
  const s = semiPct / 100;
  return f + 2 * s + f * s;
}

function monthsBetween(issue: string, current: string) {
  if (!issue || !current) return NaN;
  const [iy, im] = issue.split("-").map(Number);
  const [cy, cm] = current.split("-").map(Number);
  if (!iy || !im || !cy || !cm) return NaN;
  const months = (cy - iy) * 12 + (cm - im);
  return Math.max(0, months);
}

function compoundSemiAnnual(principal: number, annualRate: number, months: number) {
  if (!Number.isFinite(principal) || !Number.isFinite(annualRate) || !Number.isFinite(months)) return NaN;
  const periods = Math.floor(months / 6); // semi-annual accrual steps
  return principal * Math.pow(1 + annualRate / 2, periods);
}

function applyEarlyPenalty(value: number, principal: number, months: number, annualRate: number) {
  // Before 5 years (60 months), forfeit last 3 months of interest.
  if (months >= 60 || !Number.isFinite(value)) return value;
  // Approximate 3-month interest as one-half of a semi-annual period.
  const lastSemi = principal * (annualRate / 2);
  const threeMonth = lastSemi / 2;
  return Math.max(principal, value - threeMonth);
}

function todayIsoMonth() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function Calculator() {
  const [series, setSeries] = useState<Series>("ee");
  const [face, setFace] = useState(100);
  const [issue, setIssue] = useState("2010-06");
  const [current, setCurrent] = useState(todayIsoMonth());
  const [iFixed, setIFixed] = useState(1.3); // user-editable fixed rate %
  const [iSemi, setISemi] = useState(1.97);  // user-editable semi-annual inflation rate %

  const { months, rate, currentValue, maturityValue, doubledValue, penaltyApplied } = useMemo(() => {
    const m = monthsBetween(issue, current);
    const rateUsed = series === "ee" ? EE_DOUBLE_RATE : iComposite(iFixed, iSemi);
    const raw = compoundSemiAnnual(face, rateUsed, m);
    const adj = applyEarlyPenalty(raw, face, m, rateUsed);
    // EE doubles at 20 years by Treasury guarantee — clamp the 20-year value.
    const guaranteed = series === "ee" ? face * 2 : NaN;
    const mat = series === "ee" ? face * 2 : compoundSemiAnnual(face, rateUsed, 12 * 30);
    return {
      months: m,
      rate: rateUsed,
      currentValue: adj,
      maturityValue: mat,
      doubledValue: guaranteed,
      penaltyApplied: Number.isFinite(m) && m > 0 && m < 60,
    };
  }, [series, face, issue, current, iFixed, iSemi]);

  const years = Number.isFinite(months) ? months / 12 : NaN;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not tax or investment advice. For exact
        Treasury redemption values use the official TreasuryDirect Savings Bond
        Calculator.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Bond series"
          value={series}
          onChange={(v) => setSeries(v as Series)}
          options={[
            { value: "ee", label: "EE bond" },
            { value: "i", label: "I bond" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Face value (purchase price)"
          type="number"
          inputMode="decimal"
          value={face}
          onChange={(e) => setFace(Number(e.target.value))}
          min={25}
          max={10000}
          step={25}
          trailing="$"
          supportingText="Modern EE and I bonds are sold at face value through TreasuryDirect."
        />
        <TextField
          label="Issue date"
          type="month"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          supportingText="Month and year printed on the bond."
        />
        <TextField
          label="Current (or target) date"
          type="month"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          supportingText="Date you want to value the bond for."
        />
        {series === "i" ? (
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="I bond fixed rate"
              type="number"
              inputMode="decimal"
              value={iFixed}
              onChange={(e) => setIFixed(Number(e.target.value))}
              min={0}
              max={5}
              step={0.05}
              trailing="%"
              supportingText="Locked at purchase, full 30 years."
            />
            <TextField
              label="Semi-annual inflation"
              type="number"
              inputMode="decimal"
              value={iSemi}
              onChange={(e) => setISemi(Number(e.target.value))}
              min={0}
              max={10}
              step={0.05}
              trailing="%"
              supportingText="Resets every 6 months."
            />
          </div>
        ) : null}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Estimated value today
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(currentValue) ? `$${currentValue.toFixed(2)}` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Value at 30-year final maturity
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(maturityValue) ? `$${maturityValue.toFixed(2)}` : "—"}
            </p>
          </div>
          {series === "ee" ? (
            <div className="sm:col-span-2">
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                Treasury 20-year doubling guarantee
              </p>
              <p className="mt-1 md-title-medium tabular-nums">
                {Number.isFinite(doubledValue) ? `$${doubledValue.toFixed(2)}` : "—"}
              </p>
            </div>
          ) : null}
          <div className="sm:col-span-2 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
            Held {Number.isFinite(years) ? years.toFixed(1) : "—"} years at an effective rate of {Number.isFinite(rate) ? (rate * 100).toFixed(2) : "—"}% APR
            {penaltyApplied ? " · 3-month interest penalty applied (under 5 years)." : "."}
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        EE bonds double at 20 years by Treasury guarantee; I bonds use a composite rate that resets every 6 months.
        {/* TODO_VERIFY: TreasuryDirect rate publication schedule — https://www.treasurydirect.gov/savings-bonds/i-bonds/i-bonds-interest-rates/ */}
        Estimates assume the entered rate holds steady — real I bond values follow a chain of 6-month rate periods.
      </p>
    </Card>
  );
}

function Segment({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <p className="md-label-medium mb-1 text-[var(--md-sys-color-on-surface-variant)]">{label}</p>
      <div role="radiogroup" aria-label={label} className="inline-flex rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] overflow-hidden">
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
