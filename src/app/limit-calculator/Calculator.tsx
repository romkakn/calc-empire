"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Limit evaluation for the three common first-calculus forms:
//   polynomial p(x) = a x^2 + b x + c
//   rational  p(x)/q(x), each a degree-2 polynomial of the same shape
//   trig      sin(x)/x family with optional coefficient k for sin(k x)/(k x)
//
// Strategy:
//   - finite target a: try direct substitution; if 0/0 on a rational, factor
//     out (x - a) from numerator and denominator and re-substitute.
//   - infinity target: compare degrees for rational; polynomial dominated by
//     leading term sign.
//
// References:
//   OpenStax Calculus Volume 1, Chapter 2 — Limits.
//   Stewart Calculus 8e §2.3–2.6 — Limit Laws, Continuity, Indeterminate Forms.

type Form = "polynomial" | "rational" | "trig";
type Approach = "finite" | "posinf" | "neginf";

type LimitResult =
  | { kind: "value"; value: number; note: string }
  | { kind: "infinity"; sign: 1 | -1; note: string }
  | { kind: "dne"; note: string };

const EPS = 1e-9;
const approxEq = (x: number, y: number) => Math.abs(x - y) < 1e-9;

function poly2(a: number, b: number, c: number, x: number) {
  return a * x * x + b * x + c;
}

// Divide quadratic (a x^2 + b x + c) by (x - r) using synthetic division.
// Returns the linear quotient [m, n] meaning m x + n, plus the remainder.
function divideQuadByLinear(a: number, b: number, c: number, r: number) {
  const m = a;
  const n = b + a * r;
  const remainder = c + n * r;
  return { m, n, remainder };
}

function limitPolynomial(
  a: number, b: number, c: number, approach: Approach, target: number,
): LimitResult {
  if (approach === "finite") {
    const v = poly2(a, b, c, target);
    return { kind: "value", value: v, note: "Polynomial is continuous — direct substitution." };
  }
  // x -> ±∞: dominated by the highest non-zero term.
  if (!approxEq(a, 0)) {
    const sign = (approach === "posinf" ? 1 : -1) * Math.sign(a);
    return sign >= 0
      ? { kind: "infinity", sign: 1, note: "Leading a·x² term dominates as |x| grows." }
      : { kind: "infinity", sign: -1, note: "Leading a·x² term dominates as |x| grows." };
  }
  if (!approxEq(b, 0)) {
    const sign = (approach === "posinf" ? 1 : -1) * Math.sign(b);
    return sign >= 0
      ? { kind: "infinity", sign: 1, note: "Linear b·x term dominates as |x| grows." }
      : { kind: "infinity", sign: -1, note: "Linear b·x term dominates as |x| grows." };
  }
  return { kind: "value", value: c, note: "Constant function — limit equals the constant." };
}

function limitRational(
  // numerator a1 x^2 + b1 x + c1, denominator a2 x^2 + b2 x + c2
  a1: number, b1: number, c1: number,
  a2: number, b2: number, c2: number,
  approach: Approach, target: number,
): LimitResult {
  if (approach === "finite") {
    const num = poly2(a1, b1, c1, target);
    const den = poly2(a2, b2, c2, target);
    if (!approxEq(den, 0)) {
      return { kind: "value", value: num / den, note: "Denominator nonzero — direct substitution." };
    }
    if (!approxEq(num, 0)) {
      // num ≠ 0, den = 0: one-sided behavior → ±∞ or DNE.
      // Check sign on both sides of target.
      const leftDen = poly2(a2, b2, c2, target - 1e-4);
      const rightDen = poly2(a2, b2, c2, target + 1e-4);
      const leftSign = Math.sign(num / leftDen);
      const rightSign = Math.sign(num / rightDen);
      if (leftSign === rightSign && leftSign !== 0) {
        return { kind: "infinity", sign: leftSign > 0 ? 1 : -1, note: "Vertical asymptote — same sign from both sides." };
      }
      return { kind: "dne", note: "Vertical asymptote — left and right diverge to opposite infinities." };
    }
    // 0/0: factor (x - target) out of numerator and denominator, retry.
    const nQuot = divideQuadByLinear(a1, b1, c1, target);
    const dQuot = divideQuadByLinear(a2, b2, c2, target);
    if (Math.abs(nQuot.remainder) > EPS || Math.abs(dQuot.remainder) > EPS) {
      // Shouldn't happen given both eval to 0, but guard anyway.
      return { kind: "dne", note: "Could not factor cleanly — try L'Hôpital by hand." };
    }
    // Now numerator is (nQuot.m x + nQuot.n), denominator (dQuot.m x + dQuot.n).
    const num2 = nQuot.m * target + nQuot.n;
    const den2 = dQuot.m * target + dQuot.n;
    if (!approxEq(den2, 0)) {
      return {
        kind: "value",
        value: num2 / den2,
        note: "0/0 form — cancelled (x − a) factor, then substituted.",
      };
    }
    // Still 0/0 — would need a second cancellation; rare for degree 2.
    return { kind: "dne", note: "Repeated 0/0 — needs higher-order factoring or L'Hôpital." };
  }
  // x -> ±∞: compare degrees.
  const degNum = !approxEq(a1, 0) ? 2 : !approxEq(b1, 0) ? 1 : 0;
  const degDen = !approxEq(a2, 0) ? 2 : !approxEq(b2, 0) ? 1 : 0;
  const leadNum = degNum === 2 ? a1 : degNum === 1 ? b1 : c1;
  const leadDen = degDen === 2 ? a2 : degDen === 1 ? b2 : c2;
  if (approxEq(leadDen, 0)) {
    return { kind: "dne", note: "Denominator is zero — limit undefined." };
  }
  if (degNum < degDen) {
    return { kind: "value", value: 0, note: "Numerator degree < denominator degree — limit is 0." };
  }
  if (degNum === degDen) {
    return {
      kind: "value",
      value: leadNum / leadDen,
      note: "Equal degrees — limit is ratio of leading coefficients.",
    };
  }
  // degNum > degDen
  const dirSign = approach === "posinf" ? 1 : (degNum - degDen) % 2 === 0 ? 1 : -1;
  const sign = (Math.sign(leadNum) * Math.sign(leadDen) * dirSign) as 1 | -1;
  return { kind: "infinity", sign: sign >= 0 ? 1 : -1, note: "Numerator dominates — diverges to infinity." };
}

function limitTrig(k: number, approach: Approach, target: number): LimitResult {
  // Form: sin(k x) / (k x). Classic limit = 1 at x = 0.
  if (approxEq(k, 0)) {
    return { kind: "dne", note: "Coefficient k = 0 makes sin(k x)/(k x) undefined everywhere." };
  }
  if (approach === "finite") {
    if (approxEq(target, 0)) {
      return { kind: "value", value: 1, note: "Standard limit: lim (x → 0) sin(kx)/(kx) = 1." };
    }
    const num = Math.sin(k * target);
    const den = k * target;
    return { kind: "value", value: num / den, note: "Continuous at target — direct substitution." };
  }
  // sin oscillates between -1 and 1; divided by k·x as x→∞ goes to 0.
  return { kind: "value", value: 0, note: "Squeeze theorem: |sin(kx)| ≤ 1, divided by kx → 0." };
}

function formatTarget(approach: Approach, target: number) {
  if (approach === "posinf") return "+∞";
  if (approach === "neginf") return "−∞";
  return target.toString();
}

function formatResult(r: LimitResult) {
  if (r.kind === "value") return Number.isFinite(r.value) ? trimNum(r.value) : "DNE";
  if (r.kind === "infinity") return r.sign === 1 ? "+∞" : "−∞";
  return "DNE";
}

function trimNum(x: number) {
  if (Number.isInteger(x)) return x.toString();
  return Number(x.toFixed(4)).toString();
}

export function Calculator() {
  const [form, setForm] = useState<Form>("rational");
  const [approach, setApproach] = useState<Approach>("finite");
  const [target, setTarget] = useState(2);

  // Polynomial / numerator coefficients: a1 x^2 + b1 x + c1.
  const [a1, setA1] = useState(1);
  const [b1, setB1] = useState(0);
  const [c1, setC1] = useState(-4);

  // Denominator coefficients (rational): a2 x^2 + b2 x + c2.
  const [a2, setA2] = useState(0);
  const [b2, setB2] = useState(1);
  const [c2, setC2] = useState(-2);

  // Trig coefficient k for sin(k x)/(k x).
  const [k, setK] = useState(1);

  const result = useMemo<LimitResult>(() => {
    if (form === "polynomial") return limitPolynomial(a1, b1, c1, approach, target);
    if (form === "rational") return limitRational(a1, b1, c1, a2, b2, c2, approach, target);
    return limitTrig(k, approach, target);
  }, [form, approach, target, a1, b1, c1, a2, b2, c2, k]);

  const expressionLabel = useMemo(() => {
    if (form === "polynomial") return `${trimNum(a1)}x² + ${trimNum(b1)}x + ${trimNum(c1)}`;
    if (form === "rational") {
      return `(${trimNum(a1)}x² + ${trimNum(b1)}x + ${trimNum(c1)}) / (${trimNum(a2)}x² + ${trimNum(b2)}x + ${trimNum(c2)})`;
    }
    return `sin(${trimNum(k)}x) / (${trimNum(k)}x)`;
  }, [form, a1, b1, c1, a2, b2, c2, k]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Function form"
          value={form}
          onChange={(v) => setForm(v as Form)}
          options={[
            { value: "polynomial", label: "Polynomial" },
            { value: "rational", label: "Rational" },
            { value: "trig", label: "Trig (sin x / x)" },
          ]}
        />
        <Segment
          label="x approaches"
          value={approach}
          onChange={(v) => setApproach(v as Approach)}
          options={[
            { value: "finite", label: "a number" },
            { value: "posinf", label: "+∞" },
            { value: "neginf", label: "−∞" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {approach === "finite" && (
          <TextField
            label="x approaches"
            type="number"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            step={0.1}
            supportingText="The value a that x → a."
          />
        )}

        {form !== "trig" && (
          <>
            <TextField
              label={form === "polynomial" ? "a (coef of x²)" : "a₁ (num x²)"}
              type="number"
              inputMode="decimal"
              value={a1}
              onChange={(e) => setA1(Number(e.target.value))}
              step={1}
            />
            <TextField
              label={form === "polynomial" ? "b (coef of x)" : "b₁ (num x)"}
              type="number"
              inputMode="decimal"
              value={b1}
              onChange={(e) => setB1(Number(e.target.value))}
              step={1}
            />
            <TextField
              label={form === "polynomial" ? "c (constant)" : "c₁ (num const)"}
              type="number"
              inputMode="decimal"
              value={c1}
              onChange={(e) => setC1(Number(e.target.value))}
              step={1}
            />
          </>
        )}

        {form === "rational" && (
          <>
            <TextField
              label="a₂ (den x²)"
              type="number"
              inputMode="decimal"
              value={a2}
              onChange={(e) => setA2(Number(e.target.value))}
              step={1}
            />
            <TextField
              label="b₂ (den x)"
              type="number"
              inputMode="decimal"
              value={b2}
              onChange={(e) => setB2(Number(e.target.value))}
              step={1}
            />
            <TextField
              label="c₂ (den const)"
              type="number"
              inputMode="decimal"
              value={c2}
              onChange={(e) => setC2(Number(e.target.value))}
              step={1}
            />
          </>
        )}

        {form === "trig" && (
          <TextField
            label="k (in sin(kx)/(kx))"
            type="number"
            inputMode="decimal"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            step={1}
            supportingText="Standard identity: lim (x → 0) sin(kx)/(kx) = 1."
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Expression
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] text-[var(--md-sys-color-on-surface)]">
              lim (x → {formatTarget(approach, target)}) of {expressionLabel}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Limit
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {formatResult(result)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Method
            </p>
            <p className="mt-1 md-body-medium text-[var(--md-sys-color-on-surface)]">
              {result.note}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Handles quadratic numerators and denominators plus the sin(kx)/(kx) family.
        For higher-degree, exponential, or logarithmic forms use a CAS such as SymPy
        or WolframAlpha.
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
