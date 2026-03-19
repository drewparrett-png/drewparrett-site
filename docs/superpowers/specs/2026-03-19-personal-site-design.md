# drewparrett.com — Personal Portfolio Site Design

## Overview

Rebuild drewparrett.com from Adobe Portfolio into a self-hosted personal brand hub using Next.js. The site serves as a professional portfolio, creative photography showcase, and project gallery — optimized for Drew's current job search while reflecting his full range of work.

## Goals

- Replace constrained Adobe Portfolio with a flexible, self-owned site
- Present professional experience as narrative case studies, not a resume
- Showcase photography organized by collection
- Highlight pet projects and side work
- Keep costs near zero and maintenance minimal

## Tech Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Framework | Next.js 15 (App Router) | Full control, great image optimization, Vercel-native |
| Content | MDX with frontmatter | Markdown simplicity + React component flexibility |
| Styling | Tailwind CSS | Rapid styling, dark theme, utility-first |
| Images | Local in repo | No external service, optimized by Next.js Image |
| Hosting | Vercel (free tier) | Deploy on push, zero config, free |
| Domain | drewparrett.com (transfer to Vercel DNS) | Already owned |

## Visual Design

- **Theme**: Dark only (#0a0a0a background, white/gray text)
- **Typography**: System sans-serif, bold headings with tight letter-spacing
- **Aesthetic**: Bold, editorial, photography-forward — images pop against dark background
- **Navigation**: Sticky top bar with "DP" logo-mark left, page links right

## Site Structure

### Pages

1. **Home** (`/`)
2. **Work** (`/work`) → detail pages (`/work/[slug]`)
3. **Projects** (`/projects`) → detail pages (`/projects/[slug]`)
4. **Photography** (`/photography`) → collection pages (`/photography/[collection]`)
5. **About** (`/about`)

### Content Directory

```
content/
  work/
    lumafield/
      index.mdx             # Case study with frontmatter + narrative
      cover.jpg
      images/               # Supporting photos for the case study
    cognex/
      index.mdx
      cover.jpg
      images/
    co-ops/
      index.mdx             # Combined page for early career co-ops & internships
      images/               # Any photos from these roles (optional)
  projects/
    some-project/
      index.mdx             # Project write-up
      cover.jpg
      images/               # Screenshots, diagrams, etc.
  photography/
    landscapes/
      index.mdx             # Collection metadata (title, description, cover)
      images/               # Exported from Lightroom (2000-3000px wide)
        photo-01.jpg
        photo-02.jpg
    urban/
      index.mdx
      images/
    events/
      index.mdx
      images/
    film/
      index.mdx
      images/
  about.mdx
```

### MDX Frontmatter Schema

**Work entries:**
```yaml
---
title: "Lumafield"
subtitle: "Scaling CT Inspection"
role: "VP of Product & Engineering"
timeframe: "2021–2026"
cover: "./cover.jpg"
featured: true
order: 1
---
```

The co-ops page uses the same schema but covers multiple roles in the MDX body:
```yaml
---
title: "Early Career"
subtitle: "Co-ops & Internships"
role: "Mechanical Engineering Co-ops & Operations Intern"
timeframe: "2008–2011"
cover: "./cover.jpg"
featured: false
order: 3
---
```
Body content uses headings for each role: Philips Color Kinetics (2011), L-3 Communications (2010), Ocular Therapeutix (2009), Hitchiner Manufacturing (2008).

**Project entries:**
```yaml
---
title: "Project Name"
description: "One-line summary"
cover: "./cover.jpg"
date: "2025-01-15"
tags: ["hardware", "python"]
featured: true
---
```

**Photography collections:**
```yaml
---
title: "Landscapes"
description: "Collection description"
cover: "./images/hero.jpg"
date: "2025-06-01"
---
```

Photo count is computed at build time by scanning the collection's `images/` directory. No manual `count` field needed.

**About page:**
```yaml
---
title: "About"
photo: "./drew.jpg"
resumeLink: "/drew-parrett-resume.pdf"  # optional, stored in public/
---
```

## Page Designs

### Home

1. **Sticky nav**: "DP" left, "Work · Projects · Photography · About" right
2. **Hero section**: Large bold heading ("Engineering Leader & Maker"), subtitle paragraph, no image — text-only
3. **Mixed content grid**: Curated selection of work, projects, and photos in an asymmetric grid. Large featured item left (spanning 2 rows), smaller items right. Each card has:
   - Cover image
   - Color-coded category label (green for Work, blue for Projects, purple for Photography)
   - Title and brief description
   - Links to the detail page

The homepage grid shows items with `featured: true` in frontmatter. Items are sorted by `date` (projects, photography) or `order` (work) within their type, then interleaved: the highest-priority work item takes the large left slot, remaining featured items fill the smaller right slots.

### Work (`/work`)

**Listing page**: Cards for each role/company, ordered by `order` field. Each card shows cover image, company name, role, timeframe.

**Detail page** (`/work/[slug]`): Case-study layout:
- Hero image (full-width)
- Title, role, timeframe
- Narrative body rendered from MDX — supports inline images, side-by-side photo layouts, pull quotes
- Key outcomes section (optional, via frontmatter or MDX)

### Projects (`/projects`)

**Listing page**: Card grid similar to photography collections. Each card shows cover image, title, description, date, tags.

**Detail page** (`/projects/[slug]`): Full MDX page — can include screenshots, embedded demos (iframes), code blocks, photo galleries. Maximum flexibility for showcasing different types of projects.

### Photography (`/photography`)

**Listing page**: Large collection cover cards in a 2-column grid. Each card shows:
- Cover image (fills the card)
- Collection title and photo count overlaid at bottom with gradient

**Collection page** (`/photography/[collection]`):
- Collection title and description at top
- Masonry-style image grid
- Click any image to open a lightbox (full-screen overlay with prev/next navigation)
- Images loaded from the collection's `images/` directory

### About (`/about`)

- Photo of Drew (optional)
- Bio text rendered from MDX
- Links: email, LinkedIn, Instagram
- Optional: downloadable resume link

## Components to Build

### Layout Components
- `Nav` — sticky top navigation with DP mark + page links, active state indicator
- `Footer` — minimal: copyright line ("© 2026 Drew Parrett") + icon links to LinkedIn, Instagram, email
- `PageLayout` — standard page wrapper with max-width container

### Content Components
- `ContentCard` — reusable card for work/project/photo collection entries (cover image, label, title, description)
- `HomepageGrid` — asymmetric grid layout for the homepage featured content
- `MDXComponents` — custom component overrides for MDX rendering (images, links, code blocks)

### Photography Components
- `CollectionCard` — cover image card with title/count overlay for photography listing
- `MasonryGrid` — responsive masonry layout using CSS columns (3 cols desktop, 2 tablet, 1 mobile). Pure CSS, no JS library needed.
- `Lightbox` — full-screen image viewer with prev/next, close, keyboard navigation (Escape, arrow keys). Use `yet-another-react-lightbox` for proven UX and small bundle size.

### MDX Authoring Components
- `ImageGallery` — grid of images within an MDX post (for work case studies)
- `SideBySide` — two images or content blocks side by side
- `Callout` — highlighted text block for key metrics or outcomes

## Image Strategy

- **Source**: Export from Lightroom at 2000-3000px on the long edge, JPEG quality 80-85
- **Storage**: Committed to the git repo alongside their content
- **Optimization**: Next.js Image component handles responsive sizing, WebP conversion, and lazy loading at build time
- **Repo size**: For a curated portfolio (not an exhaustive archive), this is manageable. If the repo exceeds ~500MB, consider moving to external hosting later.

## Content Workflow

1. Write an MDX file in the appropriate `content/` subdirectory
2. Add images to the same directory or a co-located `images/` folder
3. Push to `main` branch
4. Vercel auto-deploys in ~30 seconds

For photography: Export collection from Lightroom → drop images in `content/photography/[collection]/images/` → update `index.mdx` if needed → push.

## What's Explicitly Out of Scope

- No CMS / database / auth
- No light mode / theme toggle
- No search functionality
- No comments system
- No analytics (can add Vercel Analytics later, it's one click)
- No contact form — links to email/LinkedIn/Instagram only
- No RSS feed (can add later)
- No SEO meta tags beyond basics (title, description, OG image)
- No Lightroom API integration — manual export workflow

## Responsive Behavior

All grid layouts collapse on smaller screens:
- **Homepage grid**: 1 column on mobile (stacked cards), 2 columns on tablet, full asymmetric grid on desktop
- **Photography collections**: 1 column on mobile, 2 columns on tablet+
- **Masonry grid**: 1 column mobile, 2 columns tablet, 3 columns desktop
- **Nav**: Collapses to hamburger menu on mobile

Breakpoints follow Tailwind defaults: `sm` (640px), `md` (768px), `lg` (1024px).

## Error Handling

- **404 page**: Custom dark-themed 404 with nav and a link back to home
- **Invalid slugs**: Next.js `notFound()` in dynamic route handlers when content file doesn't exist

## Deployment

1. Initialize git repo in project directory
2. Push to GitHub (private or public)
3. Connect repo to Vercel
4. Transfer/point drewparrett.com to Vercel
5. Auto-deploys on every push to `main`
