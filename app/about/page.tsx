import type { Metadata } from "next";
import Link from "next/link";
import { Portrait } from "@/components/portrait";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — who I am, what I'm working on, and how to reach me.`,
};

// TODO: edit these to reflect what you're currently up to.
const currently = [
  { label: "Building", value: "[a lean angle sensor]" },
  { label: "Reading", value: "[dune by frank herbert]" },
  { label: "Based in", value: "[montreal]" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
      {/* Header: portrait + bio */}
      <Reveal>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
          <Portrait name={site.name} />
          <div>
            <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              About
            </h1>
            {/* TODO: replace with your real bio. */}
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              <p>
                hey! i&rsquo;m zuhayr, a{" "}
                <span className="text-foreground">software developer</span>{" "}
                based in <span className="text-foreground">montreal</span>,
                where I spend my time{" "}
                <span className="text-foreground">
                  playing basketball, building software and riding motorcycles
                </span>
                .
              </p>
              <p>
                This is placeholder text. Say a little about your story: what
                you build, what you&rsquo;re curious about, and what
                you&rsquo;re working toward. A couple of short paragraphs is
                plenty.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Currently */}
      <Reveal delay={0.06}>
        <section className="mt-16">
          <h2 className="eyebrow text-accent">Currently</h2>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            {currently.map((item) => (
              <div
                key={item.label}
                className="flex items-baseline justify-between gap-6 py-4"
              >
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="text-right text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>

      {/* Contact CTA */}
      <Reveal delay={0.12}>
        <section className="mt-16 rounded-2xl border border-border bg-surface p-8 shadow-[var(--shadow-soft)]">
          <p className="text-lg text-foreground">
            Have an idea, a role, or just want to say hi?
          </p>
          <Link
            href="mailto:zuhayrmahmood01@gmail.com"
            className="group mt-5 inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-accent px-6 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md"
          >
            Get in touch
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
