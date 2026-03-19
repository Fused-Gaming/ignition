"use client";

import { useAdminStore } from "@/lib/brandStore";

const COPY_VARIANTS = ["urgency", "exclusivity", "authority", "rebellion", "data"];
const ANIMATION_PRESETS = ["smooth", "fast", "glitch", "static"] as const;

export default function BrandFormPanel() {
  const { draft, setDraftField } = useAdminStore();

  return (
    <div className="p-6 space-y-5 overflow-y-auto h-full">
      <div className="text-xs font-semibold uppercase tracking-wider mb-1"
        style={{ color: "var(--admin-muted)" }}>
        Brand Identity
      </div>

      {/* ID */}
      <Field label="Brand ID" hint="URL-safe, e.g. stakereloadxs">
        <input
          type="text"
          value={draft.id}
          onChange={(e) => setDraftField("id", e.target.value)}
          placeholder="stakeclaimbot"
          className="admin-input"
        />
      </Field>

      {/* Name */}
      <Field label="Brand Name">
        <input
          type="text"
          value={draft.name}
          onChange={(e) => setDraftField("name", e.target.value)}
          placeholder="StakeClaimBot"
          className="admin-input"
        />
      </Field>

      {/* Domain */}
      <Field label="Domain">
        <input
          type="text"
          value={draft.domain}
          onChange={(e) => setDraftField("domain", e.target.value)}
          placeholder="stakeclaimbot.com"
          className="admin-input"
        />
      </Field>

      {/* Tagline */}
      <Field label="Tagline (Hero H1)">
        <input
          type="text"
          value={draft.tagline}
          onChange={(e) => setDraftField("tagline", e.target.value)}
          placeholder="Automate Your Stake Claims"
          className="admin-input"
        />
      </Field>

      {/* Sub tagline */}
      <Field label="Sub Tagline (Hero body)">
        <textarea
          value={draft.subTagline}
          onChange={(e) => setDraftField("subTagline", e.target.value)}
          placeholder="One-click automation for Stake bonus cycles."
          rows={2}
          className="admin-input resize-none"
        />
      </Field>

      {/* CTA */}
      <Field label="Primary CTA Text">
        <input
          type="text"
          value={draft.ctaPrimary}
          onChange={(e) => setDraftField("ctaPrimary", e.target.value)}
          placeholder="Claim Now"
          className="admin-input"
        />
      </Field>

      {/* Affiliate commission */}
      <Field label="Affiliate Commission">
        <input
          type="text"
          value={draft.affiliateCommission}
          onChange={(e) => setDraftField("affiliateCommission", e.target.value)}
          placeholder="20%"
          className="admin-input"
        />
      </Field>

      {/* Copy variant */}
      <Field label="Copy Variant" hint="Psychological framing for all copy">
        <div className="flex flex-wrap gap-2">
          {COPY_VARIANTS.map((v) => (
            <button
              key={v}
              onClick={() => setDraftField("copyVariant", v)}
              className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all"
              style={{
                background: draft.copyVariant === v ? "var(--admin-primary)" : "var(--admin-surface2)",
                color: draft.copyVariant === v ? "white" : "var(--admin-muted)",
                border: `1px solid ${draft.copyVariant === v ? "var(--admin-primary)" : "var(--admin-border)"}`,
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </Field>

      {/* Animation */}
      <Field label="Animation Preset">
        <div className="flex flex-wrap gap-2">
          {ANIMATION_PRESETS.map((v) => (
            <button
              key={v}
              onClick={() => setDraftField("animation", v)}
              className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all"
              style={{
                background: draft.animation === v ? "var(--admin-primary)" : "var(--admin-surface2)",
                color: draft.animation === v ? "white" : "var(--admin-muted)",
                border: `1px solid ${draft.animation === v ? "var(--admin-primary)" : "var(--admin-border)"}`,
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </Field>

      <style>{`
        .admin-input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
          background: var(--admin-surface2);
          border: 1px solid var(--admin-border);
          color: var(--admin-text);
        }
        .admin-input:focus {
          border-color: var(--admin-primary);
        }
        .admin-input::placeholder {
          color: var(--admin-faint);
        }
      `}</style>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--admin-text)" }}>
        {label}
        {hint && (
          <span className="ml-2 text-xs font-normal" style={{ color: "var(--admin-faint)" }}>
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
