import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/schema";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="md-body-small">
      <ol className="flex flex-wrap items-center gap-1 text-[var(--md-sys-color-on-surface-variant)]">
        {items.map((b, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${i}-${b.path}`} className="flex items-center gap-1">
              {last ? (
                <span
                  aria-current="page"
                  className="text-[var(--md-sys-color-on-surface)]"
                >
                  {b.name}
                </span>
              ) : (
                <>
                  <Link
                    href={b.path}
                    className="rounded-[var(--md-sys-shape-corner-xs)] px-1 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)]"
                  >
                    {b.name}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
