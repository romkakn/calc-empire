"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Prorated rent formulas:
//   Daily:  rent × days_occupied ÷ days_in_month
//   Banker: rent × days_occupied ÷ 30
// Daily is the most precise method; banker uses a standardized 30-day month.

type Method = "daily" | "banker";

function daysInMonth(year: number, monthIndex: number) {
  // monthIndex is 0-based (0 = Jan, 11 = Dec). Day 0 of next month = last day of this month.
  return new Date(year, monthIndex + 1, 0).getDate();
}

function proratedRent(rent: number, daysOccupied: number, divisor: number) {
  if (!Number.isFinite(rent) || !Number.isFinite(daysOccupied) || !Number.isFinite(divisor)) return NaN;
  if (divisor <= 0) return NaN;
  return (rent * daysOccupied) / divisor;
}

const TODAY = new Date(2026, 5, 12); // 2026-06-12

function toIsoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function Calculator() {
  const [method, setMethod] = useState<Method>("daily");
  const [rent, setRent] = useState(1500);
  const [moveIn, setMoveIn] = useState(toIsoDate(TODAY));
  const [overrideDays, setOverrideDays] = useState(false);
  const [manualDaysInMonth, setManualDaysInMonth] = useState(30);

  const { daysOccupied, autoDaysInMonth, divisor, prorated, fullMonth } = useMemo(() => {
    const parts = moveIn.split("-").map((n) => Number(n));
    const year = parts[0] ?? TODAY.getFullYear();
    const monthIndex = (parts[1] ?? 1) - 1;
    const day = parts[2] ?? 1;
    const autoDays = daysInMonth(year, monthIndex);
    const effectiveDaysInMonth = overrideDays ? manualDaysInMonth : autoDays;
    const occupied = Math.max(0, effectiveDaysInMonth - day + 1);
    const div = method === "daily" ? effectiveDaysInMonth : 30;
    const result = proratedRent(rent, occupied, div);
    const full = Number.isFinite(rent) ? rent : NaN;
    return {
      daysOccupied: occupied,
      autoDaysInMonth: autoDays,
      divisor: div,
      prorated: result,
      fullMonth: full,
    };
  }, [method, rent, moveIn, overrideDays, manualDaysInMonth]);

  const moneyFmt = (n: number) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 })
      : "—";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not legal advice. Always confirm the prorated
        amount with your landlord in writing before you pay.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Proration method"
          value={method}
          onChange={(v) => setMethod(v as Method)}
          options={[
            { value: "daily", label: "Daily (actual days)" },
            { value: "banker", label: "Banker (÷ 30)" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Monthly rent"
          type="number"
          inputMode="decimal"
          value={rent}
          onChange={(e) => setRent(Number(e.target.value))}
          min={0}
          step={1}
          trailing="USD"
          supportingText="Full monthly rent from the lease."
        />

        <TextField
          label="Move-in date"
          type="date"
          value={moveIn}
          onChange={(e) => setMoveIn(e.target.value)}
          supportingText="First day of occupancy."
        />

        <label className="flex items-center gap-2 md-body-medium sm:col-span-2">
          <input
            type="checkbox"
            checked={overrideDays}
            onChange={(e) => setOverrideDays(e.target.checked)}
            className="size-4"
          />
          Override days-in-month (default: auto-detect {autoDaysInMonth} days)
        </label>

        {overrideDays && (
          <TextField
            label="Days in month"
            type="number"
            inputMode="numeric"
            value={manualDaysInMonth}
            onChange={(e) => setManualDaysInMonth(Number(e.target.value))}
            min={28}
            max={31}
            step={1}
            supportingText="Usually 28–31."
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Prorated rent owed
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {moneyFmt(prorated)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Days occupied / divisor
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {daysOccupied} / {divisor}
            </p>
          </div>
          <div className="sm:col-span-2 md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
            Full month would be <strong>{moneyFmt(fullMonth)}</strong>. You&apos;re paying for{" "}
            <strong>{daysOccupied}</strong> of {divisor} days using the{" "}
            <strong>{method === "daily" ? "daily" : "banker"}</strong> method.
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Both methods are common. Daily is more precise; banker is simpler. Landlord and
        tenant should agree which method applies — get it in writing before paying.
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
