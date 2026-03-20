import { notFound } from "next/navigation";
import {
  getContentItem,
  getContentItems,
  getCollectionImages,
} from "@/lib/content";
import { LightboxWrapper } from "@/components/lightbox-wrapper";
import type { PhotographyFrontmatter } from "@/lib/types";

export async function generateStaticParams() {
  return getContentItems<PhotographyFrontmatter>("photography").map((c) => ({
    collection: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const item = getContentItem<PhotographyFrontmatter>(
    "photography",
    collection
  );
  if (!item) return {};
  return {
    title: `${item.frontmatter.title} — Photography — Drew Parrett`,
    description: item.frontmatter.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const item = getContentItem<PhotographyFrontmatter>(
    "photography",
    collection
  );
  if (!item) notFound();

  const imageFiles = getCollectionImages(collection);
  const images = imageFiles.map((f) => ({
    src: `/content/photography/${collection}/images/${f}`,
    alt: `${item.frontmatter.title} — ${f.replace(/\.[^.]+$/, "")}`,
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        {item.frontmatter.title}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {item.frontmatter.description} · {images.length} photos
      </p>
      <LightboxWrapper images={images} />
    </div>
  );
}
