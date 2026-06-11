"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Digital SAT section maxes:
//   EBRW: 96 raw questions, scaled 200-800
//   Math: 58 raw questions, scaled 200-800
//   Composite = EBRW scaled + Math scaled, range 400-1600
//
// The College Board does NOT publish a single official curve - each test
// form is equated separately. The breakpoints below approximate an average
// curve seen across released digital SAT practice tests, anchored at the
// floor (0 raw -> 200) and ceiling (max raw -> 800).
// TODO_VERIFY: average digital SAT curve - re-check against latest released
// practice tests. Source: College Board, https://satsuite.collegeboard.org/sat/scores/understanding-scores

const EBRW_MAX = 96;
const MATH_MAX = 58;

// Anchor points: [raw, scaled]. Linear interpolation between anchors.
const EBRW_CURVE: Array<[number, number]> = [
  [0, 200],
  [10, 270],
  [20, 340],
  [30, 410],
  [40, 470],
  [50, 530],
  [60, 590],
  [70, 650],
  [80, 720],
  [88, 770],
  [96, 800],
];

const MATH_CURVE: Array<[number, number]> = [
  [0, 200],
  [5, 260],
  [10, 320],
  [15, 380],
  [20, 440],
  [25, 490],
  [30, 540],
  [35, 590],
  [40, 630],
  [45, 670],
  [50, 700],
  [54, 750],
  [58, 800],
];

function interpolate(raw: number, curve: Array<[number, number]>): number {
  if (!Number.isFinite(raw)) return NaN;
  const clamped = Math.max(0, Math.min(curve[curve.length - 1][0], raw));
  for (let i = 0; i < curve.length - 1; i++) {
    const [r0, s0] = curve[i];
    const [r1, s1] = curve[i + 1];
    if (clamped >= r0 && clamped <= r1) {
      const t = r1 === r0 ? 0 : (clamped - r0) / (r1 - r0);
      return s0 + t * (s1 - s0);
    }
  }
  return curve[curve.length - 1][1];
}

function roundTo10(v: number): number {
  if (!Number.isFinite(v)) return NaN;
  return Math.round(v / 10) * 10;
}

function compositeBand(composite: number): { label: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(composite)) return { label: "—", tone: "ok" };
  if (composite >= 1400) return { label: "Selective range (~ 94th percentile or higher)", tone: "ok" };
  if (composite >= 1200) return { label: "Above average (~ 75th–93rd percentile)", tone: "ok" };
  if (composite >= 1000) return { label: "Near national average (~ 40th–74th percentile)", tone: "warn" };
  return { label: "Below average (< ~ 40th percentile)", tone: "alert" };
}

type Section = "both" | "ebrw" | "math";

export function Calculator() {
  const [section, setSection] = useState<Section>("both");
  const [ebrwRaw, setEbrwRaw] = useState(80);
  const [mathRaw, setMathRaw] = useState(50);

  const { ebrwScaled, mathScaled, composite, band } = useMemo(() => {
    const e = roundTo10(interpolate(ebrwRaw, EBRW_CURVE));
    const m = roundTo10(interpolate(mathRaw, MATH_CURVE));
    const c = (Number.isFinite(e) ? e : 0) + (Number.isFinite(m) ? m : 0);
    return { ebrwScaled: e, mathScaled: m, composite: c, band: compositeBand(c) };
  }, [ebrwRaw, mathRaw]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[band.tone];

  const showEbrw = section === "both" || section === "ebrw";
  const showMath = section === "both" || section === "math";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Estimate only.</strong> The College Board equates every test form
        separately, so your actual scaled score can differ by 20 to 40 points from
        an average-curve estimate.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Sections to score"
          value={section}
          onChange={(v) => setSection(v as Section)}
          options={[
            { value: "both", label: "Both (composite)" },
            { value: "ebrw", label: "EBRW only" },
            { value: "math", label: "Math only" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {showEbrw && (
          <TextField
            label="EBRW raw correct"
            type="number"
            inputMode="numeric"
            value={ebrwRaw}
            onChange={(e) => setEbrwRaw(Number(e.target.value))}
            min={0}
            max={EBRW_MAX}
            step={1}
            trailing={`/ ${EBRW_MAX}`}
            supportingText="Reading and Writing questions answered correctly on the digital SAT."
          />
        )}
        {showMath && (
          <TextField
            label="Math raw correct"
            type="number"
            inputMode="numeric"
            value={mathRaw}
            onChange={(e) => setMathRaw(Number(e.target.value))}
            min={0}
            max={MATH_MAX}
            step={1}
            trailing={`/ ${MATH_MAX}`}
            supportingText="Both Math modules combined on the digital SAT."
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
          {showEbrw && (
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">EBRW scaled</p>
              <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                {Number.isFinite(ebrwScaled) ? ebrwScaled : "—"}
              </p>
            </div>
          )}
          {showMath && (
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Math scaled</p>
              <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                {Number.isFinite(mathScaled) ? mathScaled : "—"}
              </p>
            </div>
          )}
          {section === "both" && (
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Composite</p>
              <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                {Number.isFinite(composite) ? composite : "—"}
              </p>
            </div>
          )}
          {section === "both" && (
            <div className="sm:col-span-3 flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block size-3 rounded-full"
                style={{ backgroundColor: toneColor }}
              />
              <span className="md-title-medium">{band.label}</span>
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Average curve, not an official equating table. Each scaled section is
        reported in 10-point steps. {/* TODO_VERIFY: digital SAT raw-to-scaled curve - https://satsuite.collegeboard.org/sat/scores/understanding-scores */}
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
