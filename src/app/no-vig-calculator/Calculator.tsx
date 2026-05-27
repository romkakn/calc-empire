"use client";

import { useMemo, useState } from "react";

// American odds → implied probability.
// Source: standard sportsbook math; covered in any bookmaking primer
// (e.g., "Sharper" by Miller & Davidow, or Pinnacle's "Removing the margin" article).
function americanToProb(odds: number): number {
  if (!Number.isFinite(odds) || odds === 0) return NaN;
  return odds > 0 ? 100 / (odds + 100) : -odds / (-odds + 100);
}

function probToAmerican(p: number): number {
  if (p <= 0 || p >= 1) return NaN;
  return p >= 0.5 ? Math.round((-100 * p) / (1 - p)) : Math.round((100 * (1 - p)) / p);
}

function fmtAmerican(odds: number): string {
  if (!Number.isFinite(odds)) return "—";
  return odds > 0 ? `+${odds}` : `${odds}`;
}

function fmtPct(p: number, digits = 2): string {
  if (!Number.isFinite(p)) return "—";
  return `${(p * 100).toFixed(digits)}%`;
}

export function Calculator() {
  const [a, setA] = useState(-110);
  const [b, setB] = useState(-110);

  const result = useMemo(() => {
    const pa = americanToProb(a);
    const pb = americanToProb(b);
    if (!Number.isFinite(pa) || !Number.isFinite(pb)) return null;
    const sum = pa + pb;
    const vig = sum - 1; // bookmaker margin
    const fairA = pa / sum;
    const fairB = pb / sum;
    return {
      pa,
      pb,
      sum,
      vig,
      fairA,
      fairB,
      fairAmerA: probToAmerican(fairA),
      fairAmerB: probToAmerican(fairB),
    };
  }, [a, b]);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <OddsField id="a" label="Side A — American odds" value={a} onChange={setA} />
        <OddsField id="b" label="Side B — American odds" value={b} onChange={setB} />
      </form>

      <div
        role="status"
        aria-live="polite"
        className="mt-6 grid gap-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 sm:grid-cols-2"
      >
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
            Side A
          </p>
          <p className="mt-0.5 font-mono">
            Implied: <span className="tabular-nums">{result ? fmtPct(result.pa) : "—"}</span>
          </p>
          <p className="font-mono">
            Fair prob: <span className="tabular-nums">{result ? fmtPct(result.fairA) : "—"}</span>
          </p>
          <p className="font-mono text-lg font-semibold">
            Fair odds: {result ? fmtAmerican(result.fairAmerA) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
            Side B
          </p>
          <p className="mt-0.5 font-mono">
            Implied: <span className="tabular-nums">{result ? fmtPct(result.pb) : "—"}</span>
          </p>
          <p className="font-mono">
            Fair prob: <span className="tabular-nums">{result ? fmtPct(result.fairB) : "—"}</span>
          </p>
          <p className="font-mono text-lg font-semibold">
            Fair odds: {result ? fmtAmerican(result.fairAmerB) : "—"}
          </p>
        </div>
        <div className="sm:col-span-2 border-t border-[var(--color-border)] pt-3">
          <p className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
            Bookmaker margin (vig)
          </p>
          <p className="mt-0.5 font-mono text-lg font-semibold">
            {result ? fmtPct(result.vig, 2) : "—"}
          </p>
          <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
            Method: multiplicative (divide each implied probability by the sum).
            Most accurate for two-way markets near 50/50.
          </p>
        </div>
      </div>
    </div>
  );
}

function OddsField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const invalid = !Number.isFinite(value) || value === 0 || (value > -100 && value < 100);
  const errId = `${id}-err`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="number"
        inputMode="numeric"
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-invalid={invalid}
        aria-errormessage={invalid ? errId : undefined}
        aria-describedby={`${id}-hint`}
        className="mt-1 w-full"
      />
      <p id={`${id}-hint`} className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
        Use positive numbers for underdogs (e.g. +120) and negative for favorites (e.g. −110).
      </p>
      {invalid ? (
        <p id={errId} className="mt-1 text-sm text-[var(--color-danger)]">
          Enter an American price ≤ −100 or ≥ +100.
        </p>
      ) : null}
    </div>
  );
}
