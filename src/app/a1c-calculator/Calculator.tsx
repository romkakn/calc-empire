"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// eAG from A1C (ADA-endorsed Nathan et al., 2008; PMID 18540046):
//   eAG (mg/dL)  = 28.7 × A1C − 46.7
//   eAG (mmol/L) = 1.59 × A1C − 2.59
// Reverse:
//   A1C ≈ (eAG_mgdL + 46.7) / 28.7

type Direction = "a1c-to-eag" | "eag-to-a1c";
type Unit = "mgdl" | "mmoll";

function a1cToEag(a1c: number, unit: Unit) {
  if (!Number.isFinite(a1c)) return NaN;
  if (unit === "mgdl") return 28.7 * a1c - 46.7;
  return 1.59 * a1c - 2.59;
}
function eagToA1c(eag: number, unit: Unit) {
  if (!Number.isFinite(eag)) return NaN;
  const mgdl = unit === "mgdl" ? eag : eag * 18.0182; // mmol/L → mg/dL
  return (mgdl + 46.7) / 28.7;
}

function adaBand(a1c: number): { label: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(a1c)) return { label: "—", tone: "ok" };
  if (a1c < 5.7) return { label: "Normal", tone: "ok" };
  if (a1c < 6.5) return { label: "Prediabetes (5.7–6.4%)", tone: "warn" };
  return { label: "Diabetes range (≥ 6.5%)", tone: "alert" };
}

export function Calculator() {
  const [direction, setDirection] = useState<Direction>("a1c-to-eag");
  const [unit, setUnit] = useState<Unit>("mgdl");
  const [a1c, setA1c] = useState(7.0);
  const [eag, setEag] = useState(154);

  const { computedA1c, computedEag, band } = useMemo(() => {
    if (direction === "a1c-to-eag") {
      const e = a1cToEag(a1c, unit);
      return { computedA1c: a1c, computedEag: e, band: adaBand(a1c) };
    }
    const a = eagToA1c(eag, unit);
    return { computedA1c: a, computedEag: eag, band: adaBand(a) };
  }, [direction, unit, a1c, eag]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[band.tone];

  const unitLabel = unit === "mgdl" ? "mg/dL" : "mmol/L";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not medical advice. Talk to your doctor about
        your A1C and treatment plan.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Direction"
          value={direction}
          onChange={(v) => setDirection(v as Direction)}
          options={[
            { value: "a1c-to-eag", label: "A1C → eAG" },
            { value: "eag-to-a1c", label: "eAG → A1C" },
          ]}
        />
        <Segment
          label="Glucose unit"
          value={unit}
          onChange={(v) => setUnit(v as Unit)}
          options={[
            { value: "mgdl", label: "mg/dL" },
            { value: "mmoll", label: "mmol/L" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {direction === "a1c-to-eag" ? (
          <TextField
            label="A1C"
            type="number"
            inputMode="decimal"
            value={a1c}
            onChange={(e) => setA1c(Number(e.target.value))}
            min={3}
            max={20}
            step={0.1}
            trailing="%"
            supportingText="Typical 4–14%. ADA bands: < 5.7 normal · 5.7–6.4 prediabetes · ≥ 6.5 diabetes."
          />
        ) : (
          <TextField
            label="Average glucose (eAG)"
            type="number"
            inputMode="decimal"
            value={eag}
            onChange={(e) => setEag(Number(e.target.value))}
            min={20}
            max={500}
            step={1}
            trailing={unitLabel}
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">A1C</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(computedA1c) ? `${computedA1c.toFixed(1)}%` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Estimated average glucose
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(computedEag) ? `${computedEag.toFixed(0)} ${unitLabel}` : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{band.label}</span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        ADA criteria. {/* TODO_VERIFY: ADA 2026 thresholds — confirm at publish */} eAG is a
        ~3-month rolling estimate; daily readings will fluctuate above and below.
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
