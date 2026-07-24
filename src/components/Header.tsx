"use client";

import Link from "next/link";
import Image from "next/image";

const categories = [
  { label: "Fashion & Apparel", handle: "fashion-apparel" },
  { label: "Consumer Electronics", handle: "consumer-electronics" },
  { label: "Cosmetics & Beauty", handle: "cosmetics-beauty" },
  { label: "Furniture & Homeware", handle: "furniture-homeware" },
];

interface HeaderProps {
  showCategoryNav?: boolean;
}

export default function Header({ showCategoryNav = false }: HeaderProps) {
  return (
    <header className="flex items-start justify-between px-6 py-4 w-full">
      <div className="flex gap-6 items-start px-4 py-2 rounded-[20px]">
        {/* Logo */}
        <div className="flex flex-col items-start py-[6px]">
          <Link href="/">
            <Image
              src="/assets/logo.svg"
              alt="Solaya"
              width={117}
              height={27}
              priority
            />
          </Link>
        </div>

        {/* Category Nav - only shown on product pages (next to logo) */}
        {showCategoryNav && (
          <div className="flex flex-col gap-6 items-start justify-center rounded-[12px]">
            <nav className="hidden items-center md:flex">
              {categories.map((cat) => (
                <a
                  key={cat.handle}
                  href={`/#${cat.handle}`}
                  className="flex items-center justify-center px-4 py-3 rounded-[12px] text-[12px] font-medium text-content-primary whitespace-nowrap hover:opacity-70 transition-opacity"
                >
                  {cat.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 items-start justify-end">
        <div className="flex flex-col items-start py-2 w-[125px]">
          <a
            href="#contact"
            className="flex items-center justify-center w-full px-4 py-3 rounded-[12px] border border-content-tertiary text-[12px] font-medium text-content-primary hover:opacity-70 transition-opacity"
          >
            Contact us
          </a>
        </div>
        <div className="flex flex-col items-start py-2 w-[125px]">
          <a
            href="https://solaya.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-3 rounded-[12px] bg-content-primary text-[12px] font-medium text-white hover:opacity-80 transition-opacity"
          >
            Download Solaya
          </a>
        </div>
      </div>
    </header>
  );
}
