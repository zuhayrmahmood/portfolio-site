type PageHeaderProps = {
  title: string;
  intro?: string;
};

/** Consistent page title + optional intro line used across inner pages. */
export function PageHeader({ title, intro }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
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
