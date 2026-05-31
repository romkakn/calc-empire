"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Quadratic formula (standard result, OpenStax College Algebra 2e §2.5):
//   For ax^2 + bx + c = 0 with a != 0,
//     x = (-b +/- sqrt(b^2 - 4ac)) / (2a)
//   Discriminant D = b^2 - 4ac decides root kind:
//     D > 0  -> two real roots
//     D == 0 -> one repeated real root
//     D < 0  -> two complex conjugate roots
//   Vertex of y = ax^2 + bx + c:
//     x_v = -b/(2a),  y_v = c - b^2/(4a)
// Worked example check: a=1, b=-3, c=2 -> D=1, roots 2 and 1, vertex (1.5, -0.25). Verified.

type Display = "decimal" | "fraction";

type Roots =
  | { kind: "linear"; x: number }
  | { kind: "degenerate"; reason: string }
  | { kind: "real-distinct"; x1: number; x2: number }
  | { kind: "real-repeated"; x: number }
  | { kind: "complex"; re: number; im: number };

function solve(a: number, b: number, c: number): Roots {
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
    return { kind: "degenerate", reason: "Enter numbers for a, b, and c." };
  }
  if (a === 0) {
    if (b === 0) {
      return { kind: "degenerate", reason: c === 0 ? "Every x satisfies 0 = 0." : "No solution: a and b are zero but c is not." };
    }
    return { kind: "linear", x: -c / b };
  }
  const D = b * b - 4 * a * c;
  if (D > 0) {
    const r = Math.sqrt(D);
    return { kind: "real-distinct", x1: (-b + r) / (2 * a), x2: (-b - r) / (2 * a) };
  }
  if (D === 0) {
    return { kind: "real-repeated", x: -b / (2 * a) };
  }
  const r = Math.sqrt(-D);
  return { kind: "complex", re: -b / (2 * a), im: r / (2 * a) };
}

function fmt(n: number, display: Display): string {
  if (!Number.isFinite(n)) return "—";
  if (display === "fraction") {
    const f = toFraction(n);
    if (f) return f;
  }
  // Trim trailing zeros, cap at 4 decimals.
  const fixed = n.toFixed(4);
  return fixed.replace(/\.?0+$/, "");
}

function toFraction(n: number, maxDen = 1000): string | null {
  if (!Number.isFinite(n)) return null;
  if (Number.isInteger(n)) return String(n);
  const sign = n < 0 ? "-" : "";
  const x = Math.abs(n);
  let h1 = 1, h0 = 0, k1 = 0, k0 = 1;
  let b = x;
  for (let i = 0; i < 64; i++) {
    const a = Math.floor(b);
    const h2 = a * h1 + h0;
    const k2 = a * k1 + k0;
    if (k2 > maxDen) break;
    h0 = h1; h1 = h2; k0 = k1; k1 = k2;
    if (Math.abs(x - h1 / k1) < 1e-10) break;
    b = 1 / (b - a);
    if (!Number.isFinite(b)) break;
  }
  if (k1 === 0) return null;
  if (Math.abs(x - h1 / k1) > 1e-6) return null;
  return `${sign}${h1}/${k1}`;
}

export function Calculator() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-3);
  const [c, setC] = useState(2);
  const [display, setDisplay] = useState<Display>("decimal");

  const { roots, discriminant, vertex } = useMemo(() => {
    const r = solve(a, b, c);
    const D = a === 0 ? NaN : b * b - 4 * a * c;
    const vx = a === 0 ? NaN : -b / (2 * a);
    const vy = a === 0 ? NaN : c - (b * b) / (4 * a);
    return { roots: r, discriminant: D, vertex: { x: vx, y: vy } };
  }, [a, b, c]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Display"
          value={display}
          onChange={(v) => setDisplay(v as Display)}
          options={[
            { value: "decimal", label: "Decimal" },
            { value: "fraction", label: "Fraction" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-3"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Coefficient a"
          type="number"
          inputMode="decimal"
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          step="any"
          supportingText="Leading coefficient. If a = 0 the equation is linear, not quadratic."
        />
        <TextField
          label="Coefficient b"
          type="number"
          inputMode="decimal"
          value={b}
          onChange={(e) => setB(Number(e.target.value))}
          step="any"
          supportingText="Middle coefficient."
        />
        <TextField
          label="Coefficient c"
          type="number"
          inputMode="decimal"
          value={c}
          onChange={(e) => setC(Number(e.target.value))}
          step="any"
          supportingText="Constant term."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Equation</p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {fmt(a, "decimal")}x² {b >= 0 ? "+" : "−"} {fmt(Math.abs(b), "decimal")}x {c >= 0 ? "+" : "−"} {fmt(Math.abs(c), "decimal")} = 0
            </p>
          </div>

          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Discriminant</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(discriminant) ? fmt(discriminant, display) : "—"}
            </p>
            <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)] mt-1">
              {!Number.isFinite(discriminant)
                ? "Not quadratic (a = 0)."
                : discriminant > 0
                  ? "D > 0 — two distinct real roots."
                  : discriminant === 0
                    ? "D = 0 — one repeated real root."
                    : "D < 0 — two complex conjugate roots."}
            </p>
          </div>

          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Vertex</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(vertex.x) && Number.isFinite(vertex.y)
                ? `(${fmt(vertex.x, display)}, ${fmt(vertex.y, display)})`
                : "—"}
            </p>
            <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)] mt-1">
              {a > 0 ? "Opens upward (minimum)." : a < 0 ? "Opens downward (maximum)." : "No vertex (a = 0)."}
            </p>
          </div>

          <div className="sm:col-span-2 border-t border-[var(--md-sys-color-outline-variant)] pt-3">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Roots</p>
            <RootDisplay roots={roots} display={display} />
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Formula: x = (-b ± √(b² - 4ac)) / (2a). Coefficient a must be non-zero for a true quadratic.
      </p>
    </Card>
  );
}

function RootDisplay({ roots, display }: { roots: Roots; display: Display }) {
  if (roots.kind === "degenerate") {
    return <p className="mt-1 md-body-medium text-[var(--md-sys-color-on-surface)]">{roots.reason}</p>;
  }
  if (roots.kind === "linear") {
    return (
      <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
        x = {fmt(roots.x, display)} <span className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">(linear case)</span>
      </p>
    );
  }
  if (roots.kind === "real-distinct") {
    return (
      <div className="mt-1 grid gap-1 sm:grid-cols-2">
        <p className="md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
          x₁ = {fmt(roots.x1, display)}
        </p>
        <p className="md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
          x₂ = {fmt(roots.x2, display)}
        </p>
      </div>
    );
  }
  if (roots.kind === "real-repeated") {
    return (
      <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
        x = {fmt(roots.x, display)} <span className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">(repeated)</span>
      </p>
    );
  }
  // complex
  const im = fmt(Math.abs(roots.im), display);
  const re = fmt(roots.re, display);
  return (
    <div className="mt-1 grid gap-1 sm:grid-cols-2">
      <p className="md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
        x₁ = {re} + {im}i
      </p>
      <p className="md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
        x₂ = {re} − {im}i
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
