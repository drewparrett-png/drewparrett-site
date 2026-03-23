# Portfolio Depth: Adding Narrative Richness to drewparrett.com

**Date:** 2026-03-23
**Status:** Draft

## Overview

Expand drewparrett.com from a resume-style portfolio into a narrative-driven personal brand site. The primary audience is hiring managers evaluating Drew for Product/Leadership roles. The secondary purpose is a general personal brand site that highlights photography and side projects.

The core change: pull four deep stories out of the Work pages and give them standalone Project pages, slim the Work pages down to role narratives with cross-links, enrich the About page with a career arc, and keep the homepage tight and curated.

## Information Architecture

```
drewparrett.com
├── Homepage (curated grid, 5 items)
├── Work
│   ├── Lumafield (role narrative, links to SOTM + Launch projects)
│   ├── Cognex (role narrative, links to 3D-A1000 + Patents projects)
│   └── Co-ops
├── Projects
│   ├── Scan of the Month (standalone, rich)
│   ├── 3D-A1000 (standalone, rich)
│   ├── Lumafield Launch (standalone)
│   ├── Patents (standalone)
│   └── CallFrame (existing)
├── Photography
│   └── Selections
└── About (enriched with narrative arc)
```

**Navigation:** Work / Projects / Photography / About

## Technical Approach

### Extended ProjectFrontmatter

The existing `ProjectFrontmatter` type (`title`, `description`, `cover`, `date`, `tags`, `featured`) is extended with optional fields for the new rich project pages:

```typescript
export interface ProjectFrontmatter {
  title: string;
  description: string;       // Used as subtitle on detail page AND card description on listing page
  cover: string;
  date: string;
  tags: string[];
  featured: boolean;
  // New optional fields for rich project pages:
  parentWork?: string;        // Slug of parent work page, e.g., "lumafield"
  parentWorkTitle?: string;   // Display title, e.g., "Lumafield" (avoids runtime content lookups)
  externalUrl?: string;       // e.g., "https://scanofthemonth.com"
  metrics?: Array<{ value: string; label: string }>;  // Up to 3
  relatedProject?: string;    // Slug of related project for footer cross-link
  relatedProjectTitle?: string; // Display title, e.g., "Scan of the Month"
}
```

CallFrame continues to work unchanged — the new fields are all optional. The `tags` field becomes optional (`tags?: string[]`) since new project pages do not use tags. The project detail page must guard against undefined tags (use `frontmatter.tags?.map(...)` or similar).

### Visual Design Guidelines

All new components follow the existing site design system:

**Design tokens (CSS variables):**
- `--background`: #0a0a0a (page bg)
- `--foreground`: #ffffff (primary text)
- `--muted`: #888888 (secondary text, descriptions)
- `--border`: #222222 (dividers)
- `--card`: #161616 (card/surface bg)
- `--label-project`: #60a5fa (blue accent for project elements)
- `--label-work`: #4ade80 (green accent for work cross-links)

**Typography patterns to follow:**
- Page titles: `text-4xl font-bold tracking-tight` (matches existing work/project detail pages)
- Subtitles: `text-lg text-[var(--muted)]` (matches existing project description)
- Small labels/meta: `text-xs uppercase tracking-widest text-[var(--muted)]` (matches homepage section headers)
- Body text in MDX: `prose-invert` class handles this automatically

**Spacing patterns:**
- Detail page container: `max-w-4xl mx-auto px-6 py-16`
- Content gap after header: `mt-10` before MDX body
- Section spacing: `mt-8` / `mb-4` (matches MDX h2 spacing)

**Interaction patterns:**
- Links: `text-white underline underline-offset-4 hover:text-[var(--label-project)] transition-colors`
- No button components exist — the site uses text links throughout

### New ProjectHero Component (`src/components/project-hero.tsx`)

Accepts the full `ProjectFrontmatter` object as props. Renders:

- **Context line** (top, above title): `text-xs uppercase tracking-widest text-[var(--muted)]` — "Part of my work at" followed by a link to `/work/{parentWork}` styled as `text-[var(--label-work)] hover:underline`. Only renders if `parentWork` is set.
- **Title**: `text-4xl font-bold tracking-tight` (matches existing page titles)
- **Subtitle** (description): `text-lg text-[var(--muted)] mt-2` (matches existing project description style)
- **External link**: `text-sm text-[var(--label-project)] hover:underline mt-2` — rendered as "Visit {domain} →". Only renders if `externalUrl` is set.
- **Metrics bar**: `grid grid-cols-2 md:grid-cols-3 gap-3 mt-8`. Each metric card: `bg-[var(--card)] rounded-lg p-4 text-center` with value as `text-2xl font-bold text-[var(--label-project)]` and label as `text-xs text-[var(--muted)] mt-1`. Only renders if `metrics` is set and non-empty. If 2 metrics, use `grid-cols-2` only.

No cover image in ProjectHero — the new project pages lead with text and metrics, not imagery. Images are embedded in the MDX body where they serve the narrative.

### Project Footer Component (`src/components/project-footer.tsx`)

Accepts `relatedProject`, `relatedProjectTitle` as props. Renders:

- Container: `border-t border-[var(--border)] mt-16 pt-8 flex items-center justify-between` (matches site footer pattern)
- "← Back to Projects" link: `text-sm text-[var(--muted)] hover:text-white transition-colors`
- "Read about {relatedProjectTitle} →" link: `text-sm text-[var(--label-project)] hover:underline` — only renders if `relatedProject` is set

### Project Detail Page

The existing `/projects/[slug]/page.tsx` is updated:
- If `metrics` or `parentWork` exist in frontmatter: render `ProjectHero` (replaces the current cover image + title + description + tags block)
- If neither exists: render the current layout (cover image, title, description, tags) — CallFrame is untouched
- MDX body renders in the middle regardless
- `ProjectFooter` renders at the bottom for all projects (it gracefully shows only "Back to Projects" when no related project is set)
- The `tags` rendering is guarded: `frontmatter.tags?.map(...)` to handle new projects that omit tags

### URL Structure / Slugs

New project content directories and their resulting URLs:

| Project | Directory | URL |
|---------|-----------|-----|
| Scan of the Month | `content/projects/scan-of-the-month/` | `/projects/scan-of-the-month` |
| 3D-A1000 | `content/projects/3d-a1000/` | `/projects/3d-a1000` |
| Lumafield Launch | `content/projects/lumafield-launch/` | `/projects/lumafield-launch` |
| Patents | `content/projects/patents/` | `/projects/patents` |
| CallFrame | `content/projects/callframe/` (existing) | `/projects/callframe` |

### Homepage Curation

The current `getFeaturedItems()` in `src/app/page.tsx` assembles items as:
1. First work item (large card)
2. Projects + photography interleaved (projects first, then photography)
3. Remaining work items

Current result: `[Lumafield, CallFrame, Photo1, Photo2, Cognex]` (5 items)

To achieve the desired curated set of 5:

- **Work items:** No change. Lumafield (order: 1) and Cognex (order: 2) remain featured.
- **New projects:** Set `featured: true` only on Scan of the Month and CallFrame. The other 3 projects have `featured: false`.
- **Photography:** Reduce `.slice(0, 2)` to `.slice(0, 1)` in the homepage logic.

Resulting order: `[Lumafield (large), SOTM, CallFrame, Photography, Cognex]` — 5 items. The interleave logic (projects sorted before photography) handles this correctly without rewriting the algorithm. If the project sort order needs adjustment (SOTM before CallFrame), set SOTM's `date` field to be more recent than CallFrame's, since projects sort by date descending.

## Project Pages

### Shared Structure

All project pages follow a consistent layout:

- **Hero block:** Title, description (as subtitle), context line linking back to `parentWork`, external link if `externalUrl` is set
- **Metrics bar:** Up to 3 stats from `metrics` frontmatter, displayed prominently. If fewer than 3 metrics are available, render what exists.
- **Story sections:** 2-5 narrative sections in MDX body, each 2-4 short paragraphs
- **Footer:** `ProjectFooter` component — "Back to Projects" + related project link from `relatedProject`

Each project page is fully self-contained — a cold visitor with no context can understand what they are reading.

### Scan of the Month

**Subtitle:** "A content-led growth engine I built from scratch that became Lumafield's marketing cornerstone"
**Context line:** "Part of my work at Lumafield" (links to Lumafield work page)
**External link:** scanofthemonth.com

**Metrics bar:**
- #1 on Hacker News
- 4,000+ email signups
- Financial Times partnership

**Sections:**
1. **The Origin** — The idea, why Drew started it as a solo project within Lumafield, what made CT scan content inherently compelling.
2. **The Content** — What a "scan" looked like, how they were produced, what made them shareable. 2-3 embedded CT scan images.
3. **The Growth** — The Hacker News moment, traffic explosion, email signup curve. Screenshot of HN front page or analytics if available.
4. **The Business Impact** — Transition from "Drew's project" to company-wide marketing strategy. Lead generation, engineering hiring pipeline, brand awareness.
5. **The FT Partnership** — How the Financial Times collaboration came about and what it meant for Lumafield's credibility.

**Footer cross-link:** "Read about the Lumafield Launch"

### 3D-A1000

**Subtitle:** "Designed a 3D vision camera, then launched it into a new market — $0 to $10M"
**Context line:** "Part of my work at Cognex" (links to Cognex work page)

**Metrics bar:**
- $0 to $10M in revenue
- 3D vision camera designed end-to-end
- New market entry for Cognex

**Sections:**
1. **The Engineering** — What the camera was, optics and algorithm challenges, what made it technically novel. Cross-links to Patents page. Product photos or technical diagrams if available.
2. **The Product Pivot** — How the product moved from engineering into a market opportunity. The transition from "I designed this" to "I'm going to sell this."
3. **The Launch & Scale** — Go-to-market strategy, customer discovery, scaling to $10M.
4. **What I Learned** — Bridge from engineer to product leader. The "why this matters to my career arc" takeaway for hiring managers.

**Footer cross-link:** "See my Patents"

### The Lumafield Launch

**Subtitle:** "From stealth to public — building the entire go-to-market from scratch"
**Context line:** "Part of my work at Lumafield" (links to Lumafield work page)

**Metrics bar:**
- Stealth to Public launch campaign
- Full GTM built from scratch
- (Third metric TBD — Drew to provide tradeshow results or lead gen number. If unavailable at implementation time, render 2 metrics only — the component handles this gracefully.)

**Sections:**
1. **The Opportunity** — What Lumafield was, why Drew joined, the challenge on day one.
2. **The Pre-Launch Launch** — Month one: spun up the first website under the stealth brand "Meter" to give sales collateral and a shot at inbounds. Then scanofthemonth.com as an organic hype and lead-gen engine before the product was even public. Links to Scan of the Month project page.
3. **Building the GTM** — Positioning, messaging, launch strategy, customer pipeline. The full breadth of what was built.
4. **The Launch** — The public moment in April. How it landed.
5. **The Launch Touchdown** — The flagship tradeshow in September as the bookend. The launch framed as a 6-month campaign of iteration, not a single event. Reflection on what the GTM approach produced.

**Footer cross-link:** "Read about Scan of the Month"

### Patents

**Subtitle:** "4 U.S. patents in optics and 3D algorithms"
**Context line:** "From my engineering work at Cognex" (links to Cognex work page)

**Sections:**
1. **Overview** — 3-4 sentences about the domain: industrial 3D vision, why these problems were hard, what it means to have patented solutions in this space. Sets context for non-technical readers.
2. **The Patents** — Each patent gets a card:
   - Patent title
   - Patent number (linked to USPTO or Google Patents)
   - Plain-English summary (2-3 sentences) of what it does and why it matters, written for a smart generalist
   - Connection to the work, e.g., cross-link to 3D-A1000

**Footer cross-link:** "Read about the 3D-A1000"

## Work Page Changes

This is a content-editing task. The existing MDX files are rewritten (not incrementally edited) to become role narratives with cross-links. The frontmatter and page template for Work pages do not change.

### Lumafield Work Page (`content/work/lumafield/index.mdx`)

**Replace the current MDX body** with a role-focused narrative. The new content:
- Keeps the overall arc: stealth startup to scaled product org
- Keeps sections on Neptune platform, team scaling, and role growth
- Replaces the deep Scan of the Month section with 2-3 sentences + link: "Read the full Scan of the Month story →" pointing to `/projects/scan-of-the-month`
- Replaces the deep launch narrative with 2-3 sentences + link: "Read about the Lumafield Launch →" pointing to `/projects/lumafield-launch`
- Frontmatter unchanged

### Cognex Work Page (`content/work/cognex/index.mdx`)

**Replace the current MDX body** with a role-focused narrative. The new content:
- Keeps the overall arc: nine-year career from engineer to product leader
- Keeps sections on opto-mechanical engineering background, NPI management
- Replaces the deep 3D-A1000 section with 2-3 sentences + link pointing to `/projects/3d-a1000`
- Replaces the deep patents section with 2-3 sentences + link pointing to `/projects/patents`
- Frontmatter unchanged

## About Page Enrichment

**Replace the current `content/about.mdx` body entirely.** The About page component (`src/app/about/page.tsx`) is unchanged. The frontmatter `title: "About"` stays. The optional `photo` and `resumeLink` frontmatter fields may be added if Drew provides a profile photo and resume PDF — this is a content task, not a code change.

**Structure:**

1. **Opening** — Who Drew is now, in one punchy line with personality. Not a title recitation.

2. **The Career Arc** (2-3 paragraphs)
   - Started as an engineer who designed cameras and optics with his own hands at Cognex
   - Discovered that building the right thing mattered as much as building it right — the shift into product
   - Joined Lumafield, built everything from GTM to team to content strategy
   - Now building independently — CallFrame, this site, prototyping with AI-native tools

3. **The Personal Side** (1-2 paragraphs)
   - Photography and film — the creative dimension
   - Link to Photography section
   - Other authentic personal touches

4. **What I'm Looking For** (1 short paragraph)
   - Direct statement about the kind of role and company that excites Drew
   - Honest and specific, not generic

**Tone:** First person, conversational but not casual. Confident and reflective.

## Homepage Curation

5 cards, hand-picked:

1. **Lumafield** (Work) — most recent and senior role
2. **Scan of the Month** (Project) — most viral/impressive single project
3. **Cognex** (Work) — engineering credibility
4. **CallFrame** (Project) — actively building right now
5. **Photography** — personal/creative dimension

The 3D-A1000, Lumafield Launch, and Patents are one click away on the Projects listing page.

## Projects Listing Page

Simple grid with cards for all 5 projects. Each card: title, one-line description, thumbnail if available. No filtering needed for 5 items.

## Cross-Linking Strategy

Links go both directions:
- **Work to Project:** "Read the full story" links within role narratives
- **Project to Work:** "Part of my work at [Company]" context lines in hero blocks
- **Project to Project:** Related project links in footers (SOTM <-> Launch, 3D-A1000 <-> Patents)

## Assets Needed

For implementation, the following assets should be sourced:
- CT scan imagery from Scan of the Month (2-3 images)
- Screenshots of scanofthemonth.com
- HN front page screenshot or analytics charts
- 3D-A1000 product photos or technical diagrams
- Patent numbers and titles for all 4 patents

These are not blockers — pages can launch with placeholder imagery and be enriched as assets are gathered.

## What Is NOT Changing

- Photography section structure
- CallFrame project page (existing)
- Co-ops work page
- Top-level navigation labels
- Overall site visual design and styling
