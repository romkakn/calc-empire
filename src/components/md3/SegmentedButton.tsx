"use client";

import type { ReactNode } from "react";

type Option<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

/**
 * MD3 Segmented Button — single-select.
 * Behaves as a radiogroup. ARIA-checked reflected on each segment.
 * Touch target ≥ 48dp via min-height.
 */
export function SegmentedButton<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] overflow-hidden"
    >
      {options.map((opt, i) => {
        const active = value === opt.value;
        const isFirst = i === 0;
        const isLast = i === options.length - 1;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.label}
            onClick={() => onChange(opt.value)}
            className={[
              "relative inline-flex items-center justify-center gap-2",
              "min-h-12 px-3 sm:px-4",
              "md-label-large",
              "transition-colors duration-[var(--md-sys-motion-duration-short3)] var(--md-sys-motion-easing-standard)",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px] focus-visible:z-10",
              active
                ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                : "text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
              !isFirst ? "border-l border-[var(--md-sys-color-outline)]" : "",
              isFirst ? "rounded-l-[var(--md-sys-shape-corner-full)]" : "",
              isLast ? "rounded-r-[var(--md-sys-shape-corner-full)]" : "",
            ].join(" ")}
          >
            {active ? (
              <span aria-hidden className="inline-block size-4">
                {/* checkmark indicates selected segment per MD3 spec */}
                <svg viewBox="0 0 20 20" fill="currentColor"><path d="M7.629 14.571L3.057 10l1.414-1.414 3.158 3.157 6.9-6.9 1.414 1.414z" /></svg>
              </span>
            ) : opt.icon ? (
              <span aria-hidden className="inline-block">{opt.icon}</span>
            ) : null}
            <span className="hidden sm:inline">{opt.label}</span>
            <span className="sr-only sm:hidden">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
