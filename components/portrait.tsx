import Image from "next/image";
import { cn } from "@/lib/utils";

type PortraitProps = {
  /** Full name — used for the image alt text. */
  name: string;
  className?: string;
};

export function Portrait({ name, className }: PortraitProps) {
  return (
    <div
      className={cn(
        "relative aspect-square w-28 shrink-0 overflow-hidden rounded-2xl border border-border bg-accent-soft shadow-[var(--shadow-soft-lg)] ring-1 ring-black/[0.02] sm:w-40",
        className,
      )}
    >
      <Image
        src="/portrait.jpg"
        alt={name}
        fill
        sizes="(min-width: 640px) 160px, 112px"
        className="object-cover"
        priority
      />
    </div>
  );
}
