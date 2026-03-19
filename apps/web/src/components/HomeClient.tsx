"use client";

import { useState } from "react";
import type { BrandConfig } from "@/types/brand";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Services from "@/components/sections/Services";
import Shop from "@/components/sections/Shop";
import Demo from "@/components/sections/Demo";
import Metrics from "@/components/sections/Metrics";
import FAQ from "@/components/sections/FAQ";
import Blog from "@/components/sections/Blog";
import PaymentModal from "@/components/ui/PaymentModal";

interface HomeClientProps {
  brand: BrandConfig;
}

export default function HomeClient({ brand }: HomeClientProps) {
  const [activePkg, setActivePkg] = useState<BrandConfig["creditPackages"][number] | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar brand={brand} />

      <main className="flex-grow">
        {/* 1 — Hook */}
        <Hero brand={brand} />

        {/* 2 — Why us */}
        <Features brand={brand} />

        {/* 3 — Video proof */}
        <Demo brand={brand} />

        {/* 4 — Social metrics */}
        <Metrics brand={brand} />

        {/* 5 — Additional services */}
        <Services
          brand={brand}
          onBuyKyc={(tier) => {
            // Map KYC tier into a pseudo credit package for the modal
            setActivePkg({
              id: `kyc-${tier.label.toLowerCase().replace(/\s/g, "-")}`,
              name: `KYC Fix — ${tier.label}`,
              credits: 0,
              price: tier.price,
              boost: null,
              badge: null,
            });
          }}
        />

        {/* 6 — Credit packages / shop */}
        <Shop brand={brand} onBuy={setActivePkg} />

        {/* 7 — Blog */}
        <Blog />

        {/* 8 — FAQ */}
        <FAQ brand={brand} />
      </main>

      <Footer brand={brand} />

      {/* Payment modal */}
      {activePkg && (
        <PaymentModal
          pkg={activePkg}
          brand={brand}
          onClose={() => setActivePkg(null)}
        />
      )}
    </div>
  );
}
