"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";

// Sample variance (Bessel-corrected): s² = Σ(xᵢ − x̄)² / (n − 1)
// Population variance:                σ² = Σ(xᵢ − μ)² / N
// Source: NIST/SEMATECH e-Handbook of Statistical Methods, §1.3.5.

function parseNumbers(raw: string): { nums: number[]; ignored: string[] } {
  const tokens = raw.split(/[\s,;\t\n]+/).filter(Boolean);
  const nums: number[] = [];
  const ignored: string[] = [];
  for (const t of tokens) {
    const n = Number(t);
    if (Number.isFinite(n)) nums.push(n);
    else ignored.push(t);
  }
  return { nums, ignored };
}

function stats(nums: number[], sample: boolean) {
  const n = nums.length;
  if (n === 0) return null;
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const sqDev = nums.reduce((a, x) => a + (x - mean) ** 2, 0);
  const div = sample ? n - 1 : n;
  if (sample && n < 2) return { n, mean, sqDev, variance: NaN, sd: NaN, min: Math.min(...nums), max: Math.max(...nums) };
  const variance = sqDev / div;
  const sd = Math.sqrt(variance);
  return {
    n, mean, sqDev, variance, sd,
    min: Math.min(...nums),
    max: Math.max(...nums),
  };
}

function fmt(n: number, decimals: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
}

export function Calculator() {
  const [raw, setRaw] = useState("4, 8, 6, 5, 3");
  const [sample, setSample] = useState(true);
  const [decimals, setDecimals] = useState(4);

  const { nums, ignored } = useMemo(() => parseNumbers(raw), [raw]);
  const s = useMemo(() => stats(nums, sample), [nums, sample]);

  const warn = sample && s && s.n < 2 ? "Sample variance needs at least 2 values." : null;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div>
        <label htmlFor="data" className="block md-label-large mb-2">
          Data values
        </label>
        <textarea
          id="data"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={4}
          aria-describedby="data-hint"
          placeholder="4, 8, 6, 5, 3"
          className="md-body-large"
        />
        <p id="data-hint" className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
          Paste or type numbers, separated by commas, spaces, tabs, or new lines. Non-numeric tokens are skipped.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <fieldset className="inline-flex rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] overflow-hidden">
          <legend className="sr-only">Variance type</legend>
          {[
            { v: true, label: "Sample (n − 1)" },
            { v: false, label: "Population (N)" },
          ].map((opt, i) => (
            <button
              key={String(opt.v)}
              type="button"
              role="radio"
              aria-checked={sample === opt.v}
              onClick={() => setSample(opt.v)}
              className={[
                "min-h-12 px-4 md-label-large",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]",
                sample === opt.v
                  ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                  : "text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
                i === 0 ? "rounded-l-[var(--md-sys-shape-corner-full)]" : "border-l border-[var(--md-sys-color-outline)] rounded-r-[var(--md-sys-shape-corner-full)]",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </fieldset>
        <label className="md-body-medium flex items-center gap-2">
          Decimals
          <input
            type="number"
            value={decimals}
            min={0}
            max={10}
            step={1}
            onChange={(e) => setDecimals(Math.max(0, Math.min(10, Number(e.target.value))))}
            className="w-20"
          />
        </label>
      </div>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
          <Out label="Variance" value={s ? fmt(s.variance, decimals) : "—"} emphasized />
          <Out label="Standard deviation" value={s ? fmt(s.sd, decimals) : "—"} emphasized />
          <Out label="Count (n)" value={s ? `${s.n}` : "—"} />
          <Out label="Mean (x̄)" value={s ? fmt(s.mean, decimals) : "—"} />
          <Out label="Σ(xᵢ − x̄)²" value={s ? fmt(s.sqDev, decimals) : "—"} />
          <Out label="Range" value={s ? `${fmt(s.min, decimals)} … ${fmt(s.max, decimals)}` : "—"} />
        </div>
      </Card>

      {warn ? (
        <p className="mt-3 md-body-small text-[var(--md-sys-color-error)]">{warn}</p>
      ) : null}
      {ignored.length > 0 ? (
        <p className="mt-2 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          Ignored {ignored.length} non-numeric token{ignored.length === 1 ? "" : "s"}: <code>{ignored.slice(0, 6).join(", ")}{ignored.length > 6 ? " …" : ""}</code>
        </p>
      ) : null}
    </Card>
  );
}

function Out({ label, value, emphasized }: { label: string; value: string; emphasized?: boolean }) {
  return (
    <div>
      <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">{label}</p>
      <p className={["mt-1 font-[var(--md-sys-typescale-mono-font)] tabular-nums", emphasized ? "md-headline-small text-[var(--md-sys-color-primary)]" : "md-title-medium"].join(" ")}>
        {value}
      </p>
    </div>
  );
}
