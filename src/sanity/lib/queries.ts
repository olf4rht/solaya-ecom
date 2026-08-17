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
      plyFile,
      blockBottom
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
    order,
    "products": products[]-> {
      _id,
      title,
      "slug": slug.current,
      brand,
      coverImage,
      plyFile,
      blockBottom
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
    blockBottom,
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
    brand,
    coverImage
  }
`;
