"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Euclidean algorithm:
//   gcd(a, b) = gcd(b, a mod b) until b = 0; then gcd = a.
//   For three or more: gcd(a, b, c) = gcd(gcd(a, b), c).
// Reference: NIST Dictionary of Algorithms and Data Structures — Euclid's algorithm.

type Method = "euclidean" | "prime-factor";

type Step = { a: number; b: number; r: number };
type EuclidTrace = { pair: [number, number]; steps: Step[]; result: number };

function gcdWithTrace(a: number, b: number): EuclidTrace {
  const start: [number, number] = [a, b];
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  const steps: Step[] = [];
  // Ensure x >= y for a readable trace.
  if (y > x) [x, y] = [y, x];
  while (y !== 0) {
    const r = x % y;
    steps.push({ a: x, b: y, r });
    x = y;
    y = r;
  }
  return { pair: start, steps, result: x };
}

function parseNumbers(raw: string): number[] {
  return raw
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n) && Math.abs(Math.trunc(n)) > 0)
    .map((n) => Math.abs(Math.trunc(n)));
}

function primeFactors(n: number): Map<number, number> {
  const out = new Map<number, number>();
  let x = n;
  for (let p = 2; p * p <= x; p++) {
    while (x % p === 0) {
      out.set(p, (out.get(p) ?? 0) + 1);
      x = Math.floor(x / p);
    }
  }
  if (x > 1) out.set(x, (out.get(x) ?? 0) + 1);
  return out;
}

function formatFactors(map: Map<number, number>): string {
  if (map.size === 0) return "1";
  return Array.from(map.entries())
    .sort(((a, b) => a[0] - b[0]))
    .map(([p, e]) => (e === 1 ? `${p}` : `${p}^${e}`))
    .join(" × ");
}

export function Calculator() {
  const [raw, setRaw] = useState("12, 18, 24");
  const [method, setMethod] = useState<Method>("euclidean");

  const { numbers, gcf, traces, lcm, factorsByNumber, sharedFactors } = useMemo(() => {
    const nums = parseNumbers(raw);
    if (nums.length === 0) {
      return {
        numbers: [] as number[],
        gcf: NaN,
        traces: [] as EuclidTrace[],
        lcm: NaN,
        factorsByNumber: [] as { n: number; factors: Map<number, number> }[],
        sharedFactors: new Map<number, number>(),
      };
    }
    const tr: EuclidTrace[] = [];
    let running = nums[0];
    for (let i = 1; i < nums.length; i++) {
      const t = gcdWithTrace(running, nums[i]);
      tr.push(t);
      running = t.result;
    }
    // LCM for pair only (defined unambiguously when two numbers).
    let lcmVal = NaN;
    if (nums.length === 2 && running > 0) {
      lcmVal = (nums[0] * nums[1]) / running;
    }
    // Prime-factor view for cross-check.
    const fbn = nums.map((n) => ({ n, factors: primeFactors(n) }));
    const shared = new Map<number, number>();
    if (fbn.length > 0) {
      const first = fbn[0].factors;
      for (const [p, e] of first.entries()) {
        let minE = e;
        let inAll = true;
        for (let i = 1; i < fbn.length; i++) {
          const has = fbn[i].factors.get(p);
          if (has === undefined) { inAll = false; break; }
          if (has < minE) minE = has;
        }
        if (inAll) shared.set(p, minE);
      }
    }
    return {
      numbers: nums,
      gcf: running,
      traces: tr,
      lcm: lcmVal,
      factorsByNumber: fbn,
      sharedFactors: shared,
    };
  }, [raw]);

  const validCount = numbers.length;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Method shown"
          value={method}
          onChange={(v) => setMethod(v as Method)}
          options={[
            { value: "euclidean", label: "Euclidean steps" },
            { value: "prime-factor", label: "Prime factorisation" },
          ]}
        />
      </div>

      <form
        className="grid gap-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Numbers"
          type="text"
          inputMode="numeric"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          supportingText="Comma- or space-separated positive integers. Two or more values."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-y-4">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Greatest common factor
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {validCount >= 2 && Number.isFinite(gcf) ? gcf : "—"}
            </p>
            {validCount >= 2 && Number.isFinite(gcf) && (
              <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
                gcd({numbers.join(", ")}) = {gcf}
                {gcf === 1 ? " — these numbers are coprime." : ""}
              </p>
            )}
            {validCount === 1 && (
              <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
                Enter at least two numbers to compute a GCF.
              </p>
            )}
            {validCount === 0 && (
              <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
                Add some positive integers above.
              </p>
            )}
          </div>

          {validCount === 2 && Number.isFinite(lcm) && (
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                Least common multiple
              </p>
              <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                {lcm}
              </p>
              <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
                From a × b = gcd × lcm: ({numbers[0]} × {numbers[1]}) / {gcf} = {lcm}.
              </p>
            </div>
          )}

          {method === "euclidean" && traces.length > 0 && (
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)] mb-2">
                Euclidean trace
              </p>
              <ol className="grid gap-3 list-decimal pl-5 md-body-medium">
                {traces.map((t, i) => (
                  <li key={i}>
                    <p className="md-title-small">
                      gcd({t.pair[0]}, {t.pair[1]}) = {t.result}
                    </p>
                    <ul className="mt-1 grid gap-0.5 font-[var(--md-sys-typescale-mono-font)] tabular-nums md-body-small text-[var(--md-sys-color-on-surface-variant)]">
                      {t.steps.map((s, j) => (
                        <li key={j}>
                          {s.a} mod {s.b} = {s.r}
                          {s.r === 0 ? `  → gcd = ${s.b}` : ""}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {method === "prime-factor" && factorsByNumber.length > 0 && (
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)] mb-2">
                Prime-factor view
              </p>
              <ul className="grid gap-1 font-[var(--md-sys-typescale-mono-font)] tabular-nums md-body-small">
                {factorsByNumber.map(({ n, factors }) => (
                  <li key={n}>
                    {n} = {formatFactors(factors)}
                  </li>
                ))}
              </ul>
              {validCount >= 2 && (
                <p className="md-body-small mt-2">
                  Shared primes at lowest exponent:{" "}
                  <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                    {formatFactors(sharedFactors)}
                  </span>
                  {" = "}
                  <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                    {gcf}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Non-integers and zero are ignored. Negative inputs are treated by absolute value, matching the standard math convention gcd(a, b) = gcd(|a|, |b|).
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
