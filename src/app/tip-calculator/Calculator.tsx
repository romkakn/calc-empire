"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Tip math:
//   Tax-inclusive mode (US default): tip = bill × (tipPct / 100)
//                                    total = bill + tip
//   Pretax mode: tip = subtotal × (tipPct / 100)
//                total = subtotal + tax + tip
//   per_person = total / split
//
// US tipping norms (Emily Post Institute / BLS):
//   Sit-down restaurant: 15% fair, 18% standard, 20% good service.
//   TODO_VERIFY: US tipping norms shift over time — re-check before each major revision.
//     Source: https://emilypost.com/advice/general-tipping-guide
//     Source: https://www.bls.gov/oes/current/oes353031.htm (waiters & waitresses, BLS OEWS)

type Mode = "inclusive" | "pretax";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function money(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("inclusive");
  const [bill, setBill] = useState(60);
  const [subtotal, setSubtotal] = useState(50);
  const [taxPct, setTaxPct] = useState(8); // sales-tax %, pretax mode only
  const [tipPct, setTipPct] = useState(18);
  const [split, setSplit] = useState(2);

  const result = useMemo(() => {
    const safeSplit = Math.max(1, Math.floor(Number.isFinite(split) ? split : 1));

    if (mode === "inclusive") {
      const safeBill = Number.isFinite(bill) ? Math.max(0, bill) : 0;
      const tip = safeBill * (tipPct / 100);
      const total = safeBill + tip;
      return {
        tip: round2(tip),
        total: round2(total),
        perPerson: round2(total / safeSplit),
        tax: 0,
        subtotalShown: safeBill,
      };
    }

    const safeSub = Number.isFinite(subtotal) ? Math.max(0, subtotal) : 0;
    const tax = safeSub * (taxPct / 100);
    const tip = safeSub * (tipPct / 100);
    const total = safeSub + tax + tip;
    return {
      tip: round2(tip),
      total: round2(total),
      perPerson: round2(total / safeSplit),
      tax: round2(tax),
      subtotalShown: safeSub,
    };
  }, [mode, bill, subtotal, taxPct, tipPct, split]);

  const presetActive = (p: number) => Math.abs(tipPct - p) < 0.001;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Bill type"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "inclusive", label: "Tax included" },
            { value: "pretax", label: "Tip on pretax" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {mode === "inclusive" ? (
          <TextField
            label="Bill total"
            type="number"
            inputMode="decimal"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
            min={0}
            step={0.01}
            trailing="$"
            supportingText="Final amount the receipt shows, tax included."
          />
        ) : (
          <>
            <TextField
              label="Subtotal (pretax)"
              type="number"
              inputMode="decimal"
              value={subtotal}
              onChange={(e) => setSubtotal(Number(e.target.value))}
              min={0}
              step={0.01}
              trailing="$"
              supportingText="Food and drinks before tax."
            />
            <TextField
              label="Sales tax"
              type="number"
              inputMode="decimal"
              value={taxPct}
              onChange={(e) => setTaxPct(Number(e.target.value))}
              min={0}
              max={20}
              step={0.1}
              trailing="%"
              supportingText="US state + local sales tax varies — check your receipt."
            />
          </>
        )}

        <TextField
          label="Tip"
          type="number"
          inputMode="decimal"
          value={tipPct}
          onChange={(e) => setTipPct(Number(e.target.value))}
          min={0}
          max={100}
          step={0.5}
          trailing="%"
          supportingText="US norms: 15% fair · 18% standard · 20% good service."
        />

        <TextField
          label="Split between"
          type="number"
          inputMode="numeric"
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          min={1}
          max={99}
          step={1}
          trailing="people"
          supportingText="Many US restaurants auto-add 18–20% gratuity for 6+ guests."
        />
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <p className="md-label-medium w-full text-[var(--md-sys-color-on-surface-variant)]">
          Quick tip presets
        </p>
        {[15, 18, 20, 25].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setTipPct(p)}
            aria-pressed={presetActive(p)}
            className={[
              "min-h-12 px-4 rounded-[var(--md-sys-shape-corner-full)] md-label-large",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-2",
              presetActive(p)
                ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                : "border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
            ].join(" ")}
          >
            {p}%
          </button>
        ))}
      </div>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Tip
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {money(result.tip)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Total
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {money(result.total)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Per person
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {money(result.perPerson)}
            </p>
          </div>
          {mode === "pretax" ? (
            <div className="sm:col-span-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
              Subtotal {money(result.subtotalShown)} · Tax {money(result.tax)} ·
              Tip calculated on pretax.
            </div>
          ) : null}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Cash tips on credit-card bills sometimes get skimmed by processing fees — confirm
        with your server which method puts more in their pocket.
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
