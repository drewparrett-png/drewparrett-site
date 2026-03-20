import { getContentItems } from "@/lib/content";
import { ContentCard } from "@/components/content-card";
import type { WorkFrontmatter } from "@/lib/types";

export const metadata = {
  title: "Work — Drew Parrett",
};

export default function WorkPage() {
  const work = getContentItems<WorkFrontmatter>("work").sort(
    (a, b) => a.frontmatter.order - b.frontmatter.order
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Work</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {work.map((item) => (
          <ContentCard
            key={item.slug}
            href={`/work/${item.slug}`}
            title={item.frontmatter.title}
            subtitle={`${item.frontmatter.role} · ${item.frontmatter.timeframe}`}
            cover={`/content/work/${item.slug}/${item.frontmatter.cover.replace("./", "")}`}
            label="Work"
            labelColor="var(--label-work)"
          />
        ))}
      </div>
    </div>
  );
}
