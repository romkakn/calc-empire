import type { ReactNode } from "react";

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="mt-10">
      <h2
        id={headingId}
        className="md-headline-small text-[var(--md-sys-color-on-surface)]"
      >
        {title}
      </h2>
      <div className="mt-3 md-body-large text-[var(--md-sys-color-on-surface)]">
        {children}
      </div>
    </section>
  );
}
