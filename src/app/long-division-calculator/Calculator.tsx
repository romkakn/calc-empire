"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Long-division algorithm (standard school method, Common Core 4.NBT.B.6).
// For dividend D and divisor d (d != 0):
//   quotient q = trunc(D / d)
//   remainder r = D - q * d, normalized to 0 <= r < |d|
//   identity: q * d + r = D
// We walk the dividend's digits left to right, tracking the running
// remainder and emitting one quotient digit per position (including
// leading zeros once the first non-zero quotient digit has appeared).

type View = "steps" | "decimal";

type Step = {
  bringDown: string;        // digit just brought down (or "" for first chunk)
  chunkBefore: string;      // the chunk we are dividing into, as displayed
  chunkValue: number;       // numeric value of that chunk
  quotientDigit: number;    // 0..9, how many times divisor fits
  subtract: number;         // quotientDigit * |divisor|
  remainder: number;        // chunkValue - subtract
};

type DivisionResult = {
  ok: boolean;
  reason?: string;
  quotient: number;
  remainder: number;
  steps: Step[];
  quotientDigits: string;   // signed quotient as written, e.g. "-176" or "176"
  absDividend: string;
  absDivisor: number;
  sign: 1 | -1;
};

function divide(dividend: number, divisor: number): DivisionResult {
  const empty: DivisionResult = {
    ok: false, quotient: NaN, remainder: NaN, steps: [],
    quotientDigits: "", absDividend: "", absDivisor: 0, sign: 1,
  };
  if (!Number.isFinite(dividend) || !Number.isFinite(divisor)) {
    return { ...empty, reason: "Enter two whole numbers." };
  }
  if (!Number.isInteger(dividend) || !Number.isInteger(divisor)) {
    return { ...empty, reason: "Long division shown here is for whole numbers. Use the decimal view for the fractional result." };
  }
  if (divisor === 0) {
    return { ...empty, reason: "Cannot divide by zero." };
  }

  const sign: 1 | -1 = (dividend < 0) !== (divisor < 0) ? -1 : 1;
  const absDividend = Math.abs(dividend);
  const absDivisor = Math.abs(divisor);
  const digits = String(absDividend).split("");

  const steps: Step[] = [];
  let chunk = 0;
  let quotientStarted = false;
  let quotientStr = "";

  for (let i = 0; i < digits.length; i++) {
    const d = Number(digits[i]);
    const chunkBeforeNum = chunk * 10 + d;
    chunk = chunkBeforeNum;

    if (chunk >= absDivisor) {
      const qd = Math.floor(chunk / absDivisor);
      const sub = qd * absDivisor;
      const rem = chunk - sub;
      steps.push({
        bringDown: steps.length === 0 ? "" : digits[i],
        chunkBefore: String(chunkBeforeNum),
        chunkValue: chunkBeforeNum,
        quotientDigit: qd,
        subtract: sub,
        remainder: rem,
      });
      chunk = rem;
      quotientStr += String(qd);
      quotientStarted = true;
    } else if (quotientStarted) {
      // Divisor doesn't fit, but we've already started writing the quotient,
      // so a 0 belongs in this position.
      quotientStr += "0";
      steps.push({
        bringDown: digits[i],
        chunkBefore: String(chunkBeforeNum),
        chunkValue: chunkBeforeNum,
        quotientDigit: 0,
        subtract: 0,
        remainder: chunkBeforeNum,
      });
    }
    // else: still consuming leading digits smaller than divisor; no quotient digit yet
  }

  if (quotientStr === "") quotientStr = "0";

  const absQuotient = Number(quotientStr);
  const quotient = sign === -1 && absQuotient !== 0 ? -absQuotient : absQuotient;
  const remainder = chunk; // always 0 <= remainder < absDivisor by construction

  return {
    ok: true,
    quotient,
    remainder,
    steps,
    quotientDigits: (sign === -1 && absQuotient !== 0 ? "-" : "") + quotientStr,
    absDividend: String(absDividend),
    absDivisor,
    sign,
  };
}

// Decimal expansion: keep appending zeros to the running remainder
// and emit one quotient digit per pass, capped at maxDecimals.
function decimalExpand(dividend: number, divisor: number, maxDecimals = 20): string {
  if (!Number.isFinite(dividend) || !Number.isFinite(divisor) || divisor === 0) return "—";
  const sign = (dividend < 0) !== (divisor < 0) ? "-" : "";
  const n = Math.abs(dividend);
  const d = Math.abs(divisor);
  const whole = Math.floor(n / d);
  let rem = n - whole * d;
  if (rem === 0) return `${sign}${whole}`;
  let out = `${sign}${whole}.`;
  for (let i = 0; i < maxDecimals && rem !== 0; i++) {
    rem *= 10;
    const qd = Math.floor(rem / d);
    out += String(qd);
    rem -= qd * d;
  }
  if (rem !== 0) out += "…";
  return out;
}

export function Calculator() {
  const [dividend, setDividend] = useState(1234);
  const [divisor, setDivisor] = useState(7);
  const [view, setView] = useState<View>("steps");

  const result = useMemo(() => divide(dividend, divisor), [dividend, divisor]);
  const decimal = useMemo(() => decimalExpand(dividend, divisor), [dividend, divisor]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="View"
          value={view}
          onChange={(v) => setView(v as View)}
          options={[
            { value: "steps", label: "Step-by-step" },
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
          label="Dividend"
          type="number"
          inputMode="numeric"
          value={dividend}
          onChange={(e) => setDividend(Number(e.target.value))}
          step={1}
          supportingText="The number being divided (goes under the bracket)."
        />
        <TextField
          label="Divisor"
          type="number"
          inputMode="numeric"
          value={divisor}
          onChange={(e) => setDivisor(Number(e.target.value))}
          step={1}
          supportingText="The number you are dividing by. Cannot be 0."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Quotient</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {result.ok ? result.quotient : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Remainder</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {result.ok ? result.remainder : "—"}
            </p>
          </div>
          {result.ok && (
            <div className="sm:col-span-2 md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
              {dividend} ÷ {divisor} = <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">{result.quotient}</span>
              {result.remainder !== 0 && (
                <>
                  {" "}remainder <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">{result.remainder}</span>
                  {" "}(or {result.quotient} and {result.remainder}/{result.absDivisor})
                </>
              )}
            </div>
          )}
          {!result.ok && result.reason && (
            <div className="sm:col-span-2 md-body-medium text-[var(--md-sys-color-error)]">{result.reason}</div>
          )}
        </div>
      </Card>

      {result.ok && view === "steps" && result.steps.length > 0 && (
        <Card variant="filled" className="mt-4 p-4">
          <p className="md-label-medium uppercase tracking-wide mb-3 text-[var(--md-sys-color-on-surface-variant)]">
            Long-division steps
          </p>
          <ol className="grid gap-3">
            {result.steps.map((s, i) => (
              <li key={i} className="md-body-medium">
                <span className="md-label-large mr-2">Step {i + 1}.</span>
                {s.bringDown ? <>Bring down {s.bringDown} to make </> : <>Start with </>}
                <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">{s.chunkBefore}</span>.{" "}
                {result.absDivisor} fits into {s.chunkBefore}{" "}
                <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">{s.quotientDigit}</span> time
                {s.quotientDigit === 1 ? "" : "s"} ({s.quotientDigit} × {result.absDivisor} = {s.subtract}).{" "}
                Subtract: {s.chunkBefore} − {s.subtract} ={" "}
                <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">{s.remainder}</span>.
              </li>
            ))}
            <li className="md-body-medium pt-2 border-t border-[var(--md-sys-color-outline-variant)]">
              <span className="md-label-large mr-2">Check.</span>
              {result.quotient} × {divisor} + {result.remainder} ={" "}
              <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">{result.quotient * divisor + result.remainder}</span>.
            </li>
          </ol>
        </Card>
      )}

      {result.ok && view === "decimal" && (
        <Card variant="filled" className="mt-4 p-4">
          <p className="md-label-medium uppercase tracking-wide mb-2 text-[var(--md-sys-color-on-surface-variant)]">
            Decimal expansion
          </p>
          <p className="md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
            {decimal}
          </p>
          <p className="md-body-small mt-2 text-[var(--md-sys-color-on-surface-variant)]">
            Shown to at most 20 decimal places. A trailing … means the expansion is non-terminating (often repeating).
          </p>
        </Card>
      )}

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Algorithm follows the standard place-value method described in Common Core 4.NBT.B.6.
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
