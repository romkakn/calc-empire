"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Percent-off math (plain retail arithmetic):
//   savings        = original × (percent ÷ 100)
//   sale price     = original − savings
//   effective paid = 100 − percent
// Reference: FTC Guides Against Deceptive Pricing (16 CFR Part 233).

type Rounding = "cent" | "whole";

function round(value: number, mode: Rounding) {
  if (!Number.isFinite(value)) return NaN;
  if (mode === "whole") return Math.round(value);
  return Math.round(value * 100) / 100;
}

function fmt(value: number) {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function Calculator() {
  const [original, setOriginal] = useState(79.99);
  const [percent, setPercent] = useState(25);
  const [rounding, setRounding] = useState<Rounding>("cent");

  const { savings, salePrice, paidPct } = useMemo(() => {
    const pct = Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : NaN;
    const raw = (Number.isFinite(original) ? original : NaN) * (pct / 100);
    const s = round(raw, rounding);
    const price = round((Number.isFinite(original) ? original : NaN) - s, rounding);
    return {
      savings: s,
      salePrice: price,
      paidPct: Number.isFinite(pct) ? 100 - pct : NaN,
    };
  }, [original, percent, rounding]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Original price"
          type="number"
          inputMode="decimal"
          value={original}
          onChange={(e) => setOriginal(Number(e.target.value))}
          min={0}
          step={0.01}
          leading="$"
          supportingText="Pre-discount tag price in US dollars."
        />
        <TextField
          label="Percent off"
          type="number"
          inputMode="decimal"
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value))}
          min={0}
          max={100}
          step={0.1}
          trailing="%"
          supportingText="Discount on the sale sign — e.g., 25 for 25% off."
        />
      </form>

      <div className="mt-4 flex flex-wrap gap-3">
        <Segment
          label="Rounding"
          value={rounding}
          onChange={(v) => setRounding(v as Rounding)}
          options={[
            { value: "cent", label: "Nearest cent" },
            { value: "whole", label: "Whole dollar" },
          ]}
        />
      </div>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">You save</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(savings)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Sale price
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(salePrice)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              You pay this share of the tag
            </p>
            <p className="mt-1 md-title-medium tabular-nums">
              {Number.isFinite(paidPct) ? `${paidPct.toFixed(1)}%` : "—"}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Sales tax is not included — most US states apply tax to the discounted price.
        Receipts may differ by a cent due to store-side rounding rules.
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
