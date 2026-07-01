# zuhayrmahmood.me

Personal site of Zuhayr Mahmood — a calm, fast portfolio with an interactive
physics hero, an in-repo MDX writing section, and a working contact form.

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack) + **React 19** + **TypeScript**
- **[Tailwind CSS v4](https://tailwindcss.com)** — CSS-first `@theme` tokens (no `tailwind.config`)
- **[Motion](https://motion.dev)** — scroll reveals
- **[Matter.js](https://brm.io/matter-js/)** — the cursor-driven physics hero
- **[@next/mdx](https://www.npmjs.com/package/@next/mdx)** — writing posts as `.mdx` files
- **[Resend](https://resend.com)** — contact-form email delivery
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
  contact/              Contact page (form + social links)
  api/contact/route.ts  Contact form endpoint (Resend)
  opengraph-image.tsx   Generated OG / social preview image
  icon.svg, apple-icon.tsx, sitemap.ts, robots.ts, manifest.ts
components/             Nav, Footer, Reveal, PhysicsHero, ContactForm, …
content/writing/        Blog posts as .mdx
lib/
  site.ts               Central config: name, nav, socials, URL
  writing.ts            Reads/loads MDX posts
  contact.ts            Shared form validation
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

## Configuration

Most personalization lives in **`lib/site.ts`**: your name, nav items, and
social links. Placeholder links set to `"#"` (currently LinkedIn and X) are
automatically hidden until you fill them in.

- **Portrait:** `components/portrait.tsx` renders your initials as a placeholder.
  Drop a `public/portrait.jpg` in and follow the commented `next/image` snippet
  to use a real photo.
- **Bio / About copy:** edit `app/about/page.tsx` (bracketed `[…]` placeholders).
- **Colors / fonts:** design tokens are in `app/globals.css` (`@theme`).

## Contact form (Resend)

The form at `/contact` posts to `app/api/contact/route.ts`, which sends email via
Resend. Without configuration it fails gracefully (it tells visitors to use the
social links instead), so nothing breaks before you set it up.

1. Copy the env template and create a key at [resend.com/api-keys](https://resend.com/api-keys):

   ```bash
   cp .env.example .env.local
   ```

2. Fill in `.env.local`:

   | Variable             | Purpose                                                        |
   | -------------------- | -------------------------------------------------------------- |
   | `RESEND_API_KEY`     | Required to send. From the Resend dashboard.                   |
   | `CONTACT_TO_EMAIL`   | Where submissions are delivered.                               |
   | `CONTACT_FROM_EMAIL` | The "From" address — must be on a Resend-verified domain.      |

   For real delivery, [verify your domain](https://resend.com/domains) in Resend
   and set `CONTACT_FROM_EMAIL` to an address on it (e.g.
   `"Zuhayr Mahmood <contact@zuhayrmahmood.me>"`). The default
   `onboarding@resend.dev` only delivers test sends to your own account email.

## Deployment (Vercel)

Next.js on Vercel is zero-config.

1. Push this repo to GitHub and **Import** it at [vercel.com/new](https://vercel.com/new).
2. Add the three environment variables above under **Settings → Environment
   Variables** (Production).
3. Deploy.

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
- [ ] Resend API key + verified domain for the contact form
- [ ] Add `zuhayrmahmood.me` in Vercel and point DNS
