import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";
import { getPostSlugs, getPostModule, getPostMeta, formatDate } from "@/lib/writing";

// Only the posts we know about at build time are valid routes; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getPostMeta(slug);
  const url = `${site.url}/writing/${slug}`;
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

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const { default: Post, metadata } = await getPostModule(slug);

  return (
    <article className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
      <Reveal>
        <header>
          <Link
            href="/writing"
            className="font-mono text-xs uppercase tracking-[0.15em] text-subtle transition-colors hover:text-accent"
          >
            ← Writing
          </Link>
          <time
            dateTime={metadata.date}
            className="mt-8 block font-mono text-xs uppercase tracking-[0.15em] text-subtle"
          >
            {formatDate(metadata.date)}
          </time>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl">
            {metadata.title}
          </h1>
        </header>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-10">
          <Post />
        </div>
      </Reveal>

      <div className="mt-16 border-t border-border pt-8">
        <Link
          href="/writing"
          className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          ← Back to all writing
        </Link>
      </div>
    </article>
  );
}
