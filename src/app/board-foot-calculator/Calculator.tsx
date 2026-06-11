"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Board foot definition (NHLA Rules; NIST PS-20 for softwood; USDA Wood Handbook):
//   1 board foot = 144 cubic inches = 1 in x 12 in x 12 in
//   BF = (T_in x W_in x L_in) / 144
//   BF = (T_in x W_in x L_ft) / 12
//   Total = BF x quantity
// TODO_VERIFY: NHLA Rules current edition definition of board foot
//   https://www.nhla.com/rules

type LengthUnit = "in" | "ft";

function boardFeetPerPiece(thicknessIn: number, widthIn: number, length: number, lengthUnit: LengthUnit) {
  if (!Number.isFinite(thicknessIn) || !Number.isFinite(widthIn) || !Number.isFinite(length)) return NaN;
  if (thicknessIn <= 0 || widthIn <= 0 || length <= 0) return 0;
  const lengthIn = lengthUnit === "in" ? length : length * 12;
  return (thicknessIn * widthIn * lengthIn) / 144;
}

export function Calculator() {
  const [thickness, setThickness] = useState(1);
  const [width, setWidth] = useState(6);
  const [length, setLength] = useState(8);
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>("ft");
  const [quantity, setQuantity] = useState(4);
  const [pricePerBf, setPricePerBf] = useState(0);

  const { bfPerPiece, bfTotal, cost } = useMemo(() => {
    const per = boardFeetPerPiece(thickness, width, length, lengthUnit);
    const qty = Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
    const total = per * qty;
    const c = Number.isFinite(pricePerBf) && pricePerBf >= 0 ? total * pricePerBf : NaN;
    return { bfPerPiece: per, bfTotal: total, cost: c };
  }, [thickness, width, length, lengthUnit, quantity, pricePerBf]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Hardwood standard.</strong> Enter rough (pre-surfacing) thickness and width for
        hardwood billing. A 4/4 board is 1 inch; 5/4 = 1.25; 6/4 = 1.5; 8/4 = 2.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Length unit"
          value={lengthUnit}
          onChange={(v) => setLengthUnit(v as LengthUnit)}
          options={[
            { value: "ft", label: "feet" },
            { value: "in", label: "inches" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Thickness"
          type="number"
          inputMode="decimal"
          value={thickness}
          onChange={(e) => setThickness(Number(e.target.value))}
          min={0.1}
          max={24}
          step={0.25}
          trailing="in"
          supportingText="Rough thickness. 4/4 = 1, 5/4 = 1.25, 6/4 = 1.5, 8/4 = 2."
        />
        <TextField
          label="Width"
          type="number"
          inputMode="decimal"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          min={0.1}
          max={48}
          step={0.25}
          trailing="in"
          supportingText="Rough width before surfacing."
        />
        <TextField
          label="Length"
          type="number"
          inputMode="decimal"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          min={0.1}
          max={500}
          step={lengthUnit === "ft" ? 0.5 : 1}
          trailing={lengthUnit}
        />
        <TextField
          label="Quantity"
          type="number"
          inputMode="numeric"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
          max={10000}
          step={1}
          trailing="boards"
        />
        <TextField
          label="Price per board foot (optional)"
          type="number"
          inputMode="decimal"
          value={pricePerBf}
          onChange={(e) => setPricePerBf(Number(e.target.value))}
          min={0}
          max={1000}
          step={0.25}
          trailing="$"
          supportingText="Leave at 0 to skip cost estimate."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Board feet per piece</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(bfPerPiece) ? `${bfPerPiece.toFixed(2)} BF` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Total board feet
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(bfTotal) ? `${bfTotal.toFixed(2)} BF` : "—"}
            </p>
          </div>
          {pricePerBf > 0 && Number.isFinite(cost) && (
            <div className="sm:col-span-2">
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                Estimated cost
              </p>
              <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                {`$${cost.toFixed(2)}`}
              </p>
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Add 15–30% for cutting waste depending on grade and project. Figured or low-grade wood
        may need 35% or more.
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
