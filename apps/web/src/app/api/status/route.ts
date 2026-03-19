import { NextRequest, NextResponse } from "next/server";
import { loadBrandConfig } from "@/lib/brand";

/**
 * GET /api/status
 *
 * Returns full operational status for this brand deployment.
 * Used by:
 *   - /status page (HTML dashboard)
 *   - Admin console status panel
 *   - External uptime monitors (e.g. UptimeRobot, BetterUptime)
 *   - Developer CLI health checks
 *
 * Template variables injected from brand config:
 *   {{BRAND_ID}}, {{BRAND_NAME}}, {{BRAND_DOMAIN}}, {{DEPLOY_ENV}}
 */
export async function GET(req: NextRequest) {
  const brand = await loadBrandConfig();
  const startTime = Date.now();

  // ── Collect check results ─────────────────────────────────────────────────
  const checks = await Promise.allSettled([
    checkPaymentApi(),
    checkNowPayments(),
    checkAnalyticsReachable(),
    checkCloudflare(brand.domain),
  ]);

  const [paymentApi, nowPayments, analytics, cloudflare] = checks.map((c) =>
    c.status === "fulfilled" ? c.value : { status: "error", message: (c as PromiseRejectedResult).reason?.message ?? "Check failed" }
  );

  const deployedAt = process.env.DEPLOY_TIMESTAMP ?? null;
  const gitSha     = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_SHA ?? null;
  const env        = process.env.NODE_ENV ?? "development";
  const region     = process.env.VERCEL_REGION ?? process.env.FLY_REGION ?? "unknown";

  // ── Features enabled per-brand ────────────────────────────────────────────
  const features = {
    nowpaymentsConfigured:  !!process.env.NOWPAYMENTS_API_KEY,
    tawkConfigured:         !!brand.chat?.propertyId,
    affiliatesEnabled:      true,
    creditPackagesCount:    brand.creditPackages?.length ?? 0,
    servicesCount:          brand.services?.length ?? 0,
    demoVideoEnabled:       !!brand.demoVideoId,
    multiLanguage:          false, // expand as i18n is added
    analyticsEnabled:       !!process.env.NEXT_PUBLIC_GA_ID || !!process.env.NEXT_PUBLIC_CF_BEACON,
  };

  const allHealthy = [paymentApi, nowPayments, cloudflare].every(
    (c) => (c as { status: string }).status === "ok"
  );

  const responseTimeMs = Date.now() - startTime;

  const payload = {
    // ── Identity ────────────────────────────────────────────────────────────
    brand: {
      id:     brand.id,
      name:   brand.name,
      domain: brand.domain,
      tone:   brand.tone,
    },

    // ── Deployment ──────────────────────────────────────────────────────────
    deployment: {
      environment:   env,
      region,
      gitSha,
      deployedAt,
      nextVersion:   process.env.NEXT_RUNTIME_VERSION ?? null,
      nodeVersion:   process.versions?.node ?? null,
    },

    // ── Health ───────────────────────────────────────────────────────────────
    health: {
      overall:     allHealthy ? "healthy" : "degraded",
      responseMs:  responseTimeMs,
      checks: {
        paymentApi,
        nowPayments,
        analytics,
        cloudflare,
      },
    },

    // ── Features ─────────────────────────────────────────────────────────────
    features,

    // ── Analytics ────────────────────────────────────────────────────────────
    analytics: {
      googleAnalyticsId:    process.env.NEXT_PUBLIC_GA_ID ?? null,
      cloudflareBeaconId:   process.env.NEXT_PUBLIC_CF_BEACON ?? null,
      tawkPropertyId:       brand.chat?.propertyId ?? null,
    },

    // ── Cloudflare ───────────────────────────────────────────────────────────
    cloudflare: cloudflare as object,

    // ── Sales Config ─────────────────────────────────────────────────────────
    sales: {
      creditPackages:      brand.creditPackages?.map((p) => ({ id: p.id, name: p.name, price: p.price })) ?? [],
      affiliateCommission: brand.affiliateCommission,
      paymentProvider:     brand.payment?.provider ?? "nowpayments",
      telegramRequired:    brand.payment?.telegramRequired ?? true,
    },

    // ── Timestamp ────────────────────────────────────────────────────────────
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache",
      "X-Brand-Id":    brand.id,
      "X-Brand-Domain": brand.domain,
    },
  });
}

// ── Individual checks ─────────────────────────────────────────────────────────

async function checkPaymentApi() {
  if (!process.env.NOWPAYMENTS_API_KEY) {
    return { status: "unconfigured", message: "NOWPAYMENTS_API_KEY not set" };
  }
  try {
    const res = await fetch("https://api.nowpayments.io/v1/status", {
      headers: { "x-api-key": process.env.NOWPAYMENTS_API_KEY },
      signal: AbortSignal.timeout(4000),
    });
    return res.ok
      ? { status: "ok", message: "Payment API reachable" }
      : { status: "error", message: `HTTP ${res.status}` };
  } catch (e) {
    return { status: "error", message: e instanceof Error ? e.message : "Unreachable" };
  }
}

async function checkNowPayments() {
  try {
    const res = await fetch("https://api.nowpayments.io/v1/status", {
      signal: AbortSignal.timeout(4000),
    });
    const data = await res.json().catch(() => ({}));
    return { status: "ok", message: data?.message ?? "NOWPayments API online" };
  } catch {
    return { status: "error", message: "NOWPayments API unreachable" };
  }
}

async function checkAnalyticsReachable() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const cfBeacon = process.env.NEXT_PUBLIC_CF_BEACON;
  if (!gaId && !cfBeacon) {
    return { status: "unconfigured", message: "No analytics configured" };
  }
  return {
    status: "ok",
    providers: [
      gaId     ? "Google Analytics" : null,
      cfBeacon ? "Cloudflare Web Analytics" : null,
    ].filter(Boolean),
  };
}

async function checkCloudflare(domain: string) {
  try {
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, {
      headers: { Accept: "application/dns-json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { status: "error", message: `DNS query failed: HTTP ${res.status}` };
    const data = await res.json();
    const answers = data?.Answer ?? [];
    return {
      status: answers.length > 0 ? "ok" : "warning",
      domain,
      resolvedTo: answers.map((a: { data: string }) => a.data),
      message: answers.length > 0 ? `Domain resolves (${answers.length} record(s))` : "No DNS records found",
    };
  } catch (e) {
    return { status: "error", message: e instanceof Error ? e.message : "DNS check failed" };
  }
}
