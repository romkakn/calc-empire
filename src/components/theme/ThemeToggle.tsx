"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  isValidPreference,
  THEME_COOKIE,
  THEMES,
  type ThemePreference,
} from "@/lib/theme";

function readCookiePref(): ThemePreference {
  if (typeof document === "undefined") return "system";
  const m = document.cookie.match(/(?:^|; )theme=(system|light|dark)/);
  return m && isValidPreference(m[1]) ? m[1] : "system";
}

// Lightweight external store so React 19's useSyncExternalStore can read the
// cookie without triggering set-state-in-effect or hydration warnings.
const subscribers = new Set<() => void>();
function subscribe(cb: () => void) {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}
function emit() {
  for (const cb of subscribers) cb();
}
function getSnapshot(): ThemePreference {
  return readCookiePref();
}
function getServerSnapshot(): ThemePreference {
  return "system";
}

function writeCookiePref(pref: ThemePreference) {
  document.cookie = `${THEME_COOKIE}=${pref}; path=/; max-age=31536000; samesite=lax`;
  emit();
}

function applyDataTheme(pref: ThemePreference) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved =
    pref === "dark" || (pref === "system" && prefersDark) ? "dark" : "light";
  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-theme-pref", pref);
}

const LABELS: Record<ThemePreference, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

const ICONS: Record<ThemePreference, string> = {
  system: "◐",
  light: "☀",
  dark: "☾",
};

export function ThemeToggle() {
  const pref = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyDataTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [pref]);

  function choose(next: ThemePreference) {
    writeCookiePref(next);
    applyDataTheme(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1"
    >
      {THEMES.map((opt) => {
        const active = pref === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={LABELS[opt]}
            onClick={() => choose(opt)}
            className={[
              "inline-flex h-12 min-w-12 items-center justify-center rounded-full px-3 text-sm font-medium",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
              active
                ? "bg-[var(--color-on-surface)] text-[var(--color-surface)]"
                : "text-[var(--color-on-surface)] hover:bg-[var(--color-surface-2)]",
            ].join(" ")}
          >
            <span aria-hidden className="text-base leading-none">
              {ICONS[opt]}
            </span>
            <span className="sr-only sm:not-sr-only sm:ml-2">{LABELS[opt]}</span>
          </button>
        );
      })}
    </div>
  );
}
