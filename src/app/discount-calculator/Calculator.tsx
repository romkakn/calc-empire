"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Discount math:
//   Percent off:  final = original * (1 - pct/100)
//   Dollar off:   final = original - amount
//   Stacked:      apply each discount in order to the running total.
// Source: standard retail pricing arithmetic; FTC 16 CFR Part 233 governs how the
// comparison "original" price must be a real, recent selling price.
// TODO_VERIFY: state-by-state sales-tax-on-coupon rules — varies, time-sensitive.
// See https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233

type DiscountKind = "percent" | "dollar";

function applyDiscount(running: number, kind: DiscountKind, value: number): number {
  if (!Number.isFinite(running) || !Number.isFinite(value)) return NaN;
  if (kind === "percent") return running * (1 - value / 100);
  return running - value;
}

function fmtUsd(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function Calculator() {
  const [original, setOriginal] = useState(120);
  const [kind1, setKind1] = useState<DiscountKind>("percent");
  const [value1, setValue1] = useState(30);
  const [stack, setStack] = useState(false);
  const [kind2, setKind2] = useState<DiscountKind>("dollar");
  const [value2, setValue2] = useState(10);

  const { afterFirst, finalPrice, saved, effectivePct } = useMemo(() => {
    const a = applyDiscount(original, kind1, value1);
    const f = stack ? applyDiscount(a, kind2, value2) : a;
    const clampedFinal = Number.isFinite(f) ? Math.max(0, f) : NaN;
    const s = Number.isFinite(clampedFinal) ? original - clampedFinal : NaN;
    const pct = Number.isFinite(s) && original > 0 ? (s / original) * 100 : NaN;
    return { afterFirst: a, finalPrice: clampedFinal, saved: s, effectivePct: pct };
  }, [original, kind1, value1, stack, kind2, value2]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Original price"
          type="number"
          inputMode="decimal"
          value={original}
          onChange={(e) => setOriginal(Number(e.target.value))}
          min={0}
          step={0.01}
          leading="$"
          supportingText="Sticker price before any coupons."
        />

        <div className="grid gap-3">
          <Segment
            label="Discount type"
            value={kind1}
            onChange={(v) => setKind1(v as DiscountKind)}
            options={[
              { value: "percent", label: "Percent off" },
              { value: "dollar", label: "Dollar off" },
            ]}
          />
          <TextField
            label={kind1 === "percent" ? "Discount" : "Amount off"}
            type="number"
            inputMode="decimal"
            value={value1}
            onChange={(e) => setValue1(Number(e.target.value))}
            min={0}
            step={kind1 === "percent" ? 1 : 0.01}
            trailing={kind1 === "percent" ? "%" : undefined}
            leading={kind1 === "dollar" ? "$" : undefined}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="inline-flex items-center gap-2 md-body-medium cursor-pointer">
            <input
              type="checkbox"
              checked={stack}
              onChange={(e) => setStack(e.target.checked)}
              className="size-5 accent-[var(--md-sys-color-primary)]"
            />
            Stack a second discount
          </label>
        </div>

        {stack ? (
          <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2 rounded-[var(--md-sys-shape-corner-medium)] border border-[var(--md-sys-color-outline-variant)] p-3">
            <Segment
              label="Second discount type"
              value={kind2}
              onChange={(v) => setKind2(v as DiscountKind)}
              options={[
                { value: "percent", label: "Percent off" },
                { value: "dollar", label: "Dollar off" },
              ]}
            />
            <TextField
              label={kind2 === "percent" ? "Second discount" : "Second amount off"}
              type="number"
              inputMode="decimal"
              value={value2}
              onChange={(e) => setValue2(Number(e.target.value))}
              min={0}
              step={kind2 === "percent" ? 1 : 0.01}
              trailing={kind2 === "percent" ? "%" : undefined}
              leading={kind2 === "dollar" ? "$" : undefined}
              supportingText="Applied after the first discount."
            />
          </div>
        ) : null}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Final price</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtUsd(finalPrice)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">You save</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtUsd(saved)}
            </p>
          </div>
          <div className="sm:col-span-2 md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
            {stack && Number.isFinite(afterFirst) ? (
              <p>
                After first discount: <span className="tabular-nums">{fmtUsd(afterFirst)}</span> · Effective discount:{" "}
                <span className="tabular-nums">{Number.isFinite(effectivePct) ? `${effectivePct.toFixed(1)}%` : "—"}</span>
              </p>
            ) : (
              <p>
                Effective discount:{" "}
                <span className="tabular-nums">{Number.isFinite(effectivePct) ? `${effectivePct.toFixed(1)}%` : "—"}</span>
              </p>
            )}
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Final price excludes sales tax. Tax treatment of coupons varies by state and coupon type.
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
