"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getMockProduct, allProducts, type MockProduct } from "@/lib/mock-data";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import CtaButton from "@/components/CtaButton";

export default function ProductPage() {
  const params = useParams();
  const handle = params.handle as string;
  const existing = getMockProduct(handle);
  const product: MockProduct = existing ?? {
    id: handle,
    title: handle.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    handle,
    description: "This is a fictitious product page created by Solaya for demo purposes.",
    category: "Product",
    categoryHandle: "product",
    image: "/assets/products/pink-sneaker.png",
    detailImages: [
      "/assets/products/detail-main.png",
      "/assets/products/detail-thumb-2.png",
      "/assets/products/detail-thumb-3.png",
      "/assets/products/detail-thumb-4.png",
      "/assets/products/detail-thumb-5.png",
    ],
    scans: 5,
    hasIntegrations: true,
    hasExtensions: true,
    hasPlyFile: true,
    commercialUsage: true,
  };
  const [selectedImage, setSelectedImage] = useState(0);

  const features: { icon: string; label: string; underline?: boolean }[] = [
    { icon: "/assets/icons/scans.svg", label: `${product.scans} scans` },
    ...(product.hasIntegrations
      ? [{ icon: "/assets/icons/integrations.svg", label: "Integrations available" }]
      : []),
    ...(product.hasExtensions
      ? [{ icon: "/assets/icons/extensions.svg", label: "Extensions included" }]
      : []),
    ...(product.hasPlyFile
      ? [{ icon: "/assets/icons/ply-file.svg", label: "Link to .ply file", underline: true }]
      : []),
    ...(product.commercialUsage
      ? [{ icon: "/assets/icons/commercial.svg", label: "Commercial usage available" }]
      : []),
  ];

  return (
    <div className="bg-bg-primary flex flex-col items-start w-full">
      <Navbar />

      {/* Spacer for fixed navbar */}
      <div className="h-[140px]" />

      {/* Product detail section */}
      <div className="overflow-clip relative w-full" style={{ height: "935px" }}>
        <div className="flex items-start absolute left-px top-0">
          {/* Main image */}
          <div className="border border-[#ececec] h-[935px] -mr-px relative shrink-0 w-[754px] overflow-hidden">
            <div className="absolute inset-0 bg-[#f5f5f5]">
              <Image
                src={product.detailImages[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                sizes="754px"
                priority
              />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex flex-col items-start shrink-0 w-[110px]">
            {product.detailImages.map((img, index) => {
              const isSelected = index === selectedImage;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className="relative overflow-clip shrink-0 w-[111px] -mb-px border border-[#ececec]"
                  style={{ height: index === 3 ? "115px" : index === 4 ? "114px" : "114px" }}
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
                  {/* Thumbnail number */}
                  <p className="absolute left-[9px] top-[8px] text-[7px] font-medium text-content-tertiary">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product info - positioned on the right */}
        <div className="absolute flex flex-col gap-6 items-start top-[258px] w-[338px]" style={{ left: "calc(50% + 251px)" }}>
          <h1 className="font-normal text-[32px] tracking-[-0.64px] text-content-primary leading-none w-full">
            {product.title}
          </h1>

          <p className="text-[13px] leading-[16px] text-content-secondary w-full">
            {product.category}
          </p>

          <div className="flex flex-col gap-6 items-start w-full">
            <p className="text-[13px] leading-[16px] text-content-secondary w-full">
              {product.description}
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

            <div className="flex items-center gap-[12px] mt-2">
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

      {/* Product grid */}
      <ProductGrid products={allProducts} />

      {/* CTA Banner */}
      <div className="w-full px-[41px] py-[60px] flex flex-col items-center gap-[16px]">
        <p className="text-[13px] text-content-secondary text-center max-w-[400px]">
          Create photorealistic 3D scans of any product in minutes. No studio, no equipment — just your phone.
        </p>
        <div className="flex items-center gap-[12px]">
          <CtaButton href="https://solaya.app" external>
            Get Started with Solaya
          </CtaButton>
          <CtaButton href="https://solaya.app/blog" external className="bg-transparent !text-[#2A2A27] border border-[#2A2A27] hover:!bg-[#2A2A27] hover:!text-white">
            Read Our Blog
          </CtaButton>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
