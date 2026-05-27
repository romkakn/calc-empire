import Link from "next/link";
import { Container } from "./Container";
import { SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 bg-[var(--md-sys-color-surface-container-low)] text-[var(--md-sys-color-on-surface-variant)]">
      <Container as="div" className="flex flex-wrap items-center justify-between gap-3 py-6">
        <p className="md-body-small">
          © {year} {SITE.name}. {SITE.tagline}
        </p>
        <nav aria-label="Footer" className="flex gap-2">
          <Link href="/about" className="md-btn md-btn-text md-label-large">About</Link>
          <Link href="/sitemap.xml" className="md-btn md-btn-text md-label-large">Sitemap</Link>
        </nav>
      </Container>
    </footer>
  );
}
