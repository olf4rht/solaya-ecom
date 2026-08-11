# Sanity CMS Backend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace hardcoded industry/product data with Sanity CMS, with large file uploads to Cloudflare R2 via custom Studio component.

**Architecture:** Sanity Studio embedded at `/studio` in the Next.js app. Schemas for Industry and Product with references. Custom input component uploads .ply and video files to Cloudflare R2 via a Next.js API route, storing the resulting URL in Sanity. Frontend pages fetch data via GROQ queries through `next-sanity`.

**Tech Stack:** `sanity`, `next-sanity`, `@sanity/image-url`, `@aws-sdk/client-s3` (for R2), Cloudflare R2 bucket

---

### Task 1: Install Dependencies & Create Sanity Project

**Files:**
- Modify: `package.json`
- Create: `src/sanity/env.ts`
- Create: `sanity.config.ts`
- Create: `sanity.cli.ts`

**Step 1: Install Sanity packages**

```bash
npm install sanity next-sanity @sanity/image-url @sanity/vision @aws-sdk/client-s3
```

**Step 2: Create a Sanity project**

Go to [sanity.io/manage](https://www.sanity.io/manage) and create a new project called "Solaya Ecom". Note the **Project ID**. Add `http://localhost:3000` and your Cloudflare URL as CORS origins (with credentials allowed).

**Step 3: Create `src/sanity/env.ts`**

```ts
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-11";
```

**Step 4: Create `sanity.config.ts`** (project root)

```ts
"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemas";
import { projectId, dataset } from "@/sanity/env";

export default defineConfig({
  name: "solaya",
  title: "Solaya CMS",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
```

**Step 5: Create `sanity.cli.ts`** (project root)

```ts
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: "production",
  },
});
```

**Step 6: Create `.env.local`** with Sanity + R2 credentials

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-08-11
SANITY_API_TOKEN=<create-a-token-in-sanity-manage>

R2_ACCOUNT_ID=<cloudflare-account-id>
R2_ACCESS_KEY_ID=<r2-api-token-access-key>
R2_SECRET_ACCESS_KEY=<r2-api-token-secret>
R2_BUCKET_NAME=solaya-assets
R2_PUBLIC_URL=<your-r2-public-bucket-url>
```

**Step 7: Commit**

```bash
git add sanity.config.ts sanity.cli.ts src/sanity/env.ts package.json package-lock.json
# Do NOT commit .env.local
git commit -m "feat: install Sanity and R2 dependencies, add config files"
```

---

### Task 2: Create Sanity Schemas

**Files:**
- Create: `src/sanity/schemas/index.ts`
- Create: `src/sanity/schemas/r2File.ts`
- Create: `src/sanity/schemas/industry.ts`
- Create: `src/sanity/schemas/product.ts`

**Step 1: Create the R2 file object schema** (`src/sanity/schemas/r2File.ts`)

This is a reusable object type for any file stored in R2.

```ts
import { defineType } from "sanity";

export const r2File = defineType({
  name: "r2File",
  title: "R2 File",
  type: "object",
  fields: [
    {
      name: "url",
      title: "File URL",
      type: "string",
      readOnly: true,
    },
    {
      name: "fileName",
      title: "File Name",
      type: "string",
      readOnly: true,
    },
    {
      name: "fileSize",
      title: "File Size (bytes)",
      type: "number",
      readOnly: true,
    },
    {
      name: "contentType",
      title: "Content Type",
      type: "string",
      readOnly: true,
    },
  ],
});
```

**Step 2: Create the Product schema** (`src/sanity/schemas/product.ts`)

```ts
import { defineType, defineField } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      description: "Used in product grids and thumbnails",
    }),
    defineField({
      name: "plyFile",
      title: "3D Model (.ply)",
      type: "r2File",
      description: "Gaussian Splat .ply file — uploaded to R2",
    }),
    defineField({
      name: "media",
      title: "Media Gallery",
      type: "array",
      description: "Images and videos for the product page. The 3D model is automatically included.",
      of: [
        { type: "image", options: { hotspot: true } },
        {
          type: "r2File",
          title: "Video (R2)",
        },
      ],
    }),
    defineField({
      name: "scans",
      title: "Number of Scans",
      type: "number",
      initialValue: 5,
    }),
    defineField({
      name: "hasIntegrations",
      title: "Integrations Available",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "hasExtensions",
      title: "Extensions Included",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "commercialUsage",
      title: "Commercial Usage Available",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "brand", media: "coverImage" },
  },
});
```

**Step 3: Create the Industry schema** (`src/sanity/schemas/industry.ts`)

```ts
import { defineType, defineField } from "sanity";

export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
    }),
    defineField({
      name: "homepageVideo",
      title: "Homepage 360° Video",
      type: "r2File",
      description: "360° rotating video shown on the homepage carousel",
    }),
    defineField({
      name: "homepageFallbackImage",
      title: "Homepage Fallback Image",
      type: "image",
      options: { hotspot: true },
      description: "Shown if no video is provided",
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first on the homepage",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "brand", media: "homepageFallbackImage" },
  },
});
```

**Step 4: Create schema index** (`src/sanity/schemas/index.ts`)

```ts
import { industry } from "./industry";
import { product } from "./product";
import { r2File } from "./r2File";

export const schemaTypes = [industry, product, r2File];
```

**Step 5: Commit**

```bash
git add src/sanity/schemas/
git commit -m "feat: add Sanity schemas for Industry, Product, and R2File"
```

---

### Task 3: Add Sanity Studio Route

**Files:**
- Create: `src/app/studio/[[...tool]]/page.tsx`
- Create: `src/app/studio/[[...tool]]/layout.tsx`

**Step 1: Create the Studio layout** (`src/app/studio/[[...tool]]/layout.tsx`)

```tsx
export const metadata = {
  title: "Solaya CMS",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
```

**Step 2: Create the Studio page** (`src/app/studio/[[...tool]]/page.tsx`)

```tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

**Step 3: Verify Studio loads**

Run: `npm run dev`
Navigate to: `http://localhost:3000/studio`
Expected: Sanity Studio loads with Industry and Product document types in the sidebar.

**Step 4: Commit**

```bash
git add src/app/studio/
git commit -m "feat: add Sanity Studio route at /studio"
```

---

### Task 4: R2 Upload API Route

**Files:**
- Create: `src/app/api/r2-upload/route.ts`

**Step 1: Create the R2 bucket**

In Cloudflare dashboard: R2 > Create Bucket > Name: `solaya-assets`. Enable public access (Settings > Public Access > Allow Access). Note the public URL. Create an R2 API token with Object Read & Write permissions.

**Step 2: Create the upload route** (`src/app/api/r2-upload/route.ts`)

```ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique key: folder/timestamp-filename
    const folder = file.type.startsWith("video/") ? "videos" : "models";
    const key = `${folder}/${Date.now()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
    });
  } catch (error) {
    console.error("R2 upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
```

**Step 3: Test the upload route**

```bash
curl -X POST http://localhost:3000/api/r2-upload \
  -F "file=@public/assets/videos/01.mp4"
```
Expected: JSON response with `url`, `fileName`, `fileSize`, `contentType`.

**Step 4: Commit**

```bash
git add src/app/api/r2-upload/
git commit -m "feat: add R2 upload API route"
```

---

### Task 5: Custom R2 Upload Input Component for Sanity Studio

**Files:**
- Create: `src/sanity/components/R2FileInput.tsx`
- Modify: `src/sanity/schemas/r2File.ts`

**Step 1: Create the custom input component** (`src/sanity/components/R2FileInput.tsx`)

```tsx
import { useCallback, useState } from "react";
import { ObjectInputProps, set, unset } from "sanity";
import { Button, Card, Stack, Text, Flex, Spinner } from "@sanity/ui";

export default function R2FileInput(props: ObjectInputProps) {
  const { onChange, value } = props;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/r2-upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Upload failed: ${res.statusText}`);
        }

        const data = await res.json();

        onChange([
          set(data.url, ["url"]),
          set(data.fileName, ["fileName"]),
          set(data.fileSize, ["fileSize"]),
          set(data.contentType, ["contentType"]),
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleRemove = useCallback(() => {
    onChange(unset());
  }, [onChange]);

  const currentUrl = (value as Record<string, unknown>)?.url as string | undefined;
  const currentName = (value as Record<string, unknown>)?.fileName as string | undefined;
  const currentSize = (value as Record<string, unknown>)?.fileSize as number | undefined;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Stack space={3}>
      {currentUrl ? (
        <Card padding={3} radius={2} shadow={1} tone="positive">
          <Stack space={2}>
            <Text size={1} weight="semibold">
              {currentName || "Uploaded file"}
            </Text>
            {currentSize && (
              <Text size={1} muted>
                {formatSize(currentSize)}
              </Text>
            )}
            <Text size={0} muted style={{ wordBreak: "break-all" }}>
              {currentUrl}
            </Text>
            <Button text="Remove" tone="critical" mode="ghost" onClick={handleRemove} />
          </Stack>
        </Card>
      ) : (
        <Card
          padding={4}
          radius={2}
          shadow={1}
          tone={dragOver ? "primary" : "default"}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{ border: "2px dashed", borderColor: dragOver ? "#2276fc" : "#ccc", textAlign: "center" }}
        >
          <Stack space={3}>
            {uploading ? (
              <Flex justify="center" align="center" gap={2}>
                <Spinner />
                <Text size={1}>Uploading to R2...</Text>
              </Flex>
            ) : (
              <>
                <Text size={1} muted>
                  Drag & drop a file here, or
                </Text>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  id={`r2-upload-${props.id}`}
                />
                <Button
                  text="Choose File"
                  mode="ghost"
                  onClick={() =>
                    document.getElementById(`r2-upload-${props.id}`)?.click()
                  }
                />
              </>
            )}
          </Stack>
        </Card>
      )}
      {error && (
        <Card padding={2} radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      )}
    </Stack>
  );
}
```

**Step 2: Wire the component to the r2File schema**

Update `src/sanity/schemas/r2File.ts`:

```ts
import { defineType } from "sanity";
import R2FileInput from "../components/R2FileInput";

export const r2File = defineType({
  name: "r2File",
  title: "R2 File",
  type: "object",
  components: {
    input: R2FileInput,
  },
  fields: [
    {
      name: "url",
      title: "File URL",
      type: "string",
      readOnly: true,
    },
    {
      name: "fileName",
      title: "File Name",
      type: "string",
      readOnly: true,
    },
    {
      name: "fileSize",
      title: "File Size (bytes)",
      type: "number",
      readOnly: true,
    },
    {
      name: "contentType",
      title: "Content Type",
      type: "string",
      readOnly: true,
    },
  ],
});
```

**Step 3: Test in Studio**

Run: `npm run dev`
Navigate to: `http://localhost:3000/studio`
Create a new Product. The "3D Model (.ply)" field should show a drag-and-drop zone.
Upload a small test file and verify the R2 URL appears.

**Step 4: Commit**

```bash
git add src/sanity/components/ src/sanity/schemas/r2File.ts
git commit -m "feat: add R2 file upload component for Sanity Studio"
```

---

### Task 6: Sanity Client & GROQ Queries

**Files:**
- Create: `src/sanity/lib/client.ts`
- Create: `src/sanity/lib/image.ts`
- Create: `src/sanity/lib/queries.ts`

**Step 1: Create the Sanity client** (`src/sanity/lib/client.ts`)

```ts
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "../env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
```

**Step 2: Create the image URL builder** (`src/sanity/lib/image.ts`)

```ts
import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

**Step 3: Create GROQ queries** (`src/sanity/lib/queries.ts`)

```ts
import { groq } from "next-sanity";

// Homepage: all industries with video/image, ordered
export const allIndustriesQuery = groq`
  *[_type == "industry"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    brand,
    homepageVideo,
    homepageFallbackImage,
    order,
    "products": products[]-> {
      _id,
      title,
      "slug": slug.current,
      brand,
      coverImage,
      plyFile
    }
  }
`;

// Single industry page
export const industryBySlugQuery = groq`
  *[_type == "industry" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    brand,
    homepageVideo,
    homepageFallbackImage,
    "products": products[]-> {
      _id,
      title,
      "slug": slug.current,
      brand,
      coverImage,
      plyFile
    }
  }
`;

// Total industry count
export const industryCountQuery = groq`
  count(*[_type == "industry"])
`;

// Single product page
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    brand,
    description,
    category,
    coverImage,
    plyFile,
    media,
    scans,
    hasIntegrations,
    hasExtensions,
    commercialUsage
  }
`;

// All products (for the product grid)
export const allProductsQuery = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    coverImage
  }
`;
```

**Step 4: Commit**

```bash
git add src/sanity/lib/
git commit -m "feat: add Sanity client, image helper, and GROQ queries"
```

---

### Task 7: Update Homepage to Fetch from Sanity

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/IndustryShowcase.tsx`
- Modify: `src/components/Navbar.tsx`

**Step 1: Make `page.tsx` a server component that fetches data**

```tsx
import Navbar from "@/components/Navbar";
import IndustryShowcase from "@/components/IndustryShowcase";
import { sanityClient } from "@/sanity/lib/client";
import { allIndustriesQuery } from "@/sanity/lib/queries";

export default async function Home() {
  const industries = await sanityClient.fetch(allIndustriesQuery);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Navbar industries={industries} />
      <IndustryShowcase industries={industries} />
    </div>
  );
}
```

**Step 2: Update `IndustryShowcase.tsx` to accept industries as a prop**

Replace the import of `industries` from `@/lib/industries` with a prop:

```tsx
// At the top of the file, remove:
// import { industries, TOTAL_INDUSTRIES } from "@/lib/industries";

// Add a type for Sanity industry data
interface SanityR2File {
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
}

interface SanityIndustry {
  _id: string;
  title: string;
  slug: string;
  brand: string;
  homepageVideo?: SanityR2File;
  homepageFallbackImage?: unknown; // Sanity image reference
  order: number;
  products: SanityProduct[];
}

interface SanityProduct {
  _id: string;
  title: string;
  slug: string;
  brand: string;
  coverImage?: unknown;
  plyFile?: SanityR2File;
}

// Change the component signature:
export default function IndustryShowcase({ industries }: { industries: SanityIndustry[] }) {
  const TOTAL = industries.length;
  // ... rest uses `industries` from props instead of import
  // Replace `item.industry` with `item.title`
  // Replace `item.videoUrl` with `item.homepageVideo?.url`
  // Replace `item.image` with urlFor(item.homepageFallbackImage) usage
  // Replace `item.id` with `item._id`
  // Replace `item.slug` in Link with `item.slug` (already matches)
```

Key replacements in the JSX:
- `item.industry` → `item.title`
- `item.videoUrl` → `item.homepageVideo?.url`
- `item.image` → use `urlFor(item.homepageFallbackImage).url()` (import `urlFor` from `@/sanity/lib/image`)
- `industries[activeIndex].industry` → `industries[activeIndex].title`

**Step 3: Update `Navbar.tsx` to accept industries as a prop**

```tsx
// Remove: import { industries } from "@/lib/industries";
// Change signature:
export default function Navbar({ industries }: { industries: { _id: string; title: string; slug: string }[] }) {
  // Replace `item.industry` with `item.title`
  // Replace `item.id` with `item._id`
```

**Step 4: Verify homepage still renders**

Run: `npm run dev`
Navigate to: `http://localhost:3000`
Expected: Page loads. If no Sanity data yet, it should show an empty state or no industries. No crashes.

**Step 5: Commit**

```bash
git add src/app/page.tsx src/components/IndustryShowcase.tsx src/components/Navbar.tsx
git commit -m "feat: wire homepage to Sanity data"
```

---

### Task 8: Update Industry Page to Fetch from Sanity

**Files:**
- Modify: `src/app/industry/[slug]/page.tsx`

**Step 1: Convert to server component with data fetching**

The page currently uses `useParams` and `useState` (client component). Split it into a server component that fetches data and a client component for interactivity.

```tsx
import { sanityClient } from "@/sanity/lib/client";
import { industryBySlugQuery, industryCountQuery } from "@/sanity/lib/queries";
import IndustryPageClient from "./IndustryPageClient";

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [industry, totalCount] = await Promise.all([
    sanityClient.fetch(industryBySlugQuery, { slug }),
    sanityClient.fetch(industryCountQuery),
  ]);

  if (!industry) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[14px] text-content-secondary">Industry not found.</p>
      </div>
    );
  }

  return <IndustryPageClient industry={industry} totalCount={totalCount} />;
}
```

**Step 2: Create `IndustryPageClient.tsx`** in the same directory

Move the existing client-side logic (hover state, grid rendering) into this file. Replace hardcoded data references with Sanity data:
- `product.handle` → `product.slug`
- `product.name` → `product.title`
- Product cover image from `urlFor(product.coverImage)`
- PLY URL from `product.plyFile?.url`

**Step 3: Verify**

Navigate to: `http://localhost:3000/industry/fashion-and-apparel`
Expected: Page loads with Sanity data (or empty state if no data yet).

**Step 4: Commit**

```bash
git add src/app/industry/
git commit -m "feat: wire industry page to Sanity data"
```

---

### Task 9: Update Product Page to Fetch from Sanity

**Files:**
- Modify: `src/app/products/[handle]/page.tsx`

**Step 1: Convert to server/client split**

Server component fetches product data:

```tsx
import { sanityClient } from "@/sanity/lib/client";
import { productBySlugQuery, allProductsQuery } from "@/sanity/lib/queries";
import ProductPageClient from "./ProductPageClient";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const [product, allProducts] = await Promise.all([
    sanityClient.fetch(productBySlugQuery, { slug: handle }),
    sanityClient.fetch(allProductsQuery),
  ]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[14px] text-content-secondary">Product not found.</p>
      </div>
    );
  }

  return <ProductPageClient product={product} allProducts={allProducts} />;
}
```

**Step 2: Create `ProductPageClient.tsx`**

Move existing client logic. Key changes:
- Main image: first check `plyFile?.url` for 3D viewer, then iterate `media` array
- Thumbnails: build from `media` array (images use `urlFor()`, videos use R2 URL)
- Product grid at bottom: use `allProducts` with `urlFor(p.coverImage)` for images
- Link hrefs: `/products/${product.slug}`

**Step 3: Update `ProductGrid.tsx`**

Change from `MockProduct` to Sanity product type:

```tsx
interface SanityProductSummary {
  _id: string;
  title: string;
  slug: string;
  coverImage?: unknown;
}

export default function ProductGrid({ products }: { products: SanityProductSummary[] }) {
  // Use urlFor(product.coverImage) for Image src
  // Use product.slug for href
```

**Step 4: Verify**

Navigate to: `http://localhost:3000/products/kandee-bianco-sandals`
Expected: Page renders with Sanity data.

**Step 5: Commit**

```bash
git add src/app/products/ src/components/ProductGrid.tsx
git commit -m "feat: wire product page to Sanity data"
```

---

### Task 10: Remove Old Mock Data & Add R2 Env to Cloudflare

**Files:**
- Delete: `src/lib/industries.ts`
- Delete: `src/lib/mock-data.ts`
- Modify: `wrangler.jsonc`

**Step 1: Delete old data files**

```bash
rm src/lib/industries.ts src/lib/mock-data.ts
```

Verify no remaining imports reference these files:

```bash
grep -r "from.*@/lib/industries" src/
grep -r "from.*@/lib/mock-data" src/
```

Expected: No results.

**Step 2: Add R2 bucket binding to `wrangler.jsonc`**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "solaya-ecom",
  "compatibility_date": "2026-07-28",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "r2_buckets": [
    {
      "binding": "SOLAYA_ASSETS",
      "bucket_name": "solaya-assets"
    }
  ]
}
```

**Step 3: Set Cloudflare secrets for R2 + Sanity**

```bash
npx wrangler secret put R2_ACCOUNT_ID
npx wrangler secret put R2_ACCESS_KEY_ID
npx wrangler secret put R2_SECRET_ACCESS_KEY
npx wrangler secret put R2_BUCKET_NAME
npx wrangler secret put R2_PUBLIC_URL
npx wrangler secret put NEXT_PUBLIC_SANITY_PROJECT_ID
npx wrangler secret put NEXT_PUBLIC_SANITY_DATASET
```

**Step 4: Build, deploy, verify**

```bash
npm run deploy
```

Navigate to deployed URL. Verify Studio at `/studio`, homepage, industry pages, product pages all work.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: remove mock data, add R2 binding to wrangler config"
```

---

### Task 11: Seed Sanity with Existing Data

**Step 1: Open Studio at `/studio`**

Create the 7 industries and their products using the existing data from the old `industries.ts` and `mock-data.ts` as reference. Upload .ply files and videos through the R2 upload component.

This is a manual step — use Studio to populate content.

**Step 2: Final deploy & verify**

```bash
npm run deploy
```

Verify all pages render correctly with real Sanity data and R2 assets.
