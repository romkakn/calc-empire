"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// American odds → implied probability.
// Source: standard sportsbook math (Pinnacle "Removing the margin" article;
// Miller & Davidow, "Sharper").
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
    const vig = sum - 1;
    const fairA = pa / sum;
    const fairB = pb / sum;
    return {
      pa, pb, sum, vig, fairA, fairB,
      fairAmerA: probToAmerican(fairA),
      fairAmerB: probToAmerican(fairB),
    };
  }, [a, b]);

  const invalid = (v: number) =>
    !Number.isFinite(v) || v === 0 || (v > -100 && v < 100);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        aria-label="No-vig inputs"
      >
        <TextField
          label="Side A — American odds"
          type="number"
          inputMode="numeric"
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          supportingText="Use +120 for an underdog, −110 for a favorite."
          error={invalid(a) ? "Enter ≤ −100 or ≥ +100." : undefined}
        />
        <TextField
          label="Side B — American odds"
          type="number"
          inputMode="numeric"
          value={b}
          onChange={(e) => setB(Number(e.target.value))}
          supportingText="Use +120 for an underdog, −110 for a favorite."
          error={invalid(b) ? "Enter ≤ −100 or ≥ +100." : undefined}
        />
      </form>

      <div
        role="status"
        aria-live="polite"
        aria-label="Fair-odds results"
        className="mt-6 grid gap-4 sm:grid-cols-2"
      >
        <Card variant="filled" className="p-4">
          <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
            Side A
          </p>
          <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 md-body-medium">
            <dt className="text-[var(--md-sys-color-on-surface-variant)]">Implied prob</dt>
            <dd className="font-[var(--md-sys-typescale-mono-font)] tabular-nums text-right">{result ? fmtPct(result.pa) : "—"}</dd>
            <dt className="text-[var(--md-sys-color-on-surface-variant)]">Fair prob</dt>
            <dd className="font-[var(--md-sys-typescale-mono-font)] tabular-nums text-right">{result ? fmtPct(result.fairA) : "—"}</dd>
          </dl>
          <p className="mt-3 md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
            Fair odds
          </p>
          <p className="md-headline-small font-[var(--md-sys-typescale-mono-font)] text-[var(--md-sys-color-primary)]">
            {result ? fmtAmerican(result.fairAmerA) : "—"}
          </p>
        </Card>

        <Card variant="filled" className="p-4">
          <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
            Side B
          </p>
          <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 md-body-medium">
            <dt className="text-[var(--md-sys-color-on-surface-variant)]">Implied prob</dt>
            <dd className="font-[var(--md-sys-typescale-mono-font)] tabular-nums text-right">{result ? fmtPct(result.pb) : "—"}</dd>
            <dt className="text-[var(--md-sys-color-on-surface-variant)]">Fair prob</dt>
            <dd className="font-[var(--md-sys-typescale-mono-font)] tabular-nums text-right">{result ? fmtPct(result.fairB) : "—"}</dd>
          </dl>
          <p className="mt-3 md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
            Fair odds
          </p>
          <p className="md-headline-small font-[var(--md-sys-typescale-mono-font)] text-[var(--md-sys-color-primary)]">
            {result ? fmtAmerican(result.fairAmerB) : "—"}
          </p>
        </Card>

        <Card variant="outlined" className="p-4 sm:col-span-2">
          <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
            Bookmaker margin (vig)
          </p>
          <p className="md-headline-small font-[var(--md-sys-typescale-mono-font)] mt-1 text-[var(--md-sys-color-on-surface)]">
            {result ? fmtPct(result.vig, 2) : "—"}
          </p>
          <p className="md-body-small mt-2 text-[var(--md-sys-color-on-surface-variant)]">
            Method: multiplicative — divide each implied probability by their
            sum. Most accurate on two-way markets near 50/50.
          </p>
        </Card>
      </div>
    </Card>
  );
}
