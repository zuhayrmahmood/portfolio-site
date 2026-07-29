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

Adding photos to posts also needs the **WebP encoder** (`cwebp`), used by
`scripts/webpify.sh`:

```bash
brew install webp
```

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
public/
  writing/              Post images (WebP)
scripts/
  webpify.sh            Converts JPEG/PNG → WebP before committing
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

## Adding photos

Works the same for writing posts and projects. Images live in `public/` and get
converted to **WebP** before they're committed — WebP is typically 25–35%
smaller than JPEG and far smaller than PNG at the same visual quality, which
keeps the repo light and the pages fast.

### 1. Drop the image in `public/`

Post images go in `public/writing/` — by convention, project images go in
`public/projects/` (create it when you need it). Filenames become URLs, so
prefer lowercase and hyphens:

```bash
cp ~/Desktop/IMG_4821.png public/writing/ninja-650.png
```

### 2. Convert it to WebP

```bash
scripts/webpify.sh public/writing/ninja-650.png
```

This writes `ninja-650.webp` alongside it, **deletes the original**, and prints
the savings:

```
webpify: public/writing/ninja-650.png (2MB) -> public/writing/ninja-650.webp (751KB)
```

Pass several files at once, and tune quality (1–100, default 80) with
`WEBP_QUALITY` when a photo needs more detail:

```bash
scripts/webpify.sh public/writing/*.png public/writing/*.jpg
WEBP_QUALITY=90 scripts/webpify.sh public/writing/hero.png
```

> [!NOTE]
> The original JPEG/PNG is deleted — keep your source file elsewhere if you may
> need it again. Under the hood the script runs
> `cwebp -q "$WEBP_QUALITY" -m 6 <src> -o <dest>` (`-m 6` = best compression).

### 3. Reference it in the `.mdx`

Paths are relative to `public/`, so `public/writing/ninja-650.webp` is written
as `/writing/ninja-650.webp`.

**With a caption** — use the `<Figure>` component (globally available in any
`.mdx`, no import needed):

```mdx
<Figure
  src="/writing/ninja-650.webp"
  alt="My 2013 Ninja 650 outside McGill"
  caption="My 2013 Ninja 650, parked outside McGill."
  width={3024}
  height={3214}
/>
```

`alt` is the description for screen readers and SEO; `caption` is the visible
line rendered under the photo. Pass the image's intrinsic `width`/`height` in
pixels so it gets [`next/image`](https://nextjs.org/docs/app/api-reference/components/image)
optimization — resizing, responsive `srcset`, lazy-loading, and zero layout
shift. Read them with either:

```bash
sips -g pixelWidth -g pixelHeight public/writing/ninja-650.webp
webpinfo public/writing/ninja-650.webp | grep -E 'Width|Height'
```

**Without a caption** — plain Markdown is enough, and dimensions are handled
for you:

```mdx
![My 2013 Ninja 650 outside McGill](/writing/ninja-650.webp)
```

Here the `rehype-img-size` plugin (see `next.config.ts`) measures the file at
build time and stamps the dimensions on automatically, so there's nothing to
look up.

Both are styled by `mdx-components.tsx`, so they match the rest of the site.

| Need                    | Use                                  |
| ----------------------- | ------------------------------------ |
| Caption under the photo | `<Figure … caption width height />`  |
| Just the image          | `![alt](/writing/name.webp)`         |

### 4. Check it, then commit

```bash
npm run dev     # confirm the photo and caption render
git add public/writing/ninja-650.webp content/writing/my-post.mdx
git commit -m "Add Ninja 650 photo"
```

Only the `.webp` should be committed — if you still see a `.png`/`.jpg` in
`git status`, step 2 didn't run on it.

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
