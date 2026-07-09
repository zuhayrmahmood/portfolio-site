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

  // Your live domain (used for metadata / Open Graph URLs).
  url: "https://zuhayrmahmood.me",

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
    { label: "LinkedIn", href: "#" }, // TODO
    { label: "X", href: "#" }, // TODO
  ],
} as const;

export type SocialLink = (typeof site.socials)[number];
