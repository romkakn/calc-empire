"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Cooling BTU/h rule-of-thumb (ENERGY STAR / DOE room-AC guidance):
//   base = sq_ft * 20 BTU/h per sq ft
//   sunny: x 1.10 · shaded: x 0.90 · average: x 1.00
//   occupants > 2: + 600 BTU/h each
//   kitchen: + 1000 BTU/h
//   ceiling-height scaler: actual_height / 8 (8 ft is the baseline assumption)
// TODO_VERIFY: 20 BTU/h per sq ft baseline — ENERGY STAR room AC sizing
// https://www.energystar.gov/products/heating_cooling/air_conditioning_room

type Sun = "shaded" | "average" | "sunny";

const BASE_BTU_PER_SQFT = 20;
const SUN_MULT: Record<Sun, number> = { shaded: 0.9, average: 1.0, sunny: 1.1 };
const OCCUPANT_BTU = 600;
const KITCHEN_BTU = 1000;
const BASELINE_CEILING_FT = 8;

function computeBtu({
  sqft,
  ceiling,
  sun,
  occupants,
  kitchen,
}: {
  sqft: number;
  ceiling: number;
  sun: Sun;
  occupants: number;
  kitchen: boolean;
}) {
  if (!Number.isFinite(sqft) || sqft <= 0) return NaN;
  const heightScaler =
    Number.isFinite(ceiling) && ceiling > 0 ? ceiling / BASELINE_CEILING_FT : 1;
  const base = sqft * BASE_BTU_PER_SQFT * heightScaler;
  const sunAdjusted = base * SUN_MULT[sun];
  const extraOccupants = Math.max(0, Math.floor(occupants) - 2);
  const occupantBtu = extraOccupants * OCCUPANT_BTU;
  const kitchenBtu = kitchen ? KITCHEN_BTU : 0;
  return sunAdjusted + occupantBtu + kitchenBtu;
}

function band(btu: number): { label: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(btu)) return { label: "—", tone: "ok" };
  if (btu < 8000) return { label: "Small room — window or portable unit", tone: "ok" };
  if (btu < 18000) return { label: "Medium room — mini-split or larger window unit", tone: "ok" };
  if (btu < 30000) return { label: "Large room — mini-split or zoned central", tone: "warn" };
  return { label: "Whole-zone load — get a Manual J quote", tone: "alert" };
}

export function Calculator() {
  const [sqft, setSqft] = useState(300);
  const [ceiling, setCeiling] = useState(8);
  const [sun, setSun] = useState<Sun>("average");
  const [occupants, setOccupants] = useState(2);
  const [kitchen, setKitchen] = useState(false);

  const { btu, tons, status } = useMemo(() => {
    const value = computeBtu({ sqft, ceiling, sun, occupants, kitchen });
    return {
      btu: value,
      tons: Number.isFinite(value) ? value / 12000 : NaN,
      status: band(value),
    };
  }, [sqft, ceiling, sun, occupants, kitchen]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[status.tone];

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Planning estimate only.</strong> For any install, a licensed HVAC
        contractor should run an ACCA Manual J load calculation on your home.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Sun exposure"
          value={sun}
          onChange={(v) => setSun(v as Sun)}
          options={[
            { value: "shaded", label: "Shaded" },
            { value: "average", label: "Average" },
            { value: "sunny", label: "Sunny" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Square footage"
          type="number"
          inputMode="decimal"
          value={sqft}
          onChange={(e) => setSqft(Number(e.target.value))}
          min={20}
          max={5000}
          step={10}
          trailing="sq ft"
          supportingText="Room length × width in feet."
        />
        <TextField
          label="Ceiling height"
          type="number"
          inputMode="decimal"
          value={ceiling}
          onChange={(e) => setCeiling(Number(e.target.value))}
          min={6}
          max={20}
          step={0.5}
          trailing="ft"
          supportingText="Baseline is 8 ft. Taller ceilings scale the load."
        />
        <TextField
          label="Regular occupants"
          type="number"
          inputMode="numeric"
          value={occupants}
          onChange={(e) => setOccupants(Number(e.target.value))}
          min={1}
          max={20}
          step={1}
          trailing="people"
          supportingText="Add 600 BTU/h for each occupant over 2."
        />
        <label className="flex items-center gap-3 min-h-12 px-2 rounded-[var(--md-sys-shape-corner-small)] cursor-pointer">
          <input
            type="checkbox"
            checked={kitchen}
            onChange={(e) => setKitchen(e.target.checked)}
            className="size-5 accent-[var(--md-sys-color-primary)]"
          />
          <span className="md-body-large">Kitchen (adds 1,000 BTU/h)</span>
        </label>
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Cooling load
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(btu) ? `${Math.round(btu).toLocaleString()} BTU/h` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Tons of cooling
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(tons) ? `${tons.toFixed(2)} tons` : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{status.label}</span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Rule-of-thumb sizing per ENERGY STAR / DOE room-AC guidance. Real HVAC
        sizing uses ACCA Manual J, which accounts for insulation, windows,
        infiltration, and climate zone.
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
