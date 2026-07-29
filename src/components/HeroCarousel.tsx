"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import GaussianSplatViewer from "./GaussianSplatViewer";

type RotationMode = "auto" | "manual";

interface HeroItem {
  id: number;
  image: string;
  label: string;
  client: string;
  industry: string;
  plyUrl?: string;
  videoUrl?: string;
}

const SOLAYA_MODEL_URL =
  "https://assets-bear.solaya-app.com/root-bear/models/420__company_82_None_product_545_model_oriented.compressed.ply?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9hc3NldHMtYmVhci5zb2xheWEtYXBwLmNvbS9yb290LWJlYXIvbW9kZWxzLzQyMF9fY29tcGFueV84Ml9Ob25lX3Byb2R1Y3RfNTQ1X21vZGVsX29yaWVudGVkLmNvbXByZXNzZWQucGx5IiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxODE0NjIxMjk3fX19XX0_&Signature=6Gb5dBadoA5guHbKQcQifq281MDxtQS-6Xuan1L6qJuESJl2wqqX9UAWl0-CKwNWpDL1KYOevjBI9me1TSc0myyfM5QVuLQYdfxUn5Vog~V8XwfAqlApD-wMuN7pcMt6S8hsRZ7exsetfDeaOtZkccPLilwBbg2vjtldiPkKxQPXJRSpaoQdasq0jzKMmHPXFhKITbDRPTsNbIg073889yu93y9TwXwPOVbsgtgUKDhCIEopcfD06-vl2b1DPqeCU1fXBxLU11Vxwkub4gqrs0SA6Drc1FRxg9bHCE56lGu4FfUbdKqOzI-AsL9GkzMsQv8~D780neGugsgrJKOZLg__&Key-Pair-Id=K6R3RR2IEZRM4";

const heroItems: HeroItem[] = [
  { id: 1, image: "/assets/products/pink-sneaker.png", label: "Pink Sneaker", client: "Aubsas", industry: "Footwear", plyUrl: "/assets/models/white-nike-airforce.ply", videoUrl: "/assets/videos/01.mp4" },
  { id: 2, image: "/assets/products/detail-thumb-5.png", label: "Crystal Bottle", client: "Maison Lumière", industry: "Beauty", videoUrl: "/assets/videos/02.mp4" },
  { id: 3, image: "/assets/products/product-20.png", label: "Designer Bag", client: "Atelier Noir", industry: "Fashion", videoUrl: "/assets/videos/03.mp4" },
  { id: 4, image: "/assets/products/product-17.png", label: "Hobo Bag", client: "Casa Moda", industry: "Fashion", videoUrl: "/assets/videos/04.mp4" },
  { id: 5, image: "/assets/products/product-20.png", label: "Makeup Case", client: "Glow Studio", industry: "Beauty", videoUrl: "/assets/videos/05.mp4" },
  { id: 6, image: "/assets/products/product-17.png", label: "Clutch", client: "Velvet & Co", industry: "Fashion", videoUrl: "/assets/videos/06.mp4" },
  { id: 7, image: "/assets/products/product-20.png", label: "Tan Bag", client: "Nomad Leather", industry: "Accessories" },
  { id: 8, image: "/assets/products/product-17.png", label: "Mini Bag", client: "Petit Luxe", industry: "Fashion" },
  { id: 9, image: "/assets/products/product-20.png", label: "Evening Bag", client: "Soirée Paris", industry: "Fashion" },
  { id: 10, image: "/assets/products/product-17.png", label: "Wallet", client: "Craft & Hide", industry: "Accessories" },
];

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const DURATION = "700ms";
const COUNT = heroItems.length;

function useResponsiveSizes() {
  const [sizes, setSizes] = useState({ item: 120, viewer: 600, height: 900 });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setSizes({ item: 60, viewer: Math.min(w - 40, 320), height: 500 });
      } else if (w < 1024) {
        setSizes({ item: 90, viewer: Math.min(w - 80, 450), height: 700 });
      } else {
        setSizes({ item: 120, viewer: 600, height: 900 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return sizes;
}

export default function HeroCarousel() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [rotationMode, setRotationMode] = useState<RotationMode>("auto");
  const { item: ITEM_SIZE, viewer: VIEWER_SIZE, height: containerHeight } = useResponsiveSizes();
  const hasExpanded = expandedIndex !== null;

  const handleClick = useCallback((index: number) => {
    setExpandedIndex((prev) => {
      if (prev === index) {
        setRotationMode("auto");
        return null;
      }
      setRotationMode("auto");
      return index;
    });
  }, []);

  const getRowTranslate = () => {
    if (!hasExpanded) return "translateX(0)";
    const selected = expandedIndex!;
    const rowCenter = ((COUNT - 1) / 2) * ITEM_SIZE;
    const itemCenter = selected * ITEM_SIZE;
    const shift = rowCenter - itemCenter;
    return `translateX(${shift}px)`;
  };

  const getItemStyle = (index: number): React.CSSProperties => {
    if (!hasExpanded) {
      const isHovered = hoveredIndex === index;
      return {
        transform: isHovered ? "scale(1.15)" : "scale(1)",
        opacity: 1,
        zIndex: isHovered ? 5 : 1,
      };
    }

    const selected = expandedIndex!;
    const dist = Math.abs(index - selected);

    if (index === selected) {
      return {
        transform: "scale(3.5)",
        opacity: 1,
        zIndex: 10,
      };
    }

    const direction = index > selected ? 1 : -1;
    const pushBase = ITEM_SIZE * 2.2;
    const push = direction * pushBase / Math.pow(dist, 0.3);
    const opacity = dist === 1 ? 0.3 : dist === 2 ? 0.15 : 0.08;

    return {
      transform: `translateX(${push}px) scale(0.85)`,
      opacity,
      zIndex: 1,
    };
  };

  const expandedItem = hasExpanded ? heroItems[expandedIndex!] : null;
  const has3D = expandedItem?.plyUrl != null;
  const hasVideo = expandedItem?.videoUrl != null;
  // Show the .ply overlay only in manual mode
  const showPlyOverlay = hasExpanded && has3D && rotationMode === "manual";

  return (
    <div className="bg-bg-primary w-full overflow-hidden relative" style={{ height: `${containerHeight}px` }}>
      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      {/* Vertically centered but shifted up slightly */}
      <div className="w-full h-full flex items-center justify-center" style={{ paddingBottom: containerHeight < 700 ? "60px" : "120px" }}>
        <div
          className="flex items-center gap-4"
          style={{
            transform: getRowTranslate(),
            transition: `transform ${DURATION} ${EASE}`,
            willChange: "transform",
          }}
        >
          {heroItems.map((item, index) => {
            const itemStyle = getItemStyle(index);
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={item.id}
                onClick={() => handleClick(index)}
                onMouseEnter={() => !hasExpanded && setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer shrink-0"
                style={{
                  width: `${ITEM_SIZE}px`,
                  height: `${ITEM_SIZE}px`,
                  ...itemStyle,
                  transition: `transform ${DURATION} ${EASE}, opacity ${DURATION} ${EASE}`,
                  willChange: "transform, opacity",
                }}
              >
                <div className="w-full h-full relative">
                  {item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain pointer-events-none"
                      style={{
                        // Hide thumbnail video when ply overlay is showing
                        opacity: isExpanded && showPlyOverlay ? 0 : 1,
                        transition: `opacity 300ms ${EASE}`,
                      }}
                    />
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      className="object-contain pointer-events-none"
                      sizes="152px"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-resolution .ply overlay — only for manual mode */}
      {showPlyOverlay && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 15, paddingBottom: containerHeight < 700 ? "60px" : "120px" }}
        >
          <div
            className="pointer-events-auto"
            style={{ width: `${VIEWER_SIZE}px`, height: `${VIEWER_SIZE}px` }}
          >
            <GaussianSplatViewer
              plyUrl={expandedItem!.plyUrl}
              fallbackImage={expandedItem!.image}
              fallbackAlt={expandedItem!.label}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Rotation mode toggle */}
      {hasExpanded && (has3D || hasVideo) && (
        <div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm"
          style={{ zIndex: 20 }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRotationMode("auto");
            }}
            className={`px-4 py-2 rounded-full text-[12px] font-medium transition-colors duration-300 ${
              rotationMode === "auto"
                ? "bg-content-primary text-white"
                : "text-content-secondary hover:text-content-primary"
            }`}
          >
            360° Auto
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRotationMode("manual");
            }}
            className={`px-4 py-2 rounded-full text-[12px] font-medium transition-colors duration-300 ${
              rotationMode === "manual"
                ? "bg-content-primary text-white"
                : "text-content-secondary hover:text-content-primary"
            }`}
          >
            Manual
          </button>
        </div>
      )}

      {/* Product info — left side on desktop, bottom-left on mobile */}
      {hasExpanded && (
        <div
          className="absolute left-4 md:left-12 bottom-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2"
          style={{ zIndex: 20, paddingBottom: containerHeight < 700 ? "0px" : "120px" }}
        >
          <div
            className="space-y-3"
            style={{
              animation: `fadeInLeft ${DURATION} ${EASE} both`,
            }}
          >
            <h2 className="text-[18px] md:text-[22px] font-medium text-content-primary tracking-tight leading-tight">
              {expandedItem?.label}
            </h2>
            <div className="space-y-1">
              <p className="text-[11px] md:text-[12px] text-content-tertiary tracking-wide">
                <span className="uppercase">Client:</span>{" "}
                <span className="text-content-secondary">{expandedItem?.client}</span>
              </p>
              <p className="text-[11px] md:text-[12px] text-content-tertiary tracking-wide">
                <span className="uppercase">Industry:</span>{" "}
                <span className="text-content-secondary">{expandedItem?.industry}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
