"use client";

import Link from "next/link";
import Image from "next/image";
import { MockProduct } from "@/lib/mock-data";

interface ProductGridProps {
  products: MockProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const totalSlots = Math.ceil(products.length / 6) * 6;

  const cells = [];
  for (let i = 0; i < totalSlots; i++) {
    if (i < products.length) {
      const product = products[i];
      cells.push(
        <Link
          key={product.handle}
          href={`/products/${product.handle}`}
          className="group bg-bg-card border border-[#f0f0f0] h-[286px] overflow-clip relative block -mr-px -mb-px"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[145px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.15]">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 50vw, 16vw"
            />
          </div>
          {/* Subtle bg highlight on hover */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-40 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
        </Link>
      );
    } else {
      cells.push(
        <div
          key={`empty-${i}`}
          className="bg-bg-card border border-[#f0f0f0] h-[286px] -mr-px -mb-px"
        />
      );
    }
  }

  return (
    <div id="products" className="grid grid-cols-6 w-full bg-bg-primary">
      {cells}
    </div>
  );
}
