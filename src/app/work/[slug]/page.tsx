import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentItem, getContentItems } from "@/lib/content";
import { getMDXComponents } from "@/components/mdx-components";
import type { WorkFrontmatter } from "@/lib/types";

export async function generateStaticParams() {
  return getContentItems<WorkFrontmatter>("work").map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getContentItem<WorkFrontmatter>("work", slug);
  if (!item) return {};
  return {
    title: `${item.frontmatter.title} — Drew Parrett`,
    description: item.frontmatter.subtitle,
  };
}

export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getContentItem<WorkFrontmatter>("work", slug);
  if (!item) notFound();

  const { frontmatter, content } = item;
  const coverSrc = `/content/work/${slug}/${frontmatter.cover.replace("./", "")}`;

  return (
    <article className="max-w-4xl mx-auto px-6 py-16">
      <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden mb-8">
        <Image
          src={coverSrc}
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
      <p className="text-xl text-[var(--muted)] mt-2">
        {frontmatter.subtitle}
      </p>
      <div className="flex gap-4 mt-3 text-sm text-[var(--muted)]">
        <span>{frontmatter.role}</span>
        <span>·</span>
        <span>{frontmatter.timeframe}</span>
      </div>
      <div className="mt-10 prose-invert">
        <MDXRemote source={content} components={getMDXComponents()} />
      </div>
    </article>
  );
}
