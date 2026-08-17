export interface SanityR2File {
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
}

export interface SanityProductSummary {
  _id: string;
  title: string;
  slug: string;
  brand?: string;
  coverImage?: SanityImageRef;
  plyFile?: SanityR2File;
  blockBottom?: boolean;
  initialYaw?: number;
  initialPitch?: number;
}

export interface SanityIndustry {
  _id: string;
  title: string;
  slug: string;
  brand: string;
  homepageVideo?: SanityR2File;
  homepageFallbackImage?: SanityImageRef;
  order: number;
  products: SanityProductSummary[];
}

export interface SanityProduct {
  _id: string;
  title: string;
  slug: string;
  brand?: string;
  description?: string;
  category?: string;
  coverImage?: SanityImageRef;
  plyFile?: SanityR2File;
  blockBottom?: boolean;
  initialYaw?: number;
  initialPitch?: number;
  media?: SanityMediaItem[];
  scans?: number;
  hasIntegrations?: boolean;
  hasExtensions?: boolean;
  commercialUsage?: boolean;
}

// Sanity image reference (opaque — pass to urlFor())
export type SanityImageRef = Record<string, unknown>;

// Media array items can be either a Sanity image or an R2 file
export type SanityMediaItem =
  | (SanityImageRef & { _type: "image" })
  | (SanityR2File & { _type: "r2File" });
