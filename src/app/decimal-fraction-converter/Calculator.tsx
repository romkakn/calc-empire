"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Decimal -> Fraction: write the decimal as x / 10^k where k = digits after
// the point, then divide both sides by gcd(x, 10^k).
// Fraction -> Decimal: numerator / denominator.
// Repeating decimal 0.(abc) = abc / (10^k - 1).

type Direction = "d-to-f" | "f-to-d";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function decimalToFraction(input: number): {
  raw: { num: number; den: number };
  reduced: { num: number; den: number };
  divisor: number;
  whole: number;
  fracNum: number;
} {
  if (!Number.isFinite(input)) {
    return { raw: { num: NaN, den: 1 }, reduced: { num: NaN, den: 1 }, divisor: 1, whole: 0, fracNum: 0 };
  }
  const sign = input < 0 ? -1 : 1;
  const abs = Math.abs(input);
  const str = abs.toString();
  const dot = str.indexOf(".");
  const digits = dot === -1 ? 0 : str.length - dot - 1;
  const den = Math.pow(10, digits);
  const num = Math.round(abs * den);
  const divisor = gcd(num, den);
  const rNum = num / divisor;
  const rDen = den / divisor;
  const whole = Math.trunc(rNum / rDen);
  const fracNum = rNum - whole * rDen;
  return {
    raw: { num: sign * num, den },
    reduced: { num: sign * rNum, den: rDen },
    divisor,
    whole: sign * whole,
    fracNum,
  };
}

function fractionToDecimal(num: number, den: number): number {
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return NaN;
  return num / den;
}

export function Calculator() {
  const [direction, setDirection] = useState<Direction>("d-to-f");
  const [decimal, setDecimal] = useState(0.75);
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);

  const result = useMemo(() => {
    if (direction === "d-to-f") {
      const r = decimalToFraction(decimal);
      return {
        decimalOut: decimal,
        raw: r.raw,
        reduced: r.reduced,
        divisor: r.divisor,
        whole: r.whole,
        fracNum: r.fracNum,
      };
    }
    const d = fractionToDecimal(numerator, denominator);
    const divisor = gcd(numerator, denominator);
    const rNum = Number.isFinite(d) ? numerator / divisor : NaN;
    const rDen = Number.isFinite(d) ? denominator / divisor : NaN;
    const whole = Number.isFinite(d) ? Math.trunc(rNum / rDen) : 0;
    const fracNum = Number.isFinite(d) ? rNum - whole * rDen : 0;
    return {
      decimalOut: d,
      raw: { num: numerator, den: denominator },
      reduced: { num: rNum, den: rDen },
      divisor,
      whole,
      fracNum,
    };
  }, [direction, decimal, numerator, denominator]);

  const reducedFracDisplay = Number.isFinite(result.reduced.num) && Number.isFinite(result.reduced.den)
    ? `${result.reduced.num}/${result.reduced.den}`
    : "—";

  const decimalDisplay = Number.isFinite(result.decimalOut)
    ? Number(result.decimalOut.toFixed(10)).toString()
    : "—";

  const mixedDisplay = Number.isFinite(result.reduced.num) && Number.isFinite(result.reduced.den)
    && Math.abs(result.reduced.num) >= result.reduced.den && result.fracNum !== 0
    ? `${result.whole} ${Math.abs(result.fracNum)}/${result.reduced.den}`
    : null;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Direction"
          value={direction}
          onChange={(v) => setDirection(v as Direction)}
          options={[
            { value: "d-to-f", label: "Decimal → Fraction" },
            { value: "f-to-d", label: "Fraction → Decimal" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {direction === "d-to-f" ? (
          <TextField
            label="Decimal"
            type="number"
            inputMode="decimal"
            value={decimal}
            onChange={(e) => setDecimal(Number(e.target.value))}
            step={0.01}
            supportingText="Terminating decimals only. For repeating decimals, see the FAQ below."
          />
        ) : (
          <>
            <TextField
              label="Numerator"
              type="number"
              inputMode="numeric"
              value={numerator}
              onChange={(e) => setNumerator(Number(e.target.value))}
              step={1}
            />
            <TextField
              label="Denominator"
              type="number"
              inputMode="numeric"
              value={denominator}
              onChange={(e) => setDenominator(Number(e.target.value))}
              step={1}
              min={1}
              supportingText="Must be non-zero."
            />
          </>
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Reduced fraction</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {reducedFracDisplay}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Decimal</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {decimalDisplay}
            </p>
          </div>
          {mixedDisplay && (
            <div className="sm:col-span-2">
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Mixed number</p>
              <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                {mixedDisplay}
              </p>
            </div>
          )}
          {direction === "d-to-f" && result.divisor > 1 && (
            <div className="sm:col-span-2">
              <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">
                Reduced from <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">{result.raw.num}/{result.raw.den}</span> by gcd <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">{result.divisor}</span>.
              </p>
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Works for terminating decimals. Irrational numbers like pi or sqrt(2) cannot be written as exact fractions.
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
