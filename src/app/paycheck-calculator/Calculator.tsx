"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";
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
  weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12, annual: 1,
};
const FREQ_LABEL: Record<Frequency, string> = {
  weekly: "Weekly", biweekly: "Bi-weekly", semimonthly: "Semi-monthly",
  monthly: "Monthly", annual: "Annual",
};
const STATUS_LABEL: Record<FilingStatus, string> = {
  single: "Single",
  mfj: "Married filing jointly",
  hoh: "Head of household",
};

function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}
function fmtPct(p: number): string {
  if (!Number.isFinite(p)) return "—";
  return `${(p * 100).toFixed(1)}%`;
}

export function Calculator({
  defaultStatePct = 0,
  stateLabel,
}: {
  defaultStatePct?: number;
  stateLabel?: string;
} = {}) {
  const [grossPerPeriod, setGross] = useState(2500);
  const [frequency, setFrequency] = useState<Frequency>("biweekly");
  const [filingStatus, setStatus] = useState<FilingStatus>("single");
  const [retire401k, setRetire] = useState(150);
  const [hsa, setHsa] = useState(0);
  const [otherPretax, setOtherPretax] = useState(0);
  const [postTax, setPostTax] = useState(0);
  const [statePct, setStatePct] = useState(defaultStatePct);
  const [extraFederalWithholding, setExtraFedWH] = useState(0);

  const summary = useMemo(() => {
    const periods = PERIODS_PER_YEAR[frequency];
    const grossAnnual = grossPerPeriod * periods;
    const annualPreTax = (retire401k + hsa + otherPretax) * periods;
    const annualPostTax = postTax * periods;
    const annualExtraWH = extraFederalWithholding * periods;

    const federalTaxable = Math.max(0, grossAnnual - annualPreTax);
    const federalAnnual = federalAnnualWithholding(federalTaxable, filingStatus) + annualExtraWH;
    const fica = ficaAnnual(grossAnnual, filingStatus);
    const stateAnnual = federalTaxable * (statePct / 100);

    const netAnnual = grossAnnual - annualPreTax - federalAnnual - fica.total - stateAnnual - annualPostTax;
    const netPerPeriod = netAnnual / periods;
    const effectiveTotalRate =
      grossAnnual > 0 ? (federalAnnual + fica.total + stateAnnual) / grossAnnual : 0;

    return {
      periods, grossAnnual, annualPreTax, annualPostTax,
      federalAnnual, fica, stateAnnual, netAnnual, netPerPeriod, effectiveTotalRate,
    };
  }, [
    grossPerPeriod, frequency, filingStatus,
    retire401k, hsa, otherPretax, postTax, statePct, extraFederalWithholding,
  ]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Preview build (v0).</strong> Federal-only using 2025 IRS
        Publication 15-T tables; state is a single user-entered flat rate.{" "}
        {/* TODO_VERIFY: swap to 2026 tables + per-state brackets */}
      </Card>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        aria-label="Paycheck inputs"
      >
        <TextField label="Gross pay per period" type="number" inputMode="decimal" value={grossPerPeriod} onChange={(e) => setGross(Number(e.target.value))} min={0} step={50} trailing="USD" />
        <MdSelect id="frequency" label="Pay frequency" value={frequency} onChange={(v) => setFrequency(v as Frequency)} options={Object.entries(FREQ_LABEL)} />
        <MdSelect id="filing" label="Filing status" value={filingStatus} onChange={(v) => setStatus(v as FilingStatus)} options={Object.entries(STATUS_LABEL)} />
        <TextField label="State income-tax rate" type="number" inputMode="decimal" value={statePct} onChange={(e) => setStatePct(Number(e.target.value))} min={0} max={15} step={0.1} trailing="% flat" supportingText={stateLabel ? `Pre-filled with ${stateLabel}'s top marginal rate. Override if your effective rate differs.` : "Quick estimate. Production build will use per-state brackets."} />
        <TextField label="401(k) per period" type="number" inputMode="decimal" value={retire401k} onChange={(e) => setRetire(Number(e.target.value))} min={0} step={25} trailing="USD pre-tax" />
        <TextField label="HSA per period" type="number" inputMode="decimal" value={hsa} onChange={(e) => setHsa(Number(e.target.value))} min={0} step={25} trailing="USD pre-tax" />
        <TextField label="Other pre-tax deductions" type="number" inputMode="decimal" value={otherPretax} onChange={(e) => setOtherPretax(Number(e.target.value))} min={0} step={25} trailing="USD" />
        <TextField label="Post-tax deductions" type="number" inputMode="decimal" value={postTax} onChange={(e) => setPostTax(Number(e.target.value))} min={0} step={25} trailing="USD" />
        <TextField label="Extra federal withholding" type="number" inputMode="decimal" value={extraFederalWithholding} onChange={(e) => setExtraFedWH(Number(e.target.value))} min={0} step={10} trailing="USD / period" supportingText="W-4 line 4c." />
      </form>

      <Card variant="filled" className="mt-6 p-4 sm:p-5">
        <div
          role="status"
          aria-live="polite"
          aria-label="Take-home results"
          className="grid gap-x-6 gap-y-4 sm:grid-cols-2"
        >
          <Out label="Take-home per period" value={fmtUSD(summary.netPerPeriod)} emphasized />
          <Out label="Take-home per year" value={fmtUSD(summary.netAnnual)} emphasized />
          <Out label="Gross per year" value={fmtUSD(summary.grossAnnual)} />
          <Out label="Federal income tax (annual)" value={fmtUSD(summary.federalAnnual)} />
          <Out label="Social Security" value={fmtUSD(summary.fica.socialSecurity)} />
          <Out label="Medicare" value={fmtUSD(summary.fica.medicare)} />
          <Out label="State income tax" value={fmtUSD(summary.stateAnnual)} />
          <Out label="Effective tax rate" value={fmtPct(summary.effectiveTotalRate)} />
        </div>
      </Card>

      <details className="mt-4 rounded-[var(--md-sys-shape-corner-md)] border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)]">
        <summary className="md-label-large cursor-pointer px-4 py-3 text-[var(--md-sys-color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] rounded-[var(--md-sys-shape-corner-md)]">
          Where each dollar goes
        </summary>
        <div className="px-4 py-4 border-t border-[var(--md-sys-color-outline-variant)]">
          <Bar
            grossAnnual={summary.grossAnnual}
            segments={[
              { label: "Federal", value: summary.federalAnnual, color: "var(--md-sys-color-primary)" },
              { label: "Social Security", value: summary.fica.socialSecurity, color: "var(--md-sys-color-tertiary)" },
              { label: "Medicare", value: summary.fica.medicare, color: "var(--md-sys-color-secondary)" },
              { label: "State", value: summary.stateAnnual, color: "var(--md-sys-color-error)" },
              { label: "Pre-tax (401k / HSA / other)", value: summary.annualPreTax, color: "var(--md-sys-color-outline)" },
              { label: "Post-tax", value: summary.annualPostTax, color: "var(--md-sys-color-outline-variant)" },
              { label: "Take-home", value: summary.netAnnual, color: "var(--md-sys-color-on-surface)" },
            ]}
          />
        </div>
      </details>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Estimates only. Local taxes (NYC, Philadelphia, OH municipalities),
        garnishments, and post-tax benefits like Roth 401(k) aren&apos;t modeled
        in this preview.
      </p>
    </Card>
  );
}

function MdSelect<T extends string>({
  id, label, value, onChange, options,
}: {
  id: string;
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: [string, string][];
}) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="absolute left-3 -top-2 px-1 bg-[var(--md-sys-color-surface)] md-body-small text-[var(--md-sys-color-on-surface-variant)] pointer-events-none"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full"
      >
        {options.map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
    </div>
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

function Bar({
  grossAnnual, segments,
}: {
  grossAnnual: number;
  segments: { label: string; value: number; color: string }[];
}) {
  const total = Math.max(grossAnnual, 1);
  return (
    <div>
      <div
        className="flex h-3 w-full overflow-hidden rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline-variant)]"
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
      <ul className="mt-3 grid gap-1 md-body-medium sm:grid-cols-2 list-none">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-[var(--md-sys-shape-corner-xs)]"
              style={{ backgroundColor: s.color }}
            />
            <span className="flex-1">{s.label}</span>
            <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-on-surface-variant)]">
              {((s.value / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
