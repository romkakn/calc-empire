"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Cockcroft-Gault (1976) — drug-dosing standard:
//   CrCl (mL/min) = ((140 − age) × weight_kg) / (72 × SCr_mg/dL)
//   × 0.85 if female
//
// CKD-EPI 2021 (Inker et al., NEJM 2021; race-free) — kidney-function staging:
//   eGFR = 142 × min(SCr/κ,1)^α × max(SCr/κ,1)^(-1.200) × 0.9938^age × (1.012 if female)
//   κ = 0.7 (female) / 0.9 (male); α = -0.241 (female) / -0.302 (male)
//
// Unit conversions:
//   1 kg = 2.20462 lb · 1 in = 2.54 cm · SCr µmol/L = SCr mg/dL × 88.4

type Equation = "cg" | "ckdepi";
type Sex = "male" | "female";
type WeightUnit = "kg" | "lb";
type ScrUnit = "mgdl" | "umoll";

function cockcroftGault(age: number, weightKg: number, scrMgdl: number, sex: Sex): number {
  if (!Number.isFinite(age) || !Number.isFinite(weightKg) || !Number.isFinite(scrMgdl) || scrMgdl <= 0) {
    return NaN;
  }
  const base = ((140 - age) * weightKg) / (72 * scrMgdl);
  return sex === "female" ? base * 0.85 : base;
}

function ckdEpi2021(age: number, scrMgdl: number, sex: Sex): number {
  if (!Number.isFinite(age) || !Number.isFinite(scrMgdl) || scrMgdl <= 0) {
    return NaN;
  }
  const kappa = sex === "female" ? 0.7 : 0.9;
  const alpha = sex === "female" ? -0.241 : -0.302;
  const ratio = scrMgdl / kappa;
  const minTerm = Math.pow(Math.min(ratio, 1), alpha);
  const maxTerm = Math.pow(Math.max(ratio, 1), -1.2);
  const ageTerm = Math.pow(0.9938, age);
  const sexTerm = sex === "female" ? 1.012 : 1;
  return 142 * minTerm * maxTerm * ageTerm * sexTerm;
}

function kdigoStage(eGfr: number): { stage: string; description: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(eGfr)) return { stage: "—", description: "", tone: "ok" };
  if (eGfr >= 90) return { stage: "G1", description: "Normal or high", tone: "ok" };
  if (eGfr >= 60) return { stage: "G2", description: "Mildly decreased", tone: "ok" };
  if (eGfr >= 45) return { stage: "G3a", description: "Mild to moderate", tone: "warn" };
  if (eGfr >= 30) return { stage: "G3b", description: "Moderate to severe", tone: "warn" };
  if (eGfr >= 15) return { stage: "G4", description: "Severely decreased", tone: "alert" };
  return { stage: "G5", description: "Kidney failure", tone: "alert" };
}

function drugDosingBand(crcl: number): { label: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(crcl)) return { label: "—", tone: "ok" };
  if (crcl >= 90) return { label: "Normal renal function", tone: "ok" };
  if (crcl >= 60) return { label: "Mild impairment", tone: "ok" };
  if (crcl >= 30) return { label: "Moderate impairment", tone: "warn" };
  if (crcl >= 15) return { label: "Severe impairment", tone: "alert" };
  return { label: "Kidney failure", tone: "alert" };
}

export function Calculator() {
  const [equation, setEquation] = useState<Equation>("cg");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(65);
  const [weight, setWeight] = useState(80);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [scr, setScr] = useState(1.2);
  const [scrUnit, setScrUnit] = useState<ScrUnit>("mgdl");

  const result = useMemo(() => {
    const weightKg = weightUnit === "kg" ? weight : weight / 2.20462;
    const scrMgdl = scrUnit === "mgdl" ? scr : scr / 88.4;
    const value =
      equation === "cg"
        ? cockcroftGault(age, weightKg, scrMgdl, sex)
        : ckdEpi2021(age, scrMgdl, sex);
    return {
      value,
      stage: kdigoStage(value),
      band: drugDosingBand(value),
      unit: equation === "ckdepi" ? "mL/min/1.73m²" : "mL/min",
    };
  }, [equation, sex, age, weight, weightUnit, scr, scrUnit]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[result.band.tone];

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not medical advice and not a substitute
        for a drug label. Any dose adjustment must be confirmed against the
        product label and the patient&apos;s clinician.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Equation"
          value={equation}
          onChange={(v) => setEquation(v as Equation)}
          options={[
            { value: "cg", label: "Cockcroft-Gault" },
            { value: "ckdepi", label: "CKD-EPI 2021" },
          ]}
        />
        <Segment
          label="Sex"
          value={sex}
          onChange={(v) => setSex(v as Sex)}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        aria-label="Creatinine clearance inputs"
      >
        <TextField
          label="Age"
          type="number"
          inputMode="numeric"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          min={18}
          max={120}
          step={1}
          trailing="years"
        />

        <div className="grid grid-cols-[1fr_auto] gap-2 items-start">
          <TextField
            label="Weight"
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            min={0}
            step={0.5}
            trailing={weightUnit}
            supportingText={equation === "ckdepi" ? "CKD-EPI doesn't use weight" : undefined}
          />
          <Segment
            label="Unit"
            value={weightUnit}
            onChange={(v) => setWeightUnit(v as WeightUnit)}
            options={[
              { value: "kg", label: "kg" },
              { value: "lb", label: "lb" },
            ]}
            compact
          />
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 items-start sm:col-span-2">
          <TextField
            label="Serum creatinine"
            type="number"
            inputMode="decimal"
            value={scr}
            onChange={(e) => setScr(Number(e.target.value))}
            min={0.01}
            step={0.01}
            trailing={scrUnit === "mgdl" ? "mg/dL" : "µmol/L"}
            supportingText="Typical adult range 0.6–1.3 mg/dL (53–115 µmol/L)."
          />
          <Segment
            label="Unit"
            value={scrUnit}
            onChange={(v) => setScrUnit(v as ScrUnit)}
            options={[
              { value: "mgdl", label: "mg/dL" },
              { value: "umoll", label: "µmol/L" },
            ]}
            compact
          />
        </div>
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div
          role="status"
          aria-live="polite"
          aria-label="Creatinine clearance result"
          className="grid gap-x-6 gap-y-4 sm:grid-cols-2"
        >
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {equation === "cg" ? "Creatinine clearance" : "eGFR"}
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(result.value) ? `${result.value.toFixed(1)} ${result.unit}` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              KDIGO stage
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {result.stage.stage}
            </p>
            <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">
              {result.stage.description}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{result.band.label}</span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        {/* TODO_VERIFY: ideal body weight (IBW) adjustment for obese patients — Cockcroft-Gault overestimates CrCl in obesity. */}
        Cockcroft-Gault is the FDA-referenced equation for drug-dose adjustment. CKD-EPI 2021
        is preferred for staging chronic kidney disease. Pick the equation that matches your
        clinical question.
      </p>
    </Card>
  );
}

function Segment({
  label,
  value,
  onChange,
  options,
  compact,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  compact?: boolean;
}) {
  return (
    <div>
      <p className="md-label-medium mb-1 text-[var(--md-sys-color-on-surface-variant)]">{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        className="inline-flex rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] overflow-hidden"
      >
        {options.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              compact ? "min-h-12 px-3 md-label-medium" : "min-h-12 px-4 md-label-large",
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
