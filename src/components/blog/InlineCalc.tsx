"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

export type InlineField = {
  /** Key the value is exposed under in `compute`. */
  key: string;
  label: string;
  /** Unit shown after the input, e.g. "ft", "%". */
  suffix?: string;
  /** Starting value. Posts should pick numbers that make the worked example. */
  initial: number;
  step?: number;
  supportingText?: string;
};

export type InlineResult = {
  label: string;
  /** Already formatted — the widget never guesses units or precision. */
  value: string;
  /** Renders larger; use for the one number the reader came for. */
  emphasis?: boolean;
  note?: string;
};

/** Trim floating-point noise without pretending to more precision than we have. */
export function fmt(n: number, decimals = 2): string {
  return Number.parseFloat(n.toFixed(decimals)).toString();
}

/**
 * Live calculation embedded mid-article.
 *
 * Posts are server components, so `compute` cannot cross the boundary from
 * `page.tsx`. Each post declares its widgets in a sibling `Widgets.tsx` marked
 * `"use client"` and composes this primitive there — the same split the
 * calculator pages use for `Calculator.tsx`.
 *
 * `compute` receives every field parsed as a number (NaN when the box is empty
 * or non-numeric) and returns the rows to display. Return an empty array to
 * render nothing rather than a wrong answer.
 */
export function InlineCalc({
  title,
  caption,
  fields,
  compute,
  footnote,
}: {
  title: string;
  caption?: string;
  fields: InlineField[];
  compute: (values: Record<string, number>) => InlineResult[];
  footnote?: string;
}) {
  const [raw, setRaw] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, String(f.initial)])),
  );

  const results = useMemo(() => {
    const values = Object.fromEntries(
      fields.map((f) => [f.key, Number.parseFloat(raw[f.key] ?? "")]),
    ) as Record<string, number>;
    try {
      return compute(values);
    } catch {
      return [];
    }
  }, [raw, fields, compute]);

  return (
    <Card variant="filled" className="my-6 px-4 py-5 sm:px-6">
      <p className="md-title-medium text-[var(--md-sys-color-on-surface)]">{title}</p>
      {caption ? (
        <p className="mt-1 md-body-small text-[var(--md-sys-color-on-surface-variant)]">{caption}</p>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <TextField
            key={f.key}
            label={f.label}
            inputMode="decimal"
            type="number"
            step={f.step ?? "any"}
            value={raw[f.key] ?? ""}
            supportingText={f.supportingText}
            trailing={
              f.suffix ? (
                <span className="md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
                  {f.suffix}
                </span>
              ) : undefined
            }
            onChange={(e) => setRaw((prev) => ({ ...prev, [f.key]: e.target.value }))}
          />
        ))}
      </div>

      {results.length > 0 ? (
        <dl
          aria-live="polite"
          className="mt-5 divide-y divide-[var(--md-sys-color-outline-variant)] border-t border-[var(--md-sys-color-outline-variant)]"
        >
          {results.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-4 py-3">
              <dt className="md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
                {r.label}
                {r.note ? (
                  <span className="mt-0.5 block md-body-small text-[var(--md-sys-color-on-surface-variant)]">
                    {r.note}
                  </span>
                ) : null}
              </dt>
              <dd
                className={[
                  "shrink-0 text-right tabular-nums text-[var(--md-sys-color-on-surface)]",
                  r.emphasis ? "md-headline-small" : "md-body-large",
                ].join(" ")}
              >
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-5 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          Enter a number in every box to see the result.
        </p>
      )}

      {footnote ? (
        <p className="mt-4 md-body-small text-[var(--md-sys-color-on-surface-variant)]">{footnote}</p>
      ) : null}
    </Card>
  );
}
