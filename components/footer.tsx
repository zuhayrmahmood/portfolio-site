import { ObfuscatedEmail } from "@/components/obfuscated-email";
import { site } from "@/lib/site";

const LINK_CLASS = "text-muted transition-colors hover:text-accent";

export function Footer() {
  const links = site.socials.filter((s) => s.href !== "#");

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map((s) => (
            <li key={s.label}>
              {s.href === "email" ? (
                <ObfuscatedEmail className={LINK_CLASS}>
                  {s.label}
                </ObfuscatedEmail>
              ) : (
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={LINK_CLASS}
                >
                  {s.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
