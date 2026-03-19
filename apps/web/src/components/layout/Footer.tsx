import Link from "next/link";
import type { BrandConfig } from "@/types/brand";

interface FooterProps {
  brand: BrandConfig;
}

export default function Footer({ brand }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--brand-bg-secondary)", borderTop: "1px solid var(--brand-border)" }}>
      {/* Newsletter */}
      <div className="border-b" style={{ borderColor: "var(--brand-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold">Stay in the loop</h3>
              <p className="text-sm mt-1" style={{ color: "var(--brand-muted)" }}>
                New features, reload windows, and platform updates — direct to your inbox.
              </p>
            </div>
            <form
              className="flex gap-2 w-full sm:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-64 px-4 py-2 rounded-md text-sm text-white outline-none focus:ring-2"
                style={{
                  background: "var(--brand-bg-tertiary)",
                  border: "1px solid var(--brand-border)",
                  // @ts-expect-error css var
                  "--tw-ring-color": "var(--brand-primary)",
                }}
              />
              <button type="submit" className="btn-primary text-sm px-5 py-2">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="text-xl font-bold" style={{ color: "var(--brand-primary)" }}>
              {brand.name}
            </Link>
            <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--brand-muted)" }}>
              {brand.subTagline}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
              Services
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--brand-muted)" }}>
              <li><Link href="#shop" className="hover:text-white transition-colors">Credit Packages</Link></li>
              <li><Link href="#shop" className="hover:text-white transition-colors">KYC Account Fixes</Link></li>
              <li><Link href="#shop" className="hover:text-white transition-colors">Wager Guarantees</Link></li>
              <li><Link href="/affiliates" className="hover:text-white transition-colors">Affiliates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
              Resources
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--brand-muted)" }}>
              <li><Link href="#faq" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#demo" className="hover:text-white transition-colors">Demo Video</Link></li>
              <li><Link href="#blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
              Company
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--brand-muted)" }}>
              <li><Link href="#team" className="hover:text-white transition-colors">Team</Link></li>
              <li><Link href="/affiliates" className="hover:text-white transition-colors">Partner Program</Link></li>
              <li>
                <a
                  href="https://t.me/stakereloadxs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: "var(--brand-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
            {year} © All Rights Reserved | {brand.name}
          </p>
          <p className="text-xs" style={{ color: "var(--brand-faint)" }}>
            For entertainment and automation use only. Not affiliated with Stake.com.
          </p>
        </div>
      </div>
    </footer>
  );
}
