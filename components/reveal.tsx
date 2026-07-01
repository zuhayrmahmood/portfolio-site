import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Delay in seconds before the entrance animation starts (stagger). */
  delay?: number;
  className?: string;
};

/**
 * Fades + rises its children in on load.
 *
 * Pure CSS (see `.reveal` in globals.css), mirroring `.page-transition` — so
 * it runs even when JavaScript doesn't (some mobile Safari versions never
 * execute the client bundle), and, crucially, its resting state is visible.
 * That means content is never left stuck hidden if scripts fail. The global
 * `prefers-reduced-motion` rule neutralizes the motion automatically.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const style = { "--reveal-delay": `${delay}s` } as CSSProperties;
  return (
    <div className={className ? `reveal ${className}` : "reveal"} style={style}>
      {children}
    </div>
  );
}
