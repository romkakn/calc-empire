"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Standard mortgage amortization formula:
//   M = P · [ r(1+r)^n ] / [ (1+r)^n - 1 ]
// P = principal, r = monthly interest rate, n = months remaining.
// Source: Consumer Financial Protection Bureau, How loan amortization works.
function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0 || principal <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export function Calculator() {
  const [balance, setBalance] = useState(300_000);
  const [ratePct, setRatePct] = useState(6.5);
  const [yearsRemaining, setYearsRemaining] = useState(28);
  const [lumpSum, setLumpSum] = useState(50_000);
  const [recastFee, setRecastFee] = useState(250);

  const months = Math.max(1, Math.round(yearsRemaining * 12));

  const { oldPayment, newPayment, monthlySavings, lifetimeSavings, principalAfter } =
    useMemo(() => {
      const principalAfter = Math.max(0, balance - lumpSum);
      const oldPayment = monthlyPayment(balance, ratePct, months);
      const newPayment = monthlyPayment(principalAfter, ratePct, months);
      const monthlySavings = oldPayment - newPayment;
      const lifetimeSavings = monthlySavings * months - recastFee;
      return { oldPayment, newPayment, monthlySavings, lifetimeSavings, principalAfter };
    }, [balance, ratePct, months, lumpSum, recastFee]);

  const ratePositive = ratePct >= 0;
  const balancePositive = balance > 0;
  const lumpValid = lumpSum >= 0 && lumpSum <= balance;
  const formValid = ratePositive && balancePositive && lumpValid && months > 0;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        aria-label="Mortgage recast inputs"
      >
        <div className="sm:col-span-2">
          <TextField
            label="Current mortgage balance"
            type="number"
            inputMode="decimal"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            min={1000}
            max={5_000_000}
            step={1000}
            trailing="USD"
            supportingText="From your most recent mortgage statement."
            error={!balancePositive ? "Balance must be positive." : undefined}
          />
        </div>

        <TextField
          label="Interest rate"
          type="number"
          inputMode="decimal"
          value={ratePct}
          onChange={(e) => setRatePct(Number(e.target.value))}
          min={0}
          max={25}
          step={0.05}
          trailing="% APR"
          error={!ratePositive ? "Rate can't be negative." : undefined}
        />
        <TextField
          label="Years remaining on loan"
          type="number"
          inputMode="decimal"
          value={yearsRemaining}
          onChange={(e) => setYearsRemaining(Number(e.target.value))}
          min={1}
          max={40}
          step={0.5}
          trailing="years"
        />
        <TextField
          label="Lump-sum prepayment"
          type="number"
          inputMode="decimal"
          value={lumpSum}
          onChange={(e) => setLumpSum(Number(e.target.value))}
          min={0}
          max={balance}
          step={500}
          trailing="USD"
          error={!lumpValid ? "Lump sum can't exceed current balance." : undefined}
        />
        <TextField
          label="Recast fee (lender)"
          type="number"
          inputMode="decimal"
          value={recastFee}
          onChange={(e) => setRecastFee(Number(e.target.value))}
          min={0}
          max={1000}
          step={10}
          trailing="USD"
          supportingText="Most servicers charge $150–$500. Some credit unions waive it."
        />
      </form>

      <Card
        variant="filled"
        as="div"
        className="mt-6 p-4 sm:p-5"
      >
        <div
          role="status"
          aria-live="polite"
          aria-label="Calculated results"
          className="grid gap-x-6 gap-y-4 sm:grid-cols-2"
        >
          <ResultRow
            label="Current monthly payment"
            value={formValid ? fmtUSD(oldPayment) : "—"}
          />
          <ResultRow
            label="Monthly payment after recast"
            value={formValid ? fmtUSD(newPayment) : "—"}
            emphasized
          />
          <ResultRow
            label="Monthly savings"
            value={formValid ? fmtUSD(monthlySavings) : "—"}
          />
          <ResultRow
            label="Lifetime savings (net of fee)"
            value={formValid ? fmtUSD(lifetimeSavings) : "—"}
            emphasized
          />
          <ResultRow
            label="Principal after lump sum"
            value={formValid ? fmtUSD(principalAfter) : "—"}
          />
          <ResultRow
            label="Months remaining"
            value={formValid ? `${months}` : "—"}
          />
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Estimates only. Same rate and remaining term assumed (recasts don&apos;t
        reset either). Confirm exact savings with your servicer&apos;s reamortization
        statement.
      </p>
    </Card>
  );
}

function ResultRow({
  label,
  value,
  emphasized,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
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
