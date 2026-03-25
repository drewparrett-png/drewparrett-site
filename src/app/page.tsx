import { HomepageGrid } from "@/components/homepage-grid";
import { getContentItems } from "@/lib/content";
import type {
  WorkFrontmatter,
  ProjectFrontmatter,
  PhotographyFrontmatter,
  FeaturedItem,
} from "@/lib/types";

function getFeaturedItems(): FeaturedItem[] {
  const work = getContentItems<WorkFrontmatter>("work")
    .filter((w) => w.frontmatter.featured)
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order)
    .map((w) => ({
      type: "work" as const,
      slug: w.slug,
      title: w.frontmatter.title,
      subtitle: w.frontmatter.subtitle,
      cover: `/content/work/${w.slug}/${w.frontmatter.cover.replace("./", "")}`,
      href: `/work/${w.slug}`,
    }));

  const projects = getContentItems<ProjectFrontmatter>("projects")
    .filter((p) => p.frontmatter.featured)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
    .map((p) => ({
      type: "project" as const,
      slug: p.slug,
      title: p.frontmatter.title,
      description: p.frontmatter.description,
      cover: `/content/projects/${p.slug}/${p.frontmatter.cover.replace("./", "")}`,
      href: `/projects/${p.slug}`,
    }));

  const photography = getContentItems<PhotographyFrontmatter>("photography")
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
    .slice(0, 1)
    .map((p) => ({
      type: "photography" as const,
      slug: p.slug,
      title: p.frontmatter.title,
      description: p.frontmatter.description,
      cover: `/content/photography/${p.slug}/${p.frontmatter.cover.replace("./", "")}`,
      href: `/photography/${p.slug}`,
    }));

  const items: FeaturedItem[] = [];
  if (work.length > 0) items.push(work[0]);

  const others = [...projects, ...photography].sort((a, b) => {
    const typeOrder = { project: 0, photography: 1 };
    const aOrder = typeOrder[a.type as keyof typeof typeOrder] ?? 2;
    const bOrder = typeOrder[b.type as keyof typeof typeOrder] ?? 2;
    return aOrder - bOrder;
  });
  items.push(...others);
  items.push(...work.slice(1));

  items.push({
    type: "about" as const,
    slug: "about",
    title: "About",
    description: "Product leader with an engineering foundation",
    cover: "/content/about-cover.jpg",
    href: "/about",
  });

  return items;
}

export default function Home() {
  const featured = getFeaturedItems();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
        Builder
        <br />
        & Product Leader
      </h1>
      <p className="mt-4 text-[var(--muted)] max-w-lg leading-relaxed">
        Products, teams, and go-to-market — from first prototype to first $10M.
      </p>
      <HomepageGrid items={featured} />
    </div>
  );
}
