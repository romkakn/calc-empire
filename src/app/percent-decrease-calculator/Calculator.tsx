"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Percent change between two numbers:
//   percent change = (new - old) / old * 100
//   absolute change = new - old
// Negative result = decrease. Positive result = increase.
// Undefined when old = 0 (cannot divide by zero).

type Precision = "0" | "1" | "2";

function percentChange(oldVal: number, newVal: number) {
  if (!Number.isFinite(oldVal) || !Number.isFinite(newVal)) return NaN;
  if (oldVal === 0) return NaN;
  return ((newVal - oldVal) / oldVal) * 100;
}

function absoluteChange(oldVal: number, newVal: number) {
  if (!Number.isFinite(oldVal) || !Number.isFinite(newVal)) return NaN;
  return newVal - oldVal;
}

function direction(pct: number): { label: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(pct)) return { label: "—", tone: "ok" };
  if (pct === 0) return { label: "No change", tone: "ok" };
  if (pct < 0) return { label: "Decrease", tone: "alert" };
  return { label: "Increase", tone: "ok" };
}

export function Calculator() {
  const [oldVal, setOldVal] = useState(120);
  const [newVal, setNewVal] = useState(90);
  const [precision, setPrecision] = useState<Precision>("2");

  const { pct, abs, dir } = useMemo(() => {
    const p = percentChange(oldVal, newVal);
    const a = absoluteChange(oldVal, newVal);
    return { pct: p, abs: a, dir: direction(p) };
  }, [oldVal, newVal]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[dir.tone];

  const digits = Number(precision);
  const pctDisplay = Number.isFinite(pct) ? `${pct.toFixed(digits)}%` : "—";
  const absSizeDisplay = Number.isFinite(abs) ? Math.abs(abs).toFixed(digits) : "—";
  const sizeLabel = Number.isFinite(pct)
    ? pct < 0
      ? `${Math.abs(pct).toFixed(digits)}% decrease`
      : pct > 0
      ? `${pct.toFixed(digits)}% increase`
      : "0% — no change"
    : "—";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Decimal places"
          value={precision}
          onChange={(v) => setPrecision(v as Precision)}
          options={[
            { value: "0", label: "0" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Original value"
          type="number"
          inputMode="decimal"
          value={oldVal}
          onChange={(e) => setOldVal(Number(e.target.value))}
          step={0.01}
          supportingText="The starting (old) number. Used as the denominator."
        />
        <TextField
          label="New value"
          type="number"
          inputMode="decimal"
          value={newVal}
          onChange={(e) => setNewVal(Number(e.target.value))}
          step={0.01}
          supportingText="The ending (new) number to compare against."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Percent change</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {pctDisplay}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Absolute change
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(abs) ? (abs < 0 ? `−${absSizeDisplay}` : abs > 0 ? `+${absSizeDisplay}` : "0") : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{dir.label} — {sizeLabel}</span>
          </div>
        </div>
      </Card>

      {oldVal === 0 && (
        <p className="md-body-small mt-3 text-[var(--md-sys-color-error)]">
          Percent change is undefined when the original value is zero. Enter a non-zero baseline.
        </p>
      )}

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Formula: (new − old) / old × 100. Negative result = decrease, positive = increase. Absolute change is the raw difference in the original units.
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
