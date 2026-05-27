"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

type Year = {
  year: number;
  shares: number;
  pricePerShare: number;
  divPerShare: number;
  dividendsThisYear: number;
  contribution: number;
  endValue: number;
};

function project(opts: {
  initialInvestment: number;
  sharePrice: number;
  divPerShare: number;
  divGrowthPct: number;
  priceGrowthPct: number;
  annualContribution: number;
  years: number;
  drip: boolean;
}): { rows: Year[]; totals: { totalDividends: number; finalValue: number; finalShares: number } } {
  const rows: Year[] = [];
  let shares = opts.sharePrice > 0 ? opts.initialInvestment / opts.sharePrice : 0;
  let price = opts.sharePrice;
  let dps = opts.divPerShare;
  let totalDividends = 0;

  for (let y = 1; y <= opts.years; y++) {
    const dividendsThisYear = shares * dps;
    totalDividends += dividendsThisYear;
    const endPrice = price * (1 + opts.priceGrowthPct / 100);

    if (opts.drip && endPrice > 0) shares += dividendsThisYear / endPrice;
    if (opts.annualContribution > 0 && endPrice > 0)
      shares += opts.annualContribution / endPrice;

    price = endPrice;
    dps = dps * (1 + opts.divGrowthPct / 100);

    rows.push({
      year: y, shares, pricePerShare: price, divPerShare: dps,
      dividendsThisYear, contribution: opts.annualContribution, endValue: shares * price,
    });
  }

  return {
    rows,
    totals: {
      totalDividends,
      finalValue: rows.at(-1)?.endValue ?? 0,
      finalShares: shares,
    },
  };
}

function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function fmtShares(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function Calculator() {
  const [initialInvestment, setInitial] = useState(10_000);
  const [sharePrice, setSharePrice] = useState(50);
  const [divPerShare, setDivPerShare] = useState(2);
  const [divGrowthPct, setDivGrowth] = useState(6);
  const [priceGrowthPct, setPriceGrowth] = useState(4);
  const [annualContribution, setContribution] = useState(1200);
  const [years, setYears] = useState(20);
  const [drip, setDrip] = useState(true);

  const { rows, totals } = useMemo(
    () =>
      project({
        initialInvestment, sharePrice, divPerShare,
        divGrowthPct, priceGrowthPct, annualContribution, years, drip,
      }),
    [initialInvestment, sharePrice, divPerShare, divGrowthPct, priceGrowthPct, annualContribution, years, drip],
  );

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        aria-label="Dividend projection inputs"
      >
        <TextField label="Initial investment" type="number" inputMode="decimal" value={initialInvestment} onChange={(e) => setInitial(Number(e.target.value))} min={0} step={100} trailing="USD" />
        <TextField label="Share price" type="number" inputMode="decimal" value={sharePrice} onChange={(e) => setSharePrice(Number(e.target.value))} min={0.01} step={0.5} trailing="$ / share" />
        <TextField label="Annual dividend per share" type="number" inputMode="decimal" value={divPerShare} onChange={(e) => setDivPerShare(Number(e.target.value))} min={0} step={0.05} trailing="USD" />
        <TextField label="Dividend growth rate" type="number" inputMode="decimal" value={divGrowthPct} onChange={(e) => setDivGrowth(Number(e.target.value))} min={-50} max={100} step={0.1} trailing="% / yr" />
        <TextField label="Share price growth" type="number" inputMode="decimal" value={priceGrowthPct} onChange={(e) => setPriceGrowth(Number(e.target.value))} min={-50} max={100} step={0.1} trailing="% / yr" />
        <TextField label="Annual contribution" type="number" inputMode="decimal" value={annualContribution} onChange={(e) => setContribution(Number(e.target.value))} min={0} step={100} trailing="USD" />
        <TextField label="Years" type="number" inputMode="numeric" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={60} step={1} trailing="years" />

        <label
          htmlFor="drip"
          className="flex items-center gap-3 rounded-[var(--md-sys-shape-corner-xs)] border border-[var(--md-sys-color-outline)] px-4 min-h-14"
        >
          <input
            id="drip"
            type="checkbox"
            checked={drip}
            onChange={(e) => setDrip(e.target.checked)}
            aria-describedby="drip-hint"
          />
          <span className="md-body-large">Reinvest dividends (DRIP)</span>
        </label>
        <p id="drip-hint" className="md-body-small sm:col-span-2 text-[var(--md-sys-color-on-surface-variant)]">
          With DRIP on, each year&apos;s dividends buy more shares at that year&apos;s price.
        </p>
      </form>

      <Card variant="filled" className="mt-6 p-4 sm:p-5">
        <div
          role="status"
          aria-live="polite"
          aria-label="Projection results"
          className="grid gap-x-6 gap-y-4 sm:grid-cols-3"
        >
          <Out label="Final portfolio value" value={fmtUSD(totals.finalValue)} emphasized />
          <Out label="Total dividends collected" value={fmtUSD(totals.totalDividends)} />
          <Out label="Final share count" value={fmtShares(totals.finalShares)} />
        </div>
      </Card>

      <details className="mt-4 rounded-[var(--md-sys-shape-corner-md)] border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)]">
        <summary className="md-label-large cursor-pointer px-4 py-3 text-[var(--md-sys-color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] rounded-[var(--md-sys-shape-corner-md)]">
          Year-by-year breakdown
        </summary>
        <div className="overflow-x-auto border-t border-[var(--md-sys-color-outline-variant)]">
          <table className="w-full md-body-medium">
            <thead className="bg-[var(--md-sys-color-surface-container)] text-left">
              <tr>
                <th scope="col" className="px-4 py-2 md-label-medium">Year</th>
                <th scope="col" className="px-4 py-2 md-label-medium text-right">Shares</th>
                <th scope="col" className="px-4 py-2 md-label-medium text-right">Dividends</th>
                <th scope="col" className="px-4 py-2 md-label-medium text-right">End value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} className="border-t border-[var(--md-sys-color-outline-variant)]">
                  <td className="px-4 py-1.5">{r.year}</td>
                  <td className="px-4 py-1.5 text-right font-[var(--md-sys-typescale-mono-font)] tabular-nums">{fmtShares(r.shares)}</td>
                  <td className="px-4 py-1.5 text-right font-[var(--md-sys-typescale-mono-font)] tabular-nums">{fmtUSD(r.dividendsThisYear)}</td>
                  <td className="px-4 py-1.5 text-right font-[var(--md-sys-typescale-mono-font)] tabular-nums">{fmtUSD(r.endValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Pre-tax projection. Doesn&apos;t model bid/ask spread, fractional-share
        rounding, or qualified-dividend tax treatment.{" "}
        {/* TODO_VERIFY: surface a 2026-bracket tax toggle */}
      </p>
    </Card>
  );
}

function Out({ label, value, emphasized }: { label: string; value: string; emphasized?: boolean }) {
  return (
    <div>
      <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
        {label}
      </p>
      <p
        className={[
          "mt-1 font-[var(--md-sys-typescale-mono-font)] tabular-nums",
          emphasized
            ? "md-headline-small text-[var(--md-sys-color-primary)]"
            : "md-title-medium",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
