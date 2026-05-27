"use client";

import { useMemo, useState } from "react";

// DRIP / dividend projection model.
// Each year:
//   dividends_yr = shares * div_per_share
//   if DRIP: reinvest at year-end price → new shares
//   contributions added at year-end at year-end price
//   share price grows by price_growth_pct
//   div_per_share grows by div_growth_pct
//
// This is a deterministic projection; tax, fees, and bid/ask are excluded
// (these compound into "real" return adjustments — flagged in copy as TODO_VERIFY).
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

    if (opts.drip && endPrice > 0) {
      shares += dividendsThisYear / endPrice;
    }
    if (opts.annualContribution > 0 && endPrice > 0) {
      shares += opts.annualContribution / endPrice;
    }

    price = endPrice;
    dps = dps * (1 + opts.divGrowthPct / 100);

    rows.push({
      year: y,
      shares,
      pricePerShare: price,
      divPerShare: dps,
      dividendsThisYear,
      contribution: opts.annualContribution,
      endValue: shares * price,
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
        initialInvestment,
        sharePrice,
        divPerShare,
        divGrowthPct,
        priceGrowthPct,
        annualContribution,
        years,
        drip,
      }),
    [
      initialInvestment,
      sharePrice,
      divPerShare,
      divGrowthPct,
      priceGrowthPct,
      annualContribution,
      years,
      drip,
    ],
  );

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <Num id="initial" label="Initial investment" value={initialInvestment} onChange={setInitial} suffix="USD" step={100} min={0} />
        <Num id="price" label="Share price" value={sharePrice} onChange={setSharePrice} suffix="USD / share" step={0.5} min={0.01} />
        <Num id="dps" label="Annual dividend per share" value={divPerShare} onChange={setDivPerShare} suffix="USD" step={0.05} min={0} />
        <Num id="dgrowth" label="Dividend growth rate" value={divGrowthPct} onChange={setDivGrowth} suffix="% per year" step={0.1} min={-50} max={100} />
        <Num id="pgrowth" label="Share price growth" value={priceGrowthPct} onChange={setPriceGrowth} suffix="% per year" step={0.1} min={-50} max={100} />
        <Num id="contrib" label="Annual contribution" value={annualContribution} onChange={setContribution} suffix="USD" step={100} min={0} />
        <Num id="years" label="Years" value={years} onChange={setYears} suffix="years" step={1} min={1} max={60} />
        <div className="flex items-center gap-3">
          <input
            id="drip"
            type="checkbox"
            checked={drip}
            onChange={(e) => setDrip(e.target.checked)}
            className="h-5 w-5"
            aria-describedby="drip-hint"
          />
          <label htmlFor="drip" className="text-sm font-medium">
            Reinvest dividends (DRIP)
          </label>
        </div>
        <p id="drip-hint" className="sm:col-span-2 text-xs text-[var(--color-on-surface-variant)]">
          With DRIP on, each year&apos;s dividends buy more shares at that year&apos;s price.
        </p>
      </form>

      <div
        role="status"
        aria-live="polite"
        className="mt-6 grid gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 sm:grid-cols-3"
      >
        <Out label="Final portfolio value" value={fmtUSD(totals.finalValue)} big />
        <Out label="Total dividends collected" value={fmtUSD(totals.totalDividends)} />
        <Out label="Final share count" value={fmtShares(totals.finalShares)} />
      </div>

      <details className="mt-4 rounded-md border border-[var(--color-border)]">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] rounded-sm">
          Year-by-year breakdown
        </summary>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-2)] text-left">
              <tr>
                <th scope="col" className="px-3 py-2">Year</th>
                <th scope="col" className="px-3 py-2 text-right">Shares</th>
                <th scope="col" className="px-3 py-2 text-right">Dividends</th>
                <th scope="col" className="px-3 py-2 text-right">End value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} className="border-t border-[var(--color-border)]">
                  <td className="px-3 py-1.5">{r.year}</td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums">{fmtShares(r.shares)}</td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums">{fmtUSD(r.dividendsThisYear)}</td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums">{fmtUSD(r.endValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">
        Pre-tax projection. Doesn&apos;t model bid/ask spread, fractional-share rounding,
        or qualified-dividend tax treatment. {/* TODO_VERIFY: surface a 2026-bracket tax toggle */}
      </p>
    </div>
  );
}

function Num({
  id,
  label,
  value,
  onChange,
  suffix,
  step,
  min,
  max,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2">
        <input
          id={id}
          name={id}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ""}
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
        {suffix ? (
          <span className="text-sm text-[var(--color-on-surface-variant)]">{suffix}</span>
        ) : null}
      </div>
    </div>
  );
}

function Out({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
        {label}
      </p>
      <p className={["mt-0.5 font-mono tabular-nums", big ? "text-lg font-semibold" : ""].join(" ")}>
        {value}
      </p>
    </div>
  );
}
