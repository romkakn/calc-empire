"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Standard TVM equation (END mode / ordinary annuity):
//   FV + PV*(1+r)^n + PMT * ((1+r)^n - 1) / r = 0
// BGN mode (annuity due): PMT term multiplied by (1+r).
// Sign convention: outflows negative, inflows positive (matches HP/TI financial calculators).
// Source: Bodie, Kane & Marcus — Investments (McGraw-Hill); SEC Investor.gov compound interest.

type Unknown = "fv" | "pv" | "pmt" | "rate" | "nper";
type Timing = "end" | "bgn";

function pow1pr(rPct: number, n: number) {
  const r = rPct / 100;
  return Math.pow(1 + r, n);
}

function solveFV(pv: number, pmt: number, ratePct: number, nper: number, timing: Timing) {
  const r = ratePct / 100;
  const f = pow1pr(ratePct, nper);
  if (Math.abs(r) < 1e-10) return -(pv + pmt * nper);
  const annuity = (pmt * (f - 1)) / r * (timing === "bgn" ? 1 + r : 1);
  return -(pv * f + annuity);
}

function solvePV(fv: number, pmt: number, ratePct: number, nper: number, timing: Timing) {
  const r = ratePct / 100;
  const f = pow1pr(ratePct, nper);
  if (Math.abs(r) < 1e-10) return -(fv + pmt * nper);
  const annuity = (pmt * (f - 1)) / r * (timing === "bgn" ? 1 + r : 1);
  return -(fv + annuity) / f;
}

function solvePMT(pv: number, fv: number, ratePct: number, nper: number, timing: Timing) {
  const r = ratePct / 100;
  const f = pow1pr(ratePct, nper);
  if (Math.abs(r) < 1e-10) return -(pv + fv) / nper;
  const adj = timing === "bgn" ? 1 + r : 1;
  return -(fv + pv * f) / ((f - 1) / r * adj);
}

function solveNPER(pv: number, fv: number, pmt: number, ratePct: number, timing: Timing) {
  const r = ratePct / 100;
  if (Math.abs(r) < 1e-10) {
    if (Math.abs(pmt) < 1e-10) return NaN;
    return -(pv + fv) / pmt;
  }
  const adj = timing === "bgn" ? 1 + r : 1;
  const num = (pmt * adj) / r - fv;
  const den = pv + (pmt * adj) / r;
  if (num <= 0 || den <= 0) return NaN;
  return Math.log(num / den) / Math.log(1 + r);
}

// Solve for rate by Newton-Raphson on the TVM residual.
function tvmResidual(rPct: number, pv: number, fv: number, pmt: number, n: number, timing: Timing) {
  const r = rPct / 100;
  const f = Math.pow(1 + r, n);
  if (Math.abs(r) < 1e-10) return pv + fv + pmt * n;
  const adj = timing === "bgn" ? 1 + r : 1;
  return pv * f + fv + (pmt * (f - 1) / r) * adj;
}

function solveRate(pv: number, fv: number, pmt: number, nper: number, timing: Timing) {
  if (nper <= 0) return NaN;
  let rPct = 5;
  for (let i = 0; i < 100; i++) {
    const fVal = tvmResidual(rPct, pv, fv, pmt, nper, timing);
    const h = 1e-5;
    const fPrime = (tvmResidual(rPct + h, pv, fv, pmt, nper, timing) - fVal) / h;
    if (Math.abs(fPrime) < 1e-12) break;
    const next = rPct - fVal / fPrime;
    if (!Number.isFinite(next)) return NaN;
    if (Math.abs(next - rPct) < 1e-8) return next;
    rPct = next;
  }
  return rPct;
}

function fmtMoney(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function Calculator() {
  const [unknown, setUnknown] = useState<Unknown>("fv");
  const [timing, setTiming] = useState<Timing>("end");
  const [pv, setPv] = useState(-10000);
  const [fv, setFv] = useState(0);
  const [pmt, setPmt] = useState(0);
  const [rate, setRate] = useState(5);
  const [nper, setNper] = useState(10);

  const result = useMemo(() => {
    switch (unknown) {
      case "fv":   return { label: "Future value",    value: fmtMoney(solveFV(pv, pmt, rate, nper, timing)) };
      case "pv":   return { label: "Present value",   value: fmtMoney(solvePV(fv, pmt, rate, nper, timing)) };
      case "pmt":  return { label: "Payment",         value: fmtMoney(solvePMT(pv, fv, rate, nper, timing)) };
      case "rate": {
        const r = solveRate(pv, fv, pmt, nper, timing);
        return { label: "Interest rate per period", value: Number.isFinite(r) ? `${r.toFixed(4)}%` : "—" };
      }
      case "nper": {
        const n = solveNPER(pv, fv, pmt, rate, timing);
        return { label: "Number of periods", value: Number.isFinite(n) ? `${n.toFixed(2)}` : "—" };
      }
    }
  }, [unknown, timing, pv, fv, pmt, rate, nper]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not financial advice. Sign convention: outflows
        (deposits, loan payments) negative; inflows (receipts) positive.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Solve for"
          value={unknown}
          onChange={(v) => setUnknown(v as Unknown)}
          options={[
            { value: "fv",   label: "FV" },
            { value: "pv",   label: "PV" },
            { value: "pmt",  label: "PMT" },
            { value: "rate", label: "Rate" },
            { value: "nper", label: "Periods" },
          ]}
        />
        <Segment
          label="Payment timing"
          value={timing}
          onChange={(v) => setTiming(v as Timing)}
          options={[
            { value: "end", label: "END (ordinary)" },
            { value: "bgn", label: "BGN (annuity due)" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {unknown !== "pv" && (
          <TextField
            label="Present value (PV)"
            type="number"
            inputMode="decimal"
            value={pv}
            onChange={(e) => setPv(Number(e.target.value))}
            step={100}
            trailing="$"
            supportingText="Negative = outflow today (deposit). Positive = inflow (loan proceeds)."
          />
        )}
        {unknown !== "fv" && (
          <TextField
            label="Future value (FV)"
            type="number"
            inputMode="decimal"
            value={fv}
            onChange={(e) => setFv(Number(e.target.value))}
            step={100}
            trailing="$"
            supportingText="Target balance at the end. Use 0 for loans paid off in full."
          />
        )}
        {unknown !== "pmt" && (
          <TextField
            label="Payment per period (PMT)"
            type="number"
            inputMode="decimal"
            value={pmt}
            onChange={(e) => setPmt(Number(e.target.value))}
            step={10}
            trailing="$"
            supportingText="Equal payment each period. Use 0 for a pure lump sum."
          />
        )}
        {unknown !== "rate" && (
          <TextField
            label="Interest rate per period"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            min={-50}
            max={100}
            step={0.1}
            trailing="%"
            supportingText="Per-period rate. For monthly compounding, divide annual APR by 12."
          />
        )}
        {unknown !== "nper" && (
          <TextField
            label="Number of periods (n)"
            type="number"
            inputMode="decimal"
            value={nper}
            onChange={(e) => setNper(Number(e.target.value))}
            min={0}
            step={1}
            supportingText="Match the unit of the rate: months if monthly, years if annual."
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">{result.label}</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {result.value}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Equation: PV(1+r)<sup>n</sup> + FV + PMT × ((1+r)<sup>n</sup> − 1)/r × (1 + r if BGN) = 0.
        Rate solved via Newton-Raphson. Matches HP-12C and TI BA II Plus output.
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
