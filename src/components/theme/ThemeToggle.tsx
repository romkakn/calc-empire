"use client";

import { useEffect, useSyncExternalStore } from "react";
import { SegmentedButton } from "@/components/md3/SegmentedButton";
import {
  isValidPreference,
  THEME_COOKIE,
  type ThemePreference,
} from "@/lib/theme";

function readCookiePref(): ThemePreference {
  if (typeof document === "undefined") return "system";
  const m = document.cookie.match(/(?:^|; )theme=(system|light|dark)/);
  return m && isValidPreference(m[1]) ? m[1] : "system";
}

const subscribers = new Set<() => void>();
function subscribe(cb: () => void) {
  subscribers.add(cb);
  return () => { subscribers.delete(cb); };
}
function emit() { for (const cb of subscribers) cb(); }
function getSnapshot(): ThemePreference { return readCookiePref(); }
function getServerSnapshot(): ThemePreference { return "system"; }

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

// M3 Material Symbols (rounded) as inline SVG so we avoid loading a font.
const Icon = {
  System: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M21 3H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h6l-2 3v1h10v-1l-2-3h6c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2zm0 14H3V5h18v12z"/>
    </svg>
  ),
  Light: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm-1-6h2v3h-2zm0 19h2v3h-2zM1 11h3v2H1zm19 0h3v2h-3zM4.222 4.222l1.414 1.414L4.222 7.05 2.808 5.636zm12.728 12.728l1.414-1.414 1.414 1.414-1.414 1.414zM4.222 19.778l1.414-1.414 1.414 1.414-1.414 1.414zm12.728-12.728l1.414-1.414 1.414 1.414-1.414 1.414z"/>
    </svg>
  ),
  Dark: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36A5.39 5.39 0 0 1 16.5 12a5.5 5.5 0 0 1-5.5-5.5c0-1.61.69-3.06 1.79-4.07C12.55 3.05 12.0 3 12 3z"/>
    </svg>
  ),
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
    <SegmentedButton<ThemePreference>
      label="Theme"
      value={pref}
      onChange={choose}
      options={[
        { value: "system", label: "System", icon: <Icon.System /> },
        { value: "light", label: "Light", icon: <Icon.Light /> },
        { value: "dark", label: "Dark", icon: <Icon.Dark /> },
      ]}
    />
  );
}
