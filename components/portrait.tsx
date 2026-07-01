import { cn } from "@/lib/utils";

type PortraitProps = {
  /** Full name — initials are derived from it. */
  name: string;
  className?: string;
};

/**
 * Placeholder portrait: an accent-tinted rounded square with the initials.
 *
 * To use a real photo instead, drop `public/portrait.jpg` in and replace the
 * inner <div> below with:
 *
 *   import Image from "next/image";
 *   <Image src="/portrait.jpg" alt={name} fill sizes="160px"
 *          className="object-cover" priority />
 */
export function Portrait({ name, className }: PortraitProps) {
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative aspect-square w-28 shrink-0 overflow-hidden rounded-2xl border border-border bg-accent-soft sm:w-40",
        className,
      )}
    >
      <div className="flex h-full w-full items-center justify-center font-serif text-3xl font-medium text-accent sm:text-4xl">
        {initials}
      </div>
    </div>
  );
}
