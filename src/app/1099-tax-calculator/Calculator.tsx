"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// 1099 tax estimate:
//   Net SE = gross − expenses − pre-tax retirement
//   SE tax = Net SE × 0.9235 × 0.153  (12.4% SS + 2.9% Medicare)
//     TODO_VERIFY: SE tax rates per IRS Schedule SE 2025 — https://www.irs.gov/forms-pubs/about-schedule-se-form-1040
//   Half SE tax deduction = SE tax / 2
//   Taxable income = Net SE − half SE tax − standard deduction
//   Federal income tax = bracket walk
//   Total = SE tax + federal income tax + (Net SE × state rate)

type FilingStatus = "single" | "mfj" | "hoh";

// 2025 federal tax brackets (TCJA, inflation-adjusted)
// TODO_VERIFY: 2025 federal brackets — IRS Rev. Proc. 2024-40 https://www.irs.gov/pub/irs-drop/rp-24-40.pdf
const BRACKETS_2025: Record<FilingStatus, Array<{ rate: number; cap: number }>> = {
  single: [
    { rate: 0.10, cap: 11925 },
    { rate: 0.12, cap: 48475 },
    { rate: 0.22, cap: 103350 },
    { rate: 0.24, cap: 197300 },
    { rate: 0.32, cap: 250525 },
    { rate: 0.35, cap: 626350 },
    { rate: 0.37, cap: Infinity },
  ],
  mfj: [
    { rate: 0.10, cap: 23850 },
    { rate: 0.12, cap: 96950 },
    { rate: 0.22, cap: 206700 },
    { rate: 0.24, cap: 394600 },
    { rate: 0.32, cap: 501050 },
    { rate: 0.35, cap: 751600 },
    { rate: 0.37, cap: Infinity },
  ],
  hoh: [
    { rate: 0.10, cap: 17000 },
    { rate: 0.12, cap: 64850 },
    { rate: 0.22, cap: 103350 },
    { rate: 0.24, cap: 197300 },
    { rate: 0.32, cap: 250500 },
    { rate: 0.35, cap: 626350 },
    { rate: 0.37, cap: Infinity },
  ],
};

// 2025 standard deduction
// TODO_VERIFY: 2025 standard deductions — IRS Rev. Proc. 2024-40 https://www.irs.gov/pub/irs-drop/rp-24-40.pdf
const STD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 15000,
  mfj: 30000,
  hoh: 22500,
};

function federalIncomeTax(taxable: number, status: FilingStatus): number {
  if (!Number.isFinite(taxable) || taxable <= 0) return 0;
  const brackets = BRACKETS_2025[status];
  let tax = 0;
  let prevCap = 0;
  for (const b of brackets) {
    if (taxable > b.cap) {
      tax += (b.cap - prevCap) * b.rate;
      prevCap = b.cap;
    } else {
      tax += (taxable - prevCap) * b.rate;
      return tax;
    }
  }
  return tax;
}

function fmtMoney(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function Calculator() {
  const [grossIncome, setGrossIncome] = useState(80000);
  const [expenses, setExpenses] = useState(10000);
  const [retirement, setRetirement] = useState(0);
  const [stateRate, setStateRate] = useState(0);
  const [status, setStatus] = useState<FilingStatus>("single");

  const result = useMemo(() => {
    const netSe = Math.max(0, grossIncome - expenses - retirement);
    const seTax = netSe * 0.9235 * 0.153;
    const halfSeTax = seTax / 2;
    const stdDed = STD_DEDUCTION_2025[status];
    const taxable = Math.max(0, netSe - halfSeTax - stdDed);
    const fedTax = federalIncomeTax(taxable, status);
    const stateTax = netSe * (stateRate / 100);
    const total = seTax + fedTax + stateTax;
    const quarterly = total / 4;
    const effectiveRate = grossIncome > 0 ? (total / grossIncome) * 100 : 0;
    return { netSe, seTax, halfSeTax, taxable, fedTax, stateTax, total, quarterly, effectiveRate };
  }, [grossIncome, expenses, retirement, stateRate, status]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not tax advice. Confirm with a CPA or enrolled
        agent before filing — multi-state, QBI phase-outs, and credits are not modeled here.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Filing status"
          value={status}
          onChange={(v) => setStatus(v as FilingStatus)}
          options={[
            { value: "single", label: "Single" },
            { value: "mfj", label: "Married joint" },
            { value: "hoh", label: "Head of household" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Gross 1099 income"
          type="number"
          inputMode="decimal"
          value={grossIncome}
          onChange={(e) => setGrossIncome(Number(e.target.value))}
          min={0}
          step={1000}
          trailing="$"
          supportingText="Total payments received this year before any expenses."
        />
        <TextField
          label="Business expenses"
          type="number"
          inputMode="decimal"
          value={expenses}
          onChange={(e) => setExpenses(Number(e.target.value))}
          min={0}
          step={500}
          trailing="$"
          supportingText="Home office, software, mileage, supplies, etc."
        />
        <TextField
          label="Pre-tax retirement (Solo 401k / SEP-IRA)"
          type="number"
          inputMode="decimal"
          value={retirement}
          onChange={(e) => setRetirement(Number(e.target.value))}
          min={0}
          step={500}
          trailing="$"
          supportingText="Optional. Lowers both SE base and taxable income."
        />
        <TextField
          label="State tax rate"
          type="number"
          inputMode="decimal"
          value={stateRate}
          onChange={(e) => setStateRate(Number(e.target.value))}
          min={0}
          max={15}
          step={0.1}
          trailing="%"
          supportingText="Flat estimate. 0% if you live in a no-income-tax state."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Net SE income</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtMoney(result.netSe)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">SE tax (15.3%)</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtMoney(result.seTax)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Federal income tax</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtMoney(result.fedTax)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">State tax</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtMoney(result.stateTax)}
            </p>
          </div>
          <div className="sm:col-span-2 border-t border-[var(--md-sys-color-outline-variant)] pt-3">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Total tax owed
            </p>
            <p className="mt-1 md-headline-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtMoney(result.total)}
              <span className="md-body-medium ml-2 text-[var(--md-sys-color-on-surface-variant)]">
                ({result.effectiveRate.toFixed(1)}% effective)
              </span>
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Quarterly payment (Form 1040-ES)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-secondary)]">
              {fmtMoney(result.quarterly)} × 4
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        2025 brackets and standard deduction. Half SE tax of {fmtMoney(result.halfSeTax)} already
        deducted from taxable income. QBI deduction, credits, and AMT not modeled.
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
