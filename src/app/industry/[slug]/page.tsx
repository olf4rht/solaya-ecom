"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { industries, TOTAL_INDUSTRIES } from "@/lib/industries";
import GaussianSplatViewer from "@/components/GaussianSplatViewer";
import Navbar from "@/components/Navbar";
import CtaButton from "@/components/CtaButton";

const PLY_URL = "/assets/models/white-nike-airforce.ply";
const FALLBACK_IMAGE = "/assets/products/white-nike-airforce.png";

function padIndex(i: number) {
  return String(i + 1).padStart(2, "0");
}

export default function IndustryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const camPos: [number, number, number] = [-12, 0.3, 0];
  const camLookAt: [number, number, number] = [0, 0, 0];
  const objRotation: [number, number, number] = [-2, 0, 34];

  const currentIndex = industries.findIndex((item) => item.slug === slug);
  const industry = industries[currentIndex];

  if (!industry) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[14px] text-content-secondary">Industry not found.</p>
      </div>
    );
  }

  const products = industry.products;

  return (
    <div className="relative min-h-screen bg-bg-primary">
      <Navbar />

      {/* Industry info — top left */}
      <div className="pt-[140px] md:pt-[200px] px-4 md:px-[41px]">
        <p className="text-[11px] font-medium text-content-secondary tracking-wide mb-2">
          Industry {padIndex(currentIndex)} / {padIndex(TOTAL_INDUSTRIES)}
        </p>
        <h2 className="text-[24px] md:text-[30px] font-normal text-[#302c2c] tracking-[-0.6px] leading-[1.1]">
          {industry.industry}
        </h2>
      </div>

      {/* Grid of .ply viewers — 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="mt-8 md:mt-[60px] mb-12 md:mb-[80px]">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full"
          style={{ border: "1px solid #e5e5e0" }}
        >
          {products.map((product, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredCell(i)}
              onMouseLeave={() => setHoveredCell(null)}
              className="relative aspect-square"
              style={{
                borderRight: "1px solid #e5e5e0",
                borderBottom: "1px solid #e5e5e0",
              }}
            >
              <GaussianSplatViewer
                plyUrl={PLY_URL}
                fallbackImage={FALLBACK_IMAGE}
                fallbackAlt={`${product.brand} ${product.name}`}
                cameraPosition={camPos}
                cameraLookAt={camLookAt}
                objectRotation={objRotation}
                delay={i * 100}
                lowDpr
                style={{ width: "100%", height: "100%" }}
              />
              {/* Hover overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: hoveredCell === i ? "rgba(0, 0, 0, 0.04)" : "transparent",
                  transition: "background-color 300ms ease",
                  pointerEvents: "none",
                }}
              />
              {/* Product info on hover */}
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  opacity: hoveredCell === i ? 1 : 0,
                  transform: hoveredCell === i ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 250ms ease, transform 250ms ease",
                  pointerEvents: hoveredCell === i ? "auto" : "none",
                }}
              >
                <p className="text-[10px] font-medium text-content-secondary mb-[2px]">
                  {product.brand}
                </p>
                <Link
                  href={`/products/${product.handle}`}
                  className="text-[12px] font-medium text-[#2A2A27] hover:underline"
                >
                  {product.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 md:px-[41px] pb-10 md:pb-[60px] flex flex-wrap items-center gap-[16px]">
        <CtaButton href="https://solaya.app" external>
          Download Solaya
        </CtaButton>
        <CtaButton href="https://solaya.app/contact" external className="bg-transparent !text-[#2A2A27] border border-[#2A2A27] hover:!bg-[#2A2A27] hover:!text-white">
          Book a Demo
        </CtaButton>
      </div>

      {/* Footer */}
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
