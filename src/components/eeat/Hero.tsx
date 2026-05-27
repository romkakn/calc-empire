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
    <header className="mt-4">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-prose text-lg text-[var(--color-on-surface-variant)]">
        {tagline}
      </p>
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  );
}
