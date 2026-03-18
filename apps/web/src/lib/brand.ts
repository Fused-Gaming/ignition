import type { BrandConfig } from "@/types/brand";

// Brand configs are loaded at build time based on NEXT_PUBLIC_BRAND env var.
// At runtime on the client, the CSS variables are already injected by the server layout.
const brandModules: Record<string, () => Promise<BrandConfig>> = {
  stakereloadxs: () =>
    import("../../../../configs/brands/stakereloadxs.json").then((m) => m.default as unknown as BrandConfig),
};

export async function loadBrandConfig(brandId?: string): Promise<BrandConfig> {
  const id = brandId ?? process.env.NEXT_PUBLIC_BRAND ?? "stakereloadxs";
  const loader = brandModules[id];
  if (!loader) {
    console.warn(`Unknown brand "${id}", falling back to stakereloadxs`);
    return brandModules["stakereloadxs"]();
  }
  return loader();
}

/** Detect brand from hostname at request time (used in middleware / layout). */
export function detectBrandFromHost(host: string): string {
  const hostMap: Record<string, string> = {
    "stakereloadxs.com": "stakereloadxs",
    "www.stakereloadxs.com": "stakereloadxs",
    "stakereload.com": "stakereload",
    "www.stakereload.com": "stakereload",
    "gambareload.com": "gambareload",
    "www.gambareload.com": "gambareload",
    "gambarewards.com": "gambarewards",
    "www.gambarewards.com": "gambarewards",
    "stakeclaimbot.com": "stakeclaimbot",
    "www.stakeclaimbot.com": "stakeclaimbot",
  };
  return hostMap[host] ?? process.env.NEXT_PUBLIC_BRAND ?? "stakereloadxs";
}

/** Convert brand theme object to CSS custom properties string. */
export function themeToCSSVars(theme: BrandConfig["theme"]): string {
  return [
    `--brand-primary: ${theme.primary}`,
    `--brand-primary-dark: ${theme.primaryDark}`,
    `--brand-primary-hover: ${theme.primaryHover ?? theme.primary}`,
    `--brand-bg: ${theme.background}`,
    `--brand-bg-secondary: ${theme.backgroundSecondary}`,
    `--brand-bg-tertiary: ${theme.backgroundTertiary}`,
    `--brand-accent: ${theme.accent}`,
    `--brand-accent-secondary: ${theme.accentSecondary}`,
    `--brand-text: ${theme.text}`,
    `--brand-muted: ${theme.textMuted}`,
    `--brand-faint: ${theme.textFaint}`,
    `--brand-border: ${theme.border}`,
    `--brand-border-glow: ${theme.borderGlow}`,
  ].join("; ");
}
