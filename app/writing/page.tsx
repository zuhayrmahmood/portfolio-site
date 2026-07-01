import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { getAllPosts, formatDate } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays, notes, and ideas by Zuhayr Mahmood.",
};

export default async function WritingPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
      <Reveal>
        <PageHeader
          title="Writing"
          intro="Essays, notes, and things I&rsquo;m thinking about."
        />
      </Reveal>

      {posts.length === 0 ? (
        <Reveal delay={0.06}>
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
            <p className="text-muted">
              The first posts are on their way. Check back soon.
            </p>
          </div>
        </Reveal>
      ) : (
        <ul className="border-t border-border">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <Reveal delay={Math.min(i * 0.05, 0.2)}>
                <Link
                  href={`/writing/${post.slug}`}
                  className="group block border-b border-border py-8"
                >
                  <time
                    dateTime={post.date}
                    className="font-mono text-xs uppercase tracking-[0.15em] text-subtle"
                  >
                    {formatDate(post.date)}
                  </time>
                  <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="mt-2 leading-relaxed text-muted">
                    {post.summary}
                  </p>
                  <span className="mt-3 inline-block text-sm font-medium text-accent">
                    Read{" "}
                    <span className="transition-transform group-hover:translate-x-0.5 inline-block">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
