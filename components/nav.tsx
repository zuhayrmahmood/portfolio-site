"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-lg font-medium tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          {site.shortName}
        </Link>

        <ul className="flex items-center gap-0 sm:gap-1">
          {site.nav.map((item) => {
            const active =
              !item.external &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  {...(item.external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className={cn(
                    "relative rounded-full px-2 py-1.5 text-sm transition-colors sm:px-3",
                    active
                      ? "text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-px h-px bg-accent sm:inset-x-3"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
