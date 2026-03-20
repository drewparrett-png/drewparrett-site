import { getContentItems, getCollectionImages } from "@/lib/content";
import { CollectionCard } from "@/components/collection-card";
import type { PhotographyFrontmatter } from "@/lib/types";

export const metadata = {
  title: "Photography — Drew Parrett",
};

export default function PhotographyPage() {
  const collections = getContentItems<PhotographyFrontmatter>("photography")
    .map((c) => ({
      ...c,
      imageCount: getCollectionImages(c.slug).length,
    }))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-2">Photography</h1>
      <p className="text-[var(--muted)] mb-8">
        Collections from travels, events, and everyday life.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((c) => (
          <CollectionCard
            key={c.slug}
            href={`/photography/${c.slug}`}
            title={c.frontmatter.title}
            count={c.imageCount}
            cover={`/content/photography/${c.slug}/${c.frontmatter.cover.replace("./", "")}`}
          />
        ))}
      </div>
    </div>
  );
}
