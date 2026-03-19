"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BrandConfig } from "@/types/brand";

const defaultFAQ = [
  { q: "Is this actually legitimate?", a: "Yes. We operate within the reload and bonus systems these platforms make available. We just maximize every cycle automatically." },
  { q: "How fast are reloads processed?", a: "Typically under 2 seconds once a cycle triggers. Speed depends on platform response times." },
  { q: "What's the minimum to start?", a: "The New XSID package starts at $5. Connect your Telegram and the system handles the rest." },
  { q: "What payment methods are accepted?", a: "We accept crypto payments via NOWPayments — Bitcoin, Ethereum, USDT, and more." },
  { q: "How do I get support?", a: "Reach us 24/7 on Telegram. Response time is typically under 15 minutes." },
];

interface FAQProps {
  brand: BrandConfig;
}

export default function FAQ({ brand }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = (brand as unknown as { faq?: { q: string; a: string }[] }).faq ?? defaultFAQ;

  return (
    <section id="faq" className="px-4 sm:px-10 py-20"
      style={{ background: "var(--brand-bg-secondary)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-heading">Help Center</h2>
          <p className="section-subheading">Answers to the questions we get most.</p>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--brand-border)" }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-sm hover:text-white transition-colors"
                style={{ background: "var(--brand-bg-tertiary)" }}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{item.q}</span>
                <svg
                  className={`w-4 h-4 flex-shrink-0 ml-4 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  style={{ color: "var(--brand-primary)" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 py-4 text-sm leading-relaxed"
                      style={{ color: "var(--brand-muted)", background: "var(--brand-bg)" }}>
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
