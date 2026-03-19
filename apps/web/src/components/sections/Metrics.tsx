"use client";

import { motion } from "framer-motion";
import type { BrandConfig } from "@/types/brand";

interface MetricsProps {
  brand: BrandConfig;
}

export default function Metrics({ brand }: MetricsProps) {
  return (
    <section className="px-4 sm:px-10 py-16"
      style={{ background: "var(--brand-primary)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          {brand.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <div className="text-3xl sm:text-4xl font-black">{m.value}</div>
              <div className="text-sm mt-1 opacity-80">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
