"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Pythagorean theorem (right triangles only):
//   a^2 + b^2 = c^2
// Solving for each side:
//   c = sqrt(a^2 + b^2)
//   a = sqrt(c^2 - b^2)   (requires c > b)
//   b = sqrt(c^2 - a^2)   (requires c > a)

type SolveFor = "c" | "a" | "b";

function solveHypotenuse(a: number, b: number) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  if (a <= 0 || b <= 0) return NaN;
  return Math.sqrt(a * a + b * b);
}
function solveLeg(c: number, other: number) {
  if (!Number.isFinite(c) || !Number.isFinite(other)) return NaN;
  if (c <= 0 || other <= 0) return NaN;
  if (c <= other) return NaN; // hypotenuse must exceed each leg
  return Math.sqrt(c * c - other * other);
}

export function Calculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("c");
  // Defaults reproduce the classic 3-4-5 worked example.
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [c, setC] = useState(5);

  const { sideA, sideB, sideC, error, steps } = useMemo(() => {
    if (solveFor === "c") {
      const result = solveHypotenuse(a, b);
      if (!Number.isFinite(result)) {
        return { sideA: a, sideB: b, sideC: NaN, error: "Enter positive numbers for both legs.", steps: [] as string[] };
      }
      return {
        sideA: a,
        sideB: b,
        sideC: result,
        error: "",
        steps: [
          `c = sqrt(a^2 + b^2)`,
          `c = sqrt(${a}^2 + ${b}^2)`,
          `c = sqrt(${(a * a).toFixed(4)} + ${(b * b).toFixed(4)})`,
          `c = sqrt(${(a * a + b * b).toFixed(4)})`,
          `c = ${result.toFixed(4)}`,
        ],
      };
    }
    if (solveFor === "a") {
      const result = solveLeg(c, b);
      if (!Number.isFinite(result)) {
        return {
          sideA: NaN, sideB: b, sideC: c,
          error: "Hypotenuse c must be a positive number larger than leg b.",
          steps: [],
        };
      }
      return {
        sideA: result,
        sideB: b,
        sideC: c,
        error: "",
        steps: [
          `a = sqrt(c^2 - b^2)`,
          `a = sqrt(${c}^2 - ${b}^2)`,
          `a = sqrt(${(c * c).toFixed(4)} - ${(b * b).toFixed(4)})`,
          `a = sqrt(${(c * c - b * b).toFixed(4)})`,
          `a = ${result.toFixed(4)}`,
        ],
      };
    }
    const result = solveLeg(c, a);
    if (!Number.isFinite(result)) {
      return {
        sideA: a, sideB: NaN, sideC: c,
        error: "Hypotenuse c must be a positive number larger than leg a.",
        steps: [],
      };
    }
    return {
      sideA: a,
      sideB: result,
      sideC: c,
      error: "",
      steps: [
        `b = sqrt(c^2 - a^2)`,
        `b = sqrt(${c}^2 - ${a}^2)`,
        `b = sqrt(${(c * c).toFixed(4)} - ${(a * a).toFixed(4)})`,
        `b = sqrt(${(c * c - a * a).toFixed(4)})`,
        `b = ${result.toFixed(4)}`,
      ],
    };
  }, [solveFor, a, b, c]);

  const fmt = (n: number) =>
    Number.isFinite(n) ? (Math.abs(n - Math.round(n)) < 1e-9 ? n.toFixed(0) : n.toFixed(4)) : "—";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Solve for"
          value={solveFor}
          onChange={(v) => setSolveFor(v as SolveFor)}
          options={[
            { value: "c", label: "Hypotenuse c" },
            { value: "a", label: "Leg a" },
            { value: "b", label: "Leg b" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {solveFor !== "a" && (
          <TextField
            label="Leg a"
            type="number"
            inputMode="decimal"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            min={0}
            step={0.1}
            supportingText="One of the two sides that form the right angle."
          />
        )}
        {solveFor !== "b" && (
          <TextField
            label="Leg b"
            type="number"
            inputMode="decimal"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            min={0}
            step={0.1}
            supportingText="The other side forming the right angle."
          />
        )}
        {solveFor !== "c" && (
          <TextField
            label="Hypotenuse c"
            type="number"
            inputMode="decimal"
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            min={0}
            step={0.1}
            supportingText="Longest side — opposite the right angle."
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Leg a</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(sideA)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Leg b</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(sideB)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Hypotenuse c</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(sideC)}
            </p>
          </div>

          {error ? (
            <p className="sm:col-span-3 md-body-medium text-[var(--md-sys-color-error)]">{error}</p>
          ) : (
            <div className="sm:col-span-3">
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Step-by-step
              </p>
              <ol className="md-body-medium space-y-1 font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                {steps.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Works only on right triangles (one 90-degree angle). For other triangles use the Law of
        Cosines.
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
