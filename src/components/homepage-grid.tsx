import { ContentCard } from "./content-card";
import type { FeaturedItem } from "@/lib/types";

const labelConfig: Record<string, { label: string; color: string }> = {
  work: { label: "Work", color: "var(--label-work)" },
  project: { label: "Project", color: "var(--label-project)" },
  photography: { label: "Photography", color: "var(--label-photo)" },
};

interface HomepageGridProps {
  items: FeaturedItem[];
}

export function HomepageGrid({ items }: HomepageGridProps) {
  if (items.length === 0) return null;

  const [featured, ...rest] = items;
  const config = labelConfig[featured.type];

  return (
    <section className="mt-16">
      <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
        Recent
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="md:col-span-1 lg:col-span-2 lg:row-span-2">
          <ContentCard
            href={featured.href}
            title={featured.title}
            subtitle={featured.subtitle || featured.description}
            cover={featured.cover}
            label={config.label}
            labelColor={config.color}
            large
          />
        </div>
        {rest.slice(0, 5).map((item) => {
          const cfg = labelConfig[item.type];
          return (
            <ContentCard
              key={item.slug}
              href={item.href}
              title={item.title}
              subtitle={item.subtitle || item.description}
              cover={item.cover}
              label={cfg.label}
              labelColor={cfg.color}
            />
          );
        })}
      </div>
    </section>
  );
}
