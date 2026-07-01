import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description: "About Zuhayr Mahmood.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
      <Reveal>
        <PageHeader
          title="About"
          intro="A little about who I am and what I care about."
        />
      </Reveal>

      <Reveal delay={0.06}>
        {/* TODO: replace with your real bio. */}
        <div className="space-y-5 text-lg leading-relaxed text-muted">
          <p>
            I&rsquo;m Zuhayr — a{" "}
            <span className="text-foreground">[role]</span> based in{" "}
            <span className="text-foreground">[place]</span>. I spend my time{" "}
            <span className="text-foreground">[what you do]</span>.
          </p>
          <p>
            This is placeholder text. Tell your story here: what you build, what
            you&rsquo;re curious about, and what you&rsquo;re working toward. A
            couple of short paragraphs is plenty.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
