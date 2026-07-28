"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { industries, TOTAL_INDUSTRIES } from "@/lib/industries";
import GaussianSplatViewer from "@/components/GaussianSplatViewer";
import Navbar from "@/components/Navbar";

const PLY_URL = "/assets/models/pink-sneaker.ply";
const FALLBACK_IMAGE = "/assets/products/pink-sneaker.png";

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
    <div className="relative min-h-screen bg-white">
      <Navbar />

      {/* Industry info — top left */}
      <div style={{ paddingTop: "200px", paddingLeft: "41px", paddingRight: "41px" }}>
        <p className="text-[11px] font-medium text-content-secondary tracking-wide mb-2">
          Industry {padIndex(currentIndex)} / {padIndex(TOTAL_INDUSTRIES)}
        </p>
        <h2 className="text-[30px] font-normal text-[#302c2c] tracking-[-0.6px] leading-[1.1]">
          {industry.industry}
        </h2>
      </div>

      {/* 3x2 Grid of .ply viewers */}
      <div
        style={{
          margin: "60px 0 80px 0",
          aspectRatio: "3 / 2",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            width: "100%",
            height: "100%",
            border: "1px solid #e5e5e0",
          }}
        >
          {products.map((product, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredCell(i)}
              onMouseLeave={() => setHoveredCell(null)}
              style={{
                borderRight: (i % 3) < 2 ? "1px solid #e5e5e0" : "none",
                borderBottom: i < 3 ? "1px solid #e5e5e0" : "none",
                position: "relative",
              }}
            >
              <GaussianSplatViewer
                plyUrl={PLY_URL}
                fallbackImage={FALLBACK_IMAGE}
                fallbackAlt={`${product.brand} ${product.name}`}
                cameraPosition={camPos}
                cameraLookAt={camLookAt}
                objectRotation={objRotation}
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

      {/* Footer */}
      <div style={{ padding: "0 41px 30px 41px" }} className="flex items-center gap-[40px]">
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
