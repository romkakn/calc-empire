"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Linear equation in slope-intercept form: y = mx + b
//   From two points (x1, y1) and (x2, y2):
//     m = (y2 - y1) / (x2 - x1)
//     b = y1 - m * x1
//   Solve for y at a given x: y = mx + b
//   Solve for x at a given y: x = (y - b) / m  (m != 0)
// Source: OpenStax Elementary Algebra 2e, Ch. 4.

type Mode = "two-points" | "slope-intercept";
type SolveFor = "y-from-x" | "x-from-y";

function formatCoef(n: number, digits = 3): string {
  if (!Number.isFinite(n)) return "—";
  const rounded = Number(n.toFixed(digits));
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

function equationString(m: number, b: number): string {
  if (!Number.isFinite(m) || !Number.isFinite(b)) return "—";
  const mStr = formatCoef(m);
  const bAbs = Math.abs(b);
  const bStr = formatCoef(bAbs);
  const sign = b >= 0 ? "+" : "−";
  if (m === 0) return `y = ${formatCoef(b)}`;
  if (b === 0) return `y = ${mStr}x`;
  return `y = ${mStr}x ${sign} ${bStr}`;
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("two-points");
  const [solveFor, setSolveFor] = useState<SolveFor>("y-from-x");

  const [x1, setX1] = useState(1);
  const [y1, setY1] = useState(2);
  const [x2, setX2] = useState(3);
  const [y2, setY2] = useState(8);

  const [mInput, setMInput] = useState(3);
  const [bInput, setBInput] = useState(-1);

  const [queryX, setQueryX] = useState(5);
  const [queryY, setQueryY] = useState(14);

  const { m, b, vertical, equation, queryResult, queryLabel } = useMemo(() => {
    let mLocal: number;
    let bLocal: number;
    let isVertical = false;

    if (mode === "two-points") {
      const dx = x2 - x1;
      if (dx === 0) {
        isVertical = true;
        mLocal = NaN;
        bLocal = NaN;
      } else {
        mLocal = (y2 - y1) / dx;
        bLocal = y1 - mLocal * x1;
      }
    } else {
      mLocal = mInput;
      bLocal = bInput;
    }

    const eq = isVertical ? `x = ${formatCoef(x1)}` : equationString(mLocal, bLocal);

    let result: number;
    let label: string;
    if (isVertical) {
      result = NaN;
      label = "Vertical line — slope undefined";
    } else if (solveFor === "y-from-x") {
      result = mLocal * queryX + bLocal;
      label = `y at x = ${formatCoef(queryX)}`;
    } else {
      if (mLocal === 0) {
        result = NaN;
        label = "Horizontal line — every x gives the same y";
      } else {
        result = (queryY - bLocal) / mLocal;
        label = `x at y = ${formatCoef(queryY)}`;
      }
    }

    return { m: mLocal, b: bLocal, vertical: isVertical, equation: eq, queryResult: result, queryLabel: label };
  }, [mode, solveFor, x1, y1, x2, y2, mInput, bInput, queryX, queryY]);

  // Graph: simple inline SVG showing the line on a fixed window x in [-10, 10].
  const graph = useMemo(() => {
    const xMin = -10, xMax = 10, yMin = -10, yMax = 10;
    const W = 320, H = 240, pad = 24;
    const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad);
    const sy = (y: number) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad);

    let line: { x1: number; y1: number; x2: number; y2: number } | null = null;
    if (vertical) {
      const xv = x1;
      if (xv >= xMin && xv <= xMax) {
        line = { x1: sx(xv), y1: sy(yMin), x2: sx(xv), y2: sy(yMax) };
      }
    } else if (Number.isFinite(m) && Number.isFinite(b)) {
      const y_at_xMin = m * xMin + b;
      const y_at_xMax = m * xMax + b;
      line = { x1: sx(xMin), y1: sy(y_at_xMin), x2: sx(xMax), y2: sy(y_at_xMax) };
    }

    return { W, H, pad, sx, sy, line, xMin, xMax, yMin, yMax };
  }, [m, b, vertical, x1]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Input mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "two-points", label: "Two points" },
            { value: "slope-intercept", label: "Slope + intercept" },
          ]}
        />
        <Segment
          label="Solve for"
          value={solveFor}
          onChange={(v) => setSolveFor(v as SolveFor)}
          options={[
            { value: "y-from-x", label: "y from x" },
            { value: "x-from-y", label: "x from y" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {mode === "two-points" ? (
          <>
            <TextField
              label="x₁"
              type="number"
              inputMode="decimal"
              value={x1}
              onChange={(e) => setX1(Number(e.target.value))}
              step={0.1}
            />
            <TextField
              label="y₁"
              type="number"
              inputMode="decimal"
              value={y1}
              onChange={(e) => setY1(Number(e.target.value))}
              step={0.1}
            />
            <TextField
              label="x₂"
              type="number"
              inputMode="decimal"
              value={x2}
              onChange={(e) => setX2(Number(e.target.value))}
              step={0.1}
              supportingText={x1 === x2 ? "Same x as point 1 — line is vertical." : undefined}
            />
            <TextField
              label="y₂"
              type="number"
              inputMode="decimal"
              value={y2}
              onChange={(e) => setY2(Number(e.target.value))}
              step={0.1}
            />
          </>
        ) : (
          <>
            <TextField
              label="Slope (m)"
              type="number"
              inputMode="decimal"
              value={mInput}
              onChange={(e) => setMInput(Number(e.target.value))}
              step={0.1}
              supportingText="Rise over run. 0 = horizontal."
            />
            <TextField
              label="Y-intercept (b)"
              type="number"
              inputMode="decimal"
              value={bInput}
              onChange={(e) => setBInput(Number(e.target.value))}
              step={0.1}
              supportingText="Value of y when x = 0."
            />
          </>
        )}

        {solveFor === "y-from-x" ? (
          <TextField
            label="Query x"
            type="number"
            inputMode="decimal"
            value={queryX}
            onChange={(e) => setQueryX(Number(e.target.value))}
            step={0.1}
            supportingText="Calculator evaluates y at this x."
          />
        ) : (
          <TextField
            label="Query y"
            type="number"
            inputMode="decimal"
            value={queryY}
            onChange={(e) => setQueryY(Number(e.target.value))}
            step={0.1}
            supportingText="Calculator solves for x at this y."
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Equation</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {equation}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Slope (m)</p>
            <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {vertical ? "undefined" : formatCoef(m)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Y-intercept (b)</p>
            <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {vertical ? "n/a" : formatCoef(b)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">{queryLabel}</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(queryResult) ? formatCoef(queryResult) : "—"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)] mb-2">Graph</p>
          <svg
            role="img"
            aria-label={`Graph of ${equation} on x from ${graph.xMin} to ${graph.xMax}`}
            viewBox={`0 0 ${graph.W} ${graph.H}`}
            className="w-full max-w-md h-auto border border-[var(--md-sys-color-outline-variant)] rounded-[var(--md-sys-shape-corner-small)] bg-[var(--md-sys-color-surface)]"
          >
            {/* grid */}
            {Array.from({ length: 11 }).map((_, i) => {
              const x = graph.xMin + i * 2;
              const y = graph.yMin + i * 2;
              return (
                <g key={i}>
                  <line
                    x1={graph.sx(x)} y1={graph.sy(graph.yMin)}
                    x2={graph.sx(x)} y2={graph.sy(graph.yMax)}
                    stroke="var(--md-sys-color-outline-variant)" strokeWidth={0.5}
                  />
                  <line
                    x1={graph.sx(graph.xMin)} y1={graph.sy(y)}
                    x2={graph.sx(graph.xMax)} y2={graph.sy(y)}
                    stroke="var(--md-sys-color-outline-variant)" strokeWidth={0.5}
                  />
                </g>
              );
            })}
            {/* axes */}
            <line
              x1={graph.sx(graph.xMin)} y1={graph.sy(0)}
              x2={graph.sx(graph.xMax)} y2={graph.sy(0)}
              stroke="var(--md-sys-color-on-surface-variant)" strokeWidth={1}
            />
            <line
              x1={graph.sx(0)} y1={graph.sy(graph.yMin)}
              x2={graph.sx(0)} y2={graph.sy(graph.yMax)}
              stroke="var(--md-sys-color-on-surface-variant)" strokeWidth={1}
            />
            {/* line */}
            {graph.line && (
              <line
                x1={graph.line.x1} y1={graph.line.y1}
                x2={graph.line.x2} y2={graph.line.y2}
                stroke="var(--md-sys-color-primary)" strokeWidth={2}
              />
            )}
            {/* points (two-points mode) */}
            {mode === "two-points" && (
              <>
                {x1 >= graph.xMin && x1 <= graph.xMax && y1 >= graph.yMin && y1 <= graph.yMax && (
                  <circle cx={graph.sx(x1)} cy={graph.sy(y1)} r={4} fill="var(--md-sys-color-secondary)" />
                )}
                {x2 >= graph.xMin && x2 <= graph.xMax && y2 >= graph.yMin && y2 <= graph.yMax && (
                  <circle cx={graph.sx(x2)} cy={graph.sy(y2)} r={4} fill="var(--md-sys-color-secondary)" />
                )}
              </>
            )}
          </svg>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Graph window is fixed at x and y from −10 to 10. The line is plotted across that range using y = mx + b.
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
