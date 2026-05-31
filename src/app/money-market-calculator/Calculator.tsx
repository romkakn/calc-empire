"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Money-market projection with daily compounding and monthly contributions:
//   daily factor d = 1 + APY/365
//   monthly factor m = d^30
//   balance after n months: B0 * m^n + C * (m^n - 1) / (m - 1)
// FDIC insurance limit is $250,000 per depositor per ownership category.
// TODO_VERIFY: FDIC standard maximum deposit insurance amount — confirm at publish
// Source: https://www.fdic.gov/resources/deposit-insurance/

type View = "balance" | "breakdown";

function project(initial: number, apyPct: number, monthly: number, years: number) {
  const months = Math.max(0, Math.round(years * 12));
  const apy = apyPct / 100;
  const d = 1 + apy / 365;
  const m = Math.pow(d, 30);
  let balance = initial;
  for (let i = 0; i < months; i++) {
    balance = balance * m + monthly;
  }
  const contributed = initial + monthly * months;
  const interest = balance - contributed;
  return { balance, contributed, interest, months };
}

function fmtUsd(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const FDIC_LIMIT = 250_000;

export function Calculator() {
  const [view, setView] = useState<View>("balance");
  const [initial, setInitial] = useState(10000);
  const [apy, setApy] = useState(4.5);
  const [monthly, setMonthly] = useState(250);
  const [years, setYears] = useState(5);

  const { balance, contributed, interest, months } = useMemo(
    () => project(initial, apy, monthly, years),
    [initial, apy, monthly, years],
  );

  const overLimit = balance > FDIC_LIMIT;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not financial advice. Rates and account terms vary
        by institution; verify the current APY before opening an account.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="View"
          value={view}
          onChange={(v) => setView(v as View)}
          options={[
            { value: "balance", label: "Final balance" },
            { value: "breakdown", label: "Contributions vs interest" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Initial deposit"
          type="number"
          inputMode="decimal"
          value={initial}
          onChange={(e) => setInitial(Number(e.target.value))}
          min={0}
          max={10_000_000}
          step={100}
          leading="$"
          supportingText="The amount you open the account with today."
        />
        <TextField
          label="APY"
          type="number"
          inputMode="decimal"
          value={apy}
          onChange={(e) => setApy(Number(e.target.value))}
          min={0}
          max={20}
          step={0.05}
          trailing="%"
          supportingText="Annual percentage yield as posted by your bank."
        />
        <TextField
          label="Monthly contribution"
          type="number"
          inputMode="decimal"
          value={monthly}
          onChange={(e) => setMonthly(Number(e.target.value))}
          min={0}
          max={1_000_000}
          step={25}
          leading="$"
          supportingText="Set to 0 to grow only the opening deposit."
        />
        <TextField
          label="Years"
          type="number"
          inputMode="decimal"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          min={0}
          max={50}
          step={1}
          trailing="yrs"
          supportingText="Time horizon for the projection."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {view === "balance" ? (
            <>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                  Projected balance
                </p>
                <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                  {fmtUsd(balance)}
                </p>
              </div>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                  After
                </p>
                <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                  {months} mo
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                  Total contributed
                </p>
                <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                  {fmtUsd(contributed)}
                </p>
              </div>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                  Interest earned
                </p>
                <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-tertiary)]">
                  {fmtUsd(interest)}
                </p>
              </div>
            </>
          )}
          {overLimit && (
            <div className="sm:col-span-2 flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block size-3 rounded-full"
                style={{ backgroundColor: "var(--md-sys-color-error)" }}
              />
              <span className="md-title-medium">
                Above the {fmtUsd(FDIC_LIMIT)} FDIC limit at one bank — consider splitting across institutions.
              </span>
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Daily compounding, monthly contribution added at month end. APY is held constant for the projection — real-world rates change over time.
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
