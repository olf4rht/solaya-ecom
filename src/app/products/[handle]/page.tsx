import { sanityClient } from "@/sanity/lib/client";
import { productBySlugQuery, allProductsQuery } from "@/sanity/lib/queries";
import type { SanityProduct, SanityProductSummary } from "@/sanity/types";
import ProductPageClient from "./ProductPageClient";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const [product, allProducts]: [SanityProduct | null, SanityProductSummary[]] = await Promise.all([
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
