import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { PhysicsHero } from "@/components/physics-hero";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6">
      <section className="flex min-h-[calc(100svh-4rem)] flex-col justify-center py-20">
        <Reveal>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Portfolio
          </p>
        </Reveal>

        {/* Interactive Matter.js hero — cursor-shoved, spring-back name.
            Falls back to a static name for reduced-motion / no-JS. */}
        <PhysicsHero />

        <Reveal delay={0.12}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            {/* TODO: your one-liner */}
            I&rsquo;m a <span className="text-foreground">[what you do]</span>.
            This is where I write, build, and share what I&rsquo;m thinking
            about.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/writing"
              className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Read my writing
            </Link>
            <Link
              href="/about"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-surface px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              About me
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
