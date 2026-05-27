"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// tons = (length_ft × width_ft × thickness_in / 12) × density_lb_per_ft3 × 0.0005
//        × (1 + waste_factor)
// Default density: 145 lb/ft³ (Hot Mix Asphalt, dense-graded).
// Source: Asphalt Institute "Asphalt Paving Materials" + NAPA density guidance.

function fmtNum(n: number, d = 2): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: d });
}
function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function Calculator() {
  const [length, setLength] = useState(50);
  const [width, setWidth] = useState(12);
  const [thickness, setThickness] = useState(2);
  const [density, setDensity] = useState(145);
  const [wastePct, setWastePct] = useState(5);
  const [pricePerTon, setPricePerTon] = useState(110);

  const r = useMemo(() => {
    if (length <= 0 || width <= 0 || thickness <= 0) return null;
    const areaSqFt = length * width;
    const volumeCuFt = areaSqFt * (thickness / 12);
    const volumeCuYd = volumeCuFt / 27;
    const baseTons = volumeCuFt * density * 0.0005;
    const totalTons = baseTons * (1 + wastePct / 100);
    const cost = pricePerTon > 0 ? totalTons * pricePerTon : NaN;
    return { areaSqFt, volumeCuFt, volumeCuYd, baseTons, totalTons, cost };
  }, [length, width, thickness, density, wastePct, pricePerTon]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        aria-label="Asphalt inputs"
      >
        <TextField label="Length" type="number" inputMode="decimal" value={length} onChange={(e) => setLength(Number(e.target.value))} min={0} step={1} trailing="ft" />
        <TextField label="Width" type="number" inputMode="decimal" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={0} step={1} trailing="ft" />
        <TextField label="Thickness" type="number" inputMode="decimal" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} min={0.5} step={0.25} trailing="in" supportingText="Typical: 1.5–2 in overlay, 3–4 in new build." />
        <TextField label="Density" type="number" inputMode="decimal" value={density} onChange={(e) => setDensity(Number(e.target.value))} min={120} max={160} step={1} trailing="lb / ft³" supportingText="HMA average ≈ 145." />
        <TextField label="Waste factor" type="number" inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(Number(e.target.value))} min={0} max={25} step={1} trailing="%" supportingText="Default 5%. Add more for irregular shapes." />
        <TextField label="Price per ton" type="number" inputMode="decimal" value={pricePerTon} onChange={(e) => setPricePerTon(Number(e.target.value))} min={0} step={5} trailing="USD / ton" supportingText="Leave blank to skip the cost estimate." />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <Out label="Tons needed (with waste)" value={r ? `${fmtNum(r.totalTons)} tons` : "—"} emphasized />
          <Out label="Estimated cost" value={r && pricePerTon > 0 ? fmtUSD(r.cost) : "—"} emphasized />
          <Out label="Tons (no waste)" value={r ? `${fmtNum(r.baseTons)} tons` : "—"} />
          <Out label="Volume" value={r ? `${fmtNum(r.volumeCuYd)} yd³` : "—"} />
          <Out label="Area covered" value={r ? `${fmtNum(r.areaSqFt, 0)} sq ft` : "—"} />
          <Out label="Cubic feet" value={r ? `${fmtNum(r.volumeCuFt, 1)} ft³` : "—"} />
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Estimates only. Confirm thickness and density with your paving contractor — site
        compaction and mix design shift the number.
      </p>
    </Card>
  );
}

function Out({ label, value, emphasized }: { label: string; value: string; emphasized?: boolean }) {
  return (
    <div>
      <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">{label}</p>
      <p className={["mt-1 font-[var(--md-sys-typescale-mono-font)] tabular-nums", emphasized ? "md-headline-small text-[var(--md-sys-color-primary)]" : "md-title-medium"].join(" ")}>
        {value}
      </p>
    </div>
  );
}
