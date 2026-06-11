"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Linear interpolation between two points (x1, y1) and (x2, y2):
//   y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
// Equivalent lerp form, with t = (x - x1) / (x2 - x1):
//   lerp(t) = y1 + t * (y2 - y1)

type Mode = "standard" | "lerp";

function interpolate(x1: number, y1: number, x2: number, y2: number, x: number) {
  if (!Number.isFinite(x1) || !Number.isFinite(y1) || !Number.isFinite(x2) || !Number.isFinite(y2) || !Number.isFinite(x)) {
    return { y: NaN, t: NaN, slope: NaN, status: "invalid" as const };
  }
  const dx = x2 - x1;
  if (dx === 0) {
    return { y: NaN, t: NaN, slope: NaN, status: "vertical" as const };
  }
  const slope = (y2 - y1) / dx;
  const t = (x - x1) / dx;
  const y = y1 + t * (y2 - y1);
  const inside = (t >= 0 && t <= 1) || (t <= 0 && t >= 1); // covers x1 > x2 case too
  const status = inside ? ("ok" as const) : ("extrapolating" as const);
  return { y, t, slope, status };
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("standard");
  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(10);
  const [x2, setX2] = useState(10);
  const [y2, setY2] = useState(30);
  const [x, setX] = useState(4);
  const [t, setT] = useState(0.4);

  const { result, displayX } = useMemo(() => {
    if (mode === "standard") {
      return { result: interpolate(x1, y1, x2, y2, x), displayX: x };
    }
    // Lerp mode: user picks t directly; compute matching x for display.
    const dx = x2 - x1;
    const xFromT = x1 + t * dx;
    return { result: interpolate(x1, y1, x2, y2, xFromT), displayX: xFromT };
  }, [mode, x1, y1, x2, y2, x, t]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    extrapolating: "var(--md-sys-color-secondary)",
    vertical: "var(--md-sys-color-error)",
    invalid: "var(--md-sys-color-error)",
  }[result.status];

  const statusLabel = {
    ok: "Inside the known range — interpolating.",
    extrapolating: "Outside the known range — extrapolating. Treat with caution.",
    vertical: "x1 equals x2 — slope is undefined. Pick distinct x values.",
    invalid: "Enter numeric values for every field.",
  }[result.status];

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Input mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "standard", label: "Target x" },
            { value: "lerp", label: "Lerp t (0–1)" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="x1"
          type="number"
          inputMode="decimal"
          value={x1}
          onChange={(e) => setX1(Number(e.target.value))}
          step={0.1}
          supportingText="First known x"
        />
        <TextField
          label="y1"
          type="number"
          inputMode="decimal"
          value={y1}
          onChange={(e) => setY1(Number(e.target.value))}
          step={0.1}
          supportingText="First known y"
        />
        <TextField
          label="x2"
          type="number"
          inputMode="decimal"
          value={x2}
          onChange={(e) => setX2(Number(e.target.value))}
          step={0.1}
          supportingText="Second known x"
        />
        <TextField
          label="y2"
          type="number"
          inputMode="decimal"
          value={y2}
          onChange={(e) => setY2(Number(e.target.value))}
          step={0.1}
          supportingText="Second known y"
        />
        {mode === "standard" ? (
          <TextField
            label="Target x"
            type="number"
            inputMode="decimal"
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
            step={0.1}
            supportingText="The x you want y for. Keep between x1 and x2 to interpolate."
          />
        ) : (
          <TextField
            label="t (0 to 1)"
            type="number"
            inputMode="decimal"
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
            step={0.01}
            min={0}
            max={1}
            supportingText="0 returns y1, 1 returns y2, 0.5 is the midpoint."
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Interpolated y
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(result.y) ? result.y.toFixed(4).replace(/\.?0+$/, "") : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Point on the line
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(result.y) && Number.isFinite(displayX)
                ? `(${displayX.toFixed(2).replace(/\.?0+$/, "")}, ${result.y.toFixed(2).replace(/\.?0+$/, "")})`
                : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Fraction t
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(result.t) ? result.t.toFixed(3) : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Slope (y2 − y1)/(x2 − x1)
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(result.slope) ? result.slope.toFixed(3) : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{statusLabel}</span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Linear interpolation assumes a straight line between the two points. For curved data, prefer cubic or spline methods.
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
