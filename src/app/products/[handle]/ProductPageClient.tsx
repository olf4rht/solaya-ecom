"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { SanityProduct, SanityProductSummary, SanityIndustry } from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import CtaButton from "@/components/CtaButton";
import SolayaViewer from "@/components/SolayaViewer";

export default function ProductPageClient({
  product,
  allProducts,
  industries,
}: {
  product: SanityProduct;
  allProducts: SanityProductSummary[];
  industries: SanityIndustry[];
}) {
  type MediaView =
    | { type: "image"; src: string }
    | { type: "video"; src: string }
    | { type: "3d" };

  const views: MediaView[] = [];

  if (product.media) {
    for (const item of product.media) {
      if (item._type === "image") {
        views.push({ type: "image", src: urlFor(item).width(1200).url() });
      } else if (item._type === "r2File" && item.url) {
        views.push({ type: "video", src: item.url });
      }
    }
  }

  if (views.length === 0) {
    views.push({ type: "image", src: "/assets/products/detail-main.png" });
  }

  if (product.plyFile?.url) {
    views.push({ type: "3d" });
  }

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

  // Fade-in on scroll for media items
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.15 }
    );

    mediaRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-bg-primary flex flex-col items-start w-full">
      <Navbar industries={industries} />

      <div className="h-[100px] md:h-[140px]" />

      <div className="w-full">
        <div className="flex flex-col lg:flex-row w-full">
          {/* Left: scrolling media */}
          <div className="w-full lg:w-[65%] flex flex-col">
            {views.map((view, index) => (
              <div
                key={index}
                ref={(el) => { mediaRefs.current[index] = el; }}
                className="w-full border-b border-[#ececec]"
                style={{
                  opacity: index === 0 ? 1 : 0,
                  transform: index === 0 ? "translateY(0)" : "translateY(30px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
              >
                {view.type === "3d" ? (
                  <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
                    <SolayaViewer
                      splatUrl={product.plyFile!.url}
                      blockBottom={product.blockBottom}
                      initialAngle={product.initialYaw}
                      initialPitch={product.initialPitch}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                ) : view.type === "video" ? (
                  <div className="relative w-full bg-[#f5f5f5]" style={{ aspectRatio: "1/1" }}>
                    <video
                      src={view.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative w-full bg-[#f5f5f5]" style={{ aspectRatio: "1/1" }}>
                    <Image
                      src={view.src}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 65vw"
                      priority={index === 0}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: sticky product info */}
          <div className="w-full lg:w-[35%] lg:border-l border-[#ececec]">
            <div className="lg:sticky lg:top-[140px] flex flex-col gap-6 px-6 md:px-10 lg:px-10 py-8 lg:py-10">
              <div>
                <h1 className="font-medium text-[18px] md:text-[22px] tracking-[-0.4px] text-content-primary leading-tight">
                  {product.title}
                </h1>
                <p className="text-[13px] text-content-secondary mt-1">
                  {product.category || "Product"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-[12px]">
                <CtaButton href="https://www.solaya.ai/" external>
                  Test in Solaya Play
                </CtaButton>
                <CtaButton href="https://www.solaya.ai/contact" external className="bg-transparent !text-[#2A2A27] border border-[#2A2A27] hover:!bg-[#2A2A27] hover:!text-white">
                  Contact Sales
                </CtaButton>
              </div>

              <div className="border-t border-[#ececec] pt-6">
                <p className="text-[13px] leading-[20px] text-content-secondary">
                  {product.description || "This is a fictitious product page created by Solaya for demo purposes."}
                </p>
              </div>

              <div className="border-t border-[#ececec] pt-6 flex flex-col gap-[8px]">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex items-center justify-center overflow-clip size-5 shrink-0">
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
            </div>
          </div>
        </div>
      </div>

      <ProductGrid products={allProducts} />

      <Footer />
    </div>
  );
}
