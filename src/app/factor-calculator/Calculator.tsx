"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Factor finder — trial division up to sqrt(n), O(sqrt n).
// Prime factorisation — repeatedly divide by the smallest prime that fits.
// See NIST Dictionary of Algorithms — https://xlinux.nist.gov/dads/HTML/trialDivision.html
// Algorithm is mathematical (not time-sensitive), so no TODO_VERIFY needed on the math constants.

type View = "all" | "pairs" | "prime";

function findFactors(n: number): number[] {
  if (!Number.isInteger(n) || n < 1) return [];
  const out: number[] = [];
  const root = Math.floor(Math.sqrt(n));
  for (let i = 1; i <= root; i++) {
    if (n % i === 0) {
      out.push(i);
      if (i !== n / i) out.push(n / i);
    }
  }
  return out.sort((a, b) => a - b);
}

function factorPairs(n: number): Array<[number, number]> {
  if (!Number.isInteger(n) || n < 1) return [];
  const out: Array<[number, number]> = [];
  const root = Math.floor(Math.sqrt(n));
  for (let i = 1; i <= root; i++) {
    if (n % i === 0) out.push([i, n / i]);
  }
  return out;
}

function primeFactorisation(n: number): Array<{ prime: number; power: number }> {
  if (!Number.isInteger(n) || n < 2) return [];
  const out: Array<{ prime: number; power: number }> = [];
  let m = n;
  // Pull out 2s first, then odd trial divisors.
  let count = 0;
  while (m % 2 === 0) { m /= 2; count++; }
  if (count > 0) out.push({ prime: 2, power: count });
  for (let p = 3; p * p <= m; p += 2) {
    count = 0;
    while (m % p === 0) { m /= p; count++; }
    if (count > 0) out.push({ prime: p, power: count });
  }
  if (m > 1) out.push({ prime: m, power: 1 });
  return out;
}

function formatPrime(parts: Array<{ prime: number; power: number }>): string {
  if (parts.length === 0) return "—";
  return parts
    .map((p) => (p.power === 1 ? `${p.prime}` : `${p.prime}^${p.power}`))
    .join(" × ");
}

function isPerfectSquare(parts: Array<{ prime: number; power: number }>): boolean {
  if (parts.length === 0) return false;
  return parts.every((p) => p.power % 2 === 0);
}

export function Calculator() {
  const [raw, setRaw] = useState("360");
  const [view, setView] = useState<View>("all");

  const parsed = useMemo(() => {
    const trimmed = raw.trim();
    if (trimmed === "") return { n: NaN, error: "Enter a positive integer." };
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return { n: NaN, error: "Not a number." };
    if (!Number.isInteger(n)) return { n: NaN, error: "Must be a whole number." };
    if (n < 1) return { n: NaN, error: "Must be 1 or larger." };
    if (n > 10_000_000) return { n: NaN, error: "Keep it under 10,000,000 for snappy results." };
    return { n, error: "" };
  }, [raw]);

  const result = useMemo(() => {
    if (!Number.isFinite(parsed.n)) return null;
    const n = parsed.n;
    const factors = findFactors(n);
    const pairs = factorPairs(n);
    const prime = primeFactorisation(n);
    const square = isPerfectSquare(prime);
    const isPrime = n > 1 && factors.length === 2;
    return { n, factors, pairs, prime, square, isPrime };
  }, [parsed.n]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Show"
          value={view}
          onChange={(v) => setView(v as View)}
          options={[
            { value: "all", label: "All factors" },
            { value: "pairs", label: "Factor pairs" },
            { value: "prime", label: "Prime factorisation" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Positive integer"
          type="number"
          inputMode="numeric"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          min={1}
          max={10_000_000}
          step={1}
          supportingText={parsed.error || "Any whole number from 1 to 10,000,000."}
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-y-4">
          {result === null ? (
            <p className="md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
              Waiting for a valid number.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                  Number of factors
                </p>
                <p className="md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                  {result.factors.length}
                </p>
                {result.isPrime && (
                  <span className="md-label-large rounded-full px-3 py-1 bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]">
                    Prime
                  </span>
                )}
                {result.square && (
                  <span className="md-label-large rounded-full px-3 py-1 bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]">
                    Perfect square
                  </span>
                )}
              </div>

              {view === "all" && (
                <div>
                  <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                    Factors of {result.n}
                  </p>
                  <p className="mt-1 md-body-large font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-on-surface)] break-words">
                    {result.factors.join(", ")}
                  </p>
                </div>
              )}

              {view === "pairs" && (
                <div>
                  <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                    Factor pairs ({result.pairs.length})
                  </p>
                  <ul className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 md-body-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                    {result.pairs.map(([a, b]) => (
                      <li key={`${a}-${b}`}>
                        {a} × {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {view === "prime" && (
                <div>
                  <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                    Prime factorisation
                  </p>
                  <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)] break-words">
                    {result.n} = {formatPrime(result.prime)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Trial division runs in O(sqrt n) time, so even 9,999,991 (a prime) finishes in under a millisecond in
        the browser.
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
