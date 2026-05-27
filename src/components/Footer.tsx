import Link from "next/link";
import { Container } from "./Container";
import { SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-[var(--color-border)] bg-[var(--color-surface)] py-6 text-sm">
      <Container as="div" className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[var(--color-on-surface-variant)]">
          © {year} {SITE.name}. {SITE.tagline}
        </p>
        <nav aria-label="Footer" className="flex gap-4">
          <Link
            href="/about"
            className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] rounded-sm"
          >
            About
          </Link>
          <Link
            href="/sitemap.xml"
            className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] rounded-sm"
          >
            Sitemap
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
