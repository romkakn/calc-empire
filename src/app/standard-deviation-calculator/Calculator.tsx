"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";

// Standard deviation:
//   sample SD     = sqrt( sum((x - mean)^2) / (n - 1) )   // Bessel's correction
//   population SD = sqrt( sum((x - mean)^2) / n )
//   variance      = SD^2
// Reference: NIST/SEMATECH e-Handbook of Statistical Methods §1.3.6.2 (https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm)

type Mode = "sample" | "population";

function parseNumbers(raw: string): number[] {
  if (!raw) return [];
  // accept commas, spaces, tabs, semicolons, newlines as separators
  return raw
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => Number(t))
    .filter((n) => Number.isFinite(n));
}

function stats(values: number[], mode: Mode) {
  const n = values.length;
  if (n === 0) return { n: 0, mean: NaN, sumSqDev: NaN, variance: NaN, sd: NaN };
  if (mode === "sample" && n < 2) {
    // sample SD undefined for n < 2 — return mean only
    const mean = values[0];
    return { n, mean, sumSqDev: 0, variance: NaN, sd: NaN };
  }
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sumSqDev = values.reduce((acc, x) => acc + (x - mean) ** 2, 0);
  const divisor = mode === "sample" ? n - 1 : n;
  const variance = sumSqDev / divisor;
  const sd = Math.sqrt(variance);
  return { n, mean, sumSqDev, variance, sd };
}

const DEFAULT_INPUT = "2, 4, 4, 4, 5, 5, 7, 9";

export function Calculator() {
  const [mode, setMode] = useState<Mode>("sample");
  const [raw, setRaw] = useState(DEFAULT_INPUT);

  const { values, computed } = useMemo(() => {
    const parsed = parseNumbers(raw);
    return { values: parsed, computed: stats(parsed, mode) };
  }, [raw, mode]);

  const fmt = (x: number, d = 4) =>
    Number.isFinite(x) ? x.toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: 0 }) : "—";

  const modeLabel = mode === "sample" ? "Sample" : "Population";
  const divisorLabel = mode === "sample" ? "n − 1" : "n";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Data type"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "sample", label: "Sample (n − 1)" },
            { value: "population", label: "Population (n)" },
          ]}
        />
      </div>

      <form
        className="grid gap-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div>
          <label
            htmlFor="sd-numbers"
            className="block md-label-large mb-2 text-[var(--md-sys-color-on-surface)]"
          >
            Numbers
          </label>
          <textarea
            id="sd-numbers"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={4}
            inputMode="decimal"
            aria-describedby="sd-numbers-help"
            placeholder="e.g. 2, 4, 4, 4, 5, 5, 7, 9"
            className={[
              "w-full min-h-32 px-4 py-3",
              "rounded-[var(--md-sys-shape-corner-xs)]",
              "border border-[var(--md-sys-color-outline)]",
              "focus:border-2 focus:border-[var(--md-sys-color-primary)] focus:px-[15px] focus:py-[11px]",
              "bg-transparent text-[var(--md-sys-color-on-surface)] caret-[var(--md-sys-color-primary)]",
              "md-body-large outline-none resize-y",
              "font-[var(--md-sys-typescale-mono-font)] tabular-nums",
            ].join(" ")}
          />
          <p
            id="sd-numbers-help"
            className="md-body-small mt-1 ml-4 text-[var(--md-sys-color-on-surface-variant)]"
          >
            Separate with commas, spaces, or new lines. Decimals and negatives allowed.
          </p>
        </div>
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {modeLabel} standard deviation
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(computed.sd, 4)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Variance (SD²)
            </p>
            <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {fmt(computed.variance, 4)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Mean (x̄)
            </p>
            <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {fmt(computed.mean, 4)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Count (n)
            </p>
            <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {computed.n}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Sum of squared deviations
            </p>
            <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {fmt(computed.sumSqDev, 4)}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Formula: SD = sqrt( Σ(x − x̄)² / {divisorLabel} ). Sample SD divides by n − 1 (Bessel&apos;s
        correction) to give an unbiased estimate of the population SD when you only have a sample.
        {values.length > 0 && values.length !== computed.n ? " Non-numeric tokens were skipped." : ""}
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
