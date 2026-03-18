"use client";

import { useEffect, useState } from "react";
import type { BrandConfig } from "@/types/brand";

interface StatusPayload {
  brand: { id: string; name: string; domain: string; tone: string };
  deployment: {
    environment: string;
    region: string;
    gitSha: string | null;
    deployedAt: string | null;
    nextVersion: string | null;
    nodeVersion: string | null;
  };
  health: {
    overall: "healthy" | "degraded" | "down";
    responseMs: number;
    checks: Record<string, { status: string; message?: string; [k: string]: unknown }>;
  };
  features: Record<string, boolean | number>;
  analytics: {
    googleAnalyticsId: string | null;
    cloudflareBeaconId: string | null;
    tawkPropertyId: string | null;
  };
  cloudflare: { status: string; domain: string; resolvedTo?: string[]; message?: string };
  sales: {
    creditPackages: { id: string; name: string; price: number }[];
    affiliateCommission: string;
    paymentProvider: string;
    telegramRequired: boolean;
  };
  timestamp: string;
}

const STATUS_COLORS: Record<string, string> = {
  ok:           "#22c55e",
  healthy:      "#22c55e",
  warning:      "#f59e0b",
  degraded:     "#f59e0b",
  error:        "#ef4444",
  down:         "#ef4444",
  unconfigured: "#6b7280",
};

function StatusDot({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? "#6b7280";
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
    />
  );
}

function Badge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? "#6b7280";
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
      style={{ border: `1px solid ${color}`, color }}
    >
      {status}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #222" }}>
      <div className="px-5 py-3 text-xs font-semibold uppercase tracking-wider"
        style={{ background: "#111", borderBottom: "1px solid #222", color: "#9ca3af" }}>
        {title}
      </div>
      <div style={{ background: "#0d0d0d" }}>{children}</div>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between px-5 py-3 border-b last:border-b-0"
      style={{ borderColor: "#1a1a1a" }}>
      <span className="text-sm" style={{ color: "#9ca3af" }}>{label}</span>
      <span
        className={`text-sm text-right ml-4 ${mono ? "font-mono" : "font-medium"}`}
        style={{ color: mono ? "#22c55e" : "#f3f4f6" }}
      >
        {value}
      </span>
    </div>
  );
}

interface StatusClientProps {
  brand: BrandConfig;
}

export default function StatusClient({ brand }: StatusClientProps) {
  const [data, setData] = useState<StatusPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);

  async function fetchStatus() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setRefreshedAt(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load status");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30_000);
    return () => clearInterval(interval);
  }, []);

  const overall = data?.health.overall ?? "unknown";
  const overallColor = STATUS_COLORS[overall] ?? "#6b7280";

  return (
    <div className="min-h-screen px-4 sm:px-10 py-12" style={{ background: "#000", color: "#f3f4f6" }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <a href="/" className="text-lg font-bold" style={{ color: "var(--brand-primary)" }}>
              {brand.name}
            </a>
            <h1 className="text-2xl font-black mt-1">System Status</h1>
            <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
              {brand.domain} · Refreshes every 30s
            </p>
          </div>
          <button
            onClick={fetchStatus}
            className="text-xs px-4 py-2 rounded-lg font-medium transition-all"
            style={{ background: "#111", border: "1px solid #222", color: "#9ca3af" }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Overall status banner */}
        <div
          className="rounded-xl px-6 py-5 flex items-center gap-4"
          style={{
            background: `${overallColor}10`,
            border: `1px solid ${overallColor}40`,
          }}
        >
          <StatusDot status={overall} />
          <div>
            <div className="font-bold capitalize" style={{ color: overallColor }}>
              {loading ? "Checking..." : overall === "healthy" ? "All systems operational" : `System ${overall}`}
            </div>
            {refreshedAt && (
              <div className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                Last checked {refreshedAt.toLocaleTimeString()}
              </div>
            )}
          </div>
          {data && <Badge status={overall} />}
        </div>

        {error && (
          <div className="rounded-xl px-5 py-4 text-sm" style={{ background: "#1a0000", border: "1px solid #ef4444", color: "#ef4444" }}>
            Error loading status: {error}
          </div>
        )}

        {data && (
          <>
            {/* Health checks */}
            <Section title="Health Checks">
              {Object.entries(data.health.checks).map(([key, check]) => (
                <div key={key} className="flex items-center justify-between px-5 py-3 border-b last:border-b-0"
                  style={{ borderColor: "#1a1a1a" }}>
                  <div className="flex items-center gap-3">
                    <StatusDot status={check.status} />
                    <span className="text-sm capitalize" style={{ color: "#f3f4f6" }}>
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "#6b7280" }}>{check.message ?? ""}</span>
                    <Badge status={check.status} />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between px-5 py-3"
                style={{ borderTop: "1px solid #1a1a1a" }}>
                <span className="text-sm" style={{ color: "#9ca3af" }}>Response time</span>
                <span className="text-sm font-mono" style={{ color: "#22c55e" }}>
                  {data.health.responseMs}ms
                </span>
              </div>
            </Section>

            {/* Deployment */}
            <Section title="Deployment">
              <Row label="Environment" value={data.deployment.environment} />
              <Row label="Region" value={data.deployment.region} />
              {data.deployment.gitSha && (
                <Row label="Git SHA" value={data.deployment.gitSha.slice(0, 12)} mono />
              )}
              {data.deployment.deployedAt && (
                <Row label="Deployed At" value={new Date(data.deployment.deployedAt).toLocaleString()} />
              )}
              {data.deployment.nodeVersion && (
                <Row label="Node.js" value={`v${data.deployment.nodeVersion}`} mono />
              )}
              <Row label="Brand ID" value={data.brand.id} mono />
              <Row label="Brand Domain" value={data.brand.domain} mono />
            </Section>

            {/* Features */}
            <Section title="Features">
              {Object.entries(data.features).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between px-5 py-3 border-b last:border-b-0"
                  style={{ borderColor: "#1a1a1a" }}>
                  <span className="text-sm capitalize" style={{ color: "#9ca3af" }}>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                  </span>
                  <span className="text-sm font-mono"
                    style={{ color: typeof val === "boolean" ? (val ? "#22c55e" : "#6b7280") : "#f3f4f6" }}>
                    {typeof val === "boolean" ? (val ? "enabled" : "disabled") : String(val)}
                  </span>
                </div>
              ))}
            </Section>

            {/* Analytics */}
            <Section title="Analytics &amp; Tracking">
              <Row
                label="Google Analytics"
                value={data.analytics.googleAnalyticsId
                  ? <span style={{ color: "#22c55e" }}>Configured ({data.analytics.googleAnalyticsId})</span>
                  : <span style={{ color: "#6b7280" }}>Not configured</span>}
              />
              <Row
                label="Cloudflare Web Analytics"
                value={data.analytics.cloudflareBeaconId
                  ? <span style={{ color: "#22c55e" }}>Configured</span>
                  : <span style={{ color: "#6b7280" }}>Not configured</span>}
              />
              <Row
                label="Tawk.to Chat"
                value={data.analytics.tawkPropertyId
                  ? <span style={{ color: "#22c55e" }}>Configured ({data.analytics.tawkPropertyId.slice(0, 8)}...)</span>
                  : <span style={{ color: "#6b7280" }}>Not configured</span>}
              />
            </Section>

            {/* Cloudflare DNS */}
            <Section title="Cloudflare DNS">
              <Row label="Domain" value={data.cloudflare.domain} mono />
              <Row
                label="DNS Status"
                value={<Badge status={data.cloudflare.status} />}
              />
              {data.cloudflare.resolvedTo && data.cloudflare.resolvedTo.length > 0 && (
                <Row label="Resolves To" value={data.cloudflare.resolvedTo.join(", ")} mono />
              )}
              {data.cloudflare.message && (
                <Row label="Note" value={data.cloudflare.message} />
              )}
            </Section>

            {/* Sales config */}
            <Section title="Sales Configuration">
              <Row label="Payment Provider" value={data.sales.paymentProvider} />
              <Row label="Telegram Required" value={data.sales.telegramRequired ? "Yes" : "No"} />
              <Row label="Affiliate Commission" value={data.sales.affiliateCommission} />
              <Row label="Credit Packages" value={`${data.sales.creditPackages.length} packages`} />
              <div className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  {data.sales.creditPackages.map((p) => (
                    <span
                      key={p.id}
                      className="text-xs px-2 py-1 rounded-md font-mono"
                      style={{ background: "#111", border: "1px solid #222", color: "#9ca3af" }}
                    >
                      {p.name} · ${p.price}
                    </span>
                  ))}
                </div>
              </div>
            </Section>

            {/* Raw JSON for developers */}
            <Section title="Raw API Response">
              <div className="px-5 py-4">
                <a
                  href="/api/status"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono underline"
                  style={{ color: "#22c55e" }}
                >
                  GET /api/status →
                </a>
                <pre
                  className="mt-3 text-xs overflow-x-auto leading-relaxed max-h-60 overflow-y-auto"
                  style={{ color: "#6b7280", fontFamily: "monospace" }}
                >
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </Section>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-xs py-4" style={{ color: "#4b5563" }}>
          {brand.name} · {brand.domain} · Status endpoint: /api/status
        </div>
      </div>
    </div>
  );
}
