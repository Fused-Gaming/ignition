/**
 * Admin Brand Store (Zustand)
 *
 * Manages:
 *   - List of all brand configs (loaded from /configs/brands/*.json)
 *   - Active brand being edited / previewed
 *   - Deploy state (idle | building | deployed | error)
 *   - Live CSS preview generation
 */

import { create } from "zustand";
import {
  type BrandTone,
  type AnimationPreset,
  type BrandPalette,
  brandPalettes,
  generateCSSVars,
  getPaletteForTone,
} from "../../../packages/tokens/src/tokens";

export type DeployProvider = "vercel" | "vps" | "docker";
export type DeployStatus = "idle" | "building" | "deployed" | "error";

export interface BrandFormState {
  id: string;
  name: string;
  domain: string;
  tone: BrandTone;
  animation: AnimationPreset;
  copyVariant: string;
  tagline: string;
  subTagline: string;
  ctaPrimary: string;
  affiliateCommission: string;
  palette: BrandPalette;
  // override individual tokens
  overrides: Partial<BrandPalette>;
}

export interface DeployJob {
  brandId: string;
  provider: DeployProvider;
  status: DeployStatus;
  log: string[];
  startedAt: number;
  finishedAt?: number;
}

interface AdminStore {
  // Existing brands (loaded from configs)
  brands: BrandFormState[];

  // Brand being created/edited
  draft: BrandFormState;
  setDraftField: <K extends keyof BrandFormState>(key: K, value: BrandFormState[K]) => void;
  setTone: (tone: BrandTone) => void;
  setOverride: (key: keyof BrandPalette, value: string) => void;
  resetDraft: () => void;

  // Deploy
  deployJobs: DeployJob[];
  activeDeployId: string | null;
  startDeploy: (brandId: string, provider: DeployProvider) => void;
  appendLog: (brandId: string, line: string) => void;
  finishDeploy: (brandId: string, status: "deployed" | "error") => void;

  // Preview CSS
  previewCSS: string;
  refreshPreviewCSS: () => void;
}

const defaultDraft: BrandFormState = {
  id: "",
  name: "",
  domain: "",
  tone: "aggressive",
  animation: "smooth",
  copyVariant: "urgency",
  tagline: "",
  subTagline: "",
  ctaPrimary: "Claim Now",
  affiliateCommission: "20%",
  palette: brandPalettes.aggressive,
  overrides: {},
};

export const useAdminStore = create<AdminStore>((set, get) => ({
  brands: [
    // Pre-seeded from the existing stakereloadxs config
    {
      id: "stakereloadxs",
      name: "StakeReloadXS",
      domain: "stakereloadxs.com",
      tone: "aggressive",
      animation: "smooth",
      copyVariant: "urgency",
      tagline: "Xtremely Simple Reloads",
      subTagline: "Automated bonus claims for Stake in under 2 seconds.",
      ctaPrimary: "Try It Free",
      affiliateCommission: "20%",
      palette: brandPalettes.aggressive,
      overrides: {},
    },
  ],

  draft: { ...defaultDraft },

  setDraftField: (key, value) =>
    set((s) => ({ draft: { ...s.draft, [key]: value } })),

  setTone: (tone) =>
    set((s) => ({
      draft: {
        ...s.draft,
        tone,
        palette: getPaletteForTone(tone),
        overrides: {},
      },
    })),

  setOverride: (key, value) =>
    set((s) => {
      const overrides = { ...s.draft.overrides, [key]: value };
      const palette = { ...s.draft.palette, ...overrides };
      return { draft: { ...s.draft, overrides, palette } };
    }),

  resetDraft: () => set({ draft: { ...defaultDraft } }),

  deployJobs: [],
  activeDeployId: null,

  startDeploy: (brandId, provider) => {
    const job: DeployJob = {
      brandId,
      provider,
      status: "building",
      log: [`[${new Date().toISOString()}] Starting deploy: ${brandId} → ${provider}`],
      startedAt: Date.now(),
    };
    set((s) => ({
      deployJobs: [...s.deployJobs.filter((j) => j.brandId !== brandId), job],
      activeDeployId: brandId,
    }));
    // Kick off server action / API call
    get().appendLog(brandId, `Building Next.js with NEXT_PUBLIC_BRAND=${brandId}...`);
  },

  appendLog: (brandId, line) =>
    set((s) => ({
      deployJobs: s.deployJobs.map((j) =>
        j.brandId === brandId
          ? { ...j, log: [...j.log, `[${new Date().toISOString()}] ${line}`] }
          : j
      ),
    })),

  finishDeploy: (brandId, status) =>
    set((s) => ({
      deployJobs: s.deployJobs.map((j) =>
        j.brandId === brandId ? { ...j, status, finishedAt: Date.now() } : j
      ),
    })),

  previewCSS: generateCSSVars(brandPalettes.aggressive, "smooth"),

  refreshPreviewCSS: () => {
    const { draft } = get();
    const palette = { ...draft.palette, ...draft.overrides };
    set({ previewCSS: generateCSSVars(palette, draft.animation) });
  },
}));
