# zuhayrmahmood.me

Personal site of Zuhayr Mahmood — a calm, fast portfolio with an interactive
physics hero, and in-repo MDX writing + projects sections.

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack) + **React 19** + **TypeScript**
- **[Tailwind CSS v4](https://tailwindcss.com)** — CSS-first `@theme` tokens (no `tailwind.config`)
- **[Motion](https://motion.dev)** — scroll reveals
- **[Matter.js](https://brm.io/matter-js/)** — the cursor-driven physics hero
- **[@next/mdx](https://www.npmjs.com/package/@next/mdx)** — writing posts + projects as `.mdx` files
- Deployed on **[Vercel](https://vercel.com)**

## Prerequisites

> [!IMPORTANT]
> This project requires **Node 20**. If your shell defaults to an older version,
> use [nvm](https://github.com/nvm-sh/nvm) — an `.nvmrc` is included:
>
> ```bash
> nvm use            # picks up 20.20.2 from .nvmrc
> ```

## Getting started

```bash
nvm use
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build (type-checks too)
npm run start   # serve the production build
npm run lint    # eslint
```

## Project structure

```
app/
  layout.tsx            Root layout, fonts, metadata, <Nav>/<Footer>
  template.tsx          Per-navigation page-transition wrapper
  page.tsx              Home (physics hero)
  about/                About page
  writing/              Writing index + [slug] post pages
  projects/             Projects index + [slug] project pages
  opengraph-image.tsx   Generated OG / social preview image
  icon.svg, apple-icon.tsx, sitemap.ts, robots.ts, manifest.ts
components/             Nav, Footer, Reveal, PhysicsHero, …
content/
  writing/              Blog posts as .mdx
  projects/             Projects as .mdx
lib/
  site.ts               Central config: name, nav, socials, URL
  writing.ts            Reads/loads MDX posts
  projects.ts           Reads/loads MDX projects
mdx-components.tsx      Maps markdown elements to the design system
```

## Writing a post

Add a `.mdx` file to `content/writing/`. Each post exports its own metadata —
that's it, no database or CMS. It appears in the index and gets its own page
automatically.

```mdx
export const metadata = {
  title: "My new post",
  date: "2026-07-01",
  summary: "A one-line description for the index and link previews.",
};

# My new post

Write in **Markdown** — headings, lists, `code`, > quotes, tables, and even
React components are all supported.
```

## Adding a project

Add a `.mdx` file to `content/projects/`, same as a writing post, plus a
couple of project-specific fields:

```mdx
export const metadata = {
  title: "My project",
  date: "2026-07-01",
  summary: "A one-line description for the index and link previews.",
  stack: ["Next.js", "Postgres"], // optional — shown as chips
  href: "https://example.com", // optional — live URL
  repo: "https://github.com/you/example", // optional — source URL
};

Write the case study the same way you'd write a post.
```

`content/projects/example-project.mdx` is a placeholder demonstrating the
shape — replace it with a real project or delete it.

## Configuration

Most personalization lives in **`lib/site.ts`**: your name, nav items, and
social links. Placeholder links set to `"#"` (currently LinkedIn and X) are
automatically hidden until you fill them in.

- **Portrait:** `components/portrait.tsx` renders your initials as a placeholder.
  Drop a `public/portrait.jpg` in and follow the commented `next/image` snippet
  to use a real photo.
- **Bio / About copy:** edit `app/about/page.tsx` (bracketed `[…]` placeholders).
- **Colors / fonts:** design tokens are in `app/globals.css` (`@theme`).

## Deployment (Vercel)

Next.js on Vercel is zero-config.

1. Push this repo to GitHub and **Import** it at [vercel.com/new](https://vercel.com/new).
2. Deploy.

### Custom domain

1. In the Vercel project, go to **Settings → Domains** and add `zuhayrmahmood.me`.
2. Point the domain's DNS at Vercel as instructed (an apex `A` record, or use
   Vercel's nameservers). HTTPS is provisioned automatically.

The site's canonical URL is set in `lib/site.ts` (`site.url`) and drives all
metadata, Open Graph URLs, the sitemap, and `robots.txt`.

## Before you go live

- [ ] Real bio in `app/about/page.tsx` and the "Currently" list
- [ ] Real social links in `lib/site.ts` (LinkedIn / X are placeholders)
- [ ] Optional: a real `public/portrait.jpg`
- [ ] Replace `content/projects/example-project.mdx` with real projects
- [ ] Add `zuhayrmahmood.me` in Vercel and point DNS
