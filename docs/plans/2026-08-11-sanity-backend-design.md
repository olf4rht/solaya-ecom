# Sanity CMS Backend — Design

## Goal

Replace hardcoded industry/product data with Sanity CMS. Large files (.ply models, videos) stored in Cloudflare R2 via custom Studio upload component. Sanity Studio embedded at `/studio`.

## Schema

### Industry

| Field | Type | Notes |
|-------|------|-------|
| title | string | e.g. "Fashion & Apparel" |
| slug | slug (from title) | URL path segment |
| brand | string | e.g. "Gucci" |
| homepageVideo | R2 file | 360 video for homepage carousel |
| homepageFallbackImage | Sanity image | Fallback if no video |
| products | array of references -> Product | Ordered list |
| order | number | Manual sort for homepage |

### Product

| Field | Type | Notes |
|-------|------|-------|
| title | string | e.g. "Kandee - Bianco Sandals" |
| slug | slug (from title) | URL path segment |
| brand | string | |
| description | text | |
| category | string | |
| coverImage | Sanity image | Grid thumbnails |
| plyFile | R2 file | 3D model, auto-included as first media on product page |
| media | array of (Sanity image \| R2 video) | Product page gallery |
| scans | number | |
| hasIntegrations | boolean | |
| hasExtensions | boolean | |
| commercialUsage | boolean | |

## R2 Upload Component

Custom Sanity Studio input component:

1. Drag-and-drop zone in Studio UI
2. Uploads to R2 via Next.js API route (`/api/r2-upload`)
3. Stores R2 URL + filename + file size as an object in Sanity

API route uses S3-compatible `@aws-sdk/client-s3` with R2 credentials from env vars.

## Architecture

```
Sanity Studio (/studio)
    -> custom input component
Next.js API route (/api/r2-upload)
    -> S3 PutObject
Cloudflare R2 bucket
    -> public URL

Frontend pages -> GROQ queries via next-sanity -> render with R2 URLs
```

## Data Flow

- **Homepage**: Fetch industries ordered by `order`. Use `homepageVideo` for IndustryShowcase.
- **Industry page** (`/industry/[slug]`): Fetch industry + products. Render grid with `coverImage` + `plyFile`.
- **Product page** (`/products/[handle]`): Fetch product. Show 3D viewer from `plyFile`, then `media` gallery.

## Frontend Changes

- Remove `src/lib/industries.ts` and `src/lib/mock-data.ts` (replace with Sanity queries)
- Add `sanity.config.ts`, `sanity.cli.ts`
- Add schemas under `src/sanity/schemas/`
- Add Sanity client + GROQ queries in `src/sanity/lib/`
- Add `/studio` route via `next-sanity/studio`
- Add `/api/r2-upload` API route
- Update all page components to fetch from Sanity
