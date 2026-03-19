/**
 * Fused Gaming — Design Token System
 *
 * This is the single source of truth for all design tokens.
 * Tokens are consumed by:
 *   - CSS custom properties (injected in layout.tsx via themeToCSSVars)
 *   - TailwindCSS config (via CSS var references)
 *   - Admin GUI brand previewer
 *   - Deploy script validation
 *
 * Adding a new brand:
 *   1. Create configs/brands/<id>.json with BrandTheme values
 *   2. Register it in apps/web/src/lib/brand.ts brandModules map
 *   3. Run: ./scripts/deploy.sh <id> vercel
 */

// ─────────────────────────────────────────────────────────────────────────────
// BASE SCALE — Raw values. Brand themes reference these.
// ─────────────────────────────────────────────────────────────────────────────

export const colorScale = {
  // Neutrals
  black:    "#000000",
  gray950:  "#0a0a0a",
  gray900:  "#111111",
  gray850:  "#1a1a1a",
  gray800:  "#222222",
  gray700:  "#333333",
  gray600:  "#4b5563",
  gray500:  "#6b7280",
  gray400:  "#9ca3af",
  gray300:  "#d1d5db",
  gray100:  "#f3f4f6",
  white:    "#ffffff",

  // Red scale (StakeReloadXS / Stakereload)
  red400:   "#f87171",
  red500:   "#ef4444",
  red600:   "#dc2626",
  red700:   "#b91c1c",
  red800:   "#991b1b",
  red900:   "#7f1d1d",

  // Green scale (future brand variant)
  green400: "#4ade80",
  green500: "#22c55e",
  green600: "#16a34a",

  // Teal / mint scale (cyberpunk variant)
  teal400:  "#2dd4bf",
  mint400:  "#00FFB2",
  mint600:  "#00CC8F",

  // Purple scale (premium variant)
  purple400: "#c084fc",
  purple600: "#9333ea",
  purple800: "#6b21a8",

  // Orange scale (casino variant)
  orange400: "#fb923c",
  orange600: "#ea580c",

  // Pink / neon
  pink400:  "#f472b6",
  neon:     "#FF3D81",
} as const;

export const fontFamilies = {
  poppins: "'Poppins', system-ui, sans-serif",
  inter:   "'Inter', system-ui, sans-serif",
  mono:    "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
  serif:   "'Playfair Display', Georgia, serif",
} as const;

export const fontWeights = {
  light:     300,
  regular:   400,
  medium:    500,
  semibold:  600,
  bold:      700,
  extrabold: 800,
  black:     900,
} as const;

export const fontSizes = {
  xs:   "0.75rem",   // 12px
  sm:   "0.875rem",  // 14px
  base: "1rem",      // 16px
  lg:   "1.125rem",  // 18px
  xl:   "1.25rem",   // 20px
  "2xl":"1.5rem",    // 24px
  "3xl":"1.875rem",  // 30px
  "4xl":"2.25rem",   // 36px
  "5xl":"3rem",      // 48px
  "6xl":"3.75rem",   // 60px
  "7xl":"4.5rem",    // 72px
} as const;

export const spacing = {
  0:   "0px",
  1:   "4px",
  2:   "8px",
  3:   "12px",
  4:   "16px",
  5:   "20px",
  6:   "24px",
  8:   "32px",
  10:  "40px",
  12:  "48px",
  16:  "64px",
  20:  "80px",
  24:  "96px",
} as const;

export const radii = {
  none: "0px",
  sm:   "6px",
  md:   "12px",
  lg:   "16px",
  xl:   "20px",
  "2xl":"24px",
  full: "9999px",
} as const;

export const shadows = {
  "neon-xs": (color: string) => `0 0 4px ${color}40`,
  "neon-sm": (color: string) => `0 0 8px ${color}99`,
  "neon-md": (color: string) => `0 0 20px ${color}80, 0 0 40px ${color}33`,
  "neon-lg": (color: string) => `0 0 40px ${color}b3, 0 0 80px ${color}4d`,
} as const;

export const durations = {
  instant:   "50ms",
  fast:      "150ms",
  base:      "300ms",
  slow:      "500ms",
  verySlow:  "800ms",
} as const;

export const easings = {
  linear:    "linear",
  easeOut:   "ease-out",
  easeIn:    "ease-in",
  easeInOut: "ease-in-out",
  spring:    "cubic-bezier(0.34, 1.56, 0.64, 1)",
  glitch:    "steps(2, end)",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION PRESETS — keyed by brand.animation field
// ─────────────────────────────────────────────────────────────────────────────

export type AnimationPreset = "smooth" | "fast" | "glitch" | "static";

export const animationPresets: Record<AnimationPreset, {
  duration: string;
  easing: string;
  staggerMs: number;
  entranceY: string;
}> = {
  smooth: {
    duration:  durations.base,
    easing:    easings.easeOut,
    staggerMs: 80,
    entranceY: "20px",
  },
  fast: {
    duration:  durations.fast,
    easing:    easings.easeInOut,
    staggerMs: 50,
    entranceY: "12px",
  },
  glitch: {
    duration:  "100ms",
    easing:    easings.glitch,
    staggerMs: 30,
    entranceY: "4px",
  },
  static: {
    duration:  "0ms",
    easing:    easings.linear,
    staggerMs: 0,
    entranceY: "0px",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BRAND PRESETS — maps a tone to a ready-made theme palette
// ─────────────────────────────────────────────────────────────────────────────

export type BrandTone = "aggressive" | "corporate" | "playful" | "underground" | "premium";

export interface BrandPalette {
  primary:             string;
  primaryDark:         string;
  primaryHover:        string;
  background:          string;
  backgroundSecondary: string;
  backgroundTertiary:  string;
  accent:              string;
  accentSecondary:     string;
  text:                string;
  textMuted:           string;
  textFaint:           string;
  border:              string;
  borderGlow:          string;
}

export const brandPalettes: Record<BrandTone, BrandPalette> = {
  aggressive: {
    primary:             colorScale.red600,
    primaryDark:         colorScale.red700,
    primaryHover:        colorScale.red500,
    background:          colorScale.black,
    backgroundSecondary: colorScale.gray900,
    backgroundTertiary:  colorScale.gray850,
    accent:              colorScale.red600,
    accentSecondary:     colorScale.red500,
    text:                colorScale.gray100,
    textMuted:           colorScale.gray400,
    textFaint:           colorScale.gray600,
    border:              colorScale.gray800,
    borderGlow:          colorScale.red600,
  },
  corporate: {
    primary:             colorScale.purple600,
    primaryDark:         colorScale.purple800,
    primaryHover:        colorScale.purple400,
    background:          colorScale.black,
    backgroundSecondary: colorScale.gray900,
    backgroundTertiary:  colorScale.gray850,
    accent:              colorScale.purple600,
    accentSecondary:     colorScale.purple400,
    text:                colorScale.gray100,
    textMuted:           colorScale.gray400,
    textFaint:           colorScale.gray600,
    border:              colorScale.gray800,
    borderGlow:          colorScale.purple600,
  },
  playful: {
    primary:             colorScale.orange600,
    primaryDark:         "#c2410c",
    primaryHover:        colorScale.orange400,
    background:          "#0d0d0d",
    backgroundSecondary: "#141414",
    backgroundTertiary:  "#1c1c1c",
    accent:              colorScale.pink400,
    accentSecondary:     colorScale.orange400,
    text:                colorScale.white,
    textMuted:           colorScale.gray400,
    textFaint:           colorScale.gray600,
    border:              colorScale.gray800,
    borderGlow:          colorScale.orange400,
  },
  underground: {
    primary:             colorScale.mint400,
    primaryDark:         colorScale.mint600,
    primaryHover:        "#33ffbb",
    background:          "#0A0A0A",
    backgroundSecondary: "#111111",
    backgroundTertiary:  "#0F0F0F",
    accent:              colorScale.neon,
    accentSecondary:     "#FF00FF",
    text:                colorScale.white,
    textMuted:           colorScale.gray500,
    textFaint:           colorScale.gray700,
    border:              "#1A1A1A",
    borderGlow:          colorScale.mint400,
  },
  premium: {
    primary:             "#c9a84c",
    primaryDark:         "#a8893a",
    primaryHover:        "#dfc06a",
    background:          "#080808",
    backgroundSecondary: "#0e0e0e",
    backgroundTertiary:  "#161616",
    accent:              "#c9a84c",
    accentSecondary:     "#e8d5a3",
    text:                colorScale.gray100,
    textMuted:           colorScale.gray400,
    textFaint:           colorScale.gray600,
    border:              "#1f1f1f",
    borderGlow:          "#c9a84c",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CSS VARIABLE GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a full :root { } block from a BrandPalette.
 * Used server-side in layout.tsx and for live preview in the admin GUI.
 */
export function generateCSSVars(palette: BrandPalette, animPreset: AnimationPreset = "smooth"): string {
  const anim = animationPresets[animPreset];
  return `
  /* ── Color ── */
  --brand-primary:           ${palette.primary};
  --brand-primary-dark:      ${palette.primaryDark};
  --brand-primary-hover:     ${palette.primaryHover};
  --brand-bg:                ${palette.background};
  --brand-bg-secondary:      ${palette.backgroundSecondary};
  --brand-bg-tertiary:       ${palette.backgroundTertiary};
  --brand-accent:            ${palette.accent};
  --brand-accent-secondary:  ${palette.accentSecondary};
  --brand-text:              ${palette.text};
  --brand-muted:             ${palette.textMuted};
  --brand-faint:             ${palette.textFaint};
  --brand-border:            ${palette.border};
  --brand-border-glow:       ${palette.borderGlow};

  /* ── Shadows (neon glow, derived from primary) ── */
  --shadow-neon-xs:  ${shadows["neon-xs"](palette.primary)};
  --shadow-neon-sm:  ${shadows["neon-sm"](palette.primary)};
  --shadow-neon-md:  ${shadows["neon-md"](palette.primary)};
  --shadow-neon-lg:  ${shadows["neon-lg"](palette.primary)};

  /* ── Motion ── */
  --dur-instant:   ${durations.instant};
  --dur-fast:      ${durations.fast};
  --dur-base:      ${anim.duration};
  --dur-slow:      ${durations.slow};
  --ease-out:      ${easings.easeOut};
  --ease-in-out:   ${easings.easeInOut};
  --ease-spring:   ${easings.spring};
  --stagger-ms:    ${anim.staggerMs}ms;
  --entrance-y:    ${anim.entranceY};

  /* ── Radii ── */
  --radius-sm:   ${radii.sm};
  --radius-md:   ${radii.md};
  --radius-lg:   ${radii.lg};
  --radius-xl:   ${radii.xl};
  --radius-full: ${radii.full};
`.trim();
}

/**
 * Quick helper: get a palette by tone.
 */
export function getPaletteForTone(tone: BrandTone): BrandPalette {
  return brandPalettes[tone];
}
