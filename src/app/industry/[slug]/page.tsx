import { sanityClient } from "@/sanity/lib/client";
import { industryBySlugQuery, industryCountQuery } from "@/sanity/lib/queries";
import type { SanityIndustry } from "@/sanity/types";
import IndustryPageClient from "./IndustryPageClient";

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [industry, totalCount]: [SanityIndustry | null, number] = await Promise.all([
    sanityClient.fetch(industryBySlugQuery, { slug }),
    sanityClient.fetch(industryCountQuery),
  ]);

  if (!industry) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[14px] text-content-secondary">Industry not found.</p>
      </div>
    );
  }

  return <IndustryPageClient industry={industry} totalCount={totalCount} />;
}
