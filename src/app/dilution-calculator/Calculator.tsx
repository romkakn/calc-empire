"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Solution dilution: M1 * V1 = M2 * V2
//   V1 (stock to draw) = (M2 * V2) / M1
//   Diluent to add     = V2 - V1
// Source: OpenStax Chemistry 2e, Section 3.5 (Solution Dilution).

type ConcUnit = "M" | "mM" | "uM" | "nM";
type VolUnit = "L" | "mL" | "uL";

const CONC_TO_M: Record<ConcUnit, number> = {
  M: 1,
  mM: 1e-3,
  uM: 1e-6,
  nM: 1e-9,
};

const VOL_TO_L: Record<VolUnit, number> = {
  L: 1,
  mL: 1e-3,
  uL: 1e-6,
};

function solveDilution(args: {
  m1: number; m1Unit: ConcUnit;
  m2: number; m2Unit: ConcUnit;
  v2: number; v2Unit: VolUnit;
}) {
  const { m1, m1Unit, m2, m2Unit, v2, v2Unit } = args;
  if (![m1, m2, v2].every(Number.isFinite)) return { v1: NaN, diluent: NaN, factor: NaN };
  if (m1 <= 0 || m2 <= 0 || v2 <= 0) return { v1: NaN, diluent: NaN, factor: NaN };

  // Normalize to base SI (mol/L, L).
  const M1 = m1 * CONC_TO_M[m1Unit];
  const M2 = m2 * CONC_TO_M[m2Unit];
  const V2L = v2 * VOL_TO_L[v2Unit];

  if (M2 > M1) return { v1: NaN, diluent: NaN, factor: NaN }; // not a dilution

  const V1L = (M2 * V2L) / M1;
  // Render back in the user's V2 unit.
  const v1 = V1L / VOL_TO_L[v2Unit];
  const diluent = v2 - v1;
  const factor = V2L / V1L;
  return { v1, diluent, factor };
}

function fmtVol(n: number) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 100) return n.toFixed(1);
  if (Math.abs(n) >= 1) return n.toFixed(2);
  return n.toFixed(3);
}

export function Calculator() {
  const [m1, setM1] = useState(10);
  const [m1Unit, setM1Unit] = useState<ConcUnit>("M");
  const [m2, setM2] = useState(2);
  const [m2Unit, setM2Unit] = useState<ConcUnit>("M");
  const [v2, setV2] = useState(100);
  const [v2Unit, setV2Unit] = useState<VolUnit>("mL");

  const { v1, diluent, factor } = useMemo(
    () => solveDilution({ m1, m1Unit, m2, m2Unit, v2, v2Unit }),
    [m1, m1Unit, m2, m2Unit, v2, v2Unit],
  );

  const invalid = !Number.isFinite(v1);
  const invalidReason =
    !Number.isFinite(m1) || !Number.isFinite(m2) || !Number.isFinite(v2)
      ? "Enter a number for every field."
      : m1 <= 0 || m2 <= 0 || v2 <= 0
      ? "All values must be greater than zero."
      : m2 * CONC_TO_M[m2Unit] > m1 * CONC_TO_M[m1Unit]
      ? "Target concentration is higher than the stock — that requires concentrating, not diluting."
      : "";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Bench tip.</strong> Always verify units match before pipetting. For corrosive
        stocks, add acid to water — never water to acid.
      </Card>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
          <TextField
            label="Stock concentration (M1)"
            type="number"
            inputMode="decimal"
            value={m1}
            onChange={(e) => setM1(Number(e.target.value))}
            min={0}
            step="any"
            supportingText="From the bottle label."
          />
          <Segment
            label="Unit"
            value={m1Unit}
            onChange={(v) => setM1Unit(v as ConcUnit)}
            options={[
              { value: "M", label: "M" },
              { value: "mM", label: "mM" },
              { value: "uM", label: "uM" },
              { value: "nM", label: "nM" },
            ]}
          />
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
          <TextField
            label="Target concentration (M2)"
            type="number"
            inputMode="decimal"
            value={m2}
            onChange={(e) => setM2(Number(e.target.value))}
            min={0}
            step="any"
            supportingText="What you want to end up with."
          />
          <Segment
            label="Unit"
            value={m2Unit}
            onChange={(v) => setM2Unit(v as ConcUnit)}
            options={[
              { value: "M", label: "M" },
              { value: "mM", label: "mM" },
              { value: "uM", label: "uM" },
              { value: "nM", label: "nM" },
            ]}
          />
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 items-end sm:col-span-2">
          <TextField
            label="Target volume (V2)"
            type="number"
            inputMode="decimal"
            value={v2}
            onChange={(e) => setV2(Number(e.target.value))}
            min={0}
            step="any"
            supportingText="Final volume after mixing."
          />
          <Segment
            label="Volume unit"
            value={v2Unit}
            onChange={(v) => setV2Unit(v as VolUnit)}
            options={[
              { value: "L", label: "L" },
              { value: "mL", label: "mL" },
              { value: "uL", label: "uL" },
            ]}
          />
        </div>
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Stock to draw (V1)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {invalid ? "—" : `${fmtVol(v1)} ${v2Unit}`}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Diluent to add
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {invalid ? "—" : `${fmtVol(diluent)} ${v2Unit}`}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Dilution factor
            </p>
            <p className="mt-1 md-title-medium tabular-nums">
              {invalid || !Number.isFinite(factor) ? "—" : `1 : ${factor.toFixed(factor >= 100 ? 0 : 1)}`}
            </p>
          </div>
          {invalid && invalidReason ? (
            <p className="sm:col-span-2 md-body-small text-[var(--md-sys-color-error)]">
              {invalidReason}
            </p>
          ) : null}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        M1V1 = M2V2 assumes additive volumes. For highly concentrated stocks (above roughly
        50% v/v), measure V2 in the final container after mixing.
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
              "min-h-12 px-3 md-label-large",
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
