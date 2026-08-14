"use client";

import { useState } from "react";
import Image from "next/image";
import type { SanityProduct, SanityProductSummary, SanityIndustry } from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import CtaButton from "@/components/CtaButton";

export default function ProductPageClient({
  product,
  allProducts,
  industries,
}: {
  product: SanityProduct;
  allProducts: SanityProductSummary[];
  industries: SanityIndustry[];
}) {
  // Build image list from media array
  const detailImages: string[] = [];

  // Add cover image first
  if (product.coverImage) {
    detailImages.push(urlFor(product.coverImage).width(1200).url());
  }

  // Add media items
  if (product.media) {
    for (const item of product.media) {
      if (item._type === "image") {
        detailImages.push(urlFor(item).width(1200).url());
      }
      // R2 videos could be added here too but for now we focus on images
    }
  }

  // Fallback if no images at all
  if (detailImages.length === 0) {
    detailImages.push("/assets/products/detail-main.png");
  }

  const [selectedImage, setSelectedImage] = useState(0);

  const features: { icon: string; label: string; underline?: boolean }[] = [
    { icon: "/assets/icons/scans.svg", label: `${product.scans || 5} scans` },
    ...(product.hasIntegrations !== false
      ? [{ icon: "/assets/icons/integrations.svg", label: "Integrations available" }]
      : []),
    ...(product.hasExtensions !== false
      ? [{ icon: "/assets/icons/extensions.svg", label: "Extensions included" }]
      : []),
    ...(product.plyFile?.url
      ? [{ icon: "/assets/icons/ply-file.svg", label: "Link to .ply file", underline: true }]
      : []),
    ...(product.commercialUsage !== false
      ? [{ icon: "/assets/icons/commercial.svg", label: "Commercial usage available" }]
      : []),
  ];

  return (
    <div className="bg-bg-primary flex flex-col items-start w-full">
      <Navbar industries={industries} />

      <div className="h-[100px] md:h-[140px]" />

      <div className="w-full">
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex flex-col sm:flex-row w-full lg:w-auto">
            <div className="border border-[#ececec] aspect-square sm:aspect-auto sm:h-[500px] lg:h-[935px] relative shrink-0 w-full sm:w-auto sm:flex-1 lg:w-[754px] lg:flex-none overflow-hidden">
              <div className="absolute inset-0 bg-[#f5f5f5]">
                <Image
                  src={detailImages[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 754px"
                  priority
                />
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-start overflow-x-auto sm:overflow-visible shrink-0 sm:w-[110px]">
              {detailImages.map((img, index) => {
                const isSelected = index === selectedImage;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className="relative overflow-clip shrink-0 w-[80px] h-[80px] sm:w-[111px] sm:h-[114px] -mb-px -mr-px border border-[#ececec]"
                  >
                    <div className="absolute inset-0">
                      <div className={`absolute inset-0 bg-[#f5f5f5] ${isSelected ? "" : "opacity-20"}`}>
                        <Image
                          src={img}
                          alt={`View ${index + 1}`}
                          fill
                          className={`object-cover ${isSelected ? "" : "opacity-20"}`}
                          sizes="110px"
                        />
                      </div>
                    </div>
                    <p className="absolute left-[9px] top-[8px] text-[7px] font-medium text-content-tertiary">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-6 items-start px-4 md:px-[41px] lg:px-0 py-8 lg:py-0 w-full lg:w-[338px] lg:pt-[258px] lg:ml-auto lg:mr-[calc((100%-754px-110px-338px)/2)]">
            <h1 className="font-normal text-[24px] md:text-[32px] tracking-[-0.64px] text-content-primary leading-none w-full">
              {product.title}
            </h1>

            <p className="text-[13px] leading-[16px] text-content-secondary w-full">
              {product.category || "Product"}
            </p>

            <div className="flex flex-col gap-6 items-start w-full">
              <p className="text-[13px] leading-[16px] text-content-secondary w-full">
                {product.description || "This is a fictitious product page created by Solaya for demo purposes."}
              </p>

              <div className="flex flex-col gap-[6px] items-start w-full">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex items-center justify-center overflow-clip size-6 shrink-0">
                      <Image
                        src={feature.icon}
                        alt=""
                        width={14}
                        height={14}
                      />
                    </div>
                    <span
                      className={`text-[12px] font-medium text-content-secondary whitespace-nowrap ${
                        feature.underline ? "underline" : ""
                      }`}
                    >
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-[12px] mt-2">
                <CtaButton href="https://solaya.app" external>
                  Test in Solaya Play
                </CtaButton>
                <CtaButton href="https://solaya.app/contact" external className="bg-transparent !text-[#2A2A27] border border-[#2A2A27] hover:!bg-[#2A2A27] hover:!text-white">
                  Contact Sales
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductGrid products={allProducts} />

      <div className="w-full px-4 md:px-[41px] py-[40px] md:py-[60px] flex flex-col items-center gap-[16px]">
        <p className="text-[13px] text-content-secondary text-center max-w-[400px]">
          Create photorealistic 3D scans of any product in minutes. No studio, no equipment — just your phone.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[12px]">
          <CtaButton href="https://solaya.app" external>
            Get Started with Solaya
          </CtaButton>
          <CtaButton href="https://solaya.app/blog" external className="bg-transparent !text-[#2A2A27] border border-[#2A2A27] hover:!bg-[#2A2A27] hover:!text-white">
            Read Our Blog
          </CtaButton>
        </div>
      </div>

      <Footer />
    </div>
  );
}
