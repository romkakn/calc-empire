"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Scientific notation: x = a × 10^n, where 1 ≤ |a| < 10
//   n = floor(log10(|x|))
//   a = x / 10^n
// Engineering notation: same form, but n is a multiple of 3 and 1 ≤ |a| < 1000.
// Reference: NIST Special Publication 811 (SI guide) — https://www.nist.gov/pml/special-publication-811

type Direction = "decimal-to-sci" | "sci-to-decimal";
type Mode = "scientific" | "engineering";

function toScientific(x: number, mode: Mode): { a: number; n: number } {
  if (!Number.isFinite(x)) return { a: NaN, n: NaN };
  if (x === 0) return { a: 0, n: 0 };
  const sign = x < 0 ? -1 : 1;
  const abs = Math.abs(x);
  let n = Math.floor(Math.log10(abs));
  if (mode === "engineering") {
    // Round n down to the nearest multiple of 3 (works for negatives too).
    n = Math.floor(n / 3) * 3;
  }
  const a = sign * (abs / Math.pow(10, n));
  return { a, n };
}

function fromScientific(a: number, n: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(n)) return NaN;
  return a * Math.pow(10, n);
}

// Format the coefficient with a sensible number of significant digits without
// dragging in floating-point noise like 4.560000000000001.
function fmtCoefficient(a: number): string {
  if (!Number.isFinite(a)) return "—";
  if (a === 0) return "0";
  // 6 significant digits, then strip trailing zeros.
  const s = a.toPrecision(6);
  // toPrecision can return exponential form for very small/large; normalize.
  const n = Number(s);
  // Strip trailing zeros from the decimal part.
  return n.toString();
}

// Format the expanded decimal without scientific notation in the output string.
function fmtDecimal(x: number): string {
  if (!Number.isFinite(x)) return "—";
  if (x === 0) return "0";
  const abs = Math.abs(x);
  // For very large or very small values, fall back to a fixed expansion that
  // does not slip back into E notation.
  if (abs >= 1e21 || abs < 1e-6) {
    // Use toFixed with enough places to fully expand.
    const exp = Math.floor(Math.log10(abs));
    const places = exp < 0 ? Math.abs(exp) + 6 : 0;
    return x.toFixed(places).replace(/\.?0+$/, "");
  }
  // Default: trim trailing zeros after a decimal point.
  const s = x.toString();
  return s.includes(".") ? s.replace(/\.?0+$/, "") : s;
}

export function Calculator() {
  const [direction, setDirection] = useState<Direction>("decimal-to-sci");
  const [mode, setMode] = useState<Mode>("scientific");
  const [decimal, setDecimal] = useState(0.0000456);
  const [coeff, setCoeff] = useState(4.56);
  const [expon, setExpon] = useState(-5);

  const result = useMemo(() => {
    if (direction === "decimal-to-sci") {
      const { a, n } = toScientific(decimal, mode);
      return {
        coefficient: a,
        exponent: n,
        decimal: decimal,
      };
    }
    const x = fromScientific(coeff, expon);
    // When showing scientific → decimal, also recompute the canonical form so
    // the user sees the standard (1 ≤ |a| < 10) version of what they typed.
    const norm = toScientific(x, mode);
    return {
      coefficient: norm.a,
      exponent: norm.n,
      decimal: x,
    };
  }, [direction, mode, decimal, coeff, expon]);

  const coefRange = mode === "scientific" ? "1 ≤ |a| < 10" : "1 ≤ |a| < 1000, n is a multiple of 3";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Direction"
          value={direction}
          onChange={(v) => setDirection(v as Direction)}
          options={[
            { value: "decimal-to-sci", label: "Decimal → Scientific" },
            { value: "sci-to-decimal", label: "Scientific → Decimal" },
          ]}
        />
        <Segment
          label="Notation"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "scientific", label: "Scientific" },
            { value: "engineering", label: "Engineering" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {direction === "decimal-to-sci" ? (
          <TextField
            label="Decimal number"
            type="number"
            inputMode="decimal"
            value={decimal}
            onChange={(e) => setDecimal(Number(e.target.value))}
            step="any"
            supportingText="Type any value — for example 0.0000456, 47000, or -123.45."
          />
        ) : (
          <>
            <TextField
              label="Coefficient (a)"
              type="number"
              inputMode="decimal"
              value={coeff}
              onChange={(e) => setCoeff(Number(e.target.value))}
              step="any"
              supportingText={coefRange}
            />
            <TextField
              label="Exponent (n)"
              type="number"
              inputMode="numeric"
              value={expon}
              onChange={(e) => setExpon(Number(e.target.value))}
              step={1}
              supportingText="Integer power of 10. Negative for small numbers."
            />
          </>
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {mode === "scientific" ? "Scientific notation" : "Engineering notation"}
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(result.coefficient) && Number.isFinite(result.exponent)
                ? `${fmtCoefficient(result.coefficient)} × 10^${result.exponent}`
                : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Decimal value
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtDecimal(result.decimal)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              E notation (calculator format)
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(result.coefficient) && Number.isFinite(result.exponent)
                ? `${fmtCoefficient(result.coefficient)}E${result.exponent >= 0 ? "+" : ""}${result.exponent}`
                : "—"}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Coefficient range: {coefRange}. Engineering exponents line up with metric prefixes
        (kilo 10³, mega 10⁶, milli 10⁻³, micro 10⁻⁶).
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
