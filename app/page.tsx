import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { PhysicsHero } from "@/components/physics-hero";
import { TypingText } from "@/components/typing-text";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6">
      <section className="flex min-h-[calc(82svh-4rem)] flex-col justify-center py-16">
        {/* Interactive Matter.js hero — grab, fling, and scatter the letters;
            they spring back into the name. Falls back to a static name for
            reduced-motion / no-JS / touch. */}
        <PhysicsHero />

        <Reveal delay={0.12}>
          <p className="mt-9 max-w-xl text-pretty text-xl leading-relaxed text-muted sm:text-2xl">
            I&rsquo;m a <TypingText />. This is where I write, build, and share
            what I&rsquo;m thinking about.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/about"
              className="group inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-accent px-6 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md"
            >
              About me
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
