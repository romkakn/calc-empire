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
      <h2 id={headingId} className="text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-3 text-[var(--color-on-surface)]">{children}</div>
    </section>
  );
}
