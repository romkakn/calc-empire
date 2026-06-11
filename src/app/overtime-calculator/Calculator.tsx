"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// FLSA overtime (29 USC § 207): 1.5x regular rate for hours > 40/week, non-exempt.
// California Labor Code § 510: 2x after 12 hrs/day or 8 hrs on the 7th consecutive day.
// TODO_VERIFY: federal salary threshold and CA daily OT rules — see
//   https://www.dol.gov/agencies/whd/overtime and
//   https://www.dir.ca.gov/dlse/faq_overtime.htm

type Multiplier = "1.5" | "2";
type StateRule = "flsa" | "california";

function otPay(hours: number, rate: number, multiplier: number) {
  if (!Number.isFinite(hours) || !Number.isFinite(rate)) return NaN;
  return hours * rate * multiplier;
}

function regularPay(hours: number, rate: number) {
  if (!Number.isFinite(hours) || !Number.isFinite(rate)) return NaN;
  return hours * rate;
}

export function Calculator() {
  const [rate, setRate] = useState(20);
  const [regHours, setRegHours] = useState(40);
  const [otHours, setOtHours] = useState(10);
  const [multiplier, setMultiplier] = useState<Multiplier>("1.5");
  const [stateRule, setStateRule] = useState<StateRule>("flsa");

  const { reg, ot, total, otRate } = useMemo(() => {
    const m = Number(multiplier);
    const reg = regularPay(regHours, rate);
    const ot = otPay(otHours, rate, m);
    const total = (Number.isFinite(reg) ? reg : 0) + (Number.isFinite(ot) ? ot : 0);
    const otRate = Number.isFinite(rate) ? rate * m : NaN;
    return { reg, ot, total, otRate };
  }, [rate, regHours, otHours, multiplier]);

  const ruleNote =
    stateRule === "california"
      ? "California: 1.5x after 8 hrs/day or 40 hrs/week. 2x after 12 hrs/day or 8 hrs on the 7th consecutive workday."
      : "Federal FLSA: 1.5x for non-exempt hours beyond 40 in a workweek. No federal daily OT rule.";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Estimate only.</strong> Not legal or tax advice. Exempt status, bonuses,
        and tipped wages can change the math. Check with your HR or state labor office.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="State rule"
          value={stateRule}
          onChange={(v) => setStateRule(v as StateRule)}
          options={[
            { value: "flsa", label: "Federal (FLSA)" },
            { value: "california", label: "California" },
          ]}
        />
        <Segment
          label="OT multiplier"
          value={multiplier}
          onChange={(v) => setMultiplier(v as Multiplier)}
          options={[
            { value: "1.5", label: "1.5x (time-and-a-half)" },
            { value: "2", label: "2x (double-time)" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-3"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Hourly rate"
          type="number"
          inputMode="decimal"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          min={0}
          max={1000}
          step={0.25}
          leading="$"
          supportingText="Regular rate of pay."
        />
        <TextField
          label="Regular hours"
          type="number"
          inputMode="decimal"
          value={regHours}
          onChange={(e) => setRegHours(Number(e.target.value))}
          min={0}
          max={168}
          step={0.5}
          trailing="hrs"
          supportingText="FLSA cap: 40/week."
        />
        <TextField
          label="Overtime hours"
          type="number"
          inputMode="decimal"
          value={otHours}
          onChange={(e) => setOtHours(Number(e.target.value))}
          min={0}
          max={168}
          step={0.5}
          trailing="hrs"
          supportingText="Hours past the OT threshold."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Regular pay</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(reg) ? `$${reg.toFixed(2)}` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Overtime pay
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(ot) ? `$${ot.toFixed(2)}` : "—"}
            </p>
            <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)] mt-1">
              {Number.isFinite(otRate) ? `OT rate: $${otRate.toFixed(2)}/hr` : ""}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Total weekly pay
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(total) ? `$${total.toFixed(2)}` : "—"}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        {ruleNote}
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
