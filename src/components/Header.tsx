import Link from "next/link";
import { Container } from "./Container";
import { ThemeToggle } from "./theme/ThemeToggle";
import { SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <Container as="div" className="flex items-center justify-between py-3">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] rounded-sm"
        >
          {SITE.name}
        </Link>
        <ThemeToggle />
      </Container>
    </header>
  );
}
