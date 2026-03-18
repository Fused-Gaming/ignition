import { loadBrandConfig } from "@/lib/brand";
import AffiliatesClient from "@/components/AffiliatesClient";

export async function generateMetadata() {
  const brand = await loadBrandConfig();
  return {
    title: `Affiliates — ${brand.name}`,
    description: `Earn ${brand.affiliateCommission} commission referring players to ${brand.name}. ${brand.affiliateDescription}`,
  };
}

export default async function AffiliatesPage() {
  const brand = await loadBrandConfig();
  return <AffiliatesClient brand={brand} />;
}
