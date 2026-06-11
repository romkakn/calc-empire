"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// CPM = cost per mille (per 1,000 impressions).
//   CPM         = cost / impressions * 1000
//   impressions = cost / CPM * 1000
//   cost        = CPM * impressions / 1000

type Unknown = "cpm" | "impressions" | "cost";

function calcCpm(cost: number, impressions: number) {
  if (!Number.isFinite(cost) || !Number.isFinite(impressions) || impressions <= 0) return NaN;
  return (cost / impressions) * 1000;
}
function calcImpressions(cost: number, cpm: number) {
  if (!Number.isFinite(cost) || !Number.isFinite(cpm) || cpm <= 0) return NaN;
  return (cost / cpm) * 1000;
}
function calcCost(cpm: number, impressions: number) {
  if (!Number.isFinite(cpm) || !Number.isFinite(impressions)) return NaN;
  return (cpm * impressions) / 1000;
}

function fmtMoney(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}
function fmtInt(n: number) {
  if (!Number.isFinite(n)) return "—";
  return Math.round(n).toLocaleString("en-US");
}

export function Calculator() {
  const [unknown, setUnknown] = useState<Unknown>("cpm");
  const [cost, setCost] = useState(500);
  const [impressions, setImpressions] = useState(250000);
  const [cpm, setCpm] = useState(2);

  const { resultLabel, resultValue, hint } = useMemo(() => {
    if (unknown === "cpm") {
      const v = calcCpm(cost, impressions);
      return {
        resultLabel: "CPM",
        resultValue: fmtMoney(v),
        hint: `Cost ${fmtMoney(cost)} ÷ ${fmtInt(impressions)} impressions × 1,000`,
      };
    }
    if (unknown === "impressions") {
      const v = calcImpressions(cost, cpm);
      return {
        resultLabel: "Impressions",
        resultValue: fmtInt(v),
        hint: `Cost ${fmtMoney(cost)} ÷ CPM ${fmtMoney(cpm)} × 1,000`,
      };
    }
    const v = calcCost(cpm, impressions);
    return {
      resultLabel: "Cost",
      resultValue: fmtMoney(v),
      hint: `CPM ${fmtMoney(cpm)} × ${fmtInt(impressions)} impressions ÷ 1,000`,
    };
  }, [unknown, cost, impressions, cpm]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Solve for"
          value={unknown}
          onChange={(v) => setUnknown(v as Unknown)}
          options={[
            { value: "cpm", label: "CPM" },
            { value: "impressions", label: "Impressions" },
            { value: "cost", label: "Cost" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {unknown !== "cost" && (
          <TextField
            label="Ad spend (cost)"
            type="number"
            inputMode="decimal"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            min={0}
            step={1}
            leading="$"
            supportingText="Total budget for this campaign or flight."
          />
        )}
        {unknown !== "impressions" && (
          <TextField
            label="Impressions"
            type="number"
            inputMode="numeric"
            value={impressions}
            onChange={(e) => setImpressions(Number(e.target.value))}
            min={0}
            step={1000}
            supportingText="Total ad views (served or viewable, your choice — be consistent)."
          />
        )}
        {unknown !== "cpm" && (
          <TextField
            label="CPM"
            type="number"
            inputMode="decimal"
            value={cpm}
            onChange={(e) => setCpm(Number(e.target.value))}
            min={0}
            step={0.1}
            leading="$"
            supportingText="Cost per 1,000 impressions."
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {resultLabel}
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {resultValue}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Working
            </p>
            <p className="mt-1 md-body-medium text-[var(--md-sys-color-on-surface)]">{hint}</p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        {/* TODO_VERIFY: viewable-impression definition — IAB MRC Viewable Ad Impression Measurement Guidelines https://www.iab.com/guidelines/iab-measurement-guidelines/ */}
        CPM treats every 1,000 impressions equally; viewable impressions (per IAB MRC) only count
        when at least 50% of pixels render in-view for 1 second (2 seconds for video).
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
