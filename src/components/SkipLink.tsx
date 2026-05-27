export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-on-surface)] focus:px-4 focus:py-3 focus:text-[var(--color-surface)] focus:outline focus:outline-2 focus:outline-[var(--color-focus)]"
    >
      Skip to main content
    </a>
  );
}
