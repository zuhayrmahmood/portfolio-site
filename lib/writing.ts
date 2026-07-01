import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

/**
 * Writing content layer.
 *
 * Posts are `.mdx` files in `content/writing/`, each exporting its own
 * `metadata` (title/date/summary). `@next/mdx` compiles them at build time,
 * so there's no runtime markdown parsing — we just read the directory for the
 * list of slugs and import each module for its metadata / rendered component.
 *
 * Server-only: these functions use `fs` and dynamic `import()`, so only call
 * them from Server Components (which is where all callers live).
 */

export type PostMeta = {
  /** Post title, shown in the list and as the page <h1>. */
  title: string;
  /** ISO date string, e.g. "2026-06-28". Used for sorting + display. */
  date: string;
  /** One-line summary for the index and share/meta descriptions. */
  summary: string;
};

export type Post = PostMeta & { slug: string };

/** A compiled MDX module: default-exported component + its metadata export. */
type PostModule = {
  default: ComponentType;
  metadata: PostMeta;
};

const POSTS_DIR = path.join(process.cwd(), "content/writing");

/** All post slugs (filenames without the `.mdx` extension). */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/** Import a single post module (rendered component + metadata). */
export async function getPostModule(slug: string): Promise<PostModule> {
  return (await import(`@/content/writing/${slug}.mdx`)) as PostModule;
}

/** Just the metadata for one post. */
export async function getPostMeta(slug: string): Promise<PostMeta> {
  const { metadata } = await getPostModule(slug);
  return metadata;
}

/** Every post's metadata + slug, newest first. */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await Promise.all(
    getPostSlugs().map(async (slug) => ({ slug, ...(await getPostMeta(slug)) })),
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Human-friendly date, e.g. "June 28, 2026". */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
