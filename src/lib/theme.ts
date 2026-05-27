export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_COOKIE = "theme";
export const THEMES: ThemePreference[] = ["system", "light", "dark"];

export function isValidPreference(v: unknown): v is ThemePreference {
  return v === "system" || v === "light" || v === "dark";
}
