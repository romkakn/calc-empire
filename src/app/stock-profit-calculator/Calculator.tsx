"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Stock profit math:
//   cost           = shares * buy_price + buy_fee
//   proceeds       = shares * sell_price - sell_fee
//   profit         = proceeds - cost
//   return_pct     = profit / cost * 100
//   breakeven_price = (cost + sell_fee) / shares

type Side = "long" | "short";

function computeLong(shares: number, buy: number, sell: number, buyFee: number, sellFee: number) {
  const cost = shares * buy + buyFee;
  const proceeds = shares * sell - sellFee;
  const profit = proceeds - cost;
  const returnPct = cost > 0 ? (profit / cost) * 100 : NaN;
  const breakeven = shares > 0 ? (cost + sellFee) / shares : NaN;
  return { cost, proceeds, profit, returnPct, breakeven };
}

function computeShort(shares: number, sell: number, buy: number, sellFee: number, buyFee: number) {
  // For a short: you sell first (proceeds in), then buy to cover (cost out).
  const proceeds = shares * sell - sellFee;
  const cost = shares * buy + buyFee;
  const profit = proceeds - cost;
  const margin = shares * sell; // rough collateral basis for % return
  const returnPct = margin > 0 ? (profit / margin) * 100 : NaN;
  const breakeven = shares > 0 ? (proceeds - buyFee) / shares : NaN;
  return { cost, proceeds, profit, returnPct, breakeven };
}

function fmtUsd(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function fmtPct(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(2)}%`;
}

export function Calculator() {
  const [side, setSide] = useState<Side>("long");
  const [shares, setShares] = useState(100);
  const [buyPrice, setBuyPrice] = useState(50);
  const [sellPrice, setSellPrice] = useState(65);
  const [buyFee, setBuyFee] = useState(0);
  const [sellFee, setSellFee] = useState(0);

  const result = useMemo(() => {
    const s = Number.isFinite(shares) ? shares : 0;
    const bp = Number.isFinite(buyPrice) ? buyPrice : 0;
    const sp = Number.isFinite(sellPrice) ? sellPrice : 0;
    const bf = Number.isFinite(buyFee) ? buyFee : 0;
    const sf = Number.isFinite(sellFee) ? sellFee : 0;
    return side === "long"
      ? computeLong(s, bp, sp, bf, sf)
      : computeShort(s, sp, bp, sf, bf);
  }, [side, shares, buyPrice, sellPrice, buyFee, sellFee]);

  const profitTone =
    !Number.isFinite(result.profit)
      ? "var(--md-sys-color-on-surface-variant)"
      : result.profit > 0
        ? "var(--md-sys-color-tertiary)"
        : result.profit < 0
          ? "var(--md-sys-color-error)"
          : "var(--md-sys-color-on-surface)";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not investment advice. Brokerage fees, taxes, and currency
        conversion vary — see your trade confirmation and a tax professional for your actual numbers.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Trade side"
          value={side}
          onChange={(v) => setSide(v as Side)}
          options={[
            { value: "long", label: "Long (buy then sell)" },
            { value: "short", label: "Short (sell then buy)" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Shares"
          type="number"
          inputMode="decimal"
          value={shares}
          onChange={(e) => setShares(Number(e.target.value))}
          min={0}
          step={1}
          supportingText="Whole or fractional shares."
        />
        <TextField
          label={side === "long" ? "Buy price (per share)" : "Cover price (per share)"}
          type="number"
          inputMode="decimal"
          value={buyPrice}
          onChange={(e) => setBuyPrice(Number(e.target.value))}
          min={0}
          step={0.01}
          trailing="$"
        />
        <TextField
          label={side === "long" ? "Sell price (per share)" : "Short price (per share)"}
          type="number"
          inputMode="decimal"
          value={sellPrice}
          onChange={(e) => setSellPrice(Number(e.target.value))}
          min={0}
          step={0.01}
          trailing="$"
        />
        <TextField
          label={side === "long" ? "Buy commission" : "Cover commission"}
          type="number"
          inputMode="decimal"
          value={buyFee}
          onChange={(e) => setBuyFee(Number(e.target.value))}
          min={0}
          step={0.01}
          trailing="$"
          supportingText="Total fee for the entry leg (most US brokers: $0)."
        />
        <TextField
          label={side === "long" ? "Sell commission" : "Short commission"}
          type="number"
          inputMode="decimal"
          value={sellFee}
          onChange={(e) => setSellFee(Number(e.target.value))}
          min={0}
          step={0.01}
          trailing="$"
          supportingText="Includes SEC + FINRA TAF on the sell leg if your broker passes them through."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Profit / loss</p>
            <p
              className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums"
              style={{ color: profitTone }}
            >
              {fmtUsd(result.profit)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Return</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtPct(result.returnPct)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {side === "long" ? "Total cost" : "Cover cost"}
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {fmtUsd(result.cost)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {side === "long" ? "Sale proceeds" : "Short proceeds"}
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {fmtUsd(result.proceeds)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {side === "long" ? "Break-even sell price" : "Break-even cover price"}
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {fmtUsd(result.breakeven)} <span className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">per share</span>
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Excludes taxes, margin interest, dividends, and currency conversion.
        {/* TODO_VERIFY: SEC Section 31 fee rate changes annually — confirm at https://www.sec.gov/rules-regulations/statutes-regulations/fee-rate-advisory */}
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
