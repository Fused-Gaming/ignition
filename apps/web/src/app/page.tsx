import { loadBrandConfig } from "@/lib/brand";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const brand = await loadBrandConfig();
  return <HomeClient brand={brand} />;
}
