"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "id"> & {
  label: string;
  supportingText?: ReactNode;
  error?: string;
  trailing?: ReactNode;
  leading?: ReactNode;
};

/**
 * MD3 Outlined Text Field.
 *
 * - 56dp height
 * - 1px outlined border, primary border + outline ring on focus, error color on aria-invalid
 * - Floating label: rests inside on empty state, jumps to notched outline on focus or when filled
 * - Supporting text below; error text replaces supporting text when present
 * - Touch target: ≥ 48dp via min-height; full WCAG 2.2 SC 2.5.8 compliance
 * - Label always rendered as a real <label htmlFor=…> — never placeholder-only
 */
export function TextField({
  label,
  supportingText,
  error,
  trailing,
  leading,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  className = "",
  type = "text",
  ...rest
}: Props) {
  const inputId = useId();
  const helpId = useId();
  const errId = useId();

  const [focused, setFocused] = useState(false);

  const stringValue = typeof value === "string" || typeof value === "number" ? String(value) : "";
  const filled = focused || stringValue.length > 0 || (defaultValue != null && String(defaultValue).length > 0);
  const invalid = Boolean(error) || rest["aria-invalid"] === true;

  return (
    <div className={["relative", className].join(" ")}>
      <div
        className={[
          "relative flex items-center",
          "rounded-[var(--md-sys-shape-corner-xs)]",
          "transition-[border-color] duration-[var(--md-sys-motion-duration-short3)]",
        ].join(" ")}
      >
        <input
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          onChange={onChange}
          aria-invalid={invalid || undefined}
          aria-describedby={[error ? errId : null, supportingText ? helpId : null].filter(Boolean).join(" ") || undefined}
          placeholder=" "
          className={[
            // Reset the global input style so we can render the M3 outline ourselves.
            "peer w-full min-h-14 px-4 pt-5 pb-2 bg-transparent",
            "rounded-[var(--md-sys-shape-corner-xs)]",
            "border outline-none",
            invalid
              ? "border-[var(--md-sys-color-error)] focus:border-[var(--md-sys-color-error)]"
              : "border-[var(--md-sys-color-outline)] focus:border-[var(--md-sys-color-primary)]",
            "focus:border-2 focus:px-[15px] focus:pt-[19px] focus:pb-[7px]",
            "text-[var(--md-sys-color-on-surface)] caret-[var(--md-sys-color-primary)]",
            "md-body-large",
            trailing ? "pr-12" : "",
            leading ? "pl-10" : "",
          ].join(" ")}
          {...rest}
        />

        {leading ? (
          <span
            className="md-body-medium absolute left-4 text-[var(--md-sys-color-on-surface-variant)]"
            aria-hidden
          >
            {leading}
          </span>
        ) : null}

        <label
          htmlFor={inputId}
          className={[
            "pointer-events-none absolute px-1",
            leading ? "left-10" : "left-4",
            "bg-[var(--md-sys-color-surface)]",
            "transition-all duration-[var(--md-sys-motion-duration-short3)]",
            filled
              ? "top-0 -translate-y-1/2 md-body-small"
              : "top-1/2 -translate-y-1/2 md-body-large",
            invalid
              ? "text-[var(--md-sys-color-error)]"
              : focused
                ? "text-[var(--md-sys-color-primary)]"
                : "text-[var(--md-sys-color-on-surface-variant)]",
          ].join(" ")}
        >
          {label}
        </label>

        {trailing ? (
          <span
            className="md-body-medium absolute right-3 text-[var(--md-sys-color-on-surface-variant)]"
            aria-hidden
          >
            {trailing}
          </span>
        ) : null}
      </div>

      {error ? (
        <p id={errId} className="md-body-small mt-1 ml-4 text-[var(--md-sys-color-error)]">
          {error}
        </p>
      ) : supportingText ? (
        <p
          id={helpId}
          className="md-body-small mt-1 ml-4 text-[var(--md-sys-color-on-surface-variant)]"
        >
          {supportingText}
        </p>
      ) : null}
    </div>
  );
}
