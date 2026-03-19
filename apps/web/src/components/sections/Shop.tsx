"use client";

import { motion } from "framer-motion";
import type { BrandConfig } from "@/types/brand";

interface ShopProps {
  brand: BrandConfig;
  onBuy: (pkg: BrandConfig["creditPackages"][number]) => void;
}

export default function Shop({ brand, onBuy }: ShopProps) {
  return (
    <section id="shop" className="px-4 sm:px-10 py-20"
      style={{ background: "var(--brand-bg-secondary)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-heading">Credit Packages</h2>
          <p className="section-subheading">
            Top up once. The system runs indefinitely.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {brand.creditPackages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="card card-hover relative flex flex-col"
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge">{pkg.badge}</span>
                </div>
              )}

              <div className="text-center flex-grow pt-2">
                <h3 className="font-bold text-base">{pkg.name}</h3>
                <div className="mt-3 text-3xl font-black">
                  ${pkg.price.toLocaleString()}
                </div>
                <div className="text-sm mt-1" style={{ color: "var(--brand-muted)" }}>
                  {pkg.credits.toLocaleString()} credits
                </div>
                {pkg.boost && (
                  <div className="mt-2 text-xs font-semibold px-2 py-1 rounded-full inline-block"
                    style={{ background: "rgba(220,38,38,0.15)", color: "var(--brand-primary)" }}>
                    {pkg.boost}
                  </div>
                )}
              </div>

              <button
                onClick={() => onBuy(pkg)}
                className="btn-primary w-full mt-5 py-2.5 text-sm"
              >
                Purchase
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "var(--brand-faint)" }}>
          Payments processed via NOWPayments (crypto). Telegram username required at checkout.
        </p>
      </div>
    </section>
  );
}
