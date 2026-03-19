"use client";

import { useState } from "react";
import { useAdminStore, type DeployProvider } from "@/lib/brandStore";

const PROVIDERS: { id: DeployProvider; label: string; desc: string; icon: string }[] = [
  { id: "vercel", label: "Vercel",   desc: "Edge CDN, instant HTTPS, CNAME setup",    icon: "▲" },
  { id: "vps",    label: "VPS",      desc: "Bare metal / PM2. Set DEPLOY_HOST env.",   icon: "🖥" },
  { id: "docker", label: "Docker",   desc: "Container image with brand ARGs baked in", icon: "🐳" },
];

export default function DeployPanel() {
  const { draft, brands, deployJobs, startDeploy, finishDeploy, appendLog } = useAdminStore();
  const [provider, setProvider] = useState<DeployProvider>("vercel");
  const [deploying, setDeploying] = useState(false);

  // Use draft if it has an ID, otherwise show existing brands
  const targetId = draft.id || (brands[0]?.id ?? "");
  const job = deployJobs.find((j) => j.brandId === targetId);

  async function handleDeploy() {
    if (!targetId) return;
    setDeploying(true);
    startDeploy(targetId, provider);

    // Simulate deploy log stream (real impl: SSE from /api/deploy route)
    const steps = [
      "Installing dependencies...",
      `Building Next.js (NEXT_PUBLIC_BRAND=${targetId})...`,
      "Generating CSS variable bundle...",
      provider === "vercel" ? "Uploading to Vercel edge network..." : `Syncing to ${provider}...`,
      "Running post-build checks...",
      "Deploy complete ✓",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 800 + i * 400));
      appendLog(targetId, steps[i]);
    }

    finishDeploy(targetId, "deployed");
    setDeploying(false);
  }

  return (
    <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto">
      {/* Existing brands list */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "var(--admin-muted)" }}>
          Active Brands
        </div>
        <div className="space-y-2">
          {brands.map((b) => {
            const bJob = deployJobs.find((j) => j.brandId === b.id);
            return (
              <div
                key={b.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg"
                style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
              >
                <div>
                  <div className="text-sm font-semibold">{b.name}</div>
                  <div className="text-xs" style={{ color: "var(--admin-muted)" }}>{b.domain}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={bJob?.status ?? "idle"} />
                  <button
                    onClick={() => { startDeploy(b.id, provider); }}
                    className="text-xs px-3 py-1.5 rounded-md font-medium transition-all"
                    style={{ background: "var(--admin-surface2)", border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
                  >
                    Re-deploy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Provider selector */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "var(--admin-muted)" }}>
          Deploy Target
        </div>
        <div className="grid grid-cols-3 gap-3">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className="text-left p-4 rounded-lg transition-all"
              style={{
                background: provider === p.id ? "rgba(220,38,38,0.1)" : "var(--admin-surface)",
                border: `1px solid ${provider === p.id ? "var(--admin-primary)" : "var(--admin-border)"}`,
              }}
            >
              <div className="text-lg mb-1">{p.icon}</div>
              <div className="text-sm font-semibold">{p.label}</div>
              <div className="text-xs mt-1" style={{ color: "var(--admin-muted)" }}>{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Deploy command preview */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: "var(--admin-muted)" }}>
          Deploy Command
        </div>
        <pre
          className="text-xs rounded-lg px-4 py-3"
          style={{ background: "var(--admin-surface2)", border: "1px solid var(--admin-border)", color: "#22c55e", fontFamily: "monospace" }}
        >
          {`./scripts/deploy.sh ${targetId || "<brand-id>"} ${provider}`}
        </pre>
      </div>

      {/* Launch button */}
      <button
        onClick={handleDeploy}
        disabled={!targetId || deploying}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "var(--admin-primary)", color: "white" }}
      >
        {deploying ? "Deploying..." : `🚀 Deploy ${targetId || "Brand"} → ${provider}`}
      </button>

      {/* Log output */}
      {job && job.log.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--admin-muted)" }}>
            Build Log
          </div>
          <div
            className="rounded-lg p-4 text-xs font-mono space-y-1 max-h-64 overflow-y-auto"
            style={{ background: "#0a0a0a", border: "1px solid var(--admin-border)" }}
          >
            {job.log.map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.includes("✓") || line.includes("complete")
                    ? "#22c55e"
                    : line.includes("error") || line.includes("Error")
                    ? "#ef4444"
                    : "var(--admin-muted)",
                }}
              >
                {line}
              </div>
            ))}
            {deploying && (
              <div style={{ color: "var(--admin-primary)" }}>
                <span className="animate-pulse">▊</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    idle:      "var(--admin-faint)",
    building:  "var(--admin-warning)",
    deployed:  "var(--admin-success)",
    error:     "var(--admin-error)",
  };
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
      style={{ color: colors[status] ?? "var(--admin-faint)", border: `1px solid ${colors[status] ?? "var(--admin-border)"}` }}
    >
      {status}
    </span>
  );
}
