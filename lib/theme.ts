export const THEME_STORAGE_KEY = "theme";

// Keep in sync with --color-background in app/globals.css (light in the
// @theme block, dark in the [data-theme="dark"] override) — this only
// drives the browser-chrome <meta name="theme-color"> tag, so a mismatch
// won't show on the page itself, just in the OS status bar.
export const THEME_COLORS = {
  light: "#faf8f4",
  dark: "#17140f",
} as const;

export type Theme = keyof typeof THEME_COLORS;
