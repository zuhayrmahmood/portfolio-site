import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { getAllProjects } from "@/lib/projects";
import { formatDate } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built, by Zuhayr Mahmood.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
      <Reveal>
        <PageHeader
          title="Projects"
          intro="Things I&rsquo;ve built, in various states of finished."
        />
      </Reveal>

      {projects.length === 0 ? (
        <Reveal delay={0.06}>
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
            <p className="text-muted">
              The first projects are on their way. Check back soon.
            </p>
          </div>
        </Reveal>
      ) : (
        <ul className="border-t border-border">
          {projects.map((project, i) => (
            <li key={project.slug}>
              <Reveal delay={Math.min(i * 0.05, 0.2)}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block border-b border-border py-8 transition-colors"
                >
                  <time
                    dateTime={project.date}
                    className="eyebrow text-subtle transition-colors group-hover:text-accent"
                  >
                    {formatDate(project.date)}
                  </time>
                  <h2 className="mt-3 font-serif text-2xl font-medium tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-[1.75rem]">
                    {project.title}
                  </h2>
                  <p className="mt-2 leading-relaxed text-muted">
                    {project.summary}
                  </p>
                  {project.stack && project.stack.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="eyebrow rounded-full border border-border px-2.5 py-1 text-subtle"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    View project
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
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
