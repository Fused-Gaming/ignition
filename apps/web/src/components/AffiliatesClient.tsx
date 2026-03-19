"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { BrandConfig } from "@/types/brand";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const steps = [
  { num: "01", title: "Sign Up", desc: "Create your affiliate account via Telegram in under 60 seconds." },
  { num: "02", title: "Get Your Link", desc: "Receive a unique referral URL tied to your Telegram username." },
  { num: "03", title: "Share & Earn", desc: "Every user who purchases through your link earns you commission — instantly." },
];

const tiers = [
  { label: "Starter", refs: "1–10 referrals", rate: "10%", bg: "var(--brand-bg-secondary)" },
  { label: "Active", refs: "11–50 referrals", rate: "15%", bg: "var(--brand-bg-tertiary)" },
  { label: "Pro", refs: "51+ referrals", rate: "20%", bg: "var(--brand-primary)", textWhite: true },
];

interface AffiliatesClientProps {
  brand: BrandConfig;
}

export default function AffiliatesClient({ brand }: AffiliatesClientProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar brand={brand} />

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative px-4 sm:px-10 pt-20 pb-24 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(var(--brand-border) 1px, transparent 1px), linear-gradient(90deg, var(--brand-border) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div
            className="absolute top-0 right-0 w-[500px] h-[400px] opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top right, var(--brand-primary) 0%, transparent 70%)" }}
          />

          <div className="relative max-w-7xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "var(--brand-primary)" }}>
                Partner Program
              </div>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
                Earn Up to{" "}
                <span style={{ color: "var(--brand-primary)" }}>{brand.affiliateCommission}</span>
              </h1>
              <p className="mt-5 text-lg max-w-xl mx-auto" style={{ color: "var(--brand-muted)" }}>
                {brand.affiliateDescription} Refer players, watch the commission stack.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://t.me/stakereloadxs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-8 py-3.5 text-base font-semibold"
                >
                  Join as Affiliate
                </a>
                <Link href="/" className="btn-secondary px-8 py-3.5 text-base font-semibold">
                  Back to Home
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 sm:px-10 py-20" style={{ background: "var(--brand-bg-secondary)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="section-heading">How It Works</h2>
              <p className="section-subheading">Three steps. No friction. No cap.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-black mb-4" style={{ color: "var(--brand-primary)", opacity: 0.3 }}>
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm" style={{ color: "var(--brand-muted)" }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Commission tiers */}
        <section className="px-4 sm:px-10 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="section-heading">Commission Tiers</h2>
              <p className="section-subheading">The more you refer, the more you earn.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tiers.map((tier, i) => (
                <motion.div
                  key={tier.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-xl p-8 text-center"
                  style={{
                    background: tier.bg,
                    border: `1px solid ${tier.textWhite ? "transparent" : "var(--brand-border)"}`,
                    color: tier.textWhite ? "white" : "inherit",
                  }}
                >
                  <div className="text-sm font-semibold mb-2 opacity-70">{tier.label}</div>
                  <div className="text-4xl font-black mb-2">{tier.rate}</div>
                  <div className="text-sm opacity-70">{tier.refs}</div>
                </motion.div>
              ))}
            </div>

            <div className="card mt-8 text-center">
              <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
                Payouts are processed in crypto (BTC, ETH, USDT) weekly, directly to your wallet.
                No minimum threshold. No paperwork.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-10 py-20" style={{ background: "var(--brand-bg-secondary)" }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start earning?</h2>
            <p className="mb-8" style={{ color: "var(--brand-muted)" }}>
              Message us on Telegram and we&apos;ll have your affiliate link active within minutes.
            </p>
            <a
              href="https://t.me/stakereloadxs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-10 py-4 text-base font-semibold"
            >
              Get Started on Telegram
            </a>
          </div>
        </section>
      </main>

      <Footer brand={brand} />
    </div>
  );
}
