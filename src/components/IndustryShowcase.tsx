"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { industries, TOTAL_INDUSTRIES } from "@/lib/industries";
import Link from "next/link";

type ViewMode = "list" | "grid";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const TOTAL = TOTAL_INDUSTRIES;
const DURATION = 700;

function ListIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 10.9708 11.9636" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.63231 11.5636V0.4" stroke="#2A2A27" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M0.4 9.33076L2.63272 11.5635L4.86543 9.33076" stroke="#2A2A27" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.61687 2.88157H9.82655" stroke="#2A2A27" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M4.61687 0.896766H10.5708" stroke="#2A2A27" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M4.61687 4.86638H8.58615" stroke="#2A2A27" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M4.61687 6.85094H7.59383" stroke="#2A2A27" strokeWidth="0.8" strokeLinecap="round"/>
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13.3064 13.3065" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.09172 0.45H4.7281C4.7281 0.45 5.36982 0.45 5.36982 1.09172V6.01153C5.36982 6.01153 5.36982 6.65325 4.7281 6.65325H1.09172C1.09172 6.65325 0.45 6.65325 0.45 6.01153V1.09172C0.45 1.09172 0.45 0.45 1.09172 0.45Z" stroke="#2A2A27" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.09172 9.21993H4.7281C4.7281 9.21993 5.36982 9.21993 5.36982 9.86164V12.2146C5.36982 12.2146 5.36982 12.8563 4.7281 12.8563H1.09172C1.09172 12.8563 0.45 12.8563 0.45 12.2146V9.86164C0.45 9.86164 0.45 9.21993 1.09172 9.21993Z" stroke="#2A2A27" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.57833 6.6533H12.2147C12.2147 6.6533 12.8564 6.6533 12.8564 7.29501V12.2148C12.8564 12.2148 12.8564 12.8565 12.2147 12.8565H8.57833C8.57833 12.8565 7.93661 12.8565 7.93661 12.2148V7.29501C7.93661 7.29501 7.93661 6.6533 8.57833 6.6533Z" stroke="#2A2A27" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.57833 0.45H12.2147C12.2147 0.45 12.8564 0.45 12.8564 1.09172V3.44467C12.8564 3.44467 12.8564 4.08639 12.2147 4.08639H8.57833C8.57833 4.08639 7.93661 4.08639 7.93661 3.44467V1.09172C7.93661 1.09172 7.93661 0.45 8.57833 0.45Z" stroke="#2A2A27" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_146_543)">
        <path d="M18.3216 0.678467L0.678711 18.3213" stroke="#767670" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0.678711 0.678467L18.3216 18.3213" stroke="#767670" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_146_543">
          <rect width="19" height="19" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function ViewToggle({
  viewMode,
  onChange,
}: {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="fixed top-[30px] left-1/2 -translate-x-1/2 z-50 flex items-center h-[44px] bg-white rounded-[12px] pl-[15px] pr-[5px] gap-[5px]">
      <span className="text-[11px] font-medium text-content-primary mr-[2px]">View</span>
      <button
        onClick={() => onChange("list")}
        className="flex items-center justify-center size-[26px] rounded-full transition-colors"
        style={{
          backgroundColor: viewMode === "list" ? "rgba(242,242,237,0.92)" : "#f0f1ec",
          border: viewMode === "list" ? "0.5px solid #2a2a27" : "1px solid #e2e2dc",
        }}
      >
        <ListIcon />
      </button>
      <button
        onClick={() => onChange("grid")}
        className="flex items-center justify-center size-[26px] rounded-full transition-colors"
        style={{
          backgroundColor: viewMode === "grid" ? "rgba(242,242,237,0.92)" : "#f0f1ec",
          border: viewMode === "grid" ? "0.5px solid #2a2a27" : "1px solid #e2e2dc",
        }}
      >
        <GridIcon />
      </button>
    </div>
  );
}

export default function IndustryShowcase() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [winSize, setWinSize] = useState({ w: 1440, h: 900 });
  const scrollCooldown = useRef(false);

  useEffect(() => {
    const update = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const padIndex = (i: number) => String(i + 1).padStart(2, "0");

  // Grid positions: centered row of 200px items with 16px gaps
  const getGridPos = useCallback((index: number) => {
    const size = 200;
    const gap = 16;
    const totalW = TOTAL * size + (TOTAL - 1) * gap;
    const startX = winSize.w / 2 - totalW / 2;
    const startY = winSize.h / 2 - size / 2;
    return {
      left: startX + index * (size + gap),
      top: startY,
      width: size,
      height: size,
    };
  }, [winSize]);

  const getExpandedPos = useCallback(() => {
    const w = winSize.w * 0.7;
    const h = winSize.h * 0.7;
    return {
      left: winSize.w / 2 - w / 2,
      top: winSize.h / 2 - h / 2,
      width: w,
      height: h,
    };
  }, [winSize]);

  const handleExpand = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setViewMode("list");
    setTimeout(() => setIsAnimating(false), DURATION);
  }, [isAnimating]);

  // Listen for industry selection from Navbar
  useEffect(() => {
    const onSelect = (e: Event) => {
      const index = (e as CustomEvent).detail as number;
      if (index >= 0 && index < TOTAL) {
        setActiveIndex(index);
        setViewMode("list");
      }
    };
    window.addEventListener("selectIndustry", onSelect);
    return () => window.removeEventListener("selectIndustry", onSelect);
  }, []);

  const handleClose = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setViewMode("grid");
    setTimeout(() => setIsAnimating(false), DURATION);
  }, [isAnimating]);

  const handleViewChange = useCallback((mode: ViewMode) => {
    if (isAnimating) return;
    if (mode === viewMode) return;
    setIsAnimating(true);
    setViewMode(mode);
    setTimeout(() => setIsAnimating(false), DURATION);
  }, [isAnimating, viewMode]);

  // Scroll/wheel navigation in expanded mode
  useEffect(() => {
    if (viewMode !== "list") return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollCooldown.current || isAnimating) return;

      if (Math.abs(e.deltaY) > 20) {
        scrollCooldown.current = true;
        if (e.deltaY > 0 && activeIndex < TOTAL - 1) {
          setActiveIndex((i) => i + 1);
        } else if (e.deltaY < 0 && activeIndex > 0) {
          setActiveIndex((i) => i - 1);
        }
        setTimeout(() => {
          scrollCooldown.current = false;
        }, 600);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [viewMode, activeIndex, isAnimating]);

  const expanded = getExpandedPos();

  return (
    <>
      <ViewToggle viewMode={viewMode} onChange={handleViewChange} />

      {/* Close button — list view only */}
      {viewMode === "list" && (
        <button
          onClick={handleClose}
          className="fixed z-50 cursor-pointer"
          style={{
            top: "200px",
            right: "41px",
            padding: "8px",
            opacity: isAnimating ? 0 : 1,
            transition: `opacity 400ms ${EASE}`,
          }}
        >
          <CloseIcon />
        </button>
      )}

      {/* Industry info — list view only */}
      <div
        className="fixed z-30"
        style={{
          top: "160px",
          left: "41px",
          opacity: viewMode === "list" && !isAnimating ? 1 : 0,
          transform: viewMode === "list" && !isAnimating ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 500ms ${EASE} ${viewMode === "list" ? "300ms" : "0ms"}, transform 500ms ${EASE} ${viewMode === "list" ? "300ms" : "0ms"}`,
          pointerEvents: viewMode === "list" && !isAnimating ? "auto" : "none",
        }}
      >
        <p className="text-[11px] font-medium text-content-secondary tracking-wide mb-2">
          Industry {padIndex(activeIndex)} / {padIndex(TOTAL)}
        </p>
        <h2 className="text-[30px] font-normal text-[#302c2c] tracking-[-0.6px] leading-[1.1]">
          {industries[activeIndex].industry}
        </h2>
        <div className="mt-5 flex items-baseline gap-[40px]">
          <span className="text-[11px] font-medium text-content-primary">
            Brand:
          </span>
          <span className="text-[11px] font-normal text-content-primary">
            {industries[activeIndex].brand}
          </span>
        </div>
        <p className="text-[11px] text-content-tertiary mt-1">0°</p>
        <Link
          href={`/industry/${industries[activeIndex].slug}`}
          className="inline-block mt-6 text-[11px] font-medium text-content-primary underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          View Industry
        </Link>
      </div>

      {/* Persistent video/image layer — never unmounts */}
      <div className="fixed inset-0 z-20">
        {industries.map((item, index) => {
          const grid = getGridPos(index);
          const isActive = index === activeIndex;

          // In grid mode: show at grid position
          // In list mode: active item at expanded pos, others hidden
          const isExpanded = viewMode === "list";
          const showExpanded = isExpanded && isActive;
          const hidden = isExpanded && !isActive;

          const pos = showExpanded ? expanded : grid;

          return (
            <div
              key={item.id}
              onClick={() => viewMode === "grid" && !isAnimating && handleExpand(index)}
              style={{
                position: "absolute",
                left: pos.left,
                top: pos.top,
                width: pos.width,
                height: pos.height,
                opacity: hidden ? 0 : 1,
                transition: `left ${DURATION}ms ${EASE}, top ${DURATION}ms ${EASE}, width ${DURATION}ms ${EASE}, height ${DURATION}ms ${EASE}, opacity ${hidden ? 300 : DURATION}ms ${EASE}`,
                cursor: viewMode === "grid" ? "pointer" : "default",
                pointerEvents: hidden ? "none" : "auto",
                willChange: "left, top, width, height, opacity",
              }}
            >
              {item.videoUrl ? (
                <video
                  src={item.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : item.image ? (
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.industry}
                    fill
                    className="object-contain"
                    sizes="70vw"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
