"use client";

import { useMemo, useState } from "react";

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

type Field = {
  id: string;
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
};

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

  const fields: Field[] = [
    { id: "balance", label: "Current mortgage balance", value: balance, min: 1000, max: 5_000_000, step: 1000, suffix: "USD" },
    { id: "rate", label: "Interest rate", value: ratePct, min: 0, max: 25, step: 0.05, suffix: "% APR" },
    { id: "years", label: "Years remaining on loan", value: yearsRemaining, min: 1, max: 40, step: 0.5, suffix: "years" },
    { id: "lump", label: "Lump-sum prepayment", value: lumpSum, min: 0, max: balance, step: 500, suffix: "USD" },
    { id: "fee", label: "Recast fee (lender)", value: recastFee, min: 0, max: 1000, step: 10, suffix: "USD" },
  ];

  function setField(id: string, n: number) {
    if (id === "balance") setBalance(n);
    if (id === "rate") setRatePct(n);
    if (id === "years") setYearsRemaining(n);
    if (id === "lump") setLumpSum(n);
    if (id === "fee") setRecastFee(n);
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {fields.map((f) => {
          const errId = `${f.id}-err`;
          let err: string | null = null;
          if (f.id === "lump" && !lumpValid) err = "Lump sum can't exceed current balance.";
          if (f.id === "rate" && !ratePositive) err = "Rate can't be negative.";
          if (f.id === "balance" && !balancePositive) err = "Balance must be positive.";

          return (
            <div key={f.id} className={f.id === "balance" ? "sm:col-span-2" : ""}>
              <label htmlFor={f.id} className="block text-sm font-medium">
                {f.label}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id={f.id}
                  name={f.id}
                  type="number"
                  inputMode="decimal"
                  value={Number.isFinite(f.value) ? f.value : ""}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  aria-invalid={Boolean(err)}
                  aria-errormessage={err ? errId : undefined}
                  onChange={(e) => setField(f.id, Number(e.target.value))}
                  className="w-full"
                />
                {f.suffix ? (
                  <span className="text-sm text-[var(--color-on-surface-variant)]">
                    {f.suffix}
                  </span>
                ) : null}
              </div>
              {err ? (
                <p id={errId} className="mt-1 text-sm text-[var(--color-danger)]">
                  {err}
                </p>
              ) : null}
            </div>
          );
        })}
      </form>

      <div
        role="status"
        aria-live="polite"
        className="mt-6 grid gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 sm:grid-cols-2"
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
      <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">
        Estimates only. Same rate and remaining term assumed (recasts don&apos;t
        reset either). Confirm exact savings with your servicer&apos;s reamortization
        statement.
      </p>
    </div>
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
      <p className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
        {label}
      </p>
      <p
        className={[
          "mt-0.5 font-mono tabular-nums",
          emphasized ? "text-lg font-semibold" : "text-base",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
