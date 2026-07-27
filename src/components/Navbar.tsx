"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const industries = [
  "Food & Beverages",
  "Art, Culture & Collectibles",
  "Consumer Electronics",
  "Cosmetics & Beauty",
  "Fashion & Apparel",
  "Furniture & Homeware",
  "Manufacturing & Industrial Design",
];

export default function Navbar() {
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (listRef.current) {
      setListHeight(listRef.current.scrollHeight);
    }
  }, [expanded]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none" style={{ height: expanded ? "300px" : "140px" }}>
      <div
        className="bg-white flex flex-col items-start left-[41px] px-[14px] py-[9px] rounded-[20px] top-[26px] absolute pointer-events-auto"
        style={{
          width: "clamp(320px, 23%, 395px)",
          transition: "height 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          overflow: "hidden",
        }}
      >
        <div className="flex flex-col gap-[31px] items-start w-full">
          <Link href="/">
            <Image
              src="/assets/logo.svg"
              alt="Solaya"
              width={117}
              height={27}
              priority
            />
          </Link>
          <div className="flex items-center justify-between w-full text-[11px] font-medium whitespace-nowrap">
            <button
              onClick={() => setExpanded(!expanded)}
              className="hover:opacity-70 transition-opacity cursor-pointer"
              style={{ color: "#2A2A27" }}
            >
              Industry
            </button>
            <button
              className="hover:opacity-70 transition-opacity cursor-pointer"
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
              className="text-right hover:opacity-70 transition-opacity"
              style={{
                color: expanded ? "#BBBBB7" : "#2A2A27",
                transition: "color 300ms ease",
              }}
            >
              Solaya Website
            </a>
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
          <div className="flex flex-wrap gap-x-[24px] gap-y-[6px] pt-[16px] pb-[6px]">
            {industries.map((name, index) => (
              <button
                key={name}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("selectIndustry", { detail: index })
                  );
                  setExpanded(false);
                }}
                className="text-[11px] font-medium hover:opacity-70 transition-opacity cursor-pointer"
                style={{ color: "#BBBBB7" }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
