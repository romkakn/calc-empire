"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Period / ovulation / fertile-window math:
//   next_period_start = last_period_start + cycle_length days
//   ovulation_day     = next_period_start − 14 days (luteal phase ~14d)
//   fertile_window    = [ovulation − 5 days, ovulation + 1 day]
// Sperm lifespan ~5 days, egg viability ~24h — basis for the 6-day fertile window.
// TODO_VERIFY: 14-day luteal-phase constant — ACOG menstrual cycle guidance
// (https://www.acog.org/womens-health/faqs/your-first-period). Luteal phase
// length varies person to person; mid-luteal ~14d is the population mean.

type Mode = "predict" | "trying";

function parseISODate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

function formatISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatLong(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function defaultLastPeriod(): string {
  const today = new Date();
  return formatISO(addDays(today, -14));
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("predict");
  const [lastPeriod, setLastPeriod] = useState<string>(defaultLastPeriod());
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);

  const result = useMemo(() => {
    const start = parseISODate(lastPeriod);
    if (!start || !Number.isFinite(cycleLength) || cycleLength < 20 || cycleLength > 45) {
      return null;
    }
    const nextStart = addDays(start, cycleLength);
    const ovulation = addDays(nextStart, -14);
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = addDays(ovulation, 1);
    const periodEnd = addDays(nextStart, Math.max(0, periodLength - 1));
    return { nextStart, ovulation, fertileStart, fertileEnd, periodEnd };
  }, [lastPeriod, cycleLength, periodLength]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not medical advice or a contraceptive
        tool. Cycles vary; talk to a clinician about reproductive concerns.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="What are you tracking?"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "predict", label: "Next period" },
            { value: "trying", label: "Fertile window" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="First day of your last period"
          type="date"
          value={lastPeriod}
          onChange={(e) => setLastPeriod(e.target.value)}
          supportingText="Day 1 = first day of bleeding."
        />
        <TextField
          label="Average cycle length"
          type="number"
          inputMode="numeric"
          value={cycleLength}
          onChange={(e) => setCycleLength(Number(e.target.value))}
          min={20}
          max={45}
          step={1}
          trailing="days"
          supportingText="Typical 21–35. Default 28."
        />
        <TextField
          label="Period length"
          type="number"
          inputMode="numeric"
          value={periodLength}
          onChange={(e) => setPeriodLength(Number(e.target.value))}
          min={1}
          max={10}
          step={1}
          trailing="days"
          supportingText="How many days you usually bleed."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div
          role="status"
          aria-live="polite"
          className="grid gap-x-6 gap-y-4 sm:grid-cols-2"
        >
          {result ? (
            <>
              {mode === "predict" ? (
                <>
                  <div>
                    <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                      Next period starts
                    </p>
                    <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                      {formatLong(result.nextStart)}
                    </p>
                  </div>
                  <div>
                    <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                      Likely last day
                    </p>
                    <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                      {formatLong(result.periodEnd)}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                      Fertile window
                    </p>
                    <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                      {formatLong(result.fertileStart)}
                    </p>
                    <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">
                      to {formatLong(result.fertileEnd)}
                    </p>
                  </div>
                  <div>
                    <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                      Estimated ovulation
                    </p>
                    <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                      {formatLong(result.ovulation)}
                    </p>
                  </div>
                </>
              )}
              <div className="sm:col-span-2 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
                Cycle {cycleLength} days · ovulation ≈ next start − 14 ·
                fertile window = ovulation − 5 days to ovulation + 1 day.
              </div>
            </>
          ) : (
            <p className="md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
              Enter a valid date and a cycle length between 20 and 45 days.
            </p>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Calendar-based estimates assume a regular cycle. Stress, illness, travel,
        PCOS, perimenopause, breastfeeding, and hormonal contraception all shift
        these dates. Use a basal body temperature chart or ovulation predictor
        kit if precision matters.
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
