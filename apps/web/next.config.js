/** @type {import('next').NextConfig} */
const nextConfig = {
  // Multi-brand: brand key injected at build time or via env
  env: {
    NEXT_PUBLIC_BRAND: process.env.NEXT_PUBLIC_BRAND || "stakereloadxs",
  },
  // Allow serving from any domain
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "trustpilot.xyz" },
      { protocol: "https", hostname: "cdn.trustpilot.xyz" },
    ],
  },
  // Transpile local packages
  transpilePackages: ["@fused-gaming/ui", "@fused-gaming/branding", "@fused-gaming/copy"],
};

module.exports = nextConfig;
