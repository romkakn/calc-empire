import Link from "next/link";
import { Nav } from "./Nav";
import { ThemeToggle } from "./theme/ThemeToggle";
import { SITE } from "@/lib/site";

/**
 * M3 Top App Bar — sticky at top.
 *
 * The header gets a wider container than article content (which stays at
 * max-w-3xl for readability). On desktop we want all category links + the
 * theme toggle to fit comfortably alongside the wordmark.
 */
export function Header() {
  return (
    <header className="bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] sticky top-0 z-30">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 flex h-16 items-center gap-3">
        <Link
          href="/"
          className="md-title-large whitespace-nowrap rounded-[var(--md-sys-shape-corner-xs)] px-2 py-1 -mx-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)]"
        >
          {SITE.name}
        </Link>

        <div className="flex-1 flex justify-center">
          <Nav />
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
