import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAboutContent } from "@/lib/content";
import { getMDXComponents } from "@/components/mdx-components";
import type { AboutFrontmatter } from "@/lib/types";

export const metadata = {
  title: "About — Drew Parrett",
};

export default function AboutPage() {
  const about = getAboutContent<AboutFrontmatter>();
  if (!about) notFound();

  const { frontmatter, content } = about;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {frontmatter.photo && (
        <div className="relative w-40 h-40 rounded-full overflow-hidden mb-8">
          <Image
            src={`/content/${frontmatter.photo.replace("./", "")}`}
            alt="Drew Parrett"
            fill
            className="object-cover"
            sizes="160px"
            priority
          />
        </div>
      )}
      <h1 className="text-4xl font-bold tracking-tight mb-6">About</h1>
      <div className="prose-invert">
        <MDXRemote source={content} components={getMDXComponents()} />
      </div>
      <div className="flex gap-4 mt-10 text-sm">
        <a href="https://www.linkedin.com/in/andrewparrett/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-white transition-colors">LinkedIn</a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-white transition-colors">Instagram</a>
        <a href="mailto:drew@drewparrett.com" className="text-[var(--muted)] hover:text-white transition-colors">Email</a>
      </div>
      {frontmatter.resumeLink && (
        <a
          href={frontmatter.resumeLink}
          className="inline-block mt-6 text-sm text-white underline underline-offset-4 hover:text-[var(--label-project)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Resume (PDF)
        </a>
      )}
    </div>
  );
}
