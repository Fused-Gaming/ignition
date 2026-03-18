export interface BrandTheme {
  primary: string;
  primaryDark: string;
  primaryHover?: string;
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  accent: string;
  accentSecondary: string;
  text: string;
  textMuted: string;
  textFaint: string;
  border: string;
  borderGlow: string;
}

export interface BrandNav {
  links: { label: string; href: string }[];
  cta: string;
}

export interface BrandFeature {
  icon: string;
  title: string;
  description: string;
}

export interface BrandStat {
  value: string;
  label: string;
}

export interface BrandMetric {
  value: string;
  label: string;
}

export interface BrandServiceTier {
  label: string;
  price: number;
}

export interface BrandService {
  id: string;
  title: string;
  description: string;
  tiers: BrandServiceTier[];
}

export interface BrandCreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  boost: string | null;
  badge: string | null;
}

export interface BrandFAQ {
  q: string;
  a: string;
}

export interface BrandConfig {
  id: string;
  name: string;
  domain: string;
  tone: "aggressive" | "corporate" | "playful" | "underground" | "premium";
  tagline: string;
  subTagline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  theme: BrandTheme;
  ui: {
    radius: string;
    style: string;
    borderStyle: string;
    buttonStyle: string;
  };
  animation: string;
  copyVariant: string;
  languageDefault: string;
  fonts?: {
    heading: string;
    body: string;
  };
  stats: BrandStat[];
  metrics: BrandMetric[];
  features: BrandFeature[];
  services: BrandService[];
  creditPackages: BrandCreditPackage[];
  faq?: BrandFAQ[];
  demoVideoId?: string;
  affiliateCommission: string;
  affiliateDescription: string;
  payment: {
    provider: string;
    apiEndpoint: string;
    telegramRequired: boolean;
  };
  chat?: {
    provider: string;
    propertyId: string;
    widgetId: string;
  };
  nav: BrandNav;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}
