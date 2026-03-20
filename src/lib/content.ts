import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export function getContentItems<T>(
  subdir: string
): { slug: string; frontmatter: T; content: string }[] {
  const dir = path.join(contentDir, subdir);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const mdxPath = path.join(dir, entry.name, "index.mdx");
      if (!fs.existsSync(mdxPath)) return null;
      const raw = fs.readFileSync(mdxPath, "utf-8");
      const { data, content } = matter(raw);
      return { slug: entry.name, frontmatter: data as T, content };
    })
    .filter(Boolean) as { slug: string; frontmatter: T; content: string }[];
}

export function getContentItem<T>(
  subdir: string,
  slug: string
): { frontmatter: T; content: string } | null {
  const mdxPath = path.join(contentDir, subdir, slug, "index.mdx");
  if (!fs.existsSync(mdxPath)) return null;
  const raw = fs.readFileSync(mdxPath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as T, content };
}

export function getAboutContent<T>(): {
  frontmatter: T;
  content: string;
} | null {
  const mdxPath = path.join(contentDir, "about.mdx");
  if (!fs.existsSync(mdxPath)) return null;
  const raw = fs.readFileSync(mdxPath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as T, content };
}

export function getCollectionImages(collection: string): string[] {
  const imagesDir = path.join(
    contentDir,
    "photography",
    collection,
    "images"
  );
  if (!fs.existsSync(imagesDir)) return [];
  return fs
    .readdirSync(imagesDir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();
}
