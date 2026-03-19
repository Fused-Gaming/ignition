"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BrandConfig } from "@/types/brand";

interface HeroProps {
  brand: BrandConfig;
}

export default function Hero({ brand }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-4 sm:px-10 pt-20 pb-24">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(var(--brand-border) 1px, transparent 1px), linear-gradient(90deg, var(--brand-border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, var(--brand-primary) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "var(--brand-primary)" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--brand-primary)" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--brand-primary)" }} />
            </span>
            Live — Claiming Now
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
            {brand.tagline}
          </h1>

          {/* Sub */}
          <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--brand-muted)" }}>
            {brand.subTagline}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#shop" className="btn-primary px-8 py-3.5 text-base font-semibold">
              {brand.ctaPrimary}
            </Link>
            <Link href="#demo" className="btn-secondary px-8 py-3.5 text-base font-semibold">
              {brand.ctaSecondary}
            </Link>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          {brand.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black" style={{ color: "var(--brand-primary)" }}>
                {stat.value}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--brand-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
