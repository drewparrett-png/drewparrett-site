import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentItem, getContentItems } from "@/lib/content";
import { getMDXComponents } from "@/components/mdx-components";
import { ProjectHero } from "@/components/project-hero";
import { ProjectFooter } from "@/components/project-footer";
import type { ProjectFrontmatter } from "@/lib/types";

export async function generateStaticParams() {
  return getContentItems<ProjectFrontmatter>("projects").map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getContentItem<ProjectFrontmatter>("projects", slug);
  if (!item) return {};
  return {
    title: `${item.frontmatter.title} — Drew Parrett`,
    description: item.frontmatter.description,
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getContentItem<ProjectFrontmatter>("projects", slug);
  if (!item) notFound();

  const { frontmatter, content } = item;
  const isRichProject = !!(frontmatter.metrics || frontmatter.parentWork);

  return (
    <article className="max-w-4xl mx-auto px-6 py-16">
      {isRichProject ? (
        <ProjectHero frontmatter={frontmatter} />
      ) : (
        <>
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-8">
            <Image
              src={`/content/projects/${slug}/${frontmatter.cover.replace("./", "")}`}
              alt={frontmatter.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            {frontmatter.title}
          </h1>
          <p className="text-lg text-[var(--muted)] mt-2">
            {frontmatter.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {frontmatter.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded bg-[var(--card)] text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="mt-10 prose-invert">
        <MDXRemote source={content} components={getMDXComponents()} />
      </div>

      <ProjectFooter
        relatedProject={frontmatter.relatedProject}
        relatedProjectTitle={frontmatter.relatedProjectTitle}
      />
    </article>
  );
}
