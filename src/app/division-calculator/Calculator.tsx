"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Division:
//   quotient = floor(a / b)
//   remainder = a - quotient * b
// Decimal expansion via long division on the remainder; detect repetition
// when a remainder we have seen before reappears (standard schoolbook proof
// that fractions yield either terminating or eventually periodic decimals).

type Mode = "integer" | "decimal";

type DecimalResult = {
  intPart: string;
  nonRepeat: string;
  repeat: string;
  display: string;
  terminates: boolean;
};

function divideInteger(a: number, b: number) {
  const q = Math.trunc(a / b);
  const r = a - q * b;
  return { quotient: q, remainder: r };
}

// Long-division decimal expansion of |a| / |b|, with cycle detection.
// Caps fractional digits to keep the UI bounded; for 22/7 the cycle 142857
// appears within the first 7 digits.
function divideDecimal(a: number, b: number, maxFracDigits = 60): DecimalResult {
  const sign = (a < 0) !== (b < 0) ? "-" : "";
  const A = Math.abs(Math.trunc(a));
  const B = Math.abs(Math.trunc(b));

  const intPart = Math.trunc(A / B).toString();
  let rem = A % B;

  if (rem === 0) {
    return {
      intPart: sign + intPart,
      nonRepeat: "",
      repeat: "",
      display: sign + intPart,
      terminates: true,
    };
  }

  const seen = new Map<number, number>(); // remainder -> index in digits[]
  const digits: number[] = [];

  while (rem !== 0 && !seen.has(rem) && digits.length < maxFracDigits) {
    seen.set(rem, digits.length);
    rem *= 10;
    digits.push(Math.trunc(rem / B));
    rem = rem % B;
  }

  if (rem === 0) {
    return {
      intPart: sign + intPart,
      nonRepeat: digits.join(""),
      repeat: "",
      display: `${sign}${intPart}.${digits.join("")}`,
      terminates: true,
    };
  }

  if (seen.has(rem)) {
    const start = seen.get(rem)!;
    const nonRepeat = digits.slice(0, start).join("");
    const repeat = digits.slice(start).join("");
    const tail = repeat + repeat + repeat;
    const display = `${sign}${intPart}.${nonRepeat}${tail}...`;
    return { intPart: sign + intPart, nonRepeat, repeat, display, terminates: false };
  }

  // Hit digit cap without finding a cycle — show what we have with ellipsis.
  return {
    intPart: sign + intPart,
    nonRepeat: digits.join(""),
    repeat: "",
    display: `${sign}${intPart}.${digits.join("")}...`,
    terminates: false,
  };
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("integer");
  const [dividend, setDividend] = useState(22);
  const [divisor, setDivisor] = useState(7);

  const result = useMemo(() => {
    const a = Number(dividend);
    const b = Number(divisor);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      return { ok: false as const, reason: "Enter two numbers." };
    }
    if (b === 0) {
      return { ok: false as const, reason: "Division by zero is undefined." };
    }
    if (mode === "integer") {
      const { quotient, remainder } = divideInteger(Math.trunc(a), Math.trunc(b));
      return { ok: true as const, kind: "integer" as const, quotient, remainder };
    }
    const dec = divideDecimal(a, b);
    return { ok: true as const, kind: "decimal" as const, dec };
  }, [mode, dividend, divisor]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Output mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "integer", label: "Integer + remainder" },
            { value: "decimal", label: "Decimal" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Dividend (a)"
          type="number"
          inputMode="decimal"
          value={dividend}
          onChange={(e) => setDividend(Number(e.target.value))}
          step={1}
          supportingText="The number being divided."
        />
        <TextField
          label="Divisor (b)"
          type="number"
          inputMode="decimal"
          value={divisor}
          onChange={(e) => setDivisor(Number(e.target.value))}
          step={1}
          supportingText="Cannot be zero."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4">
          {!result.ok ? (
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Result</p>
              <p className="mt-1 md-headline-small text-[var(--md-sys-color-error)]">{result.reason}</p>
            </div>
          ) : result.kind === "integer" ? (
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Quotient</p>
                <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                  {result.quotient}
                </p>
              </div>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Remainder</p>
                <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                  {result.remainder}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
                  {dividend} ÷ {divisor} ={" "}
                  <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-on-surface)]">
                    {result.quotient} remainder {result.remainder}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Decimal</p>
              <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)] break-all">
                {result.dec.intPart}
                {result.dec.nonRepeat || result.dec.repeat ? "." : ""}
                {result.dec.nonRepeat}
                {result.dec.repeat ? (
                  <span style={{ textDecoration: "overline" }}>{result.dec.repeat}</span>
                ) : null}
                {result.dec.terminates ? "" : "..."}
              </p>
              <p className="md-body-small mt-2 text-[var(--md-sys-color-on-surface-variant)]">
                {result.dec.terminates
                  ? "Decimal terminates."
                  : result.dec.repeat
                    ? `Repeating block: ${result.dec.repeat} (length ${result.dec.repeat.length}).`
                    : "Decimal continues beyond shown digits."}
              </p>
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Integer mode uses floor division: quotient is the whole-number part, remainder is what is left.
        Decimal mode detects repeating blocks via standard long division.
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
