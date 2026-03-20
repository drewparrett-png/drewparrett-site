# drewparrett.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark-themed personal portfolio site with Next.js 15, MDX content, photography galleries, and work case studies.

**Architecture:** Next.js 15 App Router with file-based MDX content in `content/`. A shared content utility reads MDX files and parses frontmatter. Pages are server components that call these utilities. Photography uses CSS masonry + a lightbox library.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, MDX (`next-mdx-remote`), `yet-another-react-lightbox`, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-19-personal-site-design.md`

---

## File Structure

```
scripts/
  copy-content-images.mjs  # Prebuild script: copies content images to public/content/
src/
  app/
    layout.tsx              # Root layout: dark theme, Nav, Footer
    page.tsx                # Homepage
    not-found.tsx           # Custom 404
    globals.css             # Tailwind imports + dark theme base styles
    work/
      page.tsx              # Work listing
      [slug]/
        page.tsx            # Work detail (MDX rendered)
    projects/
      page.tsx              # Projects listing
      [slug]/
        page.tsx            # Project detail (MDX rendered)
    photography/
      page.tsx              # Photography collections listing
      [collection]/
        page.tsx            # Collection gallery with lightbox
    about/
      page.tsx              # About page
  components/
    nav.tsx                 # Sticky top nav
    footer.tsx              # Minimal footer
    content-card.tsx        # Reusable card (work/project listings)
    collection-card.tsx     # Photography collection cover card
    homepage-grid.tsx       # Asymmetric featured content grid
    masonry-grid.tsx        # CSS columns masonry for photos
    lightbox-wrapper.tsx    # Client component wrapping yet-another-react-lightbox
    mdx-components.tsx      # Custom MDX component overrides
    image-gallery.tsx       # Grid of images for MDX posts
    side-by-side.tsx        # Two-column layout for MDX
    callout.tsx             # Highlighted text block for MDX
    mobile-nav.tsx          # Hamburger menu for mobile
  lib/
    content.ts              # Read MDX files, parse frontmatter, list content
    types.ts                # TypeScript types for frontmatter schemas
content/
  work/
    lumafield/
      index.mdx
    cognex/
      index.mdx
    co-ops/
      index.mdx
  projects/
    example-project/
      index.mdx
  photography/
    sample-collection/
      index.mdx
      images/
  about.mdx
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `scripts/copy-content-images.mjs`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd "/Users/drewparrett/Documents/Resume/Personal Site"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select defaults when prompted. This scaffolds Next.js 15 + Tailwind v4 + TypeScript.

- [ ] **Step 1b: Verify Tailwind v4 and clean up legacy config files**

Check `package.json` for `"tailwindcss": "^4"`. If v3 was scaffolded, upgrade:
```bash
npm install tailwindcss@latest
```

Delete any legacy config files that v4 doesn't use:
```bash
rm -f tailwind.config.ts tailwind.config.js postcss.config.mjs postcss.config.js
```

Tailwind v4 is configured entirely via CSS (`@import "tailwindcss"` and `@theme` blocks).

- [ ] **Step 2: Install additional dependencies**

```bash
npm install next-mdx-remote@5 gray-matter yet-another-react-lightbox
npm install -D @types/node
```

Note: `next-mdx-remote@5` — pin to v5 for RSC-compatible `<MDXRemote source={...} />` API.

- [ ] **Step 3: Set up dark theme base styles**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --background: #0a0a0a;
  --foreground: #ffffff;
  --muted: #888888;
  --border: #222222;
  --card: #161616;
  --label-work: #4ade80;
  --label-project: #60a5fa;
  --label-photo: #c084fc;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: system-ui, -apple-system, sans-serif;
}
```

- [ ] **Step 4: Set up root layout**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drew Parrett",
  description: "Engineering leader, photographer, maker of things.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Set up placeholder homepage**

Replace `src/app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold tracking-tight">
        Engineering Leader & Maker
      </h1>
      <p className="mt-4 text-[var(--muted)] max-w-lg">
        14 years building products and teams. Hardware, software, and everything in between.
      </p>
    </main>
  );
}
```

- [ ] **Step 6: Verify dev server runs**

```bash
npm run dev
```

Expected: Server starts at `http://localhost:3000`, dark background with hero text visible.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 project with Tailwind dark theme"
```

---

### Task 2: TypeScript Types & Content Utilities

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/content.ts`

- [ ] **Step 1: Define TypeScript types**

Create `src/lib/types.ts`:

```ts
export interface WorkFrontmatter {
  title: string;
  subtitle: string;
  role: string;
  timeframe: string;
  cover: string;
  featured: boolean;
  order: number;
}

export interface ProjectFrontmatter {
  title: string;
  description: string;
  cover: string;
  date: string;
  tags: string[];
  featured: boolean;
}

export interface PhotographyFrontmatter {
  title: string;
  description: string;
  cover: string;
  date: string;
}

export interface AboutFrontmatter {
  title: string;
  photo?: string;
  resumeLink?: string;
}

export interface ContentItem<T> {
  slug: string;
  frontmatter: T;
  content: string;
}

export type FeaturedItem = {
  type: "work" | "project" | "photography";
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  cover: string;
  href: string;
};
```

- [ ] **Step 2: Create content reading utilities**

Create `src/lib/content.ts`:

```ts
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

```

- [ ] **Step 3: Create prebuild script to copy content images to public/**

Content images live in `content/` alongside MDX files, but `next/image` needs them in `public/` for optimization. A prebuild script copies images automatically.

Create `scripts/copy-content-images.mjs`:

```js
import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");
const publicDir = path.join(process.cwd(), "public", "content");

function copyImages(src, dest) {
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyImages(srcPath, destPath);
    } else if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(entry.name)) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean and recopy
if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true });
}
copyImages(contentDir, publicDir);
console.log("Copied content images to public/content/");
```

Update `package.json` scripts:
```json
{
  "scripts": {
    "prebuild": "node scripts/copy-content-images.mjs",
    "predev": "node scripts/copy-content-images.mjs"
  }
}
```

This means `npm run dev` and `npm run build` both copy images first. The `public/content/` directory should be gitignored.

- [ ] **Step 3b: Update next.config.ts**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
```

- [ ] **Step 3c: Add public/content to .gitignore**

Append to `.gitignore`:
```
public/content/
```

The source of truth for images is `content/` — `public/content/` is derived.

- [ ] **Step 4: Verify build compiles**

```bash
npm run build
```

Expected: Build succeeds with no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ scripts/ next.config.ts .gitignore
git commit -m "feat: add content utilities and prebuild image copy script"
```

---

### Task 3: Nav & Footer Components

**Files:**
- Create: `src/components/nav.tsx`
- Create: `src/components/mobile-nav.tsx`
- Create: `src/components/footer.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Nav component**

Create `src/components/nav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";

const links = [
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/photography", label: "Photography" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          DP
        </Link>
        <div className="hidden md:flex gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-white"
                  : "text-[var(--muted)] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <MobileNav links={links} pathname={pathname} />
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create MobileNav component**

Create `src/components/mobile-nav.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileNavProps {
  links: { href: string; label: string }[];
  pathname: string;
}

export function MobileNav({ links, pathname }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-[var(--muted)] hover:text-white p-2"
        aria-label="Toggle menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {open ? (
            <path d="M6 6l12 12M6 18L18 6" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-[var(--background)] border-b border-[var(--border)] px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-sm ${
                pathname.startsWith(link.href)
                  ? "text-white"
                  : "text-[var(--muted)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create Footer component**

Create `src/components/footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-20">
      <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-[var(--muted)]">
        <span>&copy; {new Date().getFullYear()} Drew Parrett</span>
        <div className="flex gap-4">
          <a
            href="https://www.linkedin.com/in/andrewparrett/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href="mailto:drew@drewparrett.com"
            className="hover:text-white transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Wire Nav and Footer into root layout**

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drew Parrett",
  description: "Engineering leader, photographer, maker of things.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Expected: Sticky nav at top with "DP" and links, footer at bottom. Nav links show muted color. Mobile hamburger appears below `md` breakpoint.

- [ ] **Step 6: Commit**

```bash
git add src/components/ src/app/layout.tsx
git commit -m "feat: add Nav, MobileNav, and Footer components"
```

---

### Task 4: Content Card & Homepage Grid

**Files:**
- Create: `src/components/content-card.tsx`
- Create: `src/components/homepage-grid.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create ContentCard component**

Create `src/components/content-card.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";

interface ContentCardProps {
  href: string;
  title: string;
  subtitle?: string;
  cover: string;
  label: string;
  labelColor: string;
  large?: boolean;
}

export function ContentCard({
  href,
  title,
  subtitle,
  cover,
  label,
  labelColor,
  large = false,
}: ContentCardProps) {
  return (
    <Link href={href} className="group block">
      <div
        className={`relative overflow-hidden rounded-lg bg-[var(--card)] ${
          large ? "aspect-[16/10]" : "aspect-[3/2]"
        }`}
      >
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={large ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <span
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: labelColor }}
          >
            {label}
          </span>
          <h3 className="text-white text-sm mt-1 font-medium">{title}</h3>
          {subtitle && (
            <p className="text-white/60 text-xs mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create HomepageGrid component**

Create `src/components/homepage-grid.tsx`:

```tsx
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
        {rest.slice(0, 4).map((item) => {
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
```

- [ ] **Step 3: Update homepage to load featured content**

Update `src/app/page.tsx`:

```tsx
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
    .slice(0, 2) // Show latest 2 collections on homepage
    .map((p) => ({
      type: "photography" as const,
      slug: p.slug,
      title: p.frontmatter.title,
      description: p.frontmatter.description,
      cover: `/content/photography/${p.slug}/${p.frontmatter.cover.replace("./", "")}`,
      href: `/photography/${p.slug}`,
    }));

  // Interleave: first work item gets the large slot, then alternate by date
  const items: FeaturedItem[] = [];
  if (work.length > 0) items.push(work[0]);

  const others = [...projects, ...photography].sort((a, b) => {
    // Sort by type priority then position — deterministic order
    const typeOrder = { project: 0, photography: 1 };
    const aOrder = typeOrder[a.type as keyof typeof typeOrder] ?? 2;
    const bOrder = typeOrder[b.type as keyof typeof typeOrder] ?? 2;
    return aOrder - bOrder;
  });
  items.push(...others);

  // Add remaining work items
  items.push(...work.slice(1));

  return items;
}

export default function Home() {
  const featured = getFeaturedItems();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
        Engineering
        <br />
        Leader & Maker
      </h1>
      <p className="mt-4 text-[var(--muted)] max-w-lg leading-relaxed">
        14 years building products and teams at Lumafield and Cognex. Hardware,
        software, and everything in between.
      </p>
      <HomepageGrid items={featured} />
    </div>
  );
}
```

- [ ] **Step 4: Verify homepage renders (will be empty grid until content exists)**

```bash
npm run dev
```

Expected: Hero text renders. Grid section may be empty or hidden (no content yet). No errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/content-card.tsx src/components/homepage-grid.tsx src/app/page.tsx
git commit -m "feat: add ContentCard, HomepageGrid, and homepage"
```

---

### Task 5: MDX Rendering & Authoring Components

**Files:**
- Create: `src/components/mdx-components.tsx`
- Create: `src/components/image-gallery.tsx`
- Create: `src/components/side-by-side.tsx`
- Create: `src/components/callout.tsx`

- [ ] **Step 1: Create Callout component**

Create `src/components/callout.tsx`:

```tsx
interface CalloutProps {
  children: React.ReactNode;
  type?: "info" | "metric";
}

export function Callout({ children, type = "info" }: CalloutProps) {
  const borderColor =
    type === "metric" ? "border-[var(--label-work)]" : "border-[var(--muted)]";

  return (
    <div
      className={`border-l-2 ${borderColor} pl-4 py-2 my-6 text-[var(--muted)]`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create SideBySide component**

Create `src/components/side-by-side.tsx`:

```tsx
interface SideBySideProps {
  children: React.ReactNode;
}

export function SideBySide({ children }: SideBySideProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create ImageGallery component**

Create `src/components/image-gallery.tsx`:

```tsx
import Image from "next/image";

interface ImageGalleryProps {
  images: { src: string; alt: string }[];
  columns?: 2 | 3;
}

export function ImageGallery({ images, columns = 2 }: ImageGalleryProps) {
  return (
    <div
      className={`grid gap-3 my-6 ${
        columns === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2"
      }`}
    >
      {images.map((img) => (
        <div key={img.src} className="relative aspect-[4/3] rounded-lg overflow-hidden">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create MDXComponents map**

Create `src/components/mdx-components.tsx`:

```tsx
import Image from "next/image";
import { Callout } from "./callout";
import { SideBySide } from "./side-by-side";
import { ImageGallery } from "./image-gallery";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="text-3xl font-bold tracking-tight mt-8 mb-4" {...props} />
    ),
    h2: (props) => (
      <h2 className="text-2xl font-bold tracking-tight mt-8 mb-3" {...props} />
    ),
    h3: (props) => (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props} />
    ),
    p: (props) => (
      <p className="text-[var(--muted)] leading-relaxed my-3" {...props} />
    ),
    a: (props) => (
      <a className="text-white underline underline-offset-4 hover:text-[var(--label-project)]" {...props} />
    ),
    ul: (props) => (
      <ul className="list-disc list-inside text-[var(--muted)] my-3 space-y-1" {...props} />
    ),
    ol: (props) => (
      <ol className="list-decimal list-inside text-[var(--muted)] my-3 space-y-1" {...props} />
    ),
    blockquote: (props) => (
      <blockquote className="border-l-2 border-[var(--muted)] pl-4 my-6 italic text-[var(--muted)]" {...props} />
    ),
    code: (props) => (
      <code className="bg-[var(--card)] px-1.5 py-0.5 rounded text-sm" {...props} />
    ),
    pre: (props) => (
      <pre className="bg-[var(--card)] p-4 rounded-lg overflow-x-auto my-4 text-sm" {...props} />
    ),
    img: (props) => (
      <span className="block my-6 rounded-lg overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="w-full" alt={props.alt || ""} {...props} />
      </span>
    ),
    Callout,
    SideBySide,
    ImageGallery,
  };
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add MDX rendering components (Callout, SideBySide, ImageGallery)"
```

---

### Task 6: Work Pages (Listing + Detail)

**Files:**
- Create: `src/app/work/page.tsx`
- Create: `src/app/work/[slug]/page.tsx`

- [ ] **Step 1: Create Work listing page**

Create `src/app/work/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Create Work detail page**

Create `src/app/work/[slug]/page.tsx`:

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add src/app/work/
git commit -m "feat: add Work listing and detail pages"
```

---

### Task 7: Projects Pages (Listing + Detail)

**Files:**
- Create: `src/app/projects/page.tsx`
- Create: `src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create Projects listing page**

Create `src/app/projects/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Create Projects detail page**

Create `src/app/projects/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentItem, getContentItems } from "@/lib/content";
import { getMDXComponents } from "@/components/mdx-components";
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
  const coverSrc = `/content/projects/${slug}/${frontmatter.cover.replace("./", "")}`;

  return (
    <article className="max-w-4xl mx-auto px-6 py-16">
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-8">
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
      <p className="text-lg text-[var(--muted)] mt-2">
        {frontmatter.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        {frontmatter.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded bg-[var(--card)] text-[var(--muted)]"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-10 prose-invert">
        <MDXRemote source={content} components={getMDXComponents()} />
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/
git commit -m "feat: add Projects listing and detail pages"
```

---

### Task 8: Photography Pages (Listing + Collection + Lightbox)

**Files:**
- Create: `src/components/collection-card.tsx`
- Create: `src/components/masonry-grid.tsx`
- Create: `src/components/lightbox-wrapper.tsx`
- Create: `src/app/photography/page.tsx`
- Create: `src/app/photography/[collection]/page.tsx`

- [ ] **Step 1: Create CollectionCard component**

Create `src/components/collection-card.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";

interface CollectionCardProps {
  href: string;
  title: string;
  count: number;
  cover: string;
}

export function CollectionCard({
  href,
  title,
  count,
  cover,
}: CollectionCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          <p className="text-white/60 text-sm">{count} photos</p>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create MasonryGrid component**

Create `src/components/masonry-grid.tsx`:

```tsx
"use client";

interface MasonryGridProps {
  images: { src: string; alt: string }[];
  onImageClick: (index: number) => void;
}

export function MasonryGrid({ images, onImageClick }: MasonryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
      {images.map((img, i) => (
        <button
          key={img.src}
          onClick={() => onImageClick(i)}
          className="block w-full break-inside-avoid cursor-pointer group"
        >
          <div className="overflow-hidden rounded-lg">
            {/* Use native img for natural aspect ratio in masonry layout */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create LightboxWrapper component**

Create `src/components/lightbox-wrapper.tsx`:

```tsx
"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { MasonryGrid } from "./masonry-grid";

interface LightboxWrapperProps {
  images: { src: string; alt: string }[];
}

export function LightboxWrapper({ images }: LightboxWrapperProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((img) => ({ src: img.src, alt: img.alt }));

  return (
    <>
      <MasonryGrid
        images={images}
        onImageClick={(i) => {
          setIndex(i);
          setOpen(true);
        }}
      />
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        styles={{
          container: { backgroundColor: "rgba(10, 10, 10, 0.95)" },
        }}
      />
    </>
  );
}
```

- [ ] **Step 4: Create Photography listing page**

Create `src/app/photography/page.tsx`:

```tsx
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
```

- [ ] **Step 5: Create Photography collection page**

Create `src/app/photography/[collection]/page.tsx`:

```tsx
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
```

- [ ] **Step 6: Commit**

```bash
git add src/components/collection-card.tsx src/components/masonry-grid.tsx src/components/lightbox-wrapper.tsx src/app/photography/
git commit -m "feat: add Photography listing, collection gallery, and lightbox"
```

---

### Task 9: About Page

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Create About page**

Create `src/app/about/page.tsx`:

```tsx
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
        <a
          href="https://www.linkedin.com/in/andrewparrett/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--muted)] hover:text-white transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--muted)] hover:text-white transition-colors"
        >
          Instagram
        </a>
        <a
          href="mailto:drew@drewparrett.com"
          className="text-[var(--muted)] hover:text-white transition-colors"
        >
          Email
        </a>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/about/
git commit -m "feat: add About page"
```

---

### Task 10: Custom 404 Page

**Files:**
- Create: `src/app/not-found.tsx`

- [ ] **Step 1: Create 404 page**

Create `src/app/not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-32 text-center">
      <h1 className="text-6xl font-bold tracking-tighter">404</h1>
      <p className="mt-4 text-[var(--muted)] text-lg">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 text-sm text-white underline underline-offset-4 hover:text-[var(--label-project)]"
      >
        Back to home
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "feat: add custom 404 page"
```

---

### Task 11: Placeholder Content

**Files:**
- Create: `content/work/lumafield/index.mdx`
- Create: `content/work/cognex/index.mdx`
- Create: `content/work/co-ops/index.mdx`
- Create: `content/projects/example-project/index.mdx`
- Create: `content/photography/sample-collection/index.mdx`
- Create: `content/about.mdx`

- [ ] **Step 1: Create placeholder work content**

Create `content/work/lumafield/index.mdx`:

```mdx
---
title: "Lumafield"
subtitle: "Scaling CT Inspection"
role: "VP of Product & Engineering"
timeframe: "2021–2026"
cover: "./cover.jpg"
featured: true
order: 1
---

Placeholder content for Lumafield case study. Replace with your narrative.
```

Create `content/work/cognex/index.mdx`:

```mdx
---
title: "Cognex"
subtitle: "Engineering & Manufacturing Leadership"
role: "Engineering Manager"
timeframe: "2012–2021"
cover: "./cover.jpg"
featured: true
order: 2
---

Placeholder content for Cognex case study. Replace with your narrative.
```

Create `content/work/co-ops/index.mdx`:

```mdx
---
title: "Early Career"
subtitle: "Co-ops & Internships"
role: "Mechanical Engineering Co-ops & Operations Intern"
timeframe: "2008–2011"
cover: "./cover.jpg"
featured: false
order: 3
---

## Philips Color Kinetics (2011)

Mechanical Engineering Co-op. Took a product from concept through design and tooling release.

## L-3 Communications (2010)

Mechanical Engineering Co-op. Designed mechanical components and created FEA simulations.

## Ocular Therapeutix (2009)

Operations Engineering Co-op. Created fixtures and analyzed historical data for process improvements.

## Hitchiner Manufacturing (2008)

Operations Intern. Worked on ERP implementation and created work instructions.
```

- [ ] **Step 2: Create placeholder project content**

Create `content/projects/example-project/index.mdx`:

```mdx
---
title: "Example Project"
description: "A placeholder project to test the site"
cover: "./cover.jpg"
date: "2025-01-15"
tags: ["example", "placeholder"]
featured: true
---

Replace this with a real project write-up.
```

- [ ] **Step 3: Create placeholder photography content**

Create `content/photography/sample-collection/index.mdx`:

```mdx
---
title: "Sample Collection"
description: "Placeholder photography collection"
cover: "./images/sample.jpg"
date: "2025-06-01"
---
```

Create `content/photography/sample-collection/images/` directory (will need at least one image to test).

- [ ] **Step 4: Create about content**

Create `content/about.mdx`:

```mdx
---
title: "About"
---

Engineering leader with 14 years of experience building products and teams at Lumafield and Cognex. Passionate about photography, making things, and solving hard problems at the intersection of hardware and software.

Currently exploring what's next.
```

- [ ] **Step 5: Add placeholder images**

For each content entry that references a `cover.jpg`, create a simple placeholder image. You can use a 1200x800 solid dark gray JPEG, or download sample images from Unsplash.

```bash
# Create necessary directories
mkdir -p content/work/lumafield/images
mkdir -p content/work/cognex/images
mkdir -p content/work/co-ops/images
mkdir -p content/projects/example-project/images
mkdir -p content/photography/sample-collection/images
```

Generate placeholder images (solid color JPEGs) using a quick script or download from Unsplash. Each cover.jpg should be ~1200x800.

- [ ] **Step 6: Verify full site works**

```bash
npm run dev
```

Visit each page and verify:
- `/` — Hero + grid (if placeholder images exist)
- `/work` — Lists all 3 work entries
- `/work/lumafield` — Renders MDX content
- `/projects` — Lists example project
- `/photography` — Lists sample collection
- `/photography/sample-collection` — Shows masonry grid + lightbox
- `/about` — Renders bio
- `/nonexistent` — Shows 404

- [ ] **Step 7: Commit**

```bash
git add content/
git commit -m "feat: add placeholder content for all sections"
```

---

### Task 12: Build Verification & Polish

**Files:**
- Modify: various files for any build errors

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds. Fix any type errors or build issues that surface.

- [ ] **Step 2: Test production server**

```bash
npm run start
```

Visit all pages, verify images load, lightbox works, mobile nav works (resize browser).

- [ ] **Step 3: Add .gitignore entries**

Ensure `.gitignore` includes:

```
.superpowers/
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: build verification and gitignore cleanup"
```

---

### Task 13: Deployment Setup

- [ ] **Step 1: Create GitHub repository**

```bash
gh repo create drewparrett-site --private --source=. --push
```

Or create via GitHub UI and push manually.

- [ ] **Step 2: Connect to Vercel**

```bash
npx vercel --yes
```

Follow prompts to link the project to your Vercel account.

- [ ] **Step 3: Configure domain**

In Vercel dashboard: Settings → Domains → Add `drewparrett.com`. Follow DNS instructions to point domain.

- [ ] **Step 4: Verify deployment**

Push to main and verify the site is live at the Vercel preview URL. Then verify it works on `drewparrett.com` once DNS propagates.
