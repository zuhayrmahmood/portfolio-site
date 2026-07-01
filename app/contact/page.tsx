import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Zuhayr Mahmood.",
};

export default function ContactPage() {
  const links = site.socials.filter((s) => s.href !== "#");

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
      <Reveal>
        <PageHeader
          title="Contact"
          intro="Have a question, an idea, or just want to say hi? Reach out."
        />
      </Reveal>

      {/* PHASE 5 will add the working contact form above these links. */}
      <Reveal delay={0.06}>
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {links.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-center justify-between py-4 text-lg text-foreground transition-colors hover:text-accent"
              >
                <span>{s.label}</span>
                <span className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">A contact form is coming soon.</p>
      </Reveal>
    </div>
  );
}
