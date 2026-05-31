"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Fraction arithmetic — elementary algebra (Common Core 5.NF.A.1, 5.NF.B.4, 6.NS.A.1).
//   add:      a/b + c/d = (a*d + c*b) / (b*d)
//   subtract: a/b - c/d = (a*d - c*b) / (b*d)
//   multiply: a/b * c/d = (a*c) / (b*d)
//   divide:   a/b / c/d = (a*d) / (b*c)
// Reduce by gcd(|num|, |den|). Improper -> mixed: quotient + remainder/divisor.

type Op = "add" | "sub" | "mul" | "div";

function gcd(a: number, b: number): number {
  const x = Math.abs(Math.trunc(a));
  const y = Math.abs(Math.trunc(b));
  if (y === 0) return x;
  return gcd(y, x % y);
}

function compute(
  n1: number,
  d1: number,
  n2: number,
  d2: number,
  op: Op,
): { num: number; den: number } | null {
  if (![n1, d1, n2, d2].every(Number.isFinite)) return null;
  if (d1 === 0 || d2 === 0) return null;
  let num: number;
  let den: number;
  switch (op) {
    case "add":
      num = n1 * d2 + n2 * d1;
      den = d1 * d2;
      break;
    case "sub":
      num = n1 * d2 - n2 * d1;
      den = d1 * d2;
      break;
    case "mul":
      num = n1 * n2;
      den = d1 * d2;
      break;
    case "div":
      if (n2 === 0) return null;
      num = n1 * d2;
      den = d1 * n2;
      break;
  }
  // normalize sign onto numerator
  if (den < 0) {
    num = -num;
    den = -den;
  }
  return { num, den };
}

function reduce(num: number, den: number): { num: number; den: number; g: number } {
  if (num === 0) return { num: 0, den: 1, g: Math.abs(den) || 1 };
  const g = gcd(num, den) || 1;
  return { num: num / g, den: den / g, g };
}

function toMixed(num: number, den: number): { whole: number; rem: number; den: number } {
  if (den === 0) return { whole: 0, rem: 0, den: 1 };
  const sign = num < 0 ? -1 : 1;
  const abs = Math.abs(num);
  const whole = Math.trunc(abs / den);
  const rem = abs - whole * den;
  return { whole: sign * whole, rem, den };
}

const OP_GLYPH: Record<Op, string> = { add: "+", sub: "−", mul: "×", div: "÷" };
const OP_VERB: Record<Op, string> = {
  add: "+",
  sub: "−",
  mul: "*",
  div: "*", // div shows as multiply-by-reciprocal in steps
};

export function Calculator() {
  const [op, setOp] = useState<Op>("add");
  const [n1, setN1] = useState(1);
  const [d1, setD1] = useState(2);
  const [n2, setN2] = useState(1);
  const [d2, setD2] = useState(3);

  const result = useMemo(() => {
    const raw = compute(n1, d1, n2, d2, op);
    if (!raw) return null;
    const r = reduce(raw.num, raw.den);
    const mixed = toMixed(r.num, r.den);
    const decimal = r.den !== 0 ? r.num / r.den : NaN;
    return { raw, reduced: r, mixed, decimal };
  }, [n1, d1, n2, d2, op]);

  const steps = useMemo(() => {
    if (!result) return [];
    const { raw, reduced } = result;
    const out: { label: string; value: string }[] = [];
    if (op === "add" || op === "sub") {
      const sym = OP_VERB[op];
      out.push({
        label: `Common denominator: ${d1} × ${d2}`,
        value: `${d1 * d2}`,
      });
      out.push({
        label: `Numerator: (${n1} × ${d2}) ${sym} (${n2} × ${d1})`,
        value: `${raw.num}`,
      });
    } else if (op === "mul") {
      out.push({
        label: `Multiply tops: ${n1} × ${n2}`,
        value: `${n1 * n2}`,
      });
      out.push({
        label: `Multiply bottoms: ${d1} × ${d2}`,
        value: `${d1 * d2}`,
      });
    } else {
      out.push({
        label: `Flip the second fraction: ${n2}/${d2} → ${d2}/${n2}`,
        value: "",
      });
      out.push({
        label: `Multiply: (${n1} × ${d2}) / (${d1} × ${n2})`,
        value: `${raw.num}/${raw.den}`,
      });
    }
    if (reduced.g > 1) {
      out.push({
        label: `Reduce by gcd ${reduced.g}: ${raw.num}/${raw.den}`,
        value: `${reduced.num}/${reduced.den}`,
      });
    } else {
      out.push({
        label: "Already reduced (gcd 1)",
        value: `${reduced.num}/${reduced.den}`,
      });
    }
    return out;
  }, [op, n1, d1, n2, d2, result]);

  const invalid = !result;
  const divZero = d1 === 0 || d2 === 0 || (op === "div" && n2 === 0);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="mb-4">
        <Segment
          label="Operation"
          value={op}
          onChange={(v) => setOp(v as Op)}
          options={[
            { value: "add", label: "+" },
            { value: "sub", label: "−" },
            { value: "mul", label: "×" },
            { value: "div", label: "÷" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div className="grid gap-3">
          <TextField
            label="Numerator 1"
            type="number"
            inputMode="numeric"
            value={n1}
            onChange={(e) => setN1(Number(e.target.value))}
            step={1}
          />
          <TextField
            label="Denominator 1"
            type="number"
            inputMode="numeric"
            value={d1}
            onChange={(e) => setD1(Number(e.target.value))}
            step={1}
            supportingText={d1 === 0 ? "Denominator cannot be zero." : undefined}
          />
        </div>

        <div
          aria-hidden
          className="hidden sm:flex items-center justify-center md-display-small text-[var(--md-sys-color-primary)] pb-2"
        >
          {OP_GLYPH[op]}
        </div>

        <div className="grid gap-3">
          <TextField
            label="Numerator 2"
            type="number"
            inputMode="numeric"
            value={n2}
            onChange={(e) => setN2(Number(e.target.value))}
            step={1}
            supportingText={op === "div" && n2 === 0 ? "Cannot divide by zero." : undefined}
          />
          <TextField
            label="Denominator 2"
            type="number"
            inputMode="numeric"
            value={d2}
            onChange={(e) => setD2(Number(e.target.value))}
            step={1}
            supportingText={d2 === 0 ? "Denominator cannot be zero." : undefined}
          />
        </div>
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-4">
          {invalid || divZero ? (
            <p className="md-title-medium text-[var(--md-sys-color-error)]">
              Enter non-zero denominators (and a non-zero second numerator when dividing).
            </p>
          ) : (
            <>
              <div className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
                <div>
                  <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                    Reduced fraction
                  </p>
                  <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                    {result.reduced.num}/{result.reduced.den}
                  </p>
                </div>
                <div>
                  <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                    Mixed number
                  </p>
                  <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                    {result.mixed.rem === 0
                      ? `${result.mixed.whole}`
                      : `${result.mixed.whole} ${result.mixed.rem}/${result.mixed.den}`}
                  </p>
                </div>
                <div>
                  <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                    Decimal
                  </p>
                  <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                    {Number.isFinite(result.decimal) ? result.decimal.toFixed(4) : "—"}
                  </p>
                </div>
              </div>

              <ol className="md-body-medium grid gap-1 list-decimal pl-5 text-[var(--md-sys-color-on-surface-variant)]">
                {steps.map((s, i) => (
                  <li key={i}>
                    <span>{s.label}</span>
                    {s.value && (
                      <span className="ml-2 font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-on-surface)]">
                        = {s.value}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Whole numbers welcome — enter 3 as 3/1. Negative numerators are supported; the sign is
        normalized onto the top.
      </p>
    </Card>
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
      <p className="md-label-medium mb-1 text-[var(--md-sys-color-on-surface-variant)]">{label}</p>
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
