"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Capital gains tax (US federal, 2025 tax year).
// Short-term (held <= 1 year): taxed as ordinary income at filer's marginal bracket.
// Long-term (held > 1 year): 0% / 15% / 20% brackets, based on total taxable income (incl. gain).
// NIIT: extra 3.8% on net investment income above MAGI thresholds.

type Holding = "short" | "long";
type Filing = "single" | "mfj" | "hoh";

// TODO_VERIFY: 2025 long-term capital gains brackets — IRS Rev. Proc. 2024-40
// https://www.irs.gov/pub/irs-drop/rp-24-40.pdf
const LTCG_BRACKETS: Record<Filing, { zeroTop: number; fifteenTop: number }> = {
  single: { zeroTop: 48350, fifteenTop: 533400 },
  mfj: { zeroTop: 96700, fifteenTop: 600050 },
  hoh: { zeroTop: 64750, fifteenTop: 566700 },
};

// TODO_VERIFY: 2025 ordinary-income brackets (single/MFJ/HOH) — IRS Rev. Proc. 2024-40
// https://www.irs.gov/pub/irs-drop/rp-24-40.pdf
const ORDINARY_BRACKETS: Record<Filing, { upTo: number; rate: number }[]> = {
  single: [
    { upTo: 11925, rate: 0.10 },
    { upTo: 48475, rate: 0.12 },
    { upTo: 103350, rate: 0.22 },
    { upTo: 197300, rate: 0.24 },
    { upTo: 250525, rate: 0.32 },
    { upTo: 626350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  mfj: [
    { upTo: 23850, rate: 0.10 },
    { upTo: 96950, rate: 0.12 },
    { upTo: 206700, rate: 0.22 },
    { upTo: 394600, rate: 0.24 },
    { upTo: 501050, rate: 0.32 },
    { upTo: 751600, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  hoh: [
    { upTo: 17000, rate: 0.10 },
    { upTo: 64850, rate: 0.12 },
    { upTo: 103350, rate: 0.22 },
    { upTo: 197300, rate: 0.24 },
    { upTo: 250500, rate: 0.32 },
    { upTo: 626350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};

// TODO_VERIFY: NIIT 3.8% thresholds (not indexed for inflation) — IRC §1411
// https://www.irs.gov/individuals/net-investment-income-tax
const NIIT_RATE = 0.038;
const NIIT_THRESHOLD: Record<Filing, number> = {
  single: 200000,
  mfj: 250000,
  hoh: 200000,
};

function marginalRate(income: number, filing: Filing): number {
  const brackets = ORDINARY_BRACKETS[filing];
  for (const b of brackets) {
    if (income <= b.upTo) return b.rate;
  }
  return brackets[brackets.length - 1].rate;
}

function ltcgRate(income: number, filing: Filing): number {
  const { zeroTop, fifteenTop } = LTCG_BRACKETS[filing];
  if (income <= zeroTop) return 0;
  if (income <= fifteenTop) return 0.15;
  return 0.20;
}

function calc(
  costBasis: number,
  salePrice: number,
  holding: Holding,
  otherIncome: number,
  filing: Filing,
) {
  const gain = Math.max(0, salePrice - costBasis);
  let baseRate = 0;
  let baseTax = 0;

  if (holding === "short") {
    baseRate = marginalRate(otherIncome + gain, filing);
    baseTax = gain * baseRate;
  } else {
    baseRate = ltcgRate(otherIncome + gain, filing);
    baseTax = gain * baseRate;
  }

  // NIIT applies to net investment income to the extent MAGI exceeds threshold.
  const magi = otherIncome + gain;
  const niitBase = Math.max(0, Math.min(gain, magi - NIIT_THRESHOLD[filing]));
  const niit = niitBase * NIIT_RATE;

  const total = baseTax + niit;
  const netProceeds = salePrice - costBasis - total;
  const effective = gain > 0 ? total / gain : 0;

  return { gain, baseRate, baseTax, niit, total, netProceeds, effective };
}

const usd = (n: number) =>
  Number.isFinite(n)
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "—";

export function Calculator() {
  const [costBasis, setCostBasis] = useState(10000);
  const [salePrice, setSalePrice] = useState(25000);
  const [holding, setHolding] = useState<Holding>("long");
  const [otherIncome, setOtherIncome] = useState(75000);
  const [filing, setFiling] = useState<Filing>("single");

  const result = useMemo(
    () => calc(costBasis, salePrice, holding, otherIncome, filing),
    [costBasis, salePrice, holding, otherIncome, filing],
  );

  const loss = salePrice < costBasis;
  const ratePct = (result.baseRate * 100).toFixed(0);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Estimate only.</strong> Federal tax, 2025 tax year. State tax not included.
        Talk to a CPA or enrolled agent before filing.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Holding period"
          value={holding}
          onChange={(v) => setHolding(v as Holding)}
          options={[
            { value: "short", label: "Short-term (≤ 1 yr)" },
            { value: "long", label: "Long-term (> 1 yr)" },
          ]}
        />
        <Segment
          label="Filing status"
          value={filing}
          onChange={(v) => setFiling(v as Filing)}
          options={[
            { value: "single", label: "Single" },
            { value: "mfj", label: "MFJ" },
            { value: "hoh", label: "HOH" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Cost basis"
          type="number"
          inputMode="decimal"
          value={costBasis}
          onChange={(e) => setCostBasis(Number(e.target.value))}
          min={0}
          step={100}
          leading="$"
          supportingText="What you originally paid (plus reinvested dividends, commissions)."
        />
        <TextField
          label="Sale price"
          type="number"
          inputMode="decimal"
          value={salePrice}
          onChange={(e) => setSalePrice(Number(e.target.value))}
          min={0}
          step={100}
          leading="$"
          supportingText="Net proceeds after sale (price minus broker fees)."
        />
        <TextField
          label="Other taxable income"
          type="number"
          inputMode="decimal"
          value={otherIncome}
          onChange={(e) => setOtherIncome(Number(e.target.value))}
          min={0}
          step={1000}
          leading="$"
          supportingText="Your other income for the year — wages, business profit, interest."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Capital gain
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {loss ? `−${usd(costBasis - salePrice)}` : usd(result.gain)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {holding === "short" ? "Marginal income rate" : "Long-term cap gains rate"}
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {ratePct}%
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Federal tax on gain
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {loss ? "$0" : usd(result.baseTax)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              NIIT (3.8%)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {usd(result.niit)}
            </p>
          </div>
          <div className="sm:col-span-2 border-t border-[var(--md-sys-color-outline-variant)] pt-3">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Total federal tax
            </p>
            <p className="mt-1 md-display-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {loss ? "$0" : usd(result.total)}
            </p>
            {!loss && result.gain > 0 && (
              <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
                Effective rate {(result.effective * 100).toFixed(1)}% on the gain. Net after tax:{" "}
                {usd(result.netProceeds)}.
              </p>
            )}
            {loss && (
              <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
                You have a capital loss. Up to $3,000/yr ($1,500 if MFS) can offset ordinary income;
                the rest carries forward.
              </p>
            )}
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Federal only — most states tax capital gains too (rates vary). Doesn&apos;t cover wash sales,
        Section 1202 exclusions, collectibles (28%), or qualified small business stock.
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
