"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Rounding to n decimal places (n can be negative for tens, hundreds, etc.):
//   nearest:  round(x * 10^n) / 10^n
//   up:       ceil (x * 10^n) / 10^n
//   down:     floor(x * 10^n) / 10^n
//   banker's: round-half-to-even per IEEE 754-2019 §5.4.1 (roundTiesToEven)
//   TODO_VERIFY: IEEE 754-2019 §5.4.1 roundTiesToEven — https://standards.ieee.org/ieee/754/6210/

type Mode = "nearest" | "up" | "down" | "bankers";

// Math.round in JS rounds .5 toward +Infinity (not half-to-even), so we use
// a numerically-safe nearest that adds Number.EPSILON to absorb fp noise like
// 1.005 → 1.00499999… that would otherwise round to 1.00 instead of 1.01.
function roundNearest(x: number): number {
  return Math.sign(x) * Math.round(Math.abs(x) + Number.EPSILON);
}

// IEEE 754 round-half-to-even ("banker's"). Halfway cases pick the even neighbor.
function roundBankers(x: number): number {
  const r = Math.round(x);
  const diff = Math.abs(x - Math.trunc(x));
  // Exactly .5 → pick the even one. Otherwise normal rounding.
  if (Math.abs(diff - 0.5) < 1e-9) {
    const floor = Math.floor(x);
    return floor % 2 === 0 ? floor : floor + 1;
  }
  return r;
}

function applyRound(x: number, mode: Mode): number {
  if (mode === "nearest") return roundNearest(x);
  if (mode === "up") return Math.ceil(x);
  if (mode === "down") return Math.floor(x);
  return roundBankers(x);
}

function roundToPlace(x: number, places: number, mode: Mode): number {
  if (!Number.isFinite(x) || !Number.isFinite(places)) return NaN;
  const factor = Math.pow(10, places);
  const scaled = x * factor;
  const rounded = applyRound(scaled, mode);
  return rounded / factor;
}

function placeLabel(places: number): string {
  if (places > 0) return `${places} decimal${places === 1 ? "" : "s"}`;
  if (places === 0) return "integer (ones)";
  if (places === -1) return "nearest 10";
  if (places === -2) return "nearest 100";
  if (places === -3) return "nearest 1,000";
  return `nearest 10^${-places}`;
}

function formatResult(x: number, places: number): string {
  if (!Number.isFinite(x)) return "—";
  // Always show the rounded place fully — negative places mean no decimals.
  const decimals = Math.max(places, 0);
  return x.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function Calculator() {
  const [value, setValue] = useState(3.14159265);
  const [places, setPlaces] = useState(2);
  const [mode, setMode] = useState<Mode>("nearest");

  const { rounded, factor, scaled, intScaled } = useMemo(() => {
    const f = Math.pow(10, places);
    const s = value * f;
    const i = applyRound(s, mode);
    return { rounded: roundToPlace(value, places, mode), factor: f, scaled: s, intScaled: i };
  }, [value, places, mode]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "nearest", label: "Nearest" },
            { value: "up", label: "Up" },
            { value: "down", label: "Down" },
            { value: "bankers", label: "Banker's" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Number"
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          step="any"
          supportingText="Any real number. Negatives allowed."
        />
        <TextField
          label="Round to"
          type="number"
          inputMode="numeric"
          value={places}
          onChange={(e) => setPlaces(Number(e.target.value))}
          min={-9}
          max={12}
          step={1}
          supportingText="Positive = decimal places. 0 = integer. Negative = tens (-1), hundreds (-2), etc."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Rounded result
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {formatResult(rounded, places)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Rounded to
            </p>
            <p className="mt-1 md-title-medium">{placeLabel(places)}</p>
          </div>
          <div className="sm:col-span-2 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
            <p className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {value} × 10<sup>{places}</sup> = {Number.isFinite(scaled) ? scaled : "—"}
            </p>
            <p className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {mode === "nearest" && "round"}
              {mode === "up" && "ceil"}
              {mode === "down" && "floor"}
              {mode === "bankers" && "round-half-to-even"}
              ({Number.isFinite(scaled) ? scaled : "—"}) = {Number.isFinite(intScaled) ? intScaled : "—"}
            </p>
            <p className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(intScaled) ? intScaled : "—"} ÷ {factor} = {formatResult(rounded, places)}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Banker&apos;s rounding is the IEEE 754 default and the rule most spreadsheets, finance
        systems, and statistical packages use to avoid bias on long sums.
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
