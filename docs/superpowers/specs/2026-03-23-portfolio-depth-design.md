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

## Project Pages

### Shared Structure

All project pages follow a consistent layout:

- **Hero block:** Title, subtitle (one-line value prop), context line linking back to the parent Work page, external link if applicable
- **Metrics bar:** 3 key stats displayed prominently
- **Story sections:** 2-5 narrative sections, each 2-4 short paragraphs
- **Footer:** Back to Projects, related project cross-link

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
- (Third metric TBD — tradeshow results or lead gen numbers)

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

### Lumafield Work Page

Slim down. Remove deep project detail for Scan of the Month and the Launch. Replace with:
- 2-3 sentences describing each project in the context of the role
- Clear link: "Read the full Scan of the Month story" / "Read about the Lumafield Launch"

The role narrative stays intact: what Drew was hired to do, how he grew, what he owned. The page reads like a strong role summary; the project pages handle the depth.

### Cognex Work Page

Same treatment. Remove deep project detail for 3D-A1000 and Patents. Replace with brief mentions and cross-links.

## About Page Enrichment

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
