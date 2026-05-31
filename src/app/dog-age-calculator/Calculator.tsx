"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Dog age → human age
// Epigenetic clock (Wang et al., Cell Systems 2020; PMID 32650044):
//   human_age = 16 × ln(dog_age_years) + 31
// TODO_VERIFY: epigenetic-clock constants 16 and 31 — source: https://www.cell.com/cell-systems/fulltext/S2405-4712(20)30203-9
// Classic rule (folk shortcut, kept for comparison only):
//   human_age = dog_age_years × 7

type Formula = "epigenetic" | "classic";
type Size = "small" | "medium" | "large" | "giant";

function epigeneticHumanAge(dogAge: number): number {
  if (!Number.isFinite(dogAge) || dogAge <= 0) return NaN;
  return 16 * Math.log(dogAge) + 31;
}

function classicHumanAge(dogAge: number): number {
  if (!Number.isFinite(dogAge) || dogAge <= 0) return NaN;
  return dogAge * 7;
}

// AAHA life-stage groupings (general guidance; giant breeds shift earlier).
// TODO_VERIFY: AAHA Canine Life Stage Guidelines — source: https://www.aaha.org/aaha-guidelines/life-stage-canine-2019/life-stage-canine-2019/
function lifeStage(dogAge: number, size: Size): { label: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(dogAge) || dogAge <= 0) return { label: "—", tone: "ok" };
  if (dogAge < 1) return { label: "Puppy", tone: "ok" };
  const seniorStart = size === "giant" ? 5 : size === "large" ? 6 : size === "medium" ? 7 : 8;
  const geriatricStart = size === "giant" ? 8 : size === "large" ? 10 : size === "medium" ? 11 : 12;
  if (dogAge < 3) return { label: "Young adult", tone: "ok" };
  if (dogAge < seniorStart) return { label: "Mature adult", tone: "ok" };
  if (dogAge < geriatricStart) return { label: "Senior", tone: "warn" };
  return { label: "Geriatric", tone: "alert" };
}

const SIZE_NOTES: Record<Size, string> = {
  small: "Small breeds (< 10 kg) often live 14–16 years. The formula tends to overestimate their human age in later years.",
  medium: "Medium breeds (10–25 kg) track the formula fairly well across the lifespan.",
  large: "Large breeds (25–45 kg) average 10–13 years. Expect senior care to start a year or two earlier than the formula suggests.",
  giant: "Giant breeds (> 45 kg) often only live 7–10 years. Treat them as seniors by age 5–6.",
};

export function Calculator() {
  const [formula, setFormula] = useState<Formula>("epigenetic");
  const [size, setSize] = useState<Size>("medium");
  const [dogAge, setDogAge] = useState(5);

  const { humanAge, stage } = useMemo(() => {
    const h = formula === "epigenetic" ? epigeneticHumanAge(dogAge) : classicHumanAge(dogAge);
    return { humanAge: h, stage: lifeStage(dogAge, size) };
  }, [formula, size, dogAge]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[stage.tone];

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not veterinary advice. For health decisions, talk to a licensed veterinarian who knows your dog.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Formula"
          value={formula}
          onChange={(v) => setFormula(v as Formula)}
          options={[
            { value: "epigenetic", label: "Epigenetic clock" },
            { value: "classic", label: "Classic 7x rule" },
          ]}
        />
        <Segment
          label="Breed size"
          value={size}
          onChange={(v) => setSize(v as Size)}
          options={[
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
            { value: "giant", label: "Giant" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Dog's age"
          type="number"
          inputMode="decimal"
          value={dogAge}
          onChange={(e) => setDogAge(Number(e.target.value))}
          min={0.1}
          max={25}
          step={0.1}
          trailing="years"
          supportingText="Use 0.5 for a 6-month-old puppy. Most dogs live 7–16 years depending on breed size."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Dog age</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(dogAge) && dogAge > 0 ? `${dogAge} yr` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Human-age equivalent
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(humanAge) ? `${humanAge.toFixed(1)} yr` : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{stage.label}</span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        {SIZE_NOTES[size]} The epigenetic formula was built from Labrador Retriever data; treat the number as a guide, not a diagnosis.
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
