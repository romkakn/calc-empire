import type { ReactNode } from "react";

export function Hero({
  title,
  tagline,
  children,
}: {
  title: string;
  tagline: string;
  children?: ReactNode;
}) {
  return (
    <header className="mt-2">
      <h1 className="md-display-small text-[var(--md-sys-color-on-surface)]">
        {title}
      </h1>
      <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
        {tagline}
      </p>
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  );
}
