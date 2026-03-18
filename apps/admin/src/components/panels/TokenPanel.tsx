"use client";

import { useAdminStore } from "@/lib/brandStore";
import TokenSwatch from "@/components/ui/TokenSwatch";
import type { BrandPalette, BrandTone } from "@fused-gaming/tokens";

const TOKEN_GROUPS: { label: string; keys: (keyof BrandPalette)[] }[] = [
  {
    label: "Primary",
    keys: ["primary", "primaryDark", "primaryHover"],
  },
  {
    label: "Backgrounds",
    keys: ["background", "backgroundSecondary", "backgroundTertiary"],
  },
  {
    label: "Text",
    keys: ["text", "textMuted", "textFaint"],
  },
  {
    label: "Borders",
    keys: ["border", "borderGlow"],
  },
  {
    label: "Accents",
    keys: ["accent", "accentSecondary"],
  },
];

const CSS_VAR_MAP: Record<keyof BrandPalette, string> = {
  primary:             "--brand-primary",
  primaryDark:         "--brand-primary-dark",
  primaryHover:        "--brand-primary-hover",
  background:          "--brand-bg",
  backgroundSecondary: "--brand-bg-secondary",
  backgroundTertiary:  "--brand-bg-tertiary",
  accent:              "--brand-accent",
  accentSecondary:     "--brand-accent-secondary",
  text:                "--brand-text",
  textMuted:           "--brand-muted",
  textFaint:           "--brand-faint",
  border:              "--brand-border",
  borderGlow:          "--brand-border-glow",
};

const TONES: BrandTone[] = ["aggressive", "corporate", "playful", "underground", "premium"];

export default function TokenPanel() {
  const { draft, setTone, setOverride, refreshPreviewCSS, previewCSS } = useAdminStore();

  function handleOverride(key: keyof BrandPalette, value: string) {
    setOverride(key, value);
    refreshPreviewCSS();
  }

  const effectivePalette = { ...draft.palette, ...draft.overrides };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tone selector */}
      <div className="p-4 border-b" style={{ borderColor: "var(--admin-border)" }}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "var(--admin-muted)" }}>
          Brand Tone Preset
        </div>
        <div className="flex flex-wrap gap-2">
          {TONES.map((tone) => (
            <button
              key={tone}
              onClick={() => { setTone(tone); refreshPreviewCSS(); }}
              className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all"
              style={{
                background: draft.tone === tone ? "var(--admin-primary)" : "var(--admin-surface2)",
                color: draft.tone === tone ? "white" : "var(--admin-muted)",
                border: `1px solid ${draft.tone === tone ? "var(--admin-primary)" : "var(--admin-border)"}`,
              }}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      {/* Token groups */}
      <div className="flex-grow overflow-y-auto p-4 space-y-5">
        {TOKEN_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "var(--admin-muted)" }}>
              {group.label}
            </div>
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--admin-border)" }}>
              {group.keys.map((key, i) => (
                <div
                  key={key}
                  className={i < group.keys.length - 1 ? "border-b" : ""}
                  style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}
                >
                  <TokenSwatch
                    name={key}
                    cssVar={CSS_VAR_MAP[key]}
                    hex={effectivePalette[key] ?? "#000000"}
                    onChange={(v) => handleOverride(key, v)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Generated CSS output */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--admin-muted)" }}>
            Generated CSS Variables
          </div>
          <pre
            className="text-xs rounded-lg p-4 overflow-x-auto leading-relaxed"
            style={{
              background: "var(--admin-surface2)",
              border: "1px solid var(--admin-border)",
              color: "var(--admin-muted)",
              fontFamily: "monospace",
            }}
          >
            {`:root {\n${previewCSS}\n}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
