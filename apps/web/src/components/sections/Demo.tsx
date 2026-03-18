"use client";

import { motion } from "framer-motion";
import type { BrandConfig } from "@/types/brand";

interface DemoProps {
  brand: BrandConfig;
}

export default function Demo({ brand }: DemoProps) {
  if (!brand.demoVideoId) return null;

  return (
    <section id="demo" className="px-4 sm:px-10 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading">See It in Action</h2>
          <p className="section-subheading mb-10">
            Check out our demo and see for yourself — under 2 seconds, every time.
          </p>

          <div className="relative w-full rounded-xl overflow-hidden"
            style={{ paddingBottom: "56.25%", background: "var(--brand-bg-secondary)", border: "1px solid var(--brand-border)" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${brand.demoVideoId}`}
              title="Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
