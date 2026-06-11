"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Medicare PFS payment formula (CMS):
//   Payment = (wRVU × wGPCI + peRVU × peGPCI + mpRVU × mpGPCI) × CF
// TODO_VERIFY: 2025 Medicare Physician Fee Schedule Conversion Factor ≈ $32.35
//   Source: https://www.cms.gov/medicare/payment/fee-schedules/physician — confirm CF for date of service.

type Setting = "non-facility" | "facility";

function rvuPayment(
  wRVU: number, peRVU: number, mpRVU: number,
  wGPCI: number, peGPCI: number, mpGPCI: number,
  cf: number,
): number {
  if (![wRVU, peRVU, mpRVU, wGPCI, peGPCI, mpGPCI, cf].every(Number.isFinite)) return NaN;
  return (wRVU * wGPCI + peRVU * peGPCI + mpRVU * mpGPCI) * cf;
}

function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 2,
  }).format(n);
}

export function Calculator() {
  const [setting, setSetting] = useState<Setting>("non-facility");
  const [wRVU, setWRVU] = useState(2.5);
  const [peRVU, setPeRVU] = useState(1.2);
  const [mpRVU, setMpRVU] = useState(0.2);
  const [wGPCI, setWGPCI] = useState(1.0);
  const [peGPCI, setPeGPCI] = useState(1.0);
  const [mpGPCI, setMpGPCI] = useState(1.0);
  const [cf, setCf] = useState(32.35);

  const { payment, adjustedTotal, wPortion, pePortion, mpPortion } = useMemo(() => {
    const wP = wRVU * wGPCI;
    const peP = peRVU * peGPCI;
    const mpP = mpRVU * mpGPCI;
    const total = wP + peP + mpP;
    return {
      payment: rvuPayment(wRVU, peRVU, mpRVU, wGPCI, peGPCI, mpGPCI, cf),
      adjustedTotal: total,
      wPortion: wP * cf,
      pePortion: peP * cf,
      mpPortion: mpP * cf,
    };
  }, [wRVU, peRVU, mpRVU, wGPCI, peGPCI, mpGPCI, cf]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Estimate only.</strong> Actual Medicare payment depends on modifiers,
        sequestration, MIPS, and secondary insurance. Confirm CF and GPCIs at the
        CMS Physician Fee Schedule lookup before quoting.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Place of service"
          value={setting}
          onChange={(v) => setSetting(v as Setting)}
          options={[
            { value: "non-facility", label: "Non-facility (office)" },
            { value: "facility", label: "Facility (hospital)" },
          ]}
        />
      </div>

      <p className="md-body-small mb-3 text-[var(--md-sys-color-on-surface-variant)]">
        Enter the {setting === "facility" ? "facility" : "non-facility"} PE RVU from the
        CMS PFS lookup for your CPT code.
      </p>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Work RVU (wRVU)"
          type="number"
          inputMode="decimal"
          value={wRVU}
          onChange={(e) => setWRVU(Number(e.target.value))}
          min={0}
          step={0.01}
          supportingText="Physician work component from the CMS PFS lookup."
        />
        <TextField
          label="Practice Expense RVU (PE RVU)"
          type="number"
          inputMode="decimal"
          value={peRVU}
          onChange={(e) => setPeRVU(Number(e.target.value))}
          min={0}
          step={0.01}
          supportingText="Use facility or non-facility value to match place of service."
        />
        <TextField
          label="Malpractice RVU (MP RVU)"
          type="number"
          inputMode="decimal"
          value={mpRVU}
          onChange={(e) => setMpRVU(Number(e.target.value))}
          min={0}
          step={0.01}
        />
        <TextField
          label="Conversion Factor (CF)"
          type="number"
          inputMode="decimal"
          value={cf}
          onChange={(e) => setCf(Number(e.target.value))}
          min={0}
          step={0.0001}
          trailing="$"
          supportingText="2025 CF ≈ $32.35. CMS updates annually."
        />
        <TextField
          label="Work GPCI"
          type="number"
          inputMode="decimal"
          value={wGPCI}
          onChange={(e) => setWGPCI(Number(e.target.value))}
          min={0}
          step={0.001}
          supportingText="1.0 = national average. Locality values vary."
        />
        <TextField
          label="PE GPCI"
          type="number"
          inputMode="decimal"
          value={peGPCI}
          onChange={(e) => setPeGPCI(Number(e.target.value))}
          min={0}
          step={0.001}
        />
        <TextField
          label="MP GPCI"
          type="number"
          inputMode="decimal"
          value={mpGPCI}
          onChange={(e) => setMpGPCI(Number(e.target.value))}
          min={0}
          step={0.001}
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Estimated payment
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmtUSD(payment)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Total adjusted RVUs
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(adjustedTotal) ? adjustedTotal.toFixed(2) : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 grid gap-1 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
            <p>
              <span className="font-semibold">Work portion:</span>{" "}
              <span className="tabular-nums">{fmtUSD(wPortion)}</span>
            </p>
            <p>
              <span className="font-semibold">Practice expense portion:</span>{" "}
              <span className="tabular-nums">{fmtUSD(pePortion)}</span>
            </p>
            <p>
              <span className="font-semibold">Malpractice portion:</span>{" "}
              <span className="tabular-nums">{fmtUSD(mpPortion)}</span>
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Verify the conversion factor and GPCIs at the CMS Physician Fee Schedule lookup
        for the date of service. Modifiers and policy adjustments can change the paid amount.
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
