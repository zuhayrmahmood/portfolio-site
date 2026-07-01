import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays, notes, and ideas by Zuhayr Mahmood.",
};

export default function WritingPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
      <Reveal>
        <PageHeader
          title="Writing"
          intro="Essays, notes, and things I&rsquo;m thinking about."
        />
      </Reveal>

      {/* PHASE 4 will replace this with the real MDX-powered post list. */}
      <Reveal delay={0.06}>
        <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
          <p className="text-muted">
            The first posts are on their way. Check back soon.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
