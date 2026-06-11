"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Z-score formula: z = (x - mean) / sd
// Cumulative standard normal Phi(z) approximated via Hastings polynomial
// (Abramowitz & Stegun 26.2.17), max error ~7.5e-8.
// See NIST e-Handbook of Statistical Methods, section 1.3.6.6.1.

type Output = "zscore" | "probability";

function zScore(x: number, mean: number, sd: number) {
  if (!Number.isFinite(x) || !Number.isFinite(mean) || !Number.isFinite(sd)) return NaN;
  if (sd <= 0) return NaN;
  return (x - mean) / sd;
}

// Phi(z) = P(Z <= z) for standard normal. Hastings polynomial approximation.
function phi(z: number): number {
  if (!Number.isFinite(z)) return NaN;
  // Symmetry: Phi(-z) = 1 - Phi(z)
  const sign = z < 0 ? -1 : 1;
  const az = Math.abs(z);
  // Abramowitz & Stegun 26.2.17 constants
  const p = 0.2316419;
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const t = 1 / (1 + p * az);
  const pdf = Math.exp(-(az * az) / 2) / Math.sqrt(2 * Math.PI);
  const poly = b1 * t + b2 * t ** 2 + b3 * t ** 3 + b4 * t ** 4 + b5 * t ** 5;
  const upperTail = pdf * poly;
  const cdfAbs = 1 - upperTail;
  return sign === 1 ? cdfAbs : 1 - cdfAbs;
}

function bandFor(z: number): { label: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(z)) return { label: "—", tone: "ok" };
  const az = Math.abs(z);
  if (az < 1) return { label: "Within 1 SD (about 68% of values)", tone: "ok" };
  if (az < 2) return { label: "1–2 SD from mean (about 27% of values)", tone: "ok" };
  if (az < 3) return { label: "2–3 SD from mean — unusual", tone: "warn" };
  return { label: "Beyond 3 SD — rare (< 0.3%)", tone: "alert" };
}

export function Calculator() {
  const [output, setOutput] = useState<Output>("zscore");
  const [x, setX] = useState(85);
  const [mean, setMean] = useState(70);
  const [sd, setSd] = useState(10);

  const { z, prob, band, sdValid } = useMemo(() => {
    const zv = zScore(x, mean, sd);
    const pv = phi(zv);
    return { z: zv, prob: pv, band: bandFor(zv), sdValid: sd > 0 };
  }, [x, mean, sd]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[band.tone];

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Assumes a normal distribution.</strong> For small samples or unknown
        population SD, a t-score may fit your data better.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Output"
          value={output}
          onChange={(v) => setOutput(v as Output)}
          options={[
            { value: "zscore", label: "Z-score" },
            { value: "probability", label: "Cumulative probability" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-3"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Raw value (x)"
          type="number"
          inputMode="decimal"
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          step={0.1}
          supportingText="The observation you want to standardise."
        />
        <TextField
          label="Mean (μ)"
          type="number"
          inputMode="decimal"
          value={mean}
          onChange={(e) => setMean(Number(e.target.value))}
          step={0.1}
          supportingText="Population or sample mean."
        />
        <TextField
          label="Standard deviation (σ)"
          type="number"
          inputMode="decimal"
          value={sd}
          onChange={(e) => setSd(Number(e.target.value))}
          min={0}
          step={0.1}
          supportingText={sdValid ? "Must be greater than zero." : "Enter a positive number."}
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Z-score</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(z) ? z.toFixed(4) : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {output === "probability" ? "P(X ≤ x)" : "Cumulative probability"}
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(prob) ? prob.toFixed(4) : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{band.label}</span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Cumulative probability uses the Hastings polynomial approximation of Φ(z),
        max error about 7.5 × 10⁻⁸ (Abramowitz & Stegun 26.2.17).
        {/* TODO_VERIFY: Hastings polynomial constants — see https://personal.math.ubc.ca/~cbm/aands/page_932.htm */}
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
