import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/schema";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-[var(--color-on-surface-variant)]">
        {items.map((b, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${i}-${b.path}`} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-[var(--color-on-surface)]">
                  {b.name}
                </span>
              ) : (
                <>
                  <Link
                    href={b.path}
                    className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] rounded-sm"
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
