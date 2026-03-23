import Link from "next/link";
import type { ProjectFrontmatter } from "@/lib/types";

export function ProjectHero({
  frontmatter,
}: {
  frontmatter: ProjectFrontmatter;
}) {
  const {
    title,
    description,
    parentWork,
    parentWorkTitle,
    externalUrl,
    metrics,
  } = frontmatter;

  const domain = externalUrl
    ? new URL(externalUrl).hostname.replace("www.", "")
    : null;

  return (
    <div>
      {parentWork && parentWorkTitle && (
        <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
          Part of my work at{" "}
          <Link
            href={`/work/${parentWork}`}
            className="text-[var(--label-work)] hover:underline"
          >
            {parentWorkTitle}
          </Link>
        </p>
      )}

      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>

      <p className="text-lg text-[var(--muted)] mt-2">{description}</p>

      {externalUrl && domain && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-[var(--label-project)] hover:underline mt-2"
        >
          Visit {domain} →
        </a>
      )}

      {metrics && metrics.length > 0 && (
        <div
          className={`grid gap-3 mt-8 ${
            metrics.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"
          }`}
        >
          {metrics.map((metric, i) => (
            <div
              key={i}
              className="bg-[var(--card)] rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold text-[var(--label-project)]">
                {metric.value}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
