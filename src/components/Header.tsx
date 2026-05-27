import Link from "next/link";
import { Container } from "./Container";
import { ThemeToggle } from "./theme/ThemeToggle";
import { SITE } from "@/lib/site";

/**
 * M3 Top App Bar (center-aligned variant adapted to wide content).
 * - 64dp tall on phones
 * - Surface container color (not surface) so it tints subtly with elevation
 * - md-title-large brand wordmark
 */
export function Header() {
  return (
    <header className="bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)]">
      <Container as="div" className="flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="md-title-large rounded-[var(--md-sys-shape-corner-xs)] px-2 py-1 -mx-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)]"
        >
          {SITE.name}
        </Link>
        <ThemeToggle />
      </Container>
    </header>
  );
}
