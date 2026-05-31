"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";

// Median, quartiles, IQR.
//   Sort ascending.
//   n odd : median = x_((n+1)/2)
//   n even: median = (x_(n/2) + x_(n/2+1)) / 2
//   Q1 = median of the lower half (lower half excludes the overall median when n is odd — Tukey hinges).
//   Q3 = median of the upper half (same rule).
//   IQR = Q3 − Q1.
// Source: NIST/SEMATECH e-Handbook §1.3.5.2 — Percentiles and Quartiles.

type DupRule = "include" | "exclude";

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

function medianOf(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  const mid = Math.floor(n / 2);
  return n % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function quartiles(sorted: number[]): { q1: number; q2: number; q3: number; iqr: number; lower: number[]; upper: number[] } {
  const n = sorted.length;
  if (n === 0) return { q1: NaN, q2: NaN, q3: NaN, iqr: NaN, lower: [], upper: [] };
  const q2 = medianOf(sorted);
  // Tukey-hinge halves: when n is odd, drop the middle from both halves.
  const half = Math.floor(n / 2);
  const lower = sorted.slice(0, half);
  const upper = n % 2 === 0 ? sorted.slice(half) : sorted.slice(half + 1);
  const q1 = medianOf(lower);
  const q3 = medianOf(upper);
  return { q1, q2, q3, iqr: q3 - q1, lower, upper };
}

function fmt(n: number, decimals: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
}

export function Calculator() {
  const [raw, setRaw] = useState("3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5");
  const [dupRule, setDupRule] = useState<DupRule>("include");
  const [decimals, setDecimals] = useState(2);

  const { nums, ignored } = useMemo(() => parseNumbers(raw), [raw]);

  const result = useMemo(() => {
    const cleaned = dupRule === "exclude" ? Array.from(new Set(nums)) : nums.slice();
    const sorted = cleaned.slice().sort((a, b) => a - b);
    const n = sorted.length;
    if (n === 0) return null;
    const q = quartiles(sorted);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    return {
      sorted,
      n,
      median: q.q2,
      q1: q.q1,
      q3: q.q3,
      iqr: q.iqr,
      lower: q.lower,
      upper: q.upper,
      mean,
      min: sorted[0],
      max: sorted[n - 1],
    };
  }, [nums, dupRule]);

  const sortedDisplay = result
    ? result.sorted.length > 30
      ? result.sorted.slice(0, 30).map((v) => fmt(v, decimals)).join(", ") + ` … (${result.sorted.length - 30} more)`
      : result.sorted.map((v) => fmt(v, decimals)).join(", ")
    : "—";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div>
        <label htmlFor="data" className="block md-label-large mb-2">
          Numbers
        </label>
        <textarea
          id="data"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={4}
          aria-describedby="data-hint"
          placeholder="3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5"
          className="md-body-large"
        />
        <p id="data-hint" className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
          Paste or type numbers, separated by commas, spaces, tabs, or new lines. Non-numeric tokens are skipped.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Segment
          label="Duplicates"
          value={dupRule}
          onChange={(v) => setDupRule(v as DupRule)}
          options={[
            { value: "include", label: "Keep duplicates" },
            { value: "exclude", label: "Unique only" },
          ]}
        />
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
          <Out label="Median" value={result ? fmt(result.median, decimals) : "—"} emphasized />
          <Out label="Q1 (25th percentile)" value={result ? fmt(result.q1, decimals) : "—"} />
          <Out label="Q3 (75th percentile)" value={result ? fmt(result.q3, decimals) : "—"} />
          <Out label="IQR (Q3 − Q1)" value={result ? fmt(result.iqr, decimals) : "—"} emphasized />
          <Out label="Count (n)" value={result ? `${result.n}` : "—"} />
          <Out label="Range" value={result ? `${fmt(result.min, decimals)} … ${fmt(result.max, decimals)}` : "—"} />
          <Out label="Mean (for comparison)" value={result ? fmt(result.mean, decimals) : "—"} />
        </div>

        <div className="mt-4 border-t border-[var(--md-sys-color-outline-variant)] pt-3">
          <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
            Sorted ascending
          </p>
          <p className="mt-1 md-body-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums break-words">
            {sortedDisplay}
          </p>
        </div>
      </Card>

      {ignored.length > 0 ? (
        <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          Ignored {ignored.length} non-numeric token{ignored.length === 1 ? "" : "s"}:{" "}
          <code>{ignored.slice(0, 6).join(", ")}{ignored.length > 6 ? " …" : ""}</code>
        </p>
      ) : null}

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Quartiles use the Tukey-hinge method: when the count is odd, the overall median is excluded from both halves before finding Q1 and Q3. Other conventions exist (Moore &amp; McCabe, Mendenhall &amp; Sincich); for most datasets the differences are small.
      </p>
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
