"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Standard normal CDF via the Hastings polynomial approximation
// (Abramowitz & Stegun 26.2.17 — accurate to ~7.5e-8 for z >= 0).
// p_one_tailed = 1 - Phi(|Z|)
// p_two_tailed = 2 * (1 - Phi(|Z|))
// Source: Abramowitz & Stegun, Handbook of Mathematical Functions, p. 932.
// https://personal.math.ubc.ca/~cbm/aands/page_932.htm

const SQRT_2PI = Math.sqrt(2 * Math.PI);

function standardNormalPdf(z: number) {
  return Math.exp(-(z * z) / 2) / SQRT_2PI;
}

// 1 - Phi(z) for z >= 0 — the upper-tail probability.
function upperTail(z: number) {
  if (!Number.isFinite(z)) return NaN;
  const az = Math.abs(z);
  // TODO_VERIFY: Hastings coefficients (A&S 26.2.17) — confirm constants on every rebuild.
  // Source: https://personal.math.ubc.ca/~cbm/aands/page_932.htm
  const p = 0.2316419;
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const t = 1 / (1 + p * az);
  const poly = b1 * t + b2 * t ** 2 + b3 * t ** 3 + b4 * t ** 4 + b5 * t ** 5;
  return standardNormalPdf(az) * poly;
}

function pOneTailed(z: number) {
  return upperTail(z);
}
function pTwoTailed(z: number) {
  return 2 * upperTail(z);
}

type Tail = "two" | "one";

function significanceBand(p: number): { label: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(p)) return { label: "—", tone: "ok" };
  if (p < 0.01) return { label: "Significant at α = 0.01", tone: "alert" };
  if (p < 0.05) return { label: "Significant at α = 0.05", tone: "warn" };
  if (p < 0.10) return { label: "Marginal (α = 0.10)", tone: "ok" };
  return { label: "Not significant at α = 0.05", tone: "ok" };
}

function formatP(p: number) {
  if (!Number.isFinite(p)) return "—";
  if (p < 0.0001) return "< 0.0001";
  if (p < 0.001) return p.toExponential(2);
  return p.toFixed(4);
}

export function Calculator() {
  const [tail, setTail] = useState<Tail>("two");
  const [z, setZ] = useState(1.96);

  const { p, band } = useMemo(() => {
    const value = tail === "two" ? pTwoTailed(z) : pOneTailed(z);
    return { p: value, band: significanceBand(value) };
  }, [tail, z]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[band.tone];

  const tailLabel = tail === "two" ? "two-tailed" : "one-tailed";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> A p-value is one piece of evidence — not proof.
        Always report effect size and confidence intervals alongside it.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Tail"
          value={tail}
          onChange={(v) => setTail(v as Tail)}
          options={[
            { value: "two", label: "Two-tailed" },
            { value: "one", label: "One-tailed" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Z-score"
          type="number"
          inputMode="decimal"
          value={z}
          onChange={(e) => setZ(Number(e.target.value))}
          min={-10}
          max={10}
          step={0.01}
          supportingText="Common landmarks: 1.645 (one-tailed α = 0.05), 1.96 (two-tailed α = 0.05), 2.576 (two-tailed α = 0.01)."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              P-value ({tailLabel})
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {formatP(p)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Z-score (absolute)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(z) ? Math.abs(z).toFixed(3) : "—"}
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
        Phi(z) computed via Abramowitz &amp; Stegun 26.2.17 (Hastings) — error under
        7.5 &times; 10<sup>-8</sup> for |z| up to ~6.
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
