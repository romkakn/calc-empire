export function SkipLink() {
  return (
    <a
      href="#main"
      className={[
        "sr-only focus:not-sr-only",
        "focus:fixed focus:left-4 focus:top-4 focus:z-50",
        "focus:rounded-[var(--md-sys-shape-corner-full)]",
        "focus:bg-[var(--md-sys-color-primary)] focus:text-[var(--md-sys-color-on-primary)]",
        "focus:px-6 focus:py-3 focus:md-label-large",
        "focus:md-elevation-3",
        "focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--md-sys-color-primary)]",
      ].join(" ")}
    >
      Skip to main content
    </a>
  );
}
