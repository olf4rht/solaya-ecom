"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[140px] pointer-events-none">
      <div className="bg-white flex flex-col items-start left-[41px] overflow-clip px-[14px] py-[9px] rounded-[20px] top-[26px] absolute pointer-events-auto" style={{ width: "clamp(320px, 23%, 395px)" }}>
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
          <div className="flex items-center justify-between w-full text-[11px] font-medium text-content-primary whitespace-nowrap">
            <div className="flex items-center justify-between w-[138px]">
              <Link href="/#products" className="hover:opacity-70 transition-opacity">
                All Products
              </Link>
              <button className="hover:opacity-70 transition-opacity">
                Industry
              </button>
            </div>
            <a
              href="https://solaya.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-right hover:opacity-70 transition-opacity"
            >
              Solaya Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
