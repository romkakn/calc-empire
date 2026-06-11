"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// AGI per IRS Form 1040:
//   AGI = gross_income − above_the_line_adjustments
// Gross income lines: wages (Form W-2 box 1), business / self-employment income (Schedule C net).
// Above-the-line adjustments (Schedule 1 Part II): traditional IRA contribution,
// HSA deduction, deductible half of self-employment tax, student loan interest (capped),
// alimony paid under pre-2019 divorce decrees.
// TODO_VERIFY: Schedule 1 line numbers for tax year 2025 — IRS Form 1040 instructions
// https://www.irs.gov/forms-pubs/about-form-1040

type Filing = "single" | "mfj";

function clampNonNeg(n: number) {
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

// Student loan interest deduction cap: $2,500 per return.
// TODO_VERIFY: $2,500 cap for tax year 2025 — IRS Topic 456
// https://www.irs.gov/taxtopics/tc456
const STUDENT_LOAN_CAP = 2500;

export function Calculator() {
  const [filing, setFiling] = useState<Filing>("single");
  const [wages, setWages] = useState(80000);
  const [business, setBusiness] = useState(0);
  const [iraTrad, setIraTrad] = useState(5000);
  const [hsa, setHsa] = useState(3000);
  const [halfSe, setHalfSe] = useState(0);
  const [studentLoanInterest, setStudentLoanInterest] = useState(2000);

  const { gross, adjustments, agi, studentLoanApplied } = useMemo(() => {
    const w = clampNonNeg(wages);
    const b = clampNonNeg(business);
    const ira = clampNonNeg(iraTrad);
    const h = clampNonNeg(hsa);
    const se = clampNonNeg(halfSe);
    const sli = Math.min(clampNonNeg(studentLoanInterest), STUDENT_LOAN_CAP);

    const grossVal = w + b;
    const adj = ira + h + se + sli;
    return {
      gross: grossVal,
      adjustments: adj,
      agi: grossVal - adj,
      studentLoanApplied: sli,
    };
  }, [wages, business, iraTrad, hsa, halfSe, studentLoanInterest]);

  const fmt = (n: number) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
      : "—";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not tax advice. Talk to an enrolled agent
        or CPA about your specific return.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Filing status"
          value={filing}
          onChange={(v) => setFiling(v as Filing)}
          options={[
            { value: "single", label: "Single" },
            { value: "mfj", label: "Married filing jointly" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Wages (W-2 box 1)"
          type="number"
          inputMode="decimal"
          value={wages}
          onChange={(e) => setWages(Number(e.target.value))}
          min={0}
          step={100}
          trailing="$"
          supportingText="Salary, bonuses, tips before pre-tax 401(k) is already excluded by your employer."
        />
        <TextField
          label="Business / self-employment net"
          type="number"
          inputMode="decimal"
          value={business}
          onChange={(e) => setBusiness(Number(e.target.value))}
          min={0}
          step={100}
          trailing="$"
          supportingText="Schedule C net profit, or other self-employment income."
        />
        <TextField
          label="Traditional IRA contribution"
          type="number"
          inputMode="decimal"
          value={iraTrad}
          onChange={(e) => setIraTrad(Number(e.target.value))}
          min={0}
          step={100}
          trailing="$"
          supportingText="Deductible amount (not Roth). Subject to MAGI phase-outs if you have a workplace plan."
        />
        <TextField
          label="HSA deduction"
          type="number"
          inputMode="decimal"
          value={hsa}
          onChange={(e) => setHsa(Number(e.target.value))}
          min={0}
          step={100}
          trailing="$"
          supportingText="Direct contributions only — payroll-deducted HSA is already excluded from W-2 box 1."
        />
        <TextField
          label="Half of self-employment tax"
          type="number"
          inputMode="decimal"
          value={halfSe}
          onChange={(e) => setHalfSe(Number(e.target.value))}
          min={0}
          step={50}
          trailing="$"
          supportingText="Roughly 7.65% of your SE net earnings × 0.9235. Schedule SE line 13."
        />
        <TextField
          label="Student loan interest"
          type="number"
          inputMode="decimal"
          value={studentLoanInterest}
          onChange={(e) => setStudentLoanInterest(Number(e.target.value))}
          min={0}
          max={2500}
          step={50}
          trailing="$"
          supportingText="Capped at $2,500 per return. Phases out at higher income."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Gross income
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-on-surface)]">
              {fmt(gross)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Above-the-line adjustments
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-on-surface)]">
              −{fmt(adjustments)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              AGI (Form 1040 line 11)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(agi)}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Filing status: {filing === "single" ? "Single" : "Married filing jointly"}.
        Student loan interest applied: {fmt(studentLoanApplied)} (capped at $2,500).
        {/* TODO_VERIFY: student loan interest phase-out thresholds for tax year 2025 — IRS Pub 970 */}
        AGI feeds Form 1040 line 11 and is the base for MAGI calculations used in
        Roth IRA limits, ACA subsidies, and itemized-deduction phase-outs.
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
