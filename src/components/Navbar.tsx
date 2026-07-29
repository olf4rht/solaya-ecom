"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { industries } from "@/lib/industries";

export default function Navbar() {
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (listRef.current) {
      setListHeight(listRef.current.scrollHeight);
    }
  }, [expanded]);

  // Listen for hover events from IndustryShowcase
  useEffect(() => {
    const onHover = (e: Event) => {
      const index = (e as CustomEvent).detail as number | null;
      if (index !== null) {
        setHoveredIndex(index);
        setExpanded(true);
      } else {
        setHoveredIndex(null);
        setExpanded(false);
      }
    };
    window.addEventListener("hoverIndustry", onHover);
    return () => window.removeEventListener("hoverIndustry", onHover);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none" style={{ height: expanded ? "300px" : "140px" }}>
      {/* Download Solaya CTA — top right, hidden on small mobile */}
      <a
        href="https://solaya.app"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 md:right-[41px] top-[26px] pointer-events-auto hidden sm:inline-flex items-center justify-center h-[38px] px-[20px] rounded-[12px] bg-[#2A2A27] text-[12px] font-medium text-white tracking-[0.2px] hover:bg-[#3a3a37] transition-colors"
      >
        Download Solaya
      </a>
      <div
        className="bg-white flex flex-col items-start left-4 md:left-[41px] px-[14px] py-[9px] rounded-[20px] top-[26px] absolute pointer-events-auto"
        style={{
          width: "clamp(260px, 70vw, 395px)",
          transition: "height 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          overflow: "hidden",
        }}
      >
        <div className="flex flex-col gap-[20px] md:gap-[31px] items-start w-full">
          <Link href="/">
            <Image
              src="/assets/logo.svg"
              alt="Solaya"
              width={117}
              height={27}
              priority
            />
          </Link>
          <div className="flex items-center w-full text-[11px] font-medium whitespace-nowrap">
            <button
              onClick={() => {
                setExpanded(!expanded);
                if (expanded) setHoveredIndex(null);
              }}
              className="hover:opacity-70 transition-opacity cursor-pointer"
              style={{ color: "#2A2A27" }}
            >
              Industry
            </button>
            <div className="ml-auto flex items-center gap-[20px] md:gap-[40px]">
              <button
                className="hover:opacity-70 transition-opacity cursor-pointer hidden sm:block"
                style={{
                  color: expanded ? "#BBBBB7" : "#2A2A27",
                  transition: "color 300ms ease",
                }}
              >
                Contact us
              </button>
              <a
                href="https://solaya.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                style={{
                  color: expanded ? "#BBBBB7" : "#2A2A27",
                  transition: "color 300ms ease",
                }}
              >
                Solaya Website
              </a>
            </div>
          </div>
        </div>

        {/* Expandable industry list */}
        <div
          ref={listRef}
          style={{
            maxHeight: expanded ? `${listHeight}px` : "0px",
            opacity: expanded ? 1 : 0,
            transition: "max-height 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <div className="flex flex-col items-start gap-[6px] pt-[16px] pb-[6px] w-full">
            {industries.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  router.push(`/industry/${item.slug}`);
                  setExpanded(false);
                  setHoveredIndex(null);
                }}
                className="text-[11px] font-medium hover:opacity-70 transition-opacity cursor-pointer text-left"
                style={{
                  color: "#BBBBB7",
                  opacity: hoveredIndex !== null ? (index === hoveredIndex ? 1 : 0.3) : 1,
                  transition: "opacity 300ms ease",
                }}
              >
                {item.industry}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
