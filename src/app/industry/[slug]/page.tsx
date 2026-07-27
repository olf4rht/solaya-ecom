"use client";

import { useParams, useRouter } from "next/navigation";
import { industries, TOTAL_INDUSTRIES } from "@/lib/industries";
import GaussianSplatViewer from "@/components/GaussianSplatViewer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const PLY_URL = "/assets/models/pink-sneaker.ply";
const FALLBACK_IMAGE = "/assets/products/pink-sneaker.png";

function padIndex(i: number) {
  return String(i + 1).padStart(2, "0");
}

export default function IndustryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const currentIndex = industries.findIndex((item) => item.slug === slug);
  const industry = industries[currentIndex];

  if (!industry) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[14px] text-content-secondary">Industry not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <Navbar />

      {/* Industry info — top left */}
      <div className="fixed top-[160px] left-[41px] z-30">
        <p className="text-[11px] font-medium text-content-secondary tracking-wide mb-2">
          Industry {padIndex(currentIndex)} / {padIndex(TOTAL_INDUSTRIES)}
        </p>
        <h2 className="text-[30px] font-normal text-[#302c2c] tracking-[-0.6px] leading-[1.1]">
          {industry.industry}
        </h2>
        <div className="mt-5 flex items-baseline gap-[40px]">
          <span className="text-[11px] font-medium text-content-primary">Brand:</span>
          <span className="text-[11px] font-normal text-content-primary">{industry.brand}</span>
        </div>
      </div>

      {/* Mini video thumbnails — top right */}
      <div className="fixed top-[160px] right-[41px] z-30 flex items-center gap-[8px]">
        {industries.map((item, index) => (
          <button
            key={item.id}
            onClick={() => router.push(`/industry/${item.slug}`)}
            className="relative rounded-[6px] overflow-hidden cursor-pointer"
            style={{
              width: 50,
              height: 50,
              opacity: index === currentIndex ? 1 : 0.4,
              border: index === currentIndex ? "1.5px solid #2A2A27" : "1px solid #e5e5e0",
              transition: "opacity 300ms ease, border 300ms ease",
            }}
          >
            {item.videoUrl ? (
              <video
                src={item.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : item.image ? (
              <img
                src={item.image}
                alt={item.industry}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#f2f2ed]" />
            )}
          </button>
        ))}
      </div>

      {/* 3x2 Grid of .ply viewers */}
      <div
        className="fixed z-20"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
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
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                borderRight: (i % 3) < 2 ? "1px solid #e5e5e0" : "none",
                borderBottom: i < 3 ? "1px solid #e5e5e0" : "none",
                position: "relative",
              }}
            >
              <GaussianSplatViewer
                plyUrl={PLY_URL}
                fallbackImage={FALLBACK_IMAGE}
                fallbackAlt={`${industry.industry} product ${i + 1}`}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-[30px] left-[41px] z-30 flex items-center gap-[40px]">
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
