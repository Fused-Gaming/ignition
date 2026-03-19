import type { Metadata } from "next";
import { loadBrandConfig } from "@/lib/brand";
import AffiliatesClient from "@/components/AffiliatesClient";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await loadBrandConfig();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${brand.domain}`;
  const ogImage = `${baseUrl}/og?page=affiliates`;

  return {
    title:       `Affiliates — ${brand.name}`,
    description: `Earn ${brand.affiliateCommission} commission referring players to ${brand.name}. ${brand.affiliateDescription}`,
    openGraph: {
      title:       `Affiliates — ${brand.name}`,
      description: brand.affiliateDescription,
      url:         `${baseUrl}/affiliates`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${brand.name} Affiliates` }],
    },
    twitter: {
      card:   "summary_large_image",
      title:  `Affiliates — ${brand.name}`,
      images: [ogImage],
    },
  };
}

export default async function AffiliatesPage() {
  const brand = await loadBrandConfig();
  return <AffiliatesClient brand={brand} />;
}
