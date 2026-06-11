"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Target heart rate math:
//   MHR  = 220 − age (Fox, 1971). TODO_VERIFY: Fox SM III, Naughton JP, Haskell WL — Physical activity and the prevention of coronary heart disease (Annals of Clinical Research 1971)
//     https://pubmed.ncbi.nlm.nih.gov/4945367/
//   HRR  = MHR − resting HR
//   Karvonen target  = resting HR + intensity × HRR
//   Percent-of-max   = intensity × MHR
//   TODO_VERIFY: Karvonen MJ, Kentala E, Mustala O (1957) — https://pubmed.ncbi.nlm.nih.gov/13470504/

type Method = "karvonen" | "pctmax";

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function maxHr(age: number) {
  return 220 - age;
}

function karvonenTarget(restingHr: number, mhr: number, intensity: number) {
  const hrr = mhr - restingHr;
  return restingHr + intensity * hrr;
}

function pctMaxTarget(mhr: number, intensity: number) {
  return intensity * mhr;
}

function zoneLabel(lowPct: number): { label: string; tone: "ok" | "warn" | "alert" } {
  // Zones 1–5 by intensity percentage (HRR or % of max).
  if (lowPct < 0.50) return { label: "Below zone 1 (very light)", tone: "ok" };
  if (lowPct < 0.60) return { label: "Zone 1 — Very easy (50–60%)", tone: "ok" };
  if (lowPct < 0.70) return { label: "Zone 2 — Easy aerobic (60–70%)", tone: "ok" };
  if (lowPct < 0.80) return { label: "Zone 3 — Moderate (70–80%)", tone: "warn" };
  if (lowPct < 0.90) return { label: "Zone 4 — Threshold (80–90%)", tone: "warn" };
  return { label: "Zone 5 — Near-max (90–100%)", tone: "alert" };
}

export function Calculator() {
  const [method, setMethod] = useState<Method>("karvonen");
  const [age, setAge] = useState(35);
  const [restingHr, setRestingHr] = useState(60);
  const [lowPct, setLowPct] = useState(60); // percent (0–100)
  const [highPct, setHighPct] = useState(70);

  const { mhr, hrr, lowBpm, highBpm, zone } = useMemo(() => {
    const safeAge = clamp(Number.isFinite(age) ? age : 0, 1, 110);
    const safeResting = clamp(Number.isFinite(restingHr) ? restingHr : 0, 30, 120);
    const lo = clamp(Number.isFinite(lowPct) ? lowPct : 0, 30, 100) / 100;
    const hi = clamp(Number.isFinite(highPct) ? highPct : 0, 30, 100) / 100;
    const loFinal = Math.min(lo, hi);
    const hiFinal = Math.max(lo, hi);

    const m = maxHr(safeAge);
    const r = m - safeResting;

    const low =
      method === "karvonen"
        ? karvonenTarget(safeResting, m, loFinal)
        : pctMaxTarget(m, loFinal);
    const high =
      method === "karvonen"
        ? karvonenTarget(safeResting, m, hiFinal)
        : pctMaxTarget(m, hiFinal);

    return {
      mhr: m,
      hrr: r,
      lowBpm: low,
      highBpm: high,
      zone: zoneLabel(loFinal),
    };
  }, [method, age, restingHr, lowPct, highPct]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[zone.tone];

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not medical advice. Talk to your doctor before
        starting a new exercise program, especially if you have heart conditions or take
        heart or blood pressure medication.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Method"
          value={method}
          onChange={(v) => setMethod(v as Method)}
          options={[
            { value: "karvonen", label: "Karvonen (HRR)" },
            { value: "pctmax", label: "Percent of max" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Age"
          type="number"
          inputMode="numeric"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          min={10}
          max={100}
          step={1}
          trailing="yrs"
          supportingText="Used to estimate max HR via 220 − age."
        />
        <TextField
          label="Resting heart rate"
          type="number"
          inputMode="numeric"
          value={restingHr}
          onChange={(e) => setRestingHr(Number(e.target.value))}
          min={30}
          max={120}
          step={1}
          trailing="bpm"
          supportingText={method === "karvonen" ? "Measure in bed, before caffeine." : "Optional for % of max method."}
        />
        <TextField
          label="Intensity low"
          type="number"
          inputMode="numeric"
          value={lowPct}
          onChange={(e) => setLowPct(Number(e.target.value))}
          min={30}
          max={100}
          step={1}
          trailing="%"
          supportingText="Easy zone 2 starts around 60%."
        />
        <TextField
          label="Intensity high"
          type="number"
          inputMode="numeric"
          value={highPct}
          onChange={(e) => setHighPct(Number(e.target.value))}
          min={30}
          max={100}
          step={1}
          trailing="%"
          supportingText="Threshold zone 4 ends around 90%."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Target heart rate
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(lowBpm) && Number.isFinite(highBpm)
                ? `${Math.round(lowBpm)} – ${Math.round(highBpm)} bpm`
                : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Max HR · HR reserve
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(mhr) ? `${Math.round(mhr)} bpm` : "—"}
              <span className="md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
                {method === "karvonen" && Number.isFinite(hrr) ? ` · HRR ${Math.round(hrr)}` : ""}
              </span>
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{zone.label}</span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        {method === "karvonen"
          ? "Karvonen formula uses heart rate reserve to personalize your zone."
          : "Percent-of-max takes a slice of estimated max HR; ignores resting HR."}
        {" "}220 − age has about ±10–12 bpm of variation across people; a field max-effort test is sharper.
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
