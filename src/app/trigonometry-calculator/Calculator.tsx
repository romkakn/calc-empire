"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Core trig: sin = opp/hyp, cos = adj/hyp, tan = opp/adj.
// Inverses give angle from ratio. Pythagoras: a² + b² = c².
// JavaScript's Math.sin/cos/tan take radians, so we convert when the user picks degrees.

type Mode = "eval" | "solver";
type Unit = "deg" | "rad";
type FnName = "sin" | "cos" | "tan" | "asin" | "acos" | "atan";
type SideKey = "a" | "b" | "c";

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function toRad(angle: number, unit: Unit) {
  return unit === "deg" ? angle * DEG_TO_RAD : angle;
}
function fromRad(angle: number, unit: Unit) {
  return unit === "deg" ? angle * RAD_TO_DEG : angle;
}

function evalTrig(fn: FnName, value: number, unit: Unit): number {
  if (!Number.isFinite(value)) return NaN;
  switch (fn) {
    case "sin": return Math.sin(toRad(value, unit));
    case "cos": return Math.cos(toRad(value, unit));
    case "tan": return Math.tan(toRad(value, unit));
    case "asin": return fromRad(Math.asin(value), unit);
    case "acos": return fromRad(Math.acos(value), unit);
    case "atan": return fromRad(Math.atan(value), unit);
  }
}

function reciprocalLabel(fn: FnName): string | null {
  if (fn === "sin") return "csc";
  if (fn === "cos") return "sec";
  if (fn === "tan") return "cot";
  return null;
}

type TriangleResult = {
  a: number; b: number; c: number;
  angleA: number; angleB: number;
  ok: boolean;
  message?: string;
};

// Solve a right triangle from any two of (a, b, c).
// a, b = legs; c = hypotenuse. angleA is the angle opposite side a.
function solveRightTriangle(
  known: SideKey, knownVal: number,
  other: SideKey, otherVal: number,
  unit: Unit,
): TriangleResult {
  const empty: TriangleResult = { a: NaN, b: NaN, c: NaN, angleA: NaN, angleB: NaN, ok: false };
  if (known === other) return { ...empty, message: "Pick two different sides." };
  if (!Number.isFinite(knownVal) || !Number.isFinite(otherVal)) return empty;
  if (knownVal <= 0 || otherVal <= 0) return { ...empty, message: "Sides must be positive." };

  let a = NaN, b = NaN, c = NaN;
  const pair = `${known}${other}`;

  if (pair === "ab" || pair === "ba") {
    a = pair === "ab" ? knownVal : otherVal;
    b = pair === "ab" ? otherVal : knownVal;
    c = Math.sqrt(a * a + b * b);
  } else if (pair === "ac" || pair === "ca") {
    a = pair === "ac" ? knownVal : otherVal;
    c = pair === "ac" ? otherVal : knownVal;
    if (c <= a) return { ...empty, message: "Hypotenuse c must be larger than leg a." };
    b = Math.sqrt(c * c - a * a);
  } else if (pair === "bc" || pair === "cb") {
    b = pair === "bc" ? knownVal : otherVal;
    c = pair === "bc" ? otherVal : knownVal;
    if (c <= b) return { ...empty, message: "Hypotenuse c must be larger than leg b." };
    a = Math.sqrt(c * c - b * b);
  }

  const angleA = fromRad(Math.atan2(a, b), unit);
  const angleB = fromRad(Math.atan2(b, a), unit);
  return { a, b, c, angleA, angleB, ok: true };
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("eval");
  const [unit, setUnit] = useState<Unit>("deg");

  // Function eval state
  const [fn, setFn] = useState<FnName>("sin");
  const [angle, setAngle] = useState<number>(30);
  const [ratio, setRatio] = useState<number>(0.5);

  // Right triangle solver state
  const [sideOne, setSideOne] = useState<SideKey>("a");
  const [sideOneVal, setSideOneVal] = useState<number>(3);
  const [sideTwo, setSideTwo] = useState<SideKey>("b");
  const [sideTwoVal, setSideTwoVal] = useState<number>(4);

  const isInverse = fn === "asin" || fn === "acos" || fn === "atan";

  const evalResult = useMemo(() => {
    const input = isInverse ? ratio : angle;
    return evalTrig(fn, input, unit);
  }, [fn, angle, ratio, unit, isInverse]);

  const triangle = useMemo(
    () => solveRightTriangle(sideOne, sideOneVal, sideTwo, sideTwoVal, unit),
    [sideOne, sideOneVal, sideTwo, sideTwoVal, unit],
  );

  const angleUnitLabel = unit === "deg" ? "°" : " rad";
  const reciprocal = reciprocalLabel(fn);
  const recipValue = reciprocal && Number.isFinite(evalResult) && evalResult !== 0 ? 1 / evalResult : NaN;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "eval", label: "Function eval" },
            { value: "solver", label: "Right triangle solver" },
          ]}
        />
        <Segment
          label="Angle unit"
          value={unit}
          onChange={(v) => setUnit(v as Unit)}
          options={[
            { value: "deg", label: "Degrees" },
            { value: "rad", label: "Radians" },
          ]}
        />
      </div>

      {mode === "eval" ? (
        <>
          <div className="mb-4">
            <Segment
              label="Function"
              value={fn}
              onChange={(v) => setFn(v as FnName)}
              options={[
                { value: "sin", label: "sin" },
                { value: "cos", label: "cos" },
                { value: "tan", label: "tan" },
                { value: "asin", label: "arcsin" },
                { value: "acos", label: "arccos" },
                { value: "atan", label: "arctan" },
              ]}
            />
          </div>

          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            {isInverse ? (
              <TextField
                label="Ratio"
                type="number"
                inputMode="decimal"
                value={ratio}
                onChange={(e) => setRatio(Number(e.target.value))}
                step={0.01}
                supportingText="arcsin and arccos accept −1 to 1. arctan accepts any real number."
              />
            ) : (
              <TextField
                label="Angle"
                type="number"
                inputMode="decimal"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                step={unit === "deg" ? 1 : 0.01}
                trailing={unit === "deg" ? "°" : "rad"}
                supportingText={unit === "deg" ? "Try 30, 45, 60, 90." : "π ≈ 3.14159. Try π/6 ≈ 0.5236."}
              />
            )}
          </form>

          <Card variant="filled" className="mt-6 p-4">
            <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                  {fn}({isInverse ? ratio : `${angle}${angleUnitLabel}`})
                </p>
                <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                  {Number.isFinite(evalResult)
                    ? isInverse
                      ? `${evalResult.toFixed(4)}${angleUnitLabel}`
                      : evalResult.toFixed(4)
                    : "—"}
                </p>
              </div>
              {reciprocal && (
                <div>
                  <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                    {reciprocal}({angle}{angleUnitLabel}) = 1 / {fn}
                  </p>
                  <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                    {Number.isFinite(recipValue) ? recipValue.toFixed(4) : "undefined"}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <>
          <p className="md-body-small mb-3 text-[var(--md-sys-color-on-surface-variant)]">
            Right triangle: legs <strong>a</strong> and <strong>b</strong>, hypotenuse <strong>c</strong>. Enter any two sides; the calculator returns the third side and both non-right angles.
          </p>

          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Segment
                label="First side"
                value={sideOne}
                onChange={(v) => setSideOne(v as SideKey)}
                options={[
                  { value: "a", label: "a (leg)" },
                  { value: "b", label: "b (leg)" },
                  { value: "c", label: "c (hyp)" },
                ]}
              />
              <TextField
                label={`Side ${sideOne}`}
                type="number"
                inputMode="decimal"
                value={sideOneVal}
                onChange={(e) => setSideOneVal(Number(e.target.value))}
                min={0}
                step={0.1}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Segment
                label="Second side"
                value={sideTwo}
                onChange={(v) => setSideTwo(v as SideKey)}
                options={[
                  { value: "a", label: "a (leg)" },
                  { value: "b", label: "b (leg)" },
                  { value: "c", label: "c (hyp)" },
                ]}
              />
              <TextField
                label={`Side ${sideTwo}`}
                type="number"
                inputMode="decimal"
                value={sideTwoVal}
                onChange={(e) => setSideTwoVal(Number(e.target.value))}
                min={0}
                step={0.1}
              />
            </div>
          </form>

          <Card variant="filled" className="mt-6 p-4">
            <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {triangle.ok ? (
                <>
                  <div>
                    <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Leg a</p>
                    <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                      {triangle.a.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Leg b</p>
                    <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                      {triangle.b.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Hypotenuse c</p>
                    <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                      {triangle.c.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Angle opposite a</p>
                    <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                      {triangle.angleA.toFixed(2)}{angleUnitLabel}
                    </p>
                  </div>
                  <div>
                    <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Angle opposite b</p>
                    <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                      {triangle.angleB.toFixed(2)}{angleUnitLabel}
                    </p>
                  </div>
                  <div>
                    <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Right angle</p>
                    <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                      {unit === "deg" ? "90.00°" : "1.5708 rad"}
                    </p>
                  </div>
                </>
              ) : (
                <p className="sm:col-span-2 md-body-medium text-[var(--md-sys-color-error)]">
                  {triangle.message ?? "Enter two valid sides."}
                </p>
              )}
            </div>
          </Card>
        </>
      )}

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Angle conversions use π/180. Values are rounded for display; the calculator carries full precision internally.
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
