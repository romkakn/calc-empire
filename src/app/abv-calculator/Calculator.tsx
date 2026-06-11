"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// ABV from OG and FG:
//   Simple:   ABV = (OG − FG) × 131.25
//   Accurate: ABV = (76.08 × (OG − FG) / (1.775 − OG)) × (FG / 0.794)
// Source: American Homebrewers Association — How to Calculate ABV.
// TODO_VERIFY: AHA constants 131.25, 76.08, 1.775, 0.794 — confirm at publish
// (https://www.homebrewersassociation.org/how-to-brew/how-to-calculate-abv/)

type Formula = "simple" | "accurate";

function abvSimple(og: number, fg: number) {
  if (!Number.isFinite(og) || !Number.isFinite(fg)) return NaN;
  return (og - fg) * 131.25;
}
function abvAccurate(og: number, fg: number) {
  if (!Number.isFinite(og) || !Number.isFinite(fg)) return NaN;
  if (og <= 0 || fg <= 0 || og >= 1.775) return NaN;
  return ((76.08 * (og - fg)) / (1.775 - og)) * (fg / 0.794);
}

function attenuation(og: number, fg: number) {
  if (!Number.isFinite(og) || !Number.isFinite(fg) || og <= 1) return NaN;
  return ((og - fg) / (og - 1)) * 100;
}

function strengthBand(abv: number): { label: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(abv)) return { label: "—", tone: "ok" };
  if (abv < 5) return { label: "Session strength (< 5%)", tone: "ok" };
  if (abv < 8) return { label: "Standard strength (5–8%)", tone: "ok" };
  if (abv < 12) return { label: "Strong (8–12%)", tone: "warn" };
  return { label: "Very strong (≥ 12%)", tone: "alert" };
}

export function Calculator() {
  const [formula, setFormula] = useState<Formula>("simple");
  const [og, setOg] = useState(1.055);
  const [fg, setFg] = useState(1.012);

  const { abv, att, band } = useMemo(() => {
    const a = formula === "simple" ? abvSimple(og, fg) : abvAccurate(og, fg);
    const at = attenuation(og, fg);
    return { abv: a, att: at, band: strengthBand(a) };
  }, [formula, og, fg]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[band.tone];

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Brewing standard formulas. Drink responsibly
        and follow local laws on homebrewing.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Formula"
          value={formula}
          onChange={(v) => setFormula(v as Formula)}
          options={[
            { value: "simple", label: "Simple" },
            { value: "accurate", label: "Accurate" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Original gravity (OG)"
          type="number"
          inputMode="decimal"
          value={og}
          onChange={(e) => setOg(Number(e.target.value))}
          min={1.0}
          max={1.2}
          step={0.001}
          supportingText="Typical 1.030–1.120. Reading taken before yeast is pitched."
        />
        <TextField
          label="Final gravity (FG)"
          type="number"
          inputMode="decimal"
          value={fg}
          onChange={(e) => setFg(Number(e.target.value))}
          min={0.98}
          max={1.05}
          step={0.001}
          supportingText="Typical 0.995–1.020. Reading taken after fermentation finishes."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">ABV</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(abv) ? `${abv.toFixed(2)}%` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Apparent attenuation
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(att) ? `${att.toFixed(0)}%` : "—"}
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
        Simple formula is close enough for typical beers under ~8% ABV. Switch to
        Accurate for big stouts, barleywines, and tripels where the linear
        approximation drifts low.
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
