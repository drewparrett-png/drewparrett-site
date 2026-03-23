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
  externalUrl?: string;       // e.g., "https://scanofthemonth.com"
  metrics?: Array<{ value: string; label: string }>;  // Up to 3
  relatedProject?: string;    // Slug of related project for footer cross-link
  order?: number;             // For controlling listing page order
}
```

CallFrame continues to work unchanged — the new fields are all optional.

### New ProjectHero Component

A new `ProjectHero` component renders the hero block, metrics bar, and context line. It reads from frontmatter. If `metrics` is absent, the metrics bar is not rendered (graceful fallback for CallFrame and any project without metrics). If `parentWork` is absent, the context line is not rendered.

### Project Footer Component

A new `ProjectFooter` component renders "Back to Projects" and the related project link. It reads `relatedProject` from frontmatter to generate the cross-link. If absent, only "Back to Projects" renders.

### Project Detail Page

The existing `/projects/[slug]/page.tsx` is updated to use `ProjectHero` and `ProjectFooter` when the extended fields are present. The MDX body renders between them. The page gracefully falls back to the current layout for projects without the new fields (i.e., CallFrame is untouched).

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

The current homepage uses `featured: true` flags and sorts work by `order`, projects by date, and takes top 2 photography items. To achieve the desired 5-item curated set:

- **Work items:** Already use `featured: true` + `order` field. Lumafield (order: 1) and Cognex (order: 2) are featured. No change needed.
- **New projects:** Set `featured: true` only on Scan of the Month and CallFrame. The other 3 projects (3D-A1000, Launch, Patents) have `featured: false` — they appear on the Projects listing page but not the homepage.
- **Photography:** Current logic takes top 2 by date. Reduce to top 1 to keep the homepage at 5 items total (2 work + 2 projects + 1 photography).

This achieves the curated set through the existing frontmatter flag mechanism without hardcoding.

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

**Replace the current `content/about.mdx` body entirely.** The frontmatter (title, photo, resumeLink) and the About page component (`src/app/about/page.tsx`) are unchanged. Only the MDX content body is rewritten.

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
