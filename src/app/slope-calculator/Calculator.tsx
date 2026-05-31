"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Slope of a line through two points (P1, P2):
//   m = (y2 - y1) / (x2 - x1)
//   b = y1 - m * x1
//   Equation: y = m * x + b
// Vertical line (x1 === x2) has undefined slope.
// Horizontal line (y1 === y2) has slope 0.

type Mode = "points" | "slope-point";

function gcd(a: number, b: number): number {
  const x = Math.abs(Math.round(a));
  const y = Math.abs(Math.round(b));
  if (y === 0) return x;
  return gcd(y, x % y);
}

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-12) return "0";
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(4).replace(/\.?0+$/, "");
}

function formatSlopeFraction(rise: number, run: number): string {
  if (!Number.isFinite(rise) || !Number.isFinite(run)) return "—";
  if (run === 0) return "undefined";
  if (rise === 0) return "0";
  if (Number.isInteger(rise) && Number.isInteger(run)) {
    const d = gcd(rise, run);
    const r = rise / d;
    const u = run / d;
    if (u === 1) return `${r}`;
    if (u === -1) return `${-r}`;
    return u < 0 ? `${-r}/${-u}` : `${r}/${u}`;
  }
  return formatNumber(rise / run);
}

function formatEquation(m: number, b: number): string {
  if (!Number.isFinite(m)) return "x = constant (vertical line)";
  if (m === 0) return `y = ${formatNumber(b)}`;
  const mPart =
    m === 1 ? "x" : m === -1 ? "-x" : `${formatNumber(m)}x`;
  if (b === 0) return `y = ${mPart}`;
  const sign = b > 0 ? "+" : "-";
  return `y = ${mPart} ${sign} ${formatNumber(Math.abs(b))}`;
}

function describeSlope(m: number, run: number): {
  label: string;
  tone: "ok" | "warn" | "alert";
} {
  if (run === 0) return { label: "Undefined slope (vertical line)", tone: "alert" };
  if (!Number.isFinite(m)) return { label: "—", tone: "ok" };
  if (m === 0) return { label: "Zero slope (horizontal line)", tone: "warn" };
  if (m > 0) return { label: "Positive slope (line rises left → right)", tone: "ok" };
  return { label: "Negative slope (line falls left → right)", tone: "ok" };
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("points");
  // Two-points inputs (defaults from worked example)
  const [x1, setX1] = useState(1);
  const [y1, setY1] = useState(2);
  const [x2, setX2] = useState(4);
  const [y2, setY2] = useState(8);
  // Slope + point inputs
  const [mIn, setMIn] = useState(2);
  const [xp, setXp] = useState(1);
  const [yp, setYp] = useState(2);

  const result = useMemo(() => {
    if (mode === "points") {
      const rise = y2 - y1;
      const run = x2 - x1;
      const m = run === 0 ? NaN : rise / run;
      const b = run === 0 ? NaN : y1 - m * x1;
      return {
        rise,
        run,
        m,
        b,
        slopeFraction: formatSlopeFraction(rise, run),
        equation: run === 0 ? `x = ${formatNumber(x1)}` : formatEquation(m, b),
        description: describeSlope(m, run),
      };
    }
    const b = yp - mIn * xp;
    return {
      rise: NaN,
      run: 1,
      m: mIn,
      b,
      slopeFraction: formatNumber(mIn),
      equation: formatEquation(mIn, b),
      description: describeSlope(mIn, 1),
    };
  }, [mode, x1, y1, x2, y2, mIn, xp, yp]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[result.description.tone];

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Input mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "points", label: "Two points" },
            { value: "slope-point", label: "Slope + point" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {mode === "points" ? (
          <>
            <TextField
              label="x₁"
              type="number"
              inputMode="decimal"
              value={x1}
              onChange={(e) => setX1(Number(e.target.value))}
              step={1}
              supportingText="First point x-coordinate"
            />
            <TextField
              label="y₁"
              type="number"
              inputMode="decimal"
              value={y1}
              onChange={(e) => setY1(Number(e.target.value))}
              step={1}
              supportingText="First point y-coordinate"
            />
            <TextField
              label="x₂"
              type="number"
              inputMode="decimal"
              value={x2}
              onChange={(e) => setX2(Number(e.target.value))}
              step={1}
              supportingText="Second point x-coordinate"
            />
            <TextField
              label="y₂"
              type="number"
              inputMode="decimal"
              value={y2}
              onChange={(e) => setY2(Number(e.target.value))}
              step={1}
              supportingText="Second point y-coordinate"
            />
          </>
        ) : (
          <>
            <TextField
              label="Slope m"
              type="number"
              inputMode="decimal"
              value={mIn}
              onChange={(e) => setMIn(Number(e.target.value))}
              step={0.1}
              supportingText="Rise over run"
            />
            <div className="hidden sm:block" aria-hidden />
            <TextField
              label="Point x"
              type="number"
              inputMode="decimal"
              value={xp}
              onChange={(e) => setXp(Number(e.target.value))}
              step={1}
            />
            <TextField
              label="Point y"
              type="number"
              inputMode="decimal"
              value={yp}
              onChange={(e) => setYp(Number(e.target.value))}
              step={1}
            />
          </>
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
              Slope (m)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {result.slopeFraction}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              y-intercept (b)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {formatNumber(result.b)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Equation
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {result.equation}
            </p>
          </div>
          {mode === "points" && (
            <div className="sm:col-span-2 md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
              Rise = y₂ − y₁ = {formatNumber(result.rise)} · Run = x₂ − x₁ ={" "}
              {formatNumber(result.run)}
            </div>
          )}
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{result.description.label}</span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Slope measures steepness — how much y changes for each one-unit change in
        x. A vertical line has no defined slope because run is zero.
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
