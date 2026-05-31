"use client";

import { useId, useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";

// Averages: mean, median, mode of a list of numbers.
//   mean   = sum / count
//   median = middle value of the sorted list (average of the two middles if count is even)
//   mode   = the value(s) that appear most often; report "no mode" when all values tie
// Weighted mean: sum(value_i * weight_i) / sum(weight_i)

type Mode = "basic" | "weighted";

function parseNumbers(raw: string): number[] {
  return raw
    .split(/[\s,;\n\t]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n));
}

function median(xs: number[]): number {
  if (xs.length === 0) return NaN;
  const sorted = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function modes(xs: number[]): { values: number[]; freq: number } {
  if (xs.length === 0) return { values: [], freq: 0 };
  const counts = new Map<number, number>();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  let max = 0;
  for (const c of counts.values()) if (c > max) max = c;
  const all = [...counts.values()];
  // If every value appears the same number of times, there is no mode.
  if (all.every((c) => c === max)) return { values: [], freq: max };
  const out: number[] = [];
  for (const [v, c] of counts.entries()) if (c === max) out.push(v);
  out.sort((a, b) => a - b);
  return { values: out, freq: max };
}

function weightedMean(values: number[], weights: number[]): number {
  if (values.length === 0 || values.length !== weights.length) return NaN;
  let num = 0;
  let den = 0;
  for (let i = 0; i < values.length; i++) {
    num += values[i] * weights[i];
    den += weights[i];
  }
  return den === 0 ? NaN : num / den;
}

function fmt(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return "—";
  // Trim trailing zeros for readability.
  const fixed = n.toFixed(digits);
  return fixed.replace(/\.?0+$/, "");
}

const DEFAULT_NUMBERS = "5, 8, 12, 3, 5, 10, 8, 5";

export function Calculator() {
  const [mode, setMode] = useState<Mode>("basic");
  const [raw, setRaw] = useState(DEFAULT_NUMBERS);
  const [weightsRaw, setWeightsRaw] = useState("1, 1, 1, 1, 1, 1, 1, 1");

  const result = useMemo(() => {
    const values = parseNumbers(raw);
    if (values.length === 0) {
      return {
        count: 0,
        sum: NaN,
        mean: NaN,
        median: NaN,
        mode: { values: [] as number[], freq: 0 },
        weighted: NaN,
        weightsCount: 0,
      };
    }
    const weights = parseNumbers(weightsRaw);
    const sum = values.reduce((a, b) => a + b, 0);
    return {
      count: values.length,
      sum,
      mean: sum / values.length,
      median: median(values),
      mode: modes(values),
      weighted: weightedMean(values, weights),
      weightsCount: weights.length,
    };
  }, [raw, weightsRaw]);

  const modeLabel =
    result.mode.values.length === 0
      ? result.count === 0
        ? "—"
        : "No mode (all values tie)"
      : `${result.mode.values.map((v) => fmt(v, 4)).join(", ")} (appears ${result.mode.freq}×)`;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "basic", label: "Mean / median / mode" },
            { value: "weighted", label: "Weighted average" },
          ]}
        />
      </div>

      <form
        className="grid gap-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextAreaField
          rows={4}
          label="Numbers"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          supportingText="Separate with commas, spaces, or new lines. Decimals and negatives are fine."
        />

        {mode === "weighted" && (
          <TextAreaField
            rows={3}
            label="Weights"
            value={weightsRaw}
            onChange={(e) => setWeightsRaw(e.target.value)}
            supportingText="One weight per number, in the same order. Equal-length lists required."
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div
          role="status"
          aria-live="polite"
          className="grid gap-x-6 gap-y-4 sm:grid-cols-2"
        >
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Count
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {result.count}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Sum
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(result.sum)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Mean (arithmetic average)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(result.mean)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Median (middle value)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(result.median)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Mode (most frequent)
            </p>
            <p className="mt-1 md-title-medium tabular-nums text-[var(--md-sys-color-primary)]">
              {modeLabel}
            </p>
          </div>
          {mode === "weighted" && (
            <div className="sm:col-span-2">
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                Weighted mean
              </p>
              <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                {result.weightsCount === result.count ? fmt(result.weighted) : "—"}
              </p>
              {result.weightsCount !== result.count && (
                <p className="md-body-small mt-1 text-[var(--md-sys-color-error)]">
                  Weights list has {result.weightsCount} entries; numbers list has {result.count}. Match the counts.
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Mean is sensitive to outliers; median is not. When the dataset is skewed,
        the median is often the better summary.
      </p>
    </Card>
  );
}

function TextAreaField({
  label,
  supportingText,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  supportingText?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}) {
  const id = useId();
  const helpId = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="md-label-medium block mb-1 text-[var(--md-sys-color-on-surface-variant)]"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        aria-describedby={supportingText ? helpId : undefined}
        className={[
          "w-full px-4 py-3 bg-transparent",
          "rounded-[var(--md-sys-shape-corner-xs)]",
          "border border-[var(--md-sys-color-outline)] outline-none",
          "focus:border-2 focus:border-[var(--md-sys-color-primary)] focus:px-[15px] focus:py-[11px]",
          "text-[var(--md-sys-color-on-surface)] caret-[var(--md-sys-color-primary)]",
          "md-body-large",
          "font-[var(--md-sys-typescale-mono-font)] tabular-nums",
        ].join(" ")}
      />
      {supportingText ? (
        <p
          id={helpId}
          className="md-body-small mt-1 ml-4 text-[var(--md-sys-color-on-surface-variant)]"
        >
          {supportingText}
        </p>
      ) : null}
    </div>
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
