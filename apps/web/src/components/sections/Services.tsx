"use client";

import { motion } from "framer-motion";
import type { BrandConfig } from "@/types/brand";

interface ServicesProps {
  brand: BrandConfig;
  onBuyKyc?: (tier: { label: string; price: number }) => void;
}

export default function Services({ brand, onBuyKyc }: ServicesProps) {
  return (
    <section id="services" className="px-4 sm:px-10 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-heading">Services</h2>
          <p className="section-subheading">Specialized solutions beyond the reload system.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {brand.services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card card-hover flex flex-col"
            >
              <h3 className="text-lg font-bold mb-2">{service.title}</h3>
              <p className="text-sm mb-4 flex-grow" style={{ color: "var(--brand-muted)" }}>
                {service.description}
              </p>

              {service.tiers && service.tiers.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {service.tiers.map((tier) => (
                    <button
                      key={tier.label}
                      onClick={() => onBuyKyc?.(tier)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
                      style={{ background: "var(--brand-bg-tertiary)", border: "1px solid var(--brand-border)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-primary)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-border)";
                      }}
                    >
                      <span>{tier.label}</span>
                      <span className="font-bold" style={{ color: "var(--brand-primary)" }}>
                        ${tier.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <a
                  href={service.id === "affiliates" ? "/affiliates" : "#contact"}
                  className="btn-secondary text-sm text-center mt-2"
                >
                  {service.id === "affiliates" ? "Learn More →" : "Get Started →"}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
