"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { CATEGORIES, LIVE_CALCULATORS, LIVE_ARTICLES } from "@/lib/site";

// Only show categories that have at least one live item.
function liveCategoryEntries() {
  const live = new Set([
    ...LIVE_CALCULATORS.map((c) => c.category),
    ...LIVE_ARTICLES.map((a) => a.category),
  ]);
  return Object.entries(CATEGORIES)
    .filter(([slug]) => live.has(slug))
    .map(([slug, meta]) => ({ slug, label: meta.label }));
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden>
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden>
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

export function Nav() {
  const pathname = usePathname();
  const entries = liveCategoryEntries();
  const [open, setOpen] = useState(false);
  const drawerLabelId = useId();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Close on ESC + lock body scroll while open + focus the first link.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Return focus to the toggle when the drawer closes.
  useEffect(() => {
    if (!open) toggleBtnRef.current?.focus();
  }, [open]);

  function isActive(slug: string): boolean {
    return pathname === `/${slug}`;
  }

  return (
    <>
      {/* Inline nav, visible on md+ screens. M3 active state = primary-container pill. */}
      <nav aria-label="Categories" className="hidden md:flex items-center gap-1">
        {entries.map((c) => {
          const active = isActive(c.slug);
          return (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              aria-current={active ? "page" : undefined}
              className={[
                "inline-flex items-center min-h-12 px-3 rounded-[var(--md-sys-shape-corner-full)] md-label-large",
                "transition-colors duration-[var(--md-sys-motion-duration-short3)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-2",
                active
                  ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                  : "text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
              ].join(" ")}
            >
              {c.label}
            </Link>
          );
        })}
        <Link
          href="/blog"
          aria-current={pathname.startsWith("/blog") ? "page" : undefined}
          className={[
            "inline-flex items-center min-h-12 px-3 rounded-[var(--md-sys-shape-corner-full)] md-label-large",
            "transition-colors duration-[var(--md-sys-motion-duration-short3)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-2",
            pathname.startsWith("/blog")
              ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
              : "text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
          ].join(" ")}
        >
          Blog
        </Link>
      </nav>

      {/* Mobile: hamburger button + slide-in drawer. */}
      <button
        ref={toggleBtnRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="md:hidden inline-flex items-center justify-center min-h-12 min-w-12 rounded-[var(--md-sys-shape-corner-full)] text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-2"
      >
        <MenuIcon />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={drawerLabelId}
          className="md:hidden fixed inset-0 z-40"
        >
          {/* Scrim — M3 modal drawer pattern: 32% black overlay */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
            tabIndex={-1}
          />

          {/* Drawer panel */}
          <aside
            className="absolute left-0 top-0 h-full w-[min(80vw,320px)] bg-[var(--md-sys-color-surface-container-low)] md-elevation-3 flex flex-col"
          >
            <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--md-sys-color-outline-variant)]">
              <span id={drawerLabelId} className="md-title-medium">
                Categories
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="inline-flex items-center justify-center min-h-12 min-w-12 rounded-[var(--md-sys-shape-corner-full)] text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-2"
              >
                <CloseIcon />
              </button>
            </header>

            <ul className="flex-1 overflow-y-auto py-2 list-none">
              <li>
                <Link
                  ref={firstLinkRef}
                  href="/"
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-center min-h-12 px-4 mx-2 rounded-[var(--md-sys-shape-corner-full)] md-label-large",
                    pathname === "/"
                      ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                      : "text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
                  ].join(" ")}
                >
                  Home
                </Link>
              </li>
              {entries.map((c, i) => (
                <li key={c.slug}>
                  <Link
                    href={`/${c.slug}`}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(c.slug) ? "page" : undefined}
                    ref={i === -1 ? firstLinkRef : undefined}
                    className={[
                      "flex items-center min-h-12 px-4 mx-2 rounded-[var(--md-sys-shape-corner-full)] md-label-large",
                      isActive(c.slug)
                        ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                        : "text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
                    ].join(" ")}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t border-[var(--md-sys-color-outline-variant)] pt-2">
                <Link
                  href="/blog"
                  onClick={() => setOpen(false)}
                  aria-current={pathname.startsWith("/blog") ? "page" : undefined}
                  className={[
                    "flex items-center min-h-12 px-4 mx-2 rounded-[var(--md-sys-shape-corner-full)] md-label-large",
                    pathname.startsWith("/blog")
                      ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                      : "text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
                  ].join(" ")}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  aria-current={pathname === "/about" ? "page" : undefined}
                  className={[
                    "flex items-center min-h-12 px-4 mx-2 rounded-[var(--md-sys-shape-corner-full)] md-label-large",
                    pathname === "/about"
                      ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                      : "text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
                  ].join(" ")}
                >
                  About
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      ) : null}
    </>
  );
}
