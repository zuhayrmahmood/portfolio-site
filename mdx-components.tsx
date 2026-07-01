import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";

/**
 * Global MDX element → component mapping.
 *
 * Required by `@next/mdx` in the App Router (the site won't build without it).
 * In Next 16 `useMDXComponents` takes NO arguments — it just returns the map.
 *
 * Everything here is styled with the warm-minimal tokens so posts read like the
 * rest of the site. Body copy is sized for comfortable long-form reading.
 */

// Shared body-text sizing for paragraphs and list items.
const bodyText = "text-[1.0625rem] leading-[1.8] text-foreground/85";

const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-12 mb-4 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-12 mb-4 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-10 mb-3 font-serif text-xl font-medium tracking-tight text-foreground sm:text-2xl"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="mt-8 mb-2 font-serif text-lg font-medium text-foreground"
      {...props}
    />
  ),
  p: (props) => <p className={`my-5 ${bodyText}`} {...props} />,
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    const linkClass =
      "text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent";
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className={linkClass}
          {...props}
        />
      );
    }
    return <Link href={href} className={linkClass} {...props} />;
  },
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  em: (props) => <em className="italic" {...props} />,
  ul: (props) => (
    <ul
      className={`my-5 list-disc space-y-2 pl-6 marker:text-subtle ${bodyText}`}
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className={`my-5 list-decimal space-y-2 pl-6 marker:text-subtle ${bodyText}`}
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-accent/40 pl-5 text-foreground/70 italic"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-10 border-border" {...props} />,
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl border border-border bg-surface-2 p-4 font-mono text-sm leading-relaxed text-foreground"
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => {
    // Fenced code blocks arrive as <pre><code class="language-…">; leave those
    // for <pre> to style. Only inline code gets the pill treatment.
    const isBlock =
      typeof className === "string" && className.startsWith("language-");
    if (isBlock) return <code className={className} {...props} />;
    return (
      <code
        className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        {...props}
      />
    );
  },
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table
        className="w-full border-collapse text-left text-sm"
        {...props}
      />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-border pb-2 pr-4 font-medium text-foreground"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-border py-2 pr-4 text-muted" {...props} />
  ),
  img: ({ alt = "", ...props }: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className="my-6 w-full rounded-xl border border-border"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
