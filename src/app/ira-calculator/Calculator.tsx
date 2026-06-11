"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// IRA future value (annuity-due-free, end-of-year contributions):
//   FV = B*(1+r)^n + C * ((1+r)^n - 1)/r
// Where B = current balance, C = annual contribution, r = expected return,
// n = years to retirement (retirementAge - currentAge).
//
// 2025 IRS contribution limits used as guidance (TODO_VERIFY annually):
//   Under 50: $7,000   |   50+: $8,000 (includes $1,000 catch-up)
//   Source: https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits

type AccountType = "traditional" | "roth";

function projectFV(balance: number, contribution: number, ratePct: number, years: number) {
  if (!Number.isFinite(balance) || !Number.isFinite(contribution) || !Number.isFinite(ratePct) || !Number.isFinite(years)) {
    return NaN;
  }
  if (years <= 0) return balance;
  const r = ratePct / 100;
  const growth = Math.pow(1 + r, years);
  if (r === 0) return balance + contribution * years;
  return balance * growth + contribution * ((growth - 1) / r);
}

function formatUSD(n: number, fractionDigits = 0) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function Calculator() {
  const [accountType, setAccountType] = useState<AccountType>("roth");
  const [balance, setBalance] = useState(10000);
  const [contribution, setContribution] = useState(7000);
  const [returnPct, setReturnPct] = useState(7);
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);

  const { years, futureValue, totalContributed, growth } = useMemo(() => {
    const yrs = Math.max(0, retirementAge - currentAge);
    const fv = projectFV(balance, contribution, returnPct, yrs);
    const contributed = balance + contribution * yrs;
    return {
      years: yrs,
      futureValue: fv,
      totalContributed: contributed,
      growth: Number.isFinite(fv) ? fv - contributed : NaN,
    };
  }, [balance, contribution, returnPct, currentAge, retirementAge]);

  const taxNote =
    accountType === "roth"
      ? "Roth IRA: qualified withdrawals after age 59½ are tax-free, so the projected balance is close to what you'd keep."
      : "Traditional IRA: withdrawals in retirement are taxed as ordinary income. Apply your expected future tax rate to estimate net spendable dollars.";

  const overContribution =
    contribution > 8000
      ? "Heads up: above the 2025 IRS limit ($7,000, or $8,000 with the 50+ catch-up)."
      : contribution > 7000
      ? "Above the standard 2025 IRA limit ($7,000). Only allowed if age 50+ ($8,000 cap with catch-up)."
      : "";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not tax or investment advice. IRS rules change each
        year — confirm limits in Publication 590-A before contributing.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Account type"
          value={accountType}
          onChange={(v) => setAccountType(v as AccountType)}
          options={[
            { value: "traditional", label: "Traditional" },
            { value: "roth", label: "Roth" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Current balance"
          type="number"
          inputMode="decimal"
          value={balance}
          onChange={(e) => setBalance(Number(e.target.value))}
          min={0}
          max={10_000_000}
          step={100}
          trailing="$"
          supportingText="Current value of your IRA from your latest statement."
        />
        <TextField
          label="Annual contribution"
          type="number"
          inputMode="decimal"
          value={contribution}
          onChange={(e) => setContribution(Number(e.target.value))}
          min={0}
          max={10000}
          step={100}
          trailing="$"
          supportingText={overContribution || "2025 IRS limit: $7,000 (under 50) or $8,000 (50+)."}
        />
        <TextField
          label="Expected annual return"
          type="number"
          inputMode="decimal"
          value={returnPct}
          onChange={(e) => setReturnPct(Number(e.target.value))}
          min={0}
          max={20}
          step={0.1}
          trailing="%"
          supportingText="Common planning figure: 5–7% real. Past returns don't guarantee future results."
        />
        <TextField
          label="Current age"
          type="number"
          inputMode="numeric"
          value={currentAge}
          onChange={(e) => setCurrentAge(Number(e.target.value))}
          min={18}
          max={100}
          step={1}
          trailing="yrs"
        />
        <TextField
          label="Retirement age"
          type="number"
          inputMode="numeric"
          value={retirementAge}
          onChange={(e) => setRetirementAge(Number(e.target.value))}
          min={18}
          max={100}
          step={1}
          trailing="yrs"
          supportingText="Roth withdrawals are penalty-free after age 59½."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Projected balance at age {retirementAge}
            </p>
            <p className="mt-1 md-display-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {formatUSD(futureValue)}
            </p>
            <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
              {years} year{years === 1 ? "" : "s"} from now ·{" "}
              {accountType === "roth" ? "Roth IRA" : "Traditional IRA"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Total contributed</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-on-surface)]">
              {formatUSD(totalContributed)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Investment growth</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-tertiary)]">
              {formatUSD(growth)}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        {taxNote} Compounding assumes end-of-year contributions and a constant return —
        real markets fluctuate. {/* TODO_VERIFY: IRS 2025 IRA limits — https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits */}
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
