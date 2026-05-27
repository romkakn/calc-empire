"use client";

import { useMemo, useState } from "react";
import {
  federalAnnualWithholding,
  ficaAnnual,
  type FilingStatus,
} from "./federalTax";

type Frequency =
  | "weekly"
  | "biweekly"
  | "semimonthly"
  | "monthly"
  | "annual";

const PERIODS_PER_YEAR: Record<Frequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
  annual: 1,
};

const FREQ_LABEL: Record<Frequency, string> = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  semimonthly: "Semi-monthly",
  monthly: "Monthly",
  annual: "Annual",
};

const STATUS_LABEL: Record<FilingStatus, string> = {
  single: "Single",
  mfj: "Married filing jointly",
  hoh: "Head of household",
};

function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

function fmtPct(p: number): string {
  if (!Number.isFinite(p)) return "—";
  return `${(p * 100).toFixed(1)}%`;
}

export function Calculator() {
  const [grossPerPeriod, setGross] = useState(2500);
  const [frequency, setFrequency] = useState<Frequency>("biweekly");
  const [filingStatus, setStatus] = useState<FilingStatus>("single");
  const [retire401k, setRetire] = useState(150);
  const [hsa, setHsa] = useState(0);
  const [otherPretax, setOtherPretax] = useState(0);
  const [postTax, setPostTax] = useState(0);
  const [statePct, setStatePct] = useState(0);
  const [extraFederalWithholding, setExtraFedWH] = useState(0);

  const summary = useMemo(() => {
    const periods = PERIODS_PER_YEAR[frequency];
    const grossAnnual = grossPerPeriod * periods;
    const annualPreTax = (retire401k + hsa + otherPretax) * periods;
    const annualPostTax = postTax * periods;
    const annualExtraWH = extraFederalWithholding * periods;

    const federalTaxable = Math.max(0, grossAnnual - annualPreTax);
    const federalAnnual =
      federalAnnualWithholding(federalTaxable, filingStatus) + annualExtraWH;

    const fica = ficaAnnual(grossAnnual, filingStatus);
    const stateAnnual = federalTaxable * (statePct / 100);

    const netAnnual =
      grossAnnual -
      annualPreTax -
      federalAnnual -
      fica.total -
      stateAnnual -
      annualPostTax;

    const netPerPeriod = netAnnual / periods;
    const effectiveTotalRate =
      grossAnnual > 0
        ? (federalAnnual + fica.total + stateAnnual) / grossAnnual
        : 0;

    return {
      periods,
      grossAnnual,
      annualPreTax,
      annualPostTax,
      federalAnnual,
      fica,
      stateAnnual,
      netAnnual,
      netPerPeriod,
      effectiveTotalRate,
    };
  }, [
    grossPerPeriod,
    frequency,
    filingStatus,
    retire401k,
    hsa,
    otherPretax,
    postTax,
    statePct,
    extraFederalWithholding,
  ]);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
      <p className="mb-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-sm">
        <strong>Preview build (v0).</strong> Federal-only using 2025 IRS
        Publication 15-T tables; state is a single user-entered flat rate.{" "}
        {/* TODO_VERIFY: swap to 2026 tables + per-state brackets for production */}
      </p>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <Num
          id="gross"
          label="Gross pay per period"
          value={grossPerPeriod}
          onChange={setGross}
          suffix="USD"
          step={50}
          min={0}
        />
        <Select
          id="frequency"
          label="Pay frequency"
          value={frequency}
          options={Object.entries(FREQ_LABEL)}
          onChange={(v) => setFrequency(v as Frequency)}
        />
        <Select
          id="filing"
          label="Filing status"
          value={filingStatus}
          options={Object.entries(STATUS_LABEL)}
          onChange={(v) => setStatus(v as FilingStatus)}
        />
        <Num
          id="state"
          label="State income-tax rate"
          value={statePct}
          onChange={setStatePct}
          suffix="% (flat)"
          step={0.1}
          min={0}
          max={15}
          hint="Quick estimate. Production build will use per-state brackets."
        />
        <Num
          id="retire"
          label="401(k) per period"
          value={retire401k}
          onChange={setRetire}
          suffix="USD pre-tax"
          step={25}
          min={0}
        />
        <Num
          id="hsa"
          label="HSA per period"
          value={hsa}
          onChange={setHsa}
          suffix="USD pre-tax"
          step={25}
          min={0}
        />
        <Num
          id="otherPre"
          label="Other pre-tax deductions"
          value={otherPretax}
          onChange={setOtherPretax}
          suffix="USD"
          step={25}
          min={0}
        />
        <Num
          id="postTax"
          label="Post-tax deductions"
          value={postTax}
          onChange={setPostTax}
          suffix="USD"
          step={25}
          min={0}
        />
        <Num
          id="extraWH"
          label="Extra federal withholding (W-4 4c)"
          value={extraFederalWithholding}
          onChange={setExtraFedWH}
          suffix="USD per period"
          step={10}
          min={0}
        />
      </form>

      <div
        role="status"
        aria-live="polite"
        className="mt-6 grid gap-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 sm:grid-cols-2"
      >
        <Out label="Take-home per period" value={fmtUSD(summary.netPerPeriod)} big />
        <Out label="Take-home per year" value={fmtUSD(summary.netAnnual)} big />
        <Out label="Gross per year" value={fmtUSD(summary.grossAnnual)} />
        <Out label="Federal income tax (annual)" value={fmtUSD(summary.federalAnnual)} />
        <Out label="Social Security" value={fmtUSD(summary.fica.socialSecurity)} />
        <Out label="Medicare" value={fmtUSD(summary.fica.medicare)} />
        <Out label="State income tax" value={fmtUSD(summary.stateAnnual)} />
        <Out label="Effective tax rate" value={fmtPct(summary.effectiveTotalRate)} />
      </div>

      <details className="mt-4 rounded-md border border-[var(--color-border)]">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] rounded-sm">
          Where each dollar goes
        </summary>
        <div className="px-3 py-3">
          <Bar
            grossAnnual={summary.grossAnnual}
            segments={[
              { label: "Federal", value: summary.federalAnnual, color: "#1d4ed8" },
              { label: "Social Security", value: summary.fica.socialSecurity, color: "#166534" },
              { label: "Medicare", value: summary.fica.medicare, color: "#854d0e" },
              { label: "State", value: summary.stateAnnual, color: "#7c2d12" },
              { label: "Pre-tax (401k/HSA/other)", value: summary.annualPreTax, color: "#3f3f46" },
              { label: "Post-tax", value: summary.annualPostTax, color: "#71717a" },
              { label: "Take-home", value: summary.netAnnual, color: "#22c55e" },
            ]}
          />
        </div>
      </details>

      <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">
        Estimates only. Local taxes (NYC, Philadelphia, OH municipalities),
        garnishments, and post-tax benefits like Roth 401(k) aren&apos;t modeled
        in this preview.
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
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
  hint?: string;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
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
          aria-describedby={hintId}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
        {suffix ? (
          <span className="text-sm text-[var(--color-on-surface-variant)]">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Select<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: T;
  options: [string, string][];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1 w-full"
      >
        {options.map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}

function Out({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
        {label}
      </p>
      <p
        className={[
          "mt-0.5 font-mono tabular-nums",
          big ? "text-lg font-semibold" : "text-base",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function Bar({
  grossAnnual,
  segments,
}: {
  grossAnnual: number;
  segments: { label: string; value: number; color: string }[];
}) {
  const total = Math.max(grossAnnual, 1);
  return (
    <div>
      <div
        className="flex h-4 w-full overflow-hidden rounded-full border border-[var(--color-border)]"
        role="img"
        aria-label="Breakdown of gross pay by category"
      >
        {segments.map((s) => {
          const pct = Math.max(0, (s.value / total) * 100);
          if (pct < 0.1) return null;
          return (
            <span
              key={s.label}
              style={{ width: `${pct}%`, backgroundColor: s.color }}
              title={`${s.label}: ${pct.toFixed(1)}%`}
            />
          );
        })}
      </div>
      <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            <span className="flex-1">{s.label}</span>
            <span className="font-mono tabular-nums text-[var(--color-on-surface-variant)]">
              {((s.value / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
