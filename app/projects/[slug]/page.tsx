import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";
import {
  getProjectSlugs,
  getProjectModule,
  getProjectMeta,
} from "@/lib/projects";
import { formatDate } from "@/lib/writing";

// Only the projects we know about at build time are valid routes; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getProjectMeta(slug);
  const url = `${site.url}/projects/${slug}`;
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.summary,
      url,
      publishedTime: meta.date,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const { default: Post, metadata } = await getProjectModule(slug);
  const links = [
    metadata.href && { label: "Live", href: metadata.href },
    metadata.repo && { label: "Code", href: metadata.repo },
  ].filter((l): l is { label: string; href: string } => Boolean(l));

  return (
    <article className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
      <Reveal>
        <header>
          <Link
            href="/projects"
            className="eyebrow inline-block text-subtle transition-colors hover:text-accent"
          >
            ← Projects
          </Link>
          <time
            dateTime={metadata.date}
            className="eyebrow mt-8 block text-subtle"
          >
            {formatDate(metadata.date)}
          </time>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl">
            {metadata.title}
          </h1>

          {metadata.stack && metadata.stack.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {metadata.stack.map((tech) => (
                <li
                  key={tech}
                  className="eyebrow rounded-full border border-border px-2.5 py-1 text-subtle"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}

          {links.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-surface px-4 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-2"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </header>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-10">
          <Post />
        </div>
      </Reveal>

      <div className="mt-16 border-t border-border pt-8">
        <Link
          href="/projects"
          className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          ← Back to all projects
        </Link>
      </div>
    </article>
  );
}
