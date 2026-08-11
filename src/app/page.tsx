import Navbar from "@/components/Navbar";
import IndustryShowcase from "@/components/IndustryShowcase";
import { sanityClient } from "@/sanity/lib/client";
import { allIndustriesQuery } from "@/sanity/lib/queries";
import type { SanityIndustry } from "@/sanity/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const industries: SanityIndustry[] = await sanityClient.fetch(allIndustriesQuery);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Navbar industries={industries} />
      {industries.length > 0 ? (
        <IndustryShowcase industries={industries} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-[13px] text-content-secondary">No industries yet. Add content in <a href="/studio" className="underline">/studio</a>.</p>
        </div>
      )}
    </div>
  );
}
