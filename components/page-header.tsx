type PageHeaderProps = {
  title: string;
  intro?: string;
};

/** Consistent page title + optional intro line used across inner pages. */
export function PageHeader({ title, intro }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="font-title text-[clamp(2.25rem,6vw,3.25rem)] leading-[1.02] text-foreground">
        {title}
      </h1>
      {intro && (
        <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted">
          {intro}
        </p>
      )}
    </div>
  );
}
