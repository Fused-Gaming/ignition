/**
 * Dynamic OG Image Generator
 *
 * Routes:
 *   GET /og                → default brand OG (hero)
 *   GET /og?page=affiliates → affiliates page OG
 *   GET /og?page=shop      → shop / credit packages OG
 *   GET /og?page=status    → system status OG
 *   GET /og?pkg=100k       → specific credit package OG (for share cards)
 *
 * All visuals derived from brand design tokens:
 *   --brand-primary, --brand-bg, --brand-text, etc.
 *
 * Uses Next.js ImageResponse (built on @vercel/og / Satori).
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { loadBrandConfig } from "@/lib/brand";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const brand = await loadBrandConfig();
  const { searchParams } = new URL(req.url);

  const page  = searchParams.get("page") ?? "home";
  const pkgId = searchParams.get("pkg") ?? null;

  // Resolve which copy/context to show
  const ctx = resolveContext(brand, page, pkgId);

  // Brand colors direct from config (not CSS vars — Satori needs raw values)
  const colors = {
    bg:        brand.theme.background,
    bgSec:     brand.theme.backgroundSecondary,
    primary:   brand.theme.primary,
    text:      brand.theme.text,
    muted:     brand.theme.textMuted,
    faint:     brand.theme.textFaint,
    border:    brand.theme.border,
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: colors.bg,
          position: "relative",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${colors.border} 1px, transparent 1px), linear-gradient(90deg, ${colors.border} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            opacity: 0.08,
          }}
        />

        {/* Top glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background: `radial-gradient(ellipse at center, ${colors.primary}33 0%, transparent 70%)`,
          }}
        />

        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "6px",
            background: colors.primary,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "60px 80px 60px 96px",
          }}
        >
          {/* Top: brand name + badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: colors.primary,
                letterSpacing: "-0.5px",
              }}
            >
              {brand.name}
            </span>
            {ctx.badge && (
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: "999px",
                  background: `${colors.primary}20`,
                  color: colors.primary,
                  border: `1px solid ${colors.primary}40`,
                }}
              >
                {ctx.badge}
              </span>
            )}
          </div>

          {/* Main content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                fontSize: ctx.headline.length > 30 ? "52px" : "68px",
                fontWeight: 900,
                color: colors.text,
                lineHeight: 1.05,
                letterSpacing: "-1px",
                maxWidth: "800px",
              }}
            >
              {ctx.headline}
            </div>
            <div
              style={{
                fontSize: "24px",
                color: colors.muted,
                maxWidth: "680px",
                lineHeight: 1.4,
              }}
            >
              {ctx.subline}
            </div>
          </div>

          {/* Bottom: stats / CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "48px" }}>
              {ctx.stats.map((s) => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "28px", fontWeight: 900, color: colors.primary }}>
                    {s.value}
                  </span>
                  <span style={{ fontSize: "13px", color: colors.muted, marginTop: "2px" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "16px 32px",
                background: colors.primary,
                borderRadius: "10px",
                fontSize: "18px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              {ctx.cta}
            </div>
          </div>
        </div>

        {/* Domain watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "80px",
            fontSize: "14px",
            color: colors.faint,
            fontFamily: "monospace",
          }}
        >
          {brand.domain}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface OGContext {
  headline: string;
  subline:  string;
  badge:    string | null;
  cta:      string;
  stats:    { value: string; label: string }[];
}

function resolveContext(
  brand: ReturnType<typeof loadBrandConfig> extends Promise<infer T> ? T : never,
  page: string,
  pkgId: string | null
): OGContext {
  const defaultStats = (brand.stats ?? []).slice(0, 3);

  if (pkgId) {
    const pkg = brand.creditPackages?.find((p) => p.id === pkgId);
    if (pkg) {
      return {
        headline: pkg.name,
        subline:  `${pkg.credits.toLocaleString()} credits · ${pkg.boost ?? "Start claiming instantly"}`,
        badge:    pkg.badge ?? "Shop",
        cta:      `$${pkg.price.toLocaleString()} — Purchase`,
        stats:    defaultStats,
      };
    }
  }

  switch (page) {
    case "affiliates":
      return {
        headline: `Earn Up to ${brand.affiliateCommission}`,
        subline:  brand.affiliateDescription,
        badge:    "Partner Program",
        cta:      "Join as Affiliate",
        stats:    [
          { value: brand.affiliateCommission, label: "Max Commission" },
          { value: "Weekly",                  label: "Payout Frequency" },
          { value: "No Cap",                  label: "Earnings Limit" },
        ],
      };

    case "shop":
      return {
        headline: "Credit Packages",
        subline:  "Top up once. The system runs indefinitely.",
        badge:    "Shop",
        cta:      "View All Packages",
        stats:    defaultStats,
      };

    case "status":
      return {
        headline: "System Status",
        subline:  `${brand.domain} — Operational`,
        badge:    "Status",
        cta:      "Check Live Status",
        stats:    [
          { value: "99.9%", label: "Uptime" },
          { value: "<2s",   label: "Claim Speed" },
          { value: "24/7",  label: "Support" },
        ],
      };

    default:
      return {
        headline: brand.tagline,
        subline:  brand.subTagline,
        badge:    null,
        cta:      brand.ctaPrimary,
        stats:    defaultStats,
      };
  }
}
