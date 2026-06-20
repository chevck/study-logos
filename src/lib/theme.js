export const THEMES = ["light", "dark", "system"];

export function normalizeTheme(value) {
  const v = String(value ?? "").trim().toLowerCase();
  if (v === "light" || v === "dark" || v === "system") return v;
  return "system";
}

export function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Maps a stored preference (light | dark | system) to the active color scheme. */
export function resolveTheme(preference) {
  const pref = normalizeTheme(preference);
  if (pref === "system") return getSystemTheme();
  return pref;
}

export function applyTheme(preference) {
  const pref = normalizeTheme(preference);
  const resolved = resolveTheme(pref);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.dataset.theme = pref;
  document.documentElement.dataset.resolvedTheme = resolved;
  return resolved;
}

export function readAppliedTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function readThemePreference() {
  const fromDom = document.documentElement.dataset.theme;
  return normalizeTheme(fromDom);
}

export function subscribeToSystemTheme(onChange) {
  if (typeof window === "undefined") return () => {};

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => onChange(getSystemTheme());

  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}
