"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

type ViewMode = "list" | "grid";

interface IndustrySection {
  id: number;
  industry: string;
  brand: string;
  videoUrl?: string;
  image?: string;
}

const industries: IndustrySection[] = [
  {
    id: 1,
    industry: "Food & Beverages",
    brand: "Walmart",
    videoUrl: "/assets/videos/01.mp4",
  },
  {
    id: 2,
    industry: "Art, Culture & Collectibles",
    brand: "Sotheby's",
    videoUrl: "/assets/videos/02.mp4",
  },
  {
    id: 3,
    industry: "Consumer Electronics",
    brand: "Samsung",
    videoUrl: "/assets/videos/03.mp4",
  },
  {
    id: 4,
    industry: "Cosmetics & Beauty",
    brand: "Chanel",
    videoUrl: "/assets/videos/04.mp4",
  },
  {
    id: 5,
    industry: "Fashion & Apparel",
    brand: "Gucci",
    videoUrl: "/assets/videos/05.mp4",
  },
  {
    id: 6,
    industry: "Furniture & Homeware",
    brand: "IKEA",
    videoUrl: "/assets/videos/06.mp4",
  },
  {
    id: 7,
    industry: "Manufacturing & Industrial Design",
    brand: "Siemens",
    image: "/assets/products/pink-sneaker.png",
  },
];

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const TOTAL = industries.length;
const EXPAND_DURATION = 700;

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

function Footage({ item, startTime, onVideoRef }: { item: IndustrySection; startTime?: number; onVideoRef?: (el: HTMLVideoElement | null) => void }) {
  return item.videoUrl ? (
    <video
      ref={(el) => {
        if (el && startTime !== undefined) {
          el.currentTime = startTime;
        }
        onVideoRef?.(el);
      }}
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
  ) : null;
}

interface TransitionState {
  index: number;
  fromRect: DOMRect;
  videoTime: number;
}

export default function IndustryShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [transition, setTransition] = useState<TransitionState | null>(null);
  const [expandPhase, setExpandPhase] = useState<"start" | "end" | null>(null);
  const [retract, setRetract] = useState<{ index: number; toRect: { left: number; top: number; width: number; height: number }; videoTime: number } | null>(null);
  const [retractPhase, setRetractPhase] = useState<"start" | "end" | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const overlayVideoTimeRef = useRef<number>(0);

  useEffect(() => {
    if (viewMode !== "list") return;

    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      { threshold: 0.6, root: container }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [viewMode]);

  const handleViewChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleGridSelect = useCallback((index: number) => {
    const el = gridItemRefs.current[index];
    if (!el) {
      setActiveIndex(index);
      setViewMode("list");
      return;
    }

    const fromRect = el.getBoundingClientRect();
    const video = el.querySelector("video");
    const videoTime = video ? video.currentTime : 0;
    setTransition({ index, fromRect, videoTime });
    setExpandPhase("start");

    // Trigger the expand animation on the next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setExpandPhase("end");
      });
    });

    // After animation completes, switch to list view
    setTimeout(() => {
      // Capture overlay video time before removing it
      const overlayVideo = document.querySelector(".fixed.inset-0.z-40 video") as HTMLVideoElement | null;
      overlayVideoTimeRef.current = overlayVideo ? overlayVideo.currentTime : videoTime;

      setActiveIndex(index);
      setViewMode("list");
      setTransition(null);
      setExpandPhase(null);

      requestAnimationFrame(() => {
        const section = sectionRefs.current[index];
        if (section) {
          section.scrollIntoView({ behavior: "instant" });
          // Sync the list view video to the overlay's playback position
          const listVideo = section.querySelector("video");
          if (listVideo) {
            listVideo.currentTime = overlayVideoTimeRef.current;
          }
        }
      });
    }, EXPAND_DURATION);
  }, []);

  const handleClose = useCallback(() => {
    const gridItemSize = 200;
    const gap = 16;
    const totalWidth = TOTAL * gridItemSize + (TOTAL - 1) * gap;
    const startLeft = (window.innerWidth - totalWidth) / 2;
    const itemLeft = startLeft + activeIndex * (gridItemSize + gap);
    const itemTop = (window.innerHeight - gridItemSize) / 2;

    // Capture current video time from list view
    const section = sectionRefs.current[activeIndex];
    const listVideo = section?.querySelector("video");
    const videoTime = listVideo ? listVideo.currentTime : 0;

    setRetract({ index: activeIndex, toRect: { left: itemLeft, top: itemTop, width: gridItemSize, height: gridItemSize }, videoTime });
    setRetractPhase("start");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRetractPhase("end");
      });
    });

    setTimeout(() => {
      // Capture overlay video time before removing
      const overlayVideo = document.querySelector(".fixed.inset-0.z-40 video") as HTMLVideoElement | null;
      overlayVideoTimeRef.current = overlayVideo ? overlayVideo.currentTime : videoTime;

      setViewMode("grid");
      setRetract(null);
      setRetractPhase(null);

      // Sync the grid video after switching
      requestAnimationFrame(() => {
        const gridEl = gridItemRefs.current[activeIndex];
        const gridVideo = gridEl?.querySelector("video");
        if (gridVideo) {
          gridVideo.currentTime = overlayVideoTimeRef.current;
        }
      });
    }, EXPAND_DURATION);
  }, [activeIndex]);

  const padIndex = (i: number) => String(i + 1).padStart(2, "0");

  // Calculate the target rect (center of viewport, 70vw x 70vh)
  const targetWidth = typeof window !== "undefined" ? window.innerWidth * 0.7 : 800;
  const targetHeight = typeof window !== "undefined" ? window.innerHeight * 0.7 : 600;
  const targetLeft = typeof window !== "undefined" ? (window.innerWidth - targetWidth) / 2 : 0;
  const targetTop = typeof window !== "undefined" ? (window.innerHeight - targetHeight) / 2 : 0;

  return (
    <>
      <ViewToggle viewMode={viewMode} onChange={handleViewChange} />

      {/* Close button — fixed top right, list view only */}
      {viewMode === "list" && !retract && (
        <button
          onClick={handleClose}
          className="fixed z-50 cursor-pointer"
          style={{
            top: "200px",
            right: "41px",
            opacity: 1,
            transition: `opacity 400ms ${EASE}`,
            padding: "8px",
          }}
        >
          <CloseIcon />
        </button>
      )}

      <div
        className="w-full"
        style={{
          height: "100vh",
          transition: `opacity 400ms ${EASE}`,
        }}
      >
        {viewMode === "grid" ? (
          <div className="w-full h-full flex items-center justify-center px-12">
            <div className="flex items-center gap-4">
              {industries.map((item, index) => (
                <button
                  key={item.id}
                  ref={(el) => { gridItemRefs.current[index] = el; }}
                  onClick={() => handleGridSelect(index)}
                  className="shrink-0 cursor-pointer"
                  style={{
                    width: "200px",
                    height: "200px",
                    opacity: transition ? 0 : 1,
                    transition: transition ? `opacity 300ms ${EASE}` : "none",
                  }}
                >
                  {item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  ) : item.image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.image}
                        alt={item.industry}
                        fill
                        className="object-contain"
                        sizes="200px"
                      />
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="w-full"
            style={{
              height: "100vh",
              overflowY: "auto",
              scrollSnapType: "y mandatory",
            }}
          >
            {industries.map((item, index) => {
              const isActive = activeIndex === index;

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    sectionRefs.current[index] = el;
                  }}
                  className="relative w-full flex items-center justify-center"
                  style={{
                    height: "100vh",
                    scrollSnapAlign: "start",
                    scrollSnapStop: "always",
                  }}
                >
                  {/* Centered footage */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      transform: isActive ? "scale(1)" : "scale(0.5)",
                      opacity: retract && retract.index === index ? 0 : (isActive ? 1 : 0.5),
                      transition: `transform 800ms ${EASE}, opacity 800ms ${EASE}`,
                      willChange: "transform, opacity",
                      width: "70vw",
                      height: "70vh",
                      position: "relative",
                    }}
                  >
                    <Footage item={item} />
                  </div>

                  {/* Industry info — top left */}
                  <div
                    className="absolute top-[160px] left-[41px]"
                    style={{
                      opacity: isActive && !retract ? 1 : 0,
                      transform: isActive && !retract
                        ? "translateY(0)"
                        : "translateY(12px)",
                      transition: `opacity 600ms ${EASE} 200ms, transform 600ms ${EASE} 200ms`,
                    }}
                  >
                    <p className="text-[11px] font-medium text-content-secondary tracking-wide mb-2">
                      Industry {padIndex(index)} / {padIndex(TOTAL)}
                    </p>
                    <h2 className="text-[30px] font-normal text-[#302c2c] tracking-[-0.6px] leading-[1.1]">
                      {item.industry}
                    </h2>
                    <div className="mt-5 flex items-baseline gap-[40px]">
                      <span className="text-[11px] font-medium text-content-primary">
                        Brand:
                      </span>
                      <span className="text-[11px] font-normal text-content-primary">
                        {item.brand}
                      </span>
                    </div>
                    <p className="text-[11px] text-content-tertiary mt-1">0°</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FLIP transition overlay */}
      {transition && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {/* Expanding footage */}
          <div
            style={{
              position: "absolute",
              left: expandPhase === "end" ? targetLeft : transition.fromRect.left,
              top: expandPhase === "end" ? targetTop : transition.fromRect.top,
              width: expandPhase === "end" ? targetWidth : transition.fromRect.width,
              height: expandPhase === "end" ? targetHeight : transition.fromRect.height,
              transition: `all ${EXPAND_DURATION}ms ${EASE}`,
              willChange: "left, top, width, height",
            }}
          >
            <Footage
              item={industries[transition.index]}
              startTime={transition.videoTime}
              onVideoRef={(el) => {
                if (el) {
                  overlayVideoTimeRef.current = el.currentTime;
                }
              }}
            />
          </div>

          {/* Industry info fading in */}
          <div
            className="absolute top-[160px] left-[41px]"
            style={{
              opacity: expandPhase === "end" ? 1 : 0,
              transform: expandPhase === "end" ? "translateY(0)" : "translateY(20px)",
              transition: `opacity ${EXPAND_DURATION * 0.6}ms ${EASE} ${EXPAND_DURATION * 0.4}ms, transform ${EXPAND_DURATION * 0.6}ms ${EASE} ${EXPAND_DURATION * 0.4}ms`,
            }}
          >
            <p className="text-[11px] font-medium text-content-secondary tracking-wide mb-2">
              Industry {padIndex(transition.index)} / {padIndex(TOTAL)}
            </p>
            <h2 className="text-[30px] font-normal text-[#302c2c] tracking-[-0.6px] leading-[1.1]">
              {industries[transition.index].industry}
            </h2>
            <div className="mt-5 flex items-baseline gap-[40px]">
              <span className="text-[11px] font-medium text-content-primary">
                Brand:
              </span>
              <span className="text-[11px] font-normal text-content-primary">
                {industries[transition.index].brand}
              </span>
            </div>
            <p className="text-[11px] text-content-tertiary mt-1">0°</p>
          </div>
        </div>
      )}
      {/* Retract transition overlay */}
      {retract && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div
            style={{
              position: "absolute",
              left: retractPhase === "end" ? retract.toRect.left : targetLeft,
              top: retractPhase === "end" ? retract.toRect.top : targetTop,
              width: retractPhase === "end" ? retract.toRect.width : targetWidth,
              height: retractPhase === "end" ? retract.toRect.height : targetHeight,
              transition: `all ${EXPAND_DURATION}ms ${EASE}`,
              willChange: "left, top, width, height",
            }}
          >
            <Footage item={industries[retract.index]} startTime={retract.videoTime} />
          </div>
        </div>
      )}
    </>
  );
}
