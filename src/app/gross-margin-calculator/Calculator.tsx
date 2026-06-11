"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Gross margin math:
//   profit  = price - cost
//   margin% = profit / price * 100
//   markup% = profit / cost  * 100
//   target-price = cost / (1 - margin/100)

type Mode = "from-price" | "from-margin";

function compute(cost: number, price: number) {
  if (!Number.isFinite(cost) || !Number.isFinite(price) || price === 0) {
    return { profit: NaN, margin: NaN, markup: NaN };
  }
  const profit = price - cost;
  const margin = (profit / price) * 100;
  const markup = cost === 0 ? Infinity : (profit / cost) * 100;
  return { profit, margin, markup };
}

function priceFromMargin(cost: number, marginPct: number) {
  if (!Number.isFinite(cost) || !Number.isFinite(marginPct)) return NaN;
  if (marginPct >= 100) return NaN;
  return cost / (1 - marginPct / 100);
}

function fmtMoney(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `$${n.toFixed(2)}`;
}
function fmtPct(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(1)}%`;
}

function marginBand(margin: number): { label: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(margin)) return { label: "—", tone: "ok" };
  if (margin < 0) return { label: "Loss — selling below cost", tone: "alert" };
  if (margin < 20) return { label: "Thin margin (< 20%)", tone: "warn" };
  if (margin < 50) return { label: "Healthy margin (20–50%)", tone: "ok" };
  return { label: "Premium margin (≥ 50%)", tone: "ok" };
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("from-price");
  const [cost, setCost] = useState(40);
  const [price, setPrice] = useState(60);
  const [targetMargin, setTargetMargin] = useState(40);

  const result = useMemo(() => {
    if (mode === "from-price") {
      const { profit, margin, markup } = compute(cost, price);
      return { effectivePrice: price, profit, margin, markup, band: marginBand(margin) };
    }
    const p = priceFromMargin(cost, targetMargin);
    const { profit, margin, markup } = compute(cost, p);
    return { effectivePrice: p, profit, margin, markup, band: marginBand(margin) };
  }, [mode, cost, price, targetMargin]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[result.band.tone];

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "from-price", label: "Cost + Price → Margin" },
            { value: "from-margin", label: "Cost + Target Margin → Price" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Unit cost (COGS)"
          type="number"
          inputMode="decimal"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
          min={0}
          step={0.01}
          leading="$"
          supportingText="Direct cost per unit: materials, production labor, inbound freight."
        />
        {mode === "from-price" ? (
          <TextField
            label="Selling price"
            type="number"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
            step={0.01}
            leading="$"
            supportingText="The price the customer pays, excluding sales tax."
          />
        ) : (
          <TextField
            label="Target gross margin"
            type="number"
            inputMode="decimal"
            value={targetMargin}
            onChange={(e) => setTargetMargin(Number(e.target.value))}
            min={0}
            max={99}
            step={0.1}
            trailing="%"
            supportingText="Margin you want, as a percent of price. Must be below 100%."
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {mode === "from-price" ? "Selling price" : "Target price"}
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtMoney(result.effectivePrice)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Gross profit</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtMoney(result.profit)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Gross margin</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtPct(result.margin)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Markup on cost</p>
            <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-on-surface)]">
              {fmtPct(result.markup)}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{result.band.label}</span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Gross margin only accounts for COGS. Operating expenses, interest, and taxes reduce
        the figure further when you move from gross to net margin.
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
