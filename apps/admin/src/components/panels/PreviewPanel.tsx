"use client";

import { useAdminStore } from "@/lib/brandStore";

// ASCII resolution labels
const VIEWPORTS = [
  { key: "xs",  label: "XS — 320px",  width: 320 },
  { key: "sm",  label: "SM — 640px",  width: 640 },
  { key: "md",  label: "MD — 768px",  width: 768 },
  { key: "lg",  label: "LG — 1024px", width: 1024 },
  { key: "xl",  label: "XL — 1280px", width: 1280 },
];

export default function PreviewPanel() {
  const { draft, previewCSS } = useAdminStore();
  const palette = { ...draft.palette, ...draft.overrides };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b text-xs font-semibold uppercase tracking-wider"
        style={{ borderColor: "var(--admin-border)", color: "var(--admin-muted)" }}>
        Live Token Preview — {draft.name || "New Brand"}
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {/* Color preview grid */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--admin-muted)" }}>
            Color System
          </div>
          <div
            className="rounded-xl p-5 space-y-3"
            style={{ background: palette.background, border: `1px solid ${palette.border}` }}
          >
            {/* Simulated hero */}
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full"
                style={{ background: `${palette.primary}26`, color: palette.primary, border: `1px solid ${palette.primary}4d` }}
              >
                ● Live — Claiming Now
              </span>
            </div>
            <div className="text-2xl font-black" style={{ color: palette.text, fontFamily: "system-ui" }}>
              {draft.tagline || "Brand Tagline Here"}
            </div>
            <div className="text-sm" style={{ color: palette.textMuted }}>
              {draft.subTagline || "Your brand sub-tagline will appear here."}
            </div>
            <div className="flex gap-3 mt-2">
              <button
                className="px-4 py-2 rounded-md text-sm font-semibold"
                style={{ background: palette.primary, color: "#fff" }}
              >
                {draft.ctaPrimary || "Claim Now"}
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm font-semibold"
                style={{ background: "transparent", border: `1px solid ${palette.border}`, color: palette.text }}
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-3 border-t" style={{ borderColor: palette.border }}>
              {["700+", "$250K", "3 Years"].map((v, i) => (
                <div key={i}>
                  <div className="text-xl font-black" style={{ color: palette.primary }}>{v}</div>
                  <div className="text-xs" style={{ color: palette.textMuted }}>Metric {i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card preview */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--admin-muted)" }}>
            Component Samples
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Card */}
            <div
              className="rounded-xl p-4"
              style={{ background: palette.backgroundSecondary, border: `1px solid ${palette.border}` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 text-sm"
                style={{ background: `${palette.primary}26`, color: palette.primary }}
              >
                ⚡
              </div>
              <div className="text-sm font-bold" style={{ color: palette.text }}>Auto Claims</div>
              <div className="text-xs mt-1" style={{ color: palette.textMuted }}>Under 2 seconds.</div>
            </div>
            {/* Credit package */}
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: palette.backgroundSecondary, border: `1px solid ${palette.borderGlow}` }}
            >
              <div className="text-xs font-semibold mb-1"
                style={{ background: palette.primary, color: "#fff", borderRadius: "999px", padding: "2px 8px", display: "inline-block" }}>
                Popular
              </div>
              <div className="text-xl font-black mt-1" style={{ color: palette.text }}>$100</div>
              <div className="text-xs" style={{ color: palette.textMuted }}>100,000 credits</div>
              <div className="text-xs mt-1" style={{ color: palette.primary }}>10% Boost</div>
            </div>
          </div>
        </div>

        {/* Viewport scale labels */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--admin-muted)" }}>
            Responsive Breakpoints
          </div>
          <div className="space-y-2">
            {VIEWPORTS.map((vp) => (
              <div
                key={vp.key}
                className="flex items-center gap-3 px-3 py-2 rounded-lg"
                style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
              >
                <div className="text-xs font-mono w-20" style={{ color: "var(--admin-primary)" }}>
                  {vp.key.toUpperCase()}
                </div>
                <div
                  className="h-2 rounded-full flex-grow"
                  style={{ background: "var(--admin-border)", maxWidth: `${(vp.width / 1280) * 100}%` }}
                />
                <div className="text-xs" style={{ color: "var(--admin-faint)" }}>{vp.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CSS vars output */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--admin-muted)" }}>
            Generated :root Block
          </div>
          <pre
            className="text-xs rounded-lg p-4 overflow-x-auto leading-relaxed"
            style={{ background: "#0a0a0a", border: "1px solid var(--admin-border)", color: "#22c55e", fontFamily: "monospace", maxHeight: "200px", overflowY: "auto" }}
          >
            {`:root {\n  ${previewCSS.split("\n").map(l => l.trim()).filter(Boolean).join("\n  ")}\n}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
