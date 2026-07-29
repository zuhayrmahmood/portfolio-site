/**
 * Central site configuration.
 * Edit these values to make the site yours — most copy lives in the pages,
 * but names, nav, and links are centralized here.
 */
export const site = {
  name: "Zuhayr Mahmood",
  shortName: "Zuhayr",
  title: "Zuhayr Mahmood — Portfolio",
  description:
    "The personal site of Zuhayr Mahmood — writing, projects, and ways to get in touch.",

  // How you're described in structured data (schema.org Person.jobTitle).
  // Helps search engines understand who you are when people search your name.
  jobTitle: "Software Developer",

  // Your live domain (used for metadata / Open Graph URLs).
  url: "https://zuhayrmahmood.me",

  // Google Search Console verification token. Leave "" until you've created a
  // property at https://search.google.com/search-console — then either verify
  // the domain via DNS (preferred, no token needed) or paste the HTML-tag
  // token here to verify. When empty, no verification meta tag is emitted.
  googleSiteVerification: "",

  // Main navigation (the name on the left links home).
  nav: [
    { label: "About", href: "/about", external: false },
    { label: "Projects", href: "/projects", external: false },
    { label: "Writing", href: "/writing", external: false },
    { label: "Resume", href: "/ZuhayrResume.pdf", external: true },
  ],

  // Social / contact links. Placeholder "#" entries are hidden until you
  // fill them in — replace the URLs (or delete any you don't use).
  socials: [
    // "email" is a sentinel — the real address is never stored in plain text
    // here (this file is bundled into the client). It's rendered via
    // <ObfuscatedEmail>, which assembles the mailto on the client. See
    // components/obfuscated-email.tsx.
    { label: "Email", href: "email" },
    { label: "GitHub", href: "https://github.com/zuhayrmahmood" },
    // TODO: paste your real LinkedIn URL (e.g. https://www.linkedin.com/in/zuhayr-mahmood).
    // Until it starts with "http" it stays hidden AND is excluded from the
    // structured-data `sameAs` links below — so leaving it as "#" is safe.
    { label: "LinkedIn", href: "#" },
  ],
} as const;

export type SocialLink = (typeof site.socials)[number];

/**
 * Real, absolute profile URLs for schema.org `sameAs` — the signal Google uses
 * to confirm this site represents the same person as those profiles. Derived
 * from `site.socials` so it stays in sync with the footer; placeholder ("#")
 * and the "email" sentinel are filtered out automatically.
 */
export const sameAs: string[] = site.socials
  .map((s) => s.href)
  .filter((href) => href.startsWith("http"));
