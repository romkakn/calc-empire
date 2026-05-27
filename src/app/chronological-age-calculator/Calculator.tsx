"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Borrowing-aware Y/M/D difference (no naive divisions).
function diff(birth: Date, ref: Date) {
  if (Number.isNaN(birth.getTime()) || Number.isNaN(ref.getTime())) return null;
  if (ref < birth) return null;
  let y = ref.getFullYear() - birth.getFullYear();
  let m = ref.getMonth() - birth.getMonth();
  let d = ref.getDate() - birth.getDate();
  if (d < 0) {
    const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
    d += prevMonth.getDate();
    m -= 1;
  }
  if (m < 0) {
    m += 12;
    y -= 1;
  }
  const ms = ref.getTime() - birth.getTime();
  const totalDays = Math.floor(ms / 86_400_000);
  const decimalYears = totalDays / 365.25;
  return { y, m, d, totalDays, decimalYears };
}

function todayISO() {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate()).toISOString().slice(0, 10);
}

export function Calculator() {
  const [birth, setBirth] = useState("2020-03-15");
  const [ref, setRef] = useState(todayISO());
  const [prematureWeeks, setPrematureWeeks] = useState(0);

  const out = useMemo(() => {
    const b = new Date(birth);
    const r = new Date(ref);
    const d = diff(b, r);
    if (!d) return null;
    // AAP corrected age: subtract prematurity weeks until 24 months chronological
    const monthsTotal = d.y * 12 + d.m;
    const useCorrected = prematureWeeks > 0 && monthsTotal < 24;
    if (!useCorrected) return { ...d, corrected: null };
    const correctedTotalDays = d.totalDays - prematureWeeks * 7;
    const corrRef = new Date(b.getTime() + correctedTotalDays * 86_400_000);
    const corr = diff(b, corrRef);
    return { ...d, corrected: corr };
  }, [birth, ref, prematureWeeks]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Date of birth"
          type="date"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
        />
        <TextField
          label="Reference date"
          type="date"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          supportingText="Defaults to today. Change for a specific test date or report date."
        />
        <TextField
          label="Weeks born premature (optional)"
          type="number"
          inputMode="numeric"
          value={prematureWeeks}
          onChange={(e) => setPrematureWeeks(Math.max(0, Number(e.target.value)))}
          min={0}
          max={16}
          step={1}
          supportingText="AAP: subtract weeks early until the child reaches 24 months chronological age."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Chronological age
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {out ? `${out.y}y ${out.m}m ${out.d}d` : "—"}
            </p>
          </div>
          {out?.corrected ? (
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                Corrected age (prematurity adjusted)
              </p>
              <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-tertiary)]">
                {`${out.corrected.y}y ${out.corrected.m}m ${out.corrected.d}d`}
              </p>
            </div>
          ) : null}
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Total days
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {out ? out.totalDays.toLocaleString("en-US") : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Decimal years
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {out ? out.decimalYears.toFixed(4) : "—"}
            </p>
          </div>
        </div>
      </Card>

      {!out ? (
        <p className="mt-3 md-body-small text-[var(--md-sys-color-error)]">
          Reference date must be on or after the date of birth.
        </p>
      ) : null}
    </Card>
  );
}
