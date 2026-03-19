import { loadBrandConfig } from "@/lib/brand";
import StatusClient from "@/components/StatusClient";

export async function generateMetadata() {
  const brand = await loadBrandConfig();
  return {
    title: `System Status — ${brand.name}`,
    description: `Operational status and deployment info for ${brand.domain}`,
    robots: "noindex, nofollow",
  };
}

export default async function StatusPage() {
  const brand = await loadBrandConfig();
  return <StatusClient brand={brand} />;
}
