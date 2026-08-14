import { sanityClient } from "@/sanity/lib/client";
import { productBySlugQuery, allProductsQuery, allIndustriesQuery } from "@/sanity/lib/queries";
import type { SanityProduct, SanityProductSummary, SanityIndustry } from "@/sanity/types";
import ProductPageClient from "./ProductPageClient";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const [product, allProducts, industries]: [SanityProduct | null, SanityProductSummary[], SanityIndustry[]] = await Promise.all([
    sanityClient.fetch(productBySlugQuery, { slug: handle }),
    sanityClient.fetch(allProductsQuery),
    sanityClient.fetch(allIndustriesQuery),
  ]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[14px] text-content-secondary">Product not found.</p>
      </div>
    );
  }

  return <ProductPageClient product={product} allProducts={allProducts} industries={industries} />;
}
