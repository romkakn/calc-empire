"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// 2025 federal income-tax brackets (IRS Rev. Proc. 2024-40).
// TODO_VERIFY: confirm 2025 single + MFJ brackets at IRS Rev. Proc. 2024-40
// https://www.irs.gov/pub/irs-drop/rp-24-40.pdf
const BRACKETS_2025 = {
  single: [
    { upTo: 11925, rate: 0.10 },
    { upTo: 48475, rate: 0.12 },
    { upTo: 103350, rate: 0.22 },
    { upTo: 197300, rate: 0.24 },
    { upTo: 250525, rate: 0.32 },
    { upTo: 626350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  mfj: [
    { upTo: 23850, rate: 0.10 },
    { upTo: 96950, rate: 0.12 },
    { upTo: 206700, rate: 0.22 },
    { upTo: 394600, rate: 0.24 },
    { upTo: 501050, rate: 0.32 },
    { upTo: 751600, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  hoh: [
    { upTo: 17000, rate: 0.10 },
    { upTo: 64850, rate: 0.12 },
    { upTo: 103350, rate: 0.22 },
    { upTo: 197300, rate: 0.24 },
    { upTo: 250500, rate: 0.32 },
    { upTo: 626350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};

// 2025 standard deduction. TODO_VERIFY: IRS Rev. Proc. 2024-40
// https://www.irs.gov/pub/irs-drop/rp-24-40.pdf
const STD_DEDUCTION_2025 = { single: 15000, mfj: 30000, hoh: 22500 };

// FICA: 6.2% Social Security up to wage base, 1.45% Medicare, no cap.
// 2025 SS wage base $176,100 — SSA Fact Sheet.
// TODO_VERIFY: https://www.ssa.gov/oact/cola/cbb.html
const SS_RATE = 0.062;
const SS_WAGE_BASE_2025 = 176100;
const MEDICARE_RATE = 0.0145;

type FilingStatus = "single" | "mfj" | "hoh";
type RaiseMode = "pct" | "dollar";

function federalTax(taxable: number, status: FilingStatus): number {
  if (taxable <= 0) return 0;
  const brackets = BRACKETS_2025[status];
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    const slice = Math.min(taxable, b.upTo) - prev;
    if (slice > 0) tax += slice * b.rate;
    if (taxable <= b.upTo) break;
    prev = b.upTo;
  }
  return tax;
}

function ficaTax(gross: number): number {
  const ss = Math.min(gross, SS_WAGE_BASE_2025) * SS_RATE;
  const medicare = gross * MEDICARE_RATE;
  return ss + medicare;
}

function netFromGross(gross: number, status: FilingStatus, stateRate: number) {
  const taxable = Math.max(0, gross - STD_DEDUCTION_2025[status]);
  const fed = federalTax(taxable, status);
  const fica = ficaTax(gross);
  const state = Math.max(0, gross * (stateRate / 100));
  const net = gross - fed - fica - state;
  return { net, fed, fica, state, taxable };
}

export function Calculator() {
  const [gross, setGross] = useState(60000);
  const [raiseMode, setRaiseMode] = useState<RaiseMode>("pct");
  const [raisePct, setRaisePct] = useState(5);
  const [raiseAmt, setRaiseAmt] = useState(3000);
  const [status, setStatus] = useState<FilingStatus>("single");
  const [stateRate, setStateRate] = useState(5);

  const result = useMemo(() => {
    const safeGross = Number.isFinite(gross) && gross > 0 ? gross : 0;
    const raiseDollars =
      raiseMode === "pct" ? safeGross * (raisePct / 100) : raiseAmt;
    const newGross = safeGross + raiseDollars;
    const current = netFromGross(safeGross, status, stateRate);
    const updated = netFromGross(newGross, status, stateRate);
    const deltaGross = newGross - safeGross;
    const deltaNet = updated.net - current.net;
    const keepRate = deltaGross > 0 ? deltaNet / deltaGross : 0;
    const newEffective = newGross > 0 ? (updated.fed + updated.fica + updated.state) / newGross : 0;
    return {
      newGross,
      currentNet: current.net,
      newNet: updated.net,
      deltaGross,
      deltaNet,
      keepRate,
      newEffective,
    };
  }, [gross, raiseMode, raisePct, raiseAmt, status, stateRate]);

  const fmtMoney = (n: number) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
      : "—";
  const fmtPct = (n: number) =>
    Number.isFinite(n) ? `${(n * 100).toFixed(1)}%` : "—";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Estimate only.</strong> Withholding, pre-tax benefits (401k, HSA),
        and local taxes will shift the actual take-home. Talk to an enrolled agent
        or CPA before big decisions.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Raise type"
          value={raiseMode}
          onChange={(v) => setRaiseMode(v as RaiseMode)}
          options={[
            { value: "pct", label: "Percent" },
            { value: "dollar", label: "Dollar amount" },
          ]}
        />
        <Segment
          label="Filing status"
          value={status}
          onChange={(v) => setStatus(v as FilingStatus)}
          options={[
            { value: "single", label: "Single" },
            { value: "mfj", label: "Married jointly" },
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
          label="Current gross annual"
          type="number"
          inputMode="decimal"
          value={gross}
          onChange={(e) => setGross(Number(e.target.value))}
          min={0}
          step={500}
          trailing="$"
          supportingText="Pre-tax salary, before benefits."
        />
        {raiseMode === "pct" ? (
          <TextField
            label="Raise percent"
            type="number"
            inputMode="decimal"
            value={raisePct}
            onChange={(e) => setRaisePct(Number(e.target.value))}
            min={0}
            max={100}
            step={0.1}
            trailing="%"
            supportingText="US merit raises averaged ~3.5–4% in 2024 (SHRM)."
          />
        ) : (
          <TextField
            label="Raise dollar amount"
            type="number"
            inputMode="decimal"
            value={raiseAmt}
            onChange={(e) => setRaiseAmt(Number(e.target.value))}
            min={0}
            step={100}
            trailing="$"
          />
        )}
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
          supportingText="Flat estimate. Use 0 for TX, FL, WA, NV, TN, SD, WY, AK."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div
          role="status"
          aria-live="polite"
          className="grid gap-x-6 gap-y-4 sm:grid-cols-2"
        >
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              New gross
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtMoney(result.newGross)}
            </p>
            <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">
              +{fmtMoney(result.deltaGross)} gross
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Net change (take-home)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {result.deltaNet >= 0 ? "+" : ""}
              {fmtMoney(result.deltaNet)}
            </p>
            <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">
              You keep {fmtPct(result.keepRate)} of the raise.
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Current net
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {fmtMoney(result.currentNet)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              New net
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {fmtMoney(result.newNet)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              New effective tax rate
            </p>
            <p className="mt-1 md-title-medium tabular-nums">
              {fmtPct(result.newEffective)}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Uses 2025 federal brackets, standard deduction, and FICA caps. State is a
        flat estimate — local taxes, credits, and pre-tax deductions are ignored.
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
