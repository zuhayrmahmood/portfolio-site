import type { ReactNode } from "react";

/**
 * Wraps every page in a lightweight enter animation.
 *
 * Unlike `layout.tsx`, a `template.tsx` remounts on navigation, so the CSS
 * animation on `.page-transition` (see globals.css) replays on each route
 * change — smooth page transitions with zero JS. The `prefers-reduced-motion`
 * rule in globals.css neutralizes it automatically, and because the resting
 * state is visible, content still shows if CSS/JS never runs.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
