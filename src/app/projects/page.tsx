import { getContentItems } from "@/lib/content";
import { ContentCard } from "@/components/content-card";
import type { ProjectFrontmatter } from "@/lib/types";

export const metadata = {
  title: "Projects — Drew Parrett",
};

export default function ProjectsPage() {
  const projects = getContentItems<ProjectFrontmatter>("projects").sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((item) => (
          <ContentCard
            key={item.slug}
            href={`/projects/${item.slug}`}
            title={item.frontmatter.title}
            subtitle={item.frontmatter.description}
            cover={`/content/projects/${item.slug}/${item.frontmatter.cover.replace("./", "")}`}
            label="Project"
            labelColor="var(--label-project)"
          />
        ))}
      </div>
    </div>
  );
}
