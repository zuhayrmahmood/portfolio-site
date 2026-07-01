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
    { label: "Writing", href: "/writing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  // Social / contact links. Placeholder "#" entries are hidden until you
  // fill them in — replace the URLs (or delete any you don't use).
  socials: [
    { label: "Email", href: "mailto:zuhayrmahmood01@gmail.com" },
    { label: "GitHub", href: "https://github.com/zuhayrmahmood" },
    { label: "LinkedIn", href: "#" }, // TODO
    { label: "X", href: "#" }, // TODO
  ],
} as const;

export type SocialLink = (typeof site.socials)[number];
