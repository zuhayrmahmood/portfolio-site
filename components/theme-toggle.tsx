"use client";

import { useState } from "react";
import { THEME_COLORS, THEME_STORAGE_KEY } from "@/lib/theme";

// Reads the DOM attribute the inline script in app/layout.tsx already set
// before hydration, so the icon crossfade (driven by CSS, not this value)
// is correct from first paint. `aria-pressed` below still needs
// suppressHydrationWarning: unlike `data-theme` on <html>, nothing
// pre-corrects the button's own attribute before React hydrates, so the
// server's "false" and the client's live read of an already-dark page
// legitimately disagree once.
function isDarkNow() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.dataset.theme === "dark"
  );
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(isDarkNow);

  function toggle() {
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[next]);
    setIsDark(!isDark);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      suppressHydrationWarning
      aria-label="Toggle dark mode"
      className="theme-toggle"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="18"
        height="18"
        className="theme-toggle-icon theme-toggle-icon-sun"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="18"
        height="18"
        className="theme-toggle-icon theme-toggle-icon-moon"
      >
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
