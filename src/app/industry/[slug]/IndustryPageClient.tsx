"use client";

import { useState } from "react";
import Link from "next/link";
import type { SanityIndustry } from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";
import SolayaViewer from "@/components/SolayaViewer";
import Navbar from "@/components/Navbar";
import CtaButton from "@/components/CtaButton";

function padIndex(i: number) {
  return String(i).padStart(2, "0");
}

export default function IndustryPageClient({
  industry,
  totalCount,
  allIndustries,
}: {
  industry: SanityIndustry;
  totalCount: number;
  allIndustries: SanityIndustry[];
}) {
  const [tappedCell, setTappedCell] = useState<number | null>(null);

  const products = industry.products || [];

  return (
    <div className="relative min-h-screen bg-bg-primary">
      <Navbar industries={allIndustries} />

      <div className="pt-[140px] md:pt-[200px] px-4 md:px-[41px]">
        <p className="text-[11px] font-medium text-content-secondary tracking-wide mb-2">
          Industry {padIndex(industry.order || 1)} / {padIndex(totalCount)}
        </p>
        <h2 className="text-[24px] md:text-[30px] font-normal text-[#302c2c] tracking-[-0.6px] leading-[1.1]">
          {industry.title}
        </h2>
      </div>

      <div className="mt-8 md:mt-[60px] mb-12 md:mb-[80px]">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full"
          style={{ border: "1px solid #e5e5e0" }}
        >
          {products.map((product, i) => {
            const fallbackImg = product.coverImage
              ? urlFor(product.coverImage).width(400).url()
              : "/assets/products/pink-sneaker.png";

            return (
              <div key={product._id} className="flex flex-col">
                <div
                  className="relative aspect-square"
                  style={{
                    borderRight: "1px solid #e5e5e0",
                    borderBottom: "1px solid #e5e5e0",
                  }}
                >
                  <SolayaViewer
                    splatUrl={product.plyFile?.url || "/assets/models/white-nike-airforce.ply"}
                    previewImageUrl={fallbackImg}
                    blockBottom={product.blockBottom}
                    initialAngle={product.initialYaw}
                    initialPitch={product.initialPitch}
                    style={{ width: "100%", height: "100%" }}
                    onTap={() => {
                      if (tappedCell === i) {
                        window.location.href = `/products/${product.slug}`;
                      } else {
                        setTappedCell(i);
                      }
                    }}
                  />
                </div>
                <Link
                  href={`/products/${product.slug}`}
                  className="group px-0 pt-3 pb-4"
                  style={{
                    borderRight: "1px solid #e5e5e0",
                  }}
                >
                  <p className="text-[10px] font-medium text-content-secondary mb-[2px] uppercase tracking-wide">
                    {product.brand}
                  </p>
                  <p className="text-[12px] font-medium text-[#2A2A27] group-hover:text-content-secondary transition-colors">
                    {product.title}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 md:px-[41px] pb-10 md:pb-[60px] flex flex-wrap items-center gap-[16px]">
        <CtaButton href="https://www.solaya.ai/" external>
          Download Solaya
        </CtaButton>
        <CtaButton href="https://www.solaya.ai/contact" external className="bg-transparent !text-[#2A2A27] border border-[#2A2A27] hover:!bg-[#2A2A27] hover:!text-white">
          Book a Demo
        </CtaButton>
      </div>

      <div className="px-4 md:px-[41px] pb-[30px] flex flex-wrap items-center gap-[20px] md:gap-[40px]">
        <span className="text-[11px] font-medium text-content-secondary cursor-pointer hover:opacity-70 transition-opacity">
          Terms of Service
        </span>
        <span className="text-[11px] font-medium text-content-secondary cursor-pointer hover:opacity-70 transition-opacity">
          Contact
        </span>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-content-secondary hover:opacity-70 transition-opacity"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
