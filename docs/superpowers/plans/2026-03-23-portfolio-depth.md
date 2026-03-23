# Portfolio Depth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand drewparrett.com with 4 new standalone project pages, slimmed work pages, an enriched about page, and a curated 5-item homepage.

**Architecture:** Extend the existing MDX + gray-matter content system with new optional frontmatter fields. Add two new React components (`ProjectHero`, `ProjectFooter`) that conditionally render on project detail pages when the extended fields are present. All content is MDX files in `content/projects/`. No new dependencies.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, MDX via next-mdx-remote, gray-matter for frontmatter parsing.

**⚠️ CRITICAL CONSTRAINT:** Do NOT push to GitHub or create PRs. Vercel will auto-deploy on push. All work stays local. Each task ends with a local `git commit` only. A final verification task runs the dev server for visual inspection before any push happens.

**Spec:** `docs/superpowers/specs/2026-03-23-portfolio-depth-design.md`
**Brief (source material for content):** `/Users/drewparrett/Documents/Resume/drew_parrett_website_brief.md`

---

## File Map

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/project-hero.tsx` | Hero block with context line, title, subtitle, external link, metrics bar |
| `src/components/project-footer.tsx` | Footer with "Back to Projects" + related project cross-link |
| `content/projects/scan-of-the-month/index.mdx` | SOTM project page content |
| `content/projects/3d-a1000/index.mdx` | 3D-A1000 project page content |
| `content/projects/lumafield-launch/index.mdx` | Lumafield Launch project page content |
| `content/projects/patents/index.mdx` | Patents project page content |
| `.claude/launch.json` | Dev server config for preview tool |

### Files to Modify

| File | Change |
|------|--------|
| `src/lib/types.ts` | Extend `ProjectFrontmatter` with optional fields |
| `src/app/projects/[slug]/page.tsx` | Conditional ProjectHero/ProjectFooter rendering |
| `src/app/page.tsx` | Reduce photography from 2 to 1 item |
| `content/work/lumafield/index.mdx` | Slim body, add cross-links to project pages |
| `content/work/cognex/index.mdx` | Slim body, add cross-links to project pages |
| `content/about.mdx` | Rewrite body with career arc narrative |

### Files NOT Changing

| File | Why |
|------|-----|
| `content/projects/callframe/index.mdx` | Existing project, no new fields needed |
| `src/app/projects/page.tsx` | Listing page already renders all projects via ContentCard |
| `src/components/content-card.tsx` | Cards already work for new projects |
| `src/components/homepage-grid.tsx` | Grid layout unchanged |
| `src/lib/content.ts` | Content loading logic unchanged |

---

## Task 1: Dev Server Setup

**Files:**
- Create: `.claude/launch.json`

- [ ] **Step 1: Create launch.json**

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "dev",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 3000
    }
  ]
}
```

Write this to `.claude/launch.json`.

- [ ] **Step 2: Start dev server and verify**

Run: `preview_start` with name `"dev"`
Expected: Server starts on port 3000, homepage loads.

- [ ] **Step 3: Commit**

```bash
git add .claude/launch.json
git commit -m "chore: add launch.json for local dev preview"
```

**⚠️ Do NOT push.**

---

## Task 2: Extend ProjectFrontmatter Type

**Files:**
- Modify: `src/lib/types.ts` (lines 11-18)

- [ ] **Step 1: Update the ProjectFrontmatter interface**

Replace the current `ProjectFrontmatter` interface with:

```typescript
export interface ProjectFrontmatter {
  title: string;
  description: string;
  cover: string;
  date: string;
  tags?: string[];
  featured: boolean;
  // Rich project page fields (optional — CallFrame works without these)
  parentWork?: string;
  parentWorkTitle?: string;
  externalUrl?: string;
  metrics?: Array<{ value: string; label: string }>;
  relatedProject?: string;
  relatedProjectTitle?: string;
}
```

Key change: `tags` becomes `tags?: string[]` (optional).

- [ ] **Step 2: Guard tags in project detail page**

In `src/app/projects/[slug]/page.tsx`, change line 59 from:

```tsx
{frontmatter.tags.map((tag) => (
```

To:

```tsx
{frontmatter.tags?.map((tag) => (
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build` (or check dev server has no type errors)
Expected: No TypeScript errors. CallFrame page still renders correctly.

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/app/projects/\[slug\]/page.tsx
git commit -m "feat: extend ProjectFrontmatter with optional rich fields"
```

**⚠️ Do NOT push.**

---

## Task 3: Build ProjectHero Component

**Files:**
- Create: `src/components/project-hero.tsx`

- [ ] **Step 1: Create the component**

```tsx
import Link from "next/link";
import type { ProjectFrontmatter } from "@/lib/types";

export function ProjectHero({
  frontmatter,
}: {
  frontmatter: ProjectFrontmatter;
}) {
  const {
    title,
    description,
    parentWork,
    parentWorkTitle,
    externalUrl,
    metrics,
  } = frontmatter;

  // Extract domain from URL for display
  const domain = externalUrl
    ? new URL(externalUrl).hostname.replace("www.", "")
    : null;

  return (
    <div>
      {parentWork && parentWorkTitle && (
        <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
          Part of my work at{" "}
          <Link
            href={`/work/${parentWork}`}
            className="text-[var(--label-work)] hover:underline"
          >
            {parentWorkTitle}
          </Link>
        </p>
      )}

      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>

      <p className="text-lg text-[var(--muted)] mt-2">{description}</p>

      {externalUrl && domain && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-[var(--label-project)] hover:underline mt-2"
        >
          Visit {domain} →
        </a>
      )}

      {metrics && metrics.length > 0 && (
        <div
          className={`grid gap-3 mt-8 ${
            metrics.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"
          }`}
        >
          {metrics.map((metric, i) => (
            <div
              key={i}
              className="bg-[var(--card)] rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold text-[var(--label-project)]">
                {metric.value}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/project-hero.tsx
git commit -m "feat: add ProjectHero component"
```

**⚠️ Do NOT push.**

---

## Task 4: Build ProjectFooter Component

**Files:**
- Create: `src/components/project-footer.tsx`

- [ ] **Step 1: Create the component**

```tsx
import Link from "next/link";

export function ProjectFooter({
  relatedProject,
  relatedProjectTitle,
}: {
  relatedProject?: string;
  relatedProjectTitle?: string;
}) {
  return (
    <div className="border-t border-[var(--border)] mt-16 pt-8 flex items-center justify-between">
      <Link
        href="/projects"
        className="text-sm text-[var(--muted)] hover:text-white transition-colors"
      >
        ← Back to Projects
      </Link>
      {relatedProject && relatedProjectTitle && (
        <Link
          href={`/projects/${relatedProject}`}
          className="text-sm text-[var(--label-project)] hover:underline"
        >
          Read about {relatedProjectTitle} →
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/project-footer.tsx
git commit -m "feat: add ProjectFooter component"
```

**⚠️ Do NOT push.**

---

## Task 5: Update Project Detail Page with Conditional Layout

**Files:**
- Modify: `src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Rewrite the page to conditionally use ProjectHero**

Replace the entire default export function with:

```tsx
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
```

- [ ] **Step 2: Verify CallFrame still renders correctly**

Navigate to `http://localhost:3000/projects/callframe` in the dev server.
Expected: CallFrame shows the original layout (cover image, title, description, tags). The `ProjectFooter` appears at the bottom showing "← Back to Projects" only (no related project link).

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/\[slug\]/page.tsx
git commit -m "feat: conditional rich layout for project detail pages"
```

**⚠️ Do NOT push.**

---

## Task 6: Create Scan of the Month Project Page

**Files:**
- Create: `content/projects/scan-of-the-month/index.mdx`

**Source material:** Brief sections on "Scan of the Month" + existing Lumafield MDX section.

- [ ] **Step 1: Create the content directory**

```bash
mkdir -p content/projects/scan-of-the-month
```

- [ ] **Step 2: Create a placeholder cover image**

The new project pages use `ProjectHero` (no cover image rendered on detail page), but the `ContentCard` on the listing page still reads `cover` from frontmatter. For now, copy an existing cover as placeholder:

```bash
cp content/projects/callframe/cover.png content/projects/scan-of-the-month/cover.png
```

This will be replaced with real CT scan imagery later.

- [ ] **Step 3: Write the MDX content**

Create `content/projects/scan-of-the-month/index.mdx` with:

**Frontmatter:**
```yaml
---
title: "Scan of the Month"
description: "A content-led growth engine I built from scratch that became Lumafield's marketing cornerstone"
date: "2026-03-15"
cover: "./cover.png"
featured: true
parentWork: "lumafield"
parentWorkTitle: "Lumafield"
externalUrl: "https://scanofthemonth.com"
metrics:
  - value: "#1"
    label: "Hacker News"
  - value: "4,000+"
    label: "Email Signups"
  - value: "FT"
    label: "Partnership"
relatedProject: "lumafield-launch"
relatedProjectTitle: "The Lumafield Launch"
---
```

**MDX body sections** (write using source material from the brief — first person, conversational, confident):

1. `## The Origin` — Started as a solo project within Lumafield. CT scan content was inherently fascinating — cross-sections reveal what's invisible. The idea: publish one scan per month, dissecting everyday objects with industrial CT technology.

2. `## The Content` — Each scan was a full editorial piece. We'd pick an object (AirPods, a baseball, a lock), scan it on our Neptune system, and create a visual narrative. The cross-sections told stories that photos couldn't. (Placeholder: "Images coming soon" note where CT imagery will go.)

3. `## The Growth` — Hit #1 on Hacker News multiple times. The first viral post generated massive traffic overnight. Email signups grew to 4,000+ qualified leads. Engineering communities shared the content organically.

4. `## The Business Impact` — Transitioned from "Drew's side project" to the company's primary top-of-funnel channel. Led to key engineering hires — people discovered Lumafield through these scans. Became a cornerstone of how the marketing team told the company's story.

5. `## The FT Partnership` — The Financial Times reached out to collaborate on an article, bringing Lumafield's technology to an entirely different audience. This partnership validated the content strategy and expanded the company's credibility beyond the engineering community.

**Tone guidance:** First person. Not a press release — tell it like you'd tell a friend. "I started this because..." not "The project was initiated..."

- [ ] **Step 4: Verify the page renders**

Navigate to `http://localhost:3000/projects/scan-of-the-month`
Expected: ProjectHero renders with context line linking to Lumafield, 3 metric cards (blue accent), subtitle, external link. MDX body renders below. ProjectFooter shows "Read about The Lumafield Launch →".

Also check `http://localhost:3000/projects` — the listing page should now show 2 project cards.

- [ ] **Step 5: Commit**

```bash
git add content/projects/scan-of-the-month/
git commit -m "feat: add Scan of the Month project page"
```

**⚠️ Do NOT push.**

---

## Task 7: Create 3D-A1000 Project Page

**Files:**
- Create: `content/projects/3d-a1000/index.mdx`

**Source material:** Brief sections on Cognex engineering + PMM roles.

- [ ] **Step 1: Create content directory with placeholder cover**

```bash
mkdir -p content/projects/3d-a1000
cp content/projects/callframe/cover.png content/projects/3d-a1000/cover.png
```

- [ ] **Step 2: Write the MDX content**

**Frontmatter:**
```yaml
---
title: "3D-A1000"
description: "Designed a 3D vision camera, then launched it into a new market — $0 to $10M"
date: "2019-01-01"
cover: "./cover.png"
featured: false
parentWork: "cognex"
parentWorkTitle: "Cognex"
metrics:
  - value: "$0→$10M"
    label: "Revenue in 3 Years"
  - value: "End-to-End"
    label: "Camera Design"
  - value: "New Market"
    label: "Logistics Entry"
relatedProject: "patents"
relatedProjectTitle: "Patents"
---
```

**MDX body sections** (source: brief's Cognex engineering + PMM sections):

1. `## The Engineering` — Lead opto-mechanical engineer. Designed the complete camera system: optics, illumination, autofocus mechanisms. Two contractors under my direction for mechanical design. This wasn't a spec review — I designed the camera with my own hands. Two of my [patents](/projects/patents) came directly from this work.

2. `## The Product Pivot` — Transition from "I designed this camera" to "I'm going to sell it." At Cognex, Product Marketing acted as both product and marketing. I took the camera I'd engineered and became its product manager, targeting the logistics market. Like running a startup inside a well-funded public company.

3. `## The Launch & Scale` — Launched "Vision for Logistics" from nothing. Worked with two software teams to wrap specialized software onto the embedded device. Key customers included major logistics companies. Revenue trajectory: ~$2M year one, ~$5M year two, nearly $10M year three. Products had >80% gross margin and one of the lowest tech support burdens in Cognex's portfolio.

4. `## What I Learned` — This was where I discovered that building the right thing matters as much as building it right. Engineering gave me credibility; product management gave me leverage. The combination — designing a product and then scaling it commercially — is rare, and it's what I look for in every role since.

- [ ] **Step 3: Verify the page renders**

Navigate to `http://localhost:3000/projects/3d-a1000`
Expected: ProjectHero with Cognex context line, 3 metrics, MDX body, footer linking to Patents.

- [ ] **Step 4: Commit**

```bash
git add content/projects/3d-a1000/
git commit -m "feat: add 3D-A1000 project page"
```

**⚠️ Do NOT push.**

---

## Task 8: Create Lumafield Launch Project Page

**Files:**
- Create: `content/projects/lumafield-launch/index.mdx`

**Source material:** Brief sections on Lumafield launch, GTM building.

- [ ] **Step 1: Create content directory with placeholder cover**

```bash
mkdir -p content/projects/lumafield-launch
cp content/projects/callframe/cover.png content/projects/lumafield-launch/cover.png
```

- [ ] **Step 2: Write the MDX content**

**Frontmatter:**
```yaml
---
title: "The Lumafield Launch"
description: "From stealth to public — building the entire go-to-market from scratch"
date: "2022-04-01"
cover: "./cover.png"
featured: false
parentWork: "lumafield"
parentWorkTitle: "Lumafield"
metrics:
  - value: "Stealth → Public"
    label: "Launch Campaign"
  - value: "Full GTM"
    label: "Built from Scratch"
relatedProject: "scan-of-the-month"
relatedProjectTitle: "Scan of the Month"
---
```

Note: Only 2 metrics (third is TBD). The component renders `grid-cols-2` when there are 2 metrics.

**MDX body sections:**

1. `## The Opportunity` — Lumafield had a breakthrough technology — cloud-connected industrial CT scanners that reduced cost from ~$1M to $36K/yr — but no brand, no website, no go-to-market motion. I joined as the first hire on the commercial side.

2. `## The Pre-Launch Launch` — Given a month to stand up the first website. The company was still operating under the stealth name "Meter." I spun up a site to give sales their first real collateral and a shot at inbound leads. Then I launched [Scan of the Month](/projects/scan-of-the-month) as an organic hype and lead-gen engine — building an audience before the product was even public.

3. `## Building the GTM` — Worked with the second marketing hire (now Head of Marketing) to rebrand the company as "Lumafield." Built positioning, messaging, and the launch strategy from scratch. Systematically hired myself out of each function — content marketing, tradeshow coordination, product marketing, photo/video — so I could move to the next highest-leverage problem.

4. `## The Launch` — The public launch in April. The company went from invisible to visible overnight. Everything we'd built — the brand, the content engine, the early community — came together.

5. `## The Launch Touchdown` — We didn't treat the launch as a single event. It was a campaign. The flagship tradeshow in September was the bookend — a point in time to reflect on the entire GTM approach. Six months of iteration, learning what resonated, doubling down on what worked. By the time we hit that tradeshow, the playbook was proven.

- [ ] **Step 3: Verify the page renders**

Navigate to `http://localhost:3000/projects/lumafield-launch`
Expected: ProjectHero with 2 metric cards (grid-cols-2), MDX body, footer linking to SOTM.

- [ ] **Step 4: Commit**

```bash
git add content/projects/lumafield-launch/
git commit -m "feat: add Lumafield Launch project page"
```

**⚠️ Do NOT push.**

---

## Task 9: Create Patents Project Page

**Files:**
- Create: `content/projects/patents/index.mdx`

**Source material:** Brief section on patents + Cognex work page.

- [ ] **Step 1: Create content directory with placeholder cover**

```bash
mkdir -p content/projects/patents
cp content/projects/callframe/cover.png content/projects/patents/cover.png
```

- [ ] **Step 2: Write the MDX content**

**Frontmatter:**
```yaml
---
title: "Patents"
description: "4 U.S. patents in optics and 3D algorithms"
date: "2019-06-01"
cover: "./cover.png"
featured: false
parentWork: "cognex"
parentWorkTitle: "Cognex"
relatedProject: "3d-a1000"
relatedProjectTitle: "3D-A1000"
---
```

Note: No `metrics` field — the Patents page doesn't use a metrics bar. The component handles this gracefully (metrics bar simply doesn't render).

**MDX body:**

1. `## Overview` — 3-4 sentences: Industrial 3D vision involves solving hard problems in optics, illumination, and algorithms under real-world constraints — vibration, temperature swings, cost limits. Patenting solutions in this space means the ideas were novel enough to survive the full patent examination process. These four patents came from my hands-on engineering work at Cognex on the [3D-A1000](/projects/3d-a1000) and related camera systems.

2. Then list each patent as an h3 with:
   - `### Passively Athermal Optical Mounting`
   - Patent number (placeholder: "U.S. Patent X,XXX,XXX" — Drew to provide actual numbers)
   - 2-3 sentence plain-English explanation of what it does and why it matters

   Repeat for:
   - `### Laser Despeckling Method`
   - `### Low-Compute 3D Stitching Algorithm`
   - `### Composite 3D Blob Tool Algorithm`

   Each with a placeholder patent number and a plain-English summary.

- [ ] **Step 3: Verify the page renders**

Navigate to `http://localhost:3000/projects/patents`
Expected: ProjectHero with Cognex context line, NO metrics bar, MDX body with 4 patent sections, footer linking to 3D-A1000.

- [ ] **Step 4: Commit**

```bash
git add content/projects/patents/
git commit -m "feat: add Patents project page"
```

**⚠️ Do NOT push.**

---

## Task 10: Update Homepage Curation

**Files:**
- Modify: `src/app/page.tsx` (line 45)

- [ ] **Step 1: Reduce photography slice from 2 to 1 (defensive)**

In `src/app/page.tsx`, change line 45 from:

```tsx
    .slice(0, 2)
```

To:

```tsx
    .slice(0, 1)
```

Note: Currently there is only 1 photography collection, so this is a no-op today. However, it protects the 5-item homepage if more photography collections are added later. The actual mechanism producing 5 items is that only 2 projects (SOTM + CallFrame) have `featured: true`.

- [ ] **Step 2: Verify homepage shows 5 items**

Navigate to `http://localhost:3000`
Expected: 5 cards — Lumafield (large), Scan of the Month, CallFrame, Photography (1 item), Cognex.

SOTM date is "2026-03-15" (set in Task 6) which sorts before CallFrame's "2026-03-01" in descending order, so SOTM appears first. The algorithm puts all projects before photography, then remaining work items at the end, producing: `[Lumafield (large), SOTM, CallFrame, Photography, Cognex]`. Note: this differs slightly from the spec's stated order (which put Cognex third), but the algorithm has no mechanism to interleave work items between projects. The actual ordering is better for the user — it groups content by type.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: reduce homepage photography to 1 for 5-item curated grid"
```

**⚠️ Do NOT push.**

---

## Task 11: Slim Down Lumafield Work Page

**Files:**
- Modify: `content/work/lumafield/index.mdx`

- [ ] **Step 1: Rewrite the MDX body**

Keep the frontmatter exactly as-is. Replace the MDX body with a slimmed role narrative. The content should:

- Keep "From Stealth to Category Leader" section (role overview)
- Keep "Building the Neptune Platform" section (product work — modules, microfocus, pricing)
- Replace the "Scan of the Month" section with 2-3 sentences + link:
  > I created Scan of the Month, a content-led growth engine that hit #1 on Hacker News, generated 4,000+ leads, and became the company's marketing cornerstone. [Read the full Scan of the Month story →](/projects/scan-of-the-month)
- Keep "Scaling the Organization" section
- Keep "Accelerating Triton" section
- Add a brief mention of the launch with link:
  > As the first GTM hire, I built the go-to-market function from scratch — from the initial stealth website to the public launch and beyond. [Read about the Lumafield Launch →](/projects/lumafield-launch)

Preserve all existing images.

- [ ] **Step 2: Verify the page renders**

Navigate to `http://localhost:3000/work/lumafield`
Expected: Slimmer page with cross-links to SOTM and Launch project pages. Links should work.

- [ ] **Step 3: Commit**

```bash
git add content/work/lumafield/index.mdx
git commit -m "content: slim Lumafield work page with project cross-links"
```

**⚠️ Do NOT push.**

---

## Task 12: Slim Down Cognex Work Page

**Files:**
- Modify: `content/work/cognex/index.mdx`

- [ ] **Step 1: Rewrite the MDX body**

Keep the frontmatter exactly as-is. Replace the MDX body with a slimmed role narrative:

- Keep "Nine Years at the Machine Vision Leader" intro
- Replace "Launching the 3D-A1000" deep section with 2-3 sentences + link:
  > I led product management and go-to-market for the 3D-A1000 — Cognex's entry into the logistics market. What started as a camera I designed as an engineer became a $10M/yr business. [Read the full 3D-A1000 story →](/projects/3d-a1000)
- Keep "Opto-Mechanical Engineering" section (role narrative)
- Keep "NPI Engineering Management" section
- Replace "Patents" section with brief mention + link:
  > Named inventor on 4 U.S. patents in optics and 3D algorithms, spanning camera mounting, laser systems, and computational methods. [See my Patents →](/projects/patents)

Preserve all existing images.

- [ ] **Step 2: Verify the page renders**

Navigate to `http://localhost:3000/work/cognex`
Expected: Slimmer page with cross-links to 3D-A1000 and Patents project pages.

- [ ] **Step 3: Commit**

```bash
git add content/work/cognex/index.mdx
git commit -m "content: slim Cognex work page with project cross-links"
```

**⚠️ Do NOT push.**

---

## Task 13: Rewrite About Page

**Files:**
- Modify: `content/about.mdx`

- [ ] **Step 1: Rewrite the MDX body**

Keep frontmatter as-is (`title: "About"`). Replace the body with the enriched narrative:

**Opening** — One punchy first-person line. Not a title. Something like: "I build products that work in the real world — and the teams that ship them."

**The Career Arc** (2-3 paragraphs):
- Started at Cognex designing cameras and optics. Designed one, then realized building the right thing mattered as much as building it right.
- Pivoted into product. Took the camera I'd designed and scaled it to $10M in revenue. Four patents along the way.
- Joined [Lumafield](/work/lumafield) as the first GTM hire. Built the brand, launched from stealth, created [Scan of the Month](/projects/scan-of-the-month), scaled the org from 10 to 20+.
- Now building independently. [CallFrame](/projects/callframe) is my current project — using AI-native tools to move from idea to prototype fast.

**The Personal Side** (1-2 paragraphs):
- Photography and filmmaking. Link to [Photography](/photography) section.
- Northeastern (ME), University of Arizona (Optics). Based in the Boston area.

**What I'm Looking For** (1 short paragraph):
- Direct statement. Product leadership at companies building physical or technical products. Interested in the intersection of hardware and software. Excited about AI-native product development.

**Tone:** First person, conversational, confident, reflective.

- [ ] **Step 2: Verify the page renders**

Navigate to `http://localhost:3000/about`
Expected: Richer narrative, cross-links to work and project pages.

- [ ] **Step 3: Commit**

```bash
git add content/about.mdx
git commit -m "content: rewrite About page with career narrative arc"
```

**⚠️ Do NOT push.**

---

## Task 14: Full Local Verification

**This is the gating task before any push to GitHub.**

- [ ] **Step 1: Run build to check for errors**

```bash
npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 2: Visual inspection — Homepage**

Navigate to `http://localhost:3000`
Check:
- 5 cards visible (Lumafield large, SOTM, CallFrame, Photography, Cognex)
- All cards link correctly

- [ ] **Step 3: Visual inspection — Projects listing**

Navigate to `http://localhost:3000/projects`
Check:
- 5 project cards visible (SOTM, 3D-A1000, Lumafield Launch, Patents, CallFrame)
- All cards have covers and descriptions

- [ ] **Step 4: Visual inspection — Each new project page**

Navigate to each:
- `http://localhost:3000/projects/scan-of-the-month` — hero, 3 metrics, external link, SOTM → Launch footer link
- `http://localhost:3000/projects/3d-a1000` — hero, 3 metrics, Cognex context, → Patents footer link
- `http://localhost:3000/projects/lumafield-launch` — hero, 2 metrics, Lumafield context, → SOTM footer link
- `http://localhost:3000/projects/patents` — hero, NO metrics, Cognex context, → 3D-A1000 footer link

- [ ] **Step 5: Visual inspection — CallFrame unchanged**

Navigate to `http://localhost:3000/projects/callframe`
Check: Original layout (cover image, title, tags, no hero component)

- [ ] **Step 6: Visual inspection — Work pages slimmed**

Navigate to:
- `http://localhost:3000/work/lumafield` — shorter, cross-links to SOTM and Launch work
- `http://localhost:3000/work/cognex` — shorter, cross-links to 3D-A1000 and Patents

- [ ] **Step 7: Visual inspection — About page**

Navigate to `http://localhost:3000/about`
Check: Career arc narrative, cross-links, tone

- [ ] **Step 8: Cross-link verification**

Click through every cross-link:
- Work → Project links (Lumafield page → SOTM, Launch; Cognex page → 3D-A1000, Patents)
- Project → Work links (each hero context line)
- Project → Project links (each footer related link)
- About → Work/Project links

All should resolve without 404s.

- [ ] **Step 9: Report to user**

Present findings. If there are visual issues, placeholder images that need replacing, or content that needs Drew's review — flag them. **Do NOT push until Drew approves.**

---

## Task 15: Push and Deploy (USER-GATED)

**⚠️ This task is ONLY executed after Drew explicitly approves the local version.**

- [ ] **Step 1: Push to GitHub**

```bash
git push origin main
```

This will trigger Vercel auto-deploy.

- [ ] **Step 2: Verify production deployment**

Check the Vercel deployment URL to confirm everything looks correct in production.
