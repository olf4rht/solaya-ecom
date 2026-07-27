# Industry Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create individual industry pages at `/industry/[slug]` with a 3x2 grid of .ply model viewers, industry info header, mini video carousel, and footer.

**Architecture:** Extract shared industry data into a constants file. Create a dynamic Next.js route `src/app/industry/[slug]/page.tsx` with an `IndustryPage` client component. Each page renders 6 GaussianSplatViewer instances in a 3-column grid, a mini video carousel in the top-right, and industry info top-left. Wire up navbar and showcase to link to these pages.

**Tech Stack:** Next.js App Router, GaussianSplatViewer (existing), shared industry constants

---

### Task 1: Extract shared industry data

**Files:**
- Create: `src/lib/industries.ts`
- Modify: `src/components/IndustryShowcase.tsx` (import from shared)
- Modify: `src/components/Navbar.tsx` (import from shared)

Extract industry data (name, slug, brand, videoUrl, image) into a shared constants file. Add `slug` field to each industry. Update IndustryShowcase and Navbar to import from it.

### Task 2: Create industry page route and component

**Files:**
- Create: `src/app/industry/[slug]/page.tsx`

Layout:
- Top-left: "Industry 01 / 07" + industry name
- Top-right: Mini horizontal row of video thumbnails (~50px), current highlighted with border, others faded. Each links to its industry page.
- Main: 3-column CSS grid, 2 rows, 6 cells. Each cell contains a GaussianSplatViewer with `/assets/models/pink-sneaker.ply`. Cells separated by 1px `#e5e5e0` borders.
- Footer: "Terms of Service", "Contact", "LinkedIn" at bottom-left
- Full-page scrollable (not vh-locked like showcase)

### Task 3: Wire up navigation

**Files:**
- Modify: `src/components/Navbar.tsx` — industry dropdown links to `/industry/[slug]`
- Modify: `src/components/IndustryShowcase.tsx` — clicking an expanded item navigates to `/industry/[slug]`

### Task 4: Verify and commit

Build, test on localhost, push.
