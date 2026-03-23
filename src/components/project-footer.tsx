import Link from "next/link";

export function ProjectFooter({
  relatedProject,
  relatedProjectTitle,
}: {
  relatedProject?: string;
  relatedProjectTitle?: string;
}) {
  return (
    <div className="border-t border-[var(--border)] mt-16 pt-8 flex items-center justify-between">
      <Link
        href="/projects"
        className="text-sm text-[var(--muted)] hover:text-white transition-colors"
      >
        ← Back to Projects
      </Link>
      {relatedProject && relatedProjectTitle && (
        <Link
          href={`/projects/${relatedProject}`}
          className="text-sm text-[var(--label-project)] hover:underline"
        >
          Read about {relatedProjectTitle} →
        </Link>
      )}
    </div>
  );
}
