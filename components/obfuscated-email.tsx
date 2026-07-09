"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * The address is stored reversed, then base64-encoded, so it never appears
 * as a plain `x@y` / `mailto:` string in the served HTML *or* the JS bundle.
 * Regex-based address harvesters (which almost never execute JS, let alone
 * decode strings) find nothing to scrape. The real `mailto:` href is
 * assembled on the client after mount — the server-rendered markup ships
 * with no href at all.
 *
 * This is deliberately not military-grade: a headless-browser scraper that
 * runs our JS could still recover the address. It stops the overwhelming
 * majority of real-world harvesters, which is the goal. Paired with the
 * Gmail `+site` alias baked into the encoded value, anything that does leak
 * is trivially traceable and filterable.
 *
 * Regenerate ENCODED after changing the address:
 *   node -e 'console.log(Buffer.from("YOUR+alias@gmail.com".split("").reverse().join(""),"utf8").toString("base64"))'
 */
const ENCODED = "bW9jLmxpYW1nQGV0aXMrMTBkb29taGFtcnlhaHV6";

function decodeEmail(): string {
  return atob(ENCODED).split("").reverse().join("");
}

export function ObfuscatedEmail({
  children,
  className,
  subject,
}: {
  children: ReactNode;
  className?: string;
  /** Optional prefilled subject line for the composed email. */
  subject?: string;
}) {
  const [href, setHref] = useState<string | undefined>(undefined);

  useEffect(() => {
    const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
    setHref(`mailto:${decodeEmail()}${query}`);
  }, [subject]);

  return (
    <a
      href={href}
      className={className}
      // Until the effect runs (and for the rare no-JS visitor) there's no
      // address to navigate to — swallow the click rather than jumping to
      // an undefined href.
      onClick={(e) => {
        if (!href) e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}
