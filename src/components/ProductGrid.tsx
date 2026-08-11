"use client";

import Link from "next/link";
import Image from "next/image";
import type { SanityProductSummary } from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";

interface ProductGridProps {
  products: SanityProductSummary[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const cells = products.map((product) => {
    const imgSrc = product.coverImage
      ? urlFor(product.coverImage).width(300).url()
      : "/assets/products/pink-sneaker.png";

    return (
      <Link
        key={product._id}
        href={`/products/${product.slug}`}
        className="group bg-bg-card border border-[#f0f0f0] h-[200px] sm:h-[240px] md:h-[286px] overflow-clip relative block -mr-px -mb-px"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[100px] sm:size-[120px] md:size-[145px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.15]">
          <Image
            src={imgSrc}
            alt={product.title}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        </div>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-40 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      </Link>
    );
  });

  return (
    <div id="products" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full bg-bg-primary">
      {cells}
    </div>
  );
}
