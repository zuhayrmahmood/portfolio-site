import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

/**
 * Projects content layer.
 *
 * Same shape as `lib/writing.ts`: projects are `.mdx` files in
 * `content/projects/`, each exporting its own `metadata`. `@next/mdx`
 * compiles them at build time, so there's no runtime markdown parsing — we
 * just read the directory for the list of slugs and import each module for
 * its metadata / rendered component.
 *
 * Server-only: these functions use `fs` and dynamic `import()`, so only call
 * them from Server Components (which is where all callers live).
 */

export type ProjectMeta = {
  /** Project title, shown in the list and as the page <h1>. */
  title: string;
  /** ISO date string, e.g. "2026-06-28". Used for sorting + display. */
  date: string;
  /** One-line summary for the index and share/meta descriptions. */
  summary: string;
  /** Tech used, shown as chips, e.g. ["Next.js", "Postgres"]. */
  stack?: string[];
  /** Live URL, if the project is deployed somewhere. */
  href?: string;
  /** Source URL, e.g. a GitHub repo. */
  repo?: string;
};

export type Project = ProjectMeta & { slug: string };

/** A compiled MDX module: default-exported component + its metadata export. */
type ProjectModule = {
  default: ComponentType;
  metadata: ProjectMeta;
};

const PROJECTS_DIR = path.join(process.cwd(), "content/projects");

/** All project slugs (filenames without the `.mdx` extension). */
export function getProjectSlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/** Import a single project module (rendered component + metadata). */
export async function getProjectModule(slug: string): Promise<ProjectModule> {
  return (await import(`@/content/projects/${slug}.mdx`)) as ProjectModule;
}

/** Just the metadata for one project. */
export async function getProjectMeta(slug: string): Promise<ProjectMeta> {
  const { metadata } = await getProjectModule(slug);
  return metadata;
}

/** Every project's metadata + slug, newest first. */
export async function getAllProjects(): Promise<Project[]> {
  const projects = await Promise.all(
    getProjectSlugs().map(async (slug) => ({
      slug,
      ...(await getProjectMeta(slug)),
    })),
  );
  return projects.sort((a, b) => (a.date < b.date ? 1 : -1));
}
