export type HardwareCategory =
  | 'smartphones'
  | 'laptops'
  | 'audio'
  | 'smartwatches'
  | 'gaming'
  | 'accessories';

export interface ProductSpecs {
  processor?: string;
  display?: string;
  battery?: string;
  ramStorage?: string;
  gpu?: string;
  os?: string;
  weight?: string;
  refreshRate?: string;
  connectivity?: string;
  specialFeature?: string;
  driver?: string;
  sensors?: string;
  waterResistance?: string;
  charging?: string;
  capacity?: string;
  speed?: string;
  layout?: string;
  sensor?: string;
  scrollWheel?: string;
  clicks?: string;
  switches?: string;
  chassis?: string;
  ports?: string;
  durability?: string;
  security?: string;
  compatibility?: string;
  [key: string]: string | undefined;
}

export interface Product {
  _id: string;
  slug: string;
  asin: string;
  title: string;
  brand: string;
  category: HardwareCategory;
  price: string;
  mrp: string;
  priceMode: 'indicative' | 'safe_cta';
  priceLastVerified: string;
  imageUrl: string;
  gallery?: string[];
  affiliateUrl: string;
  url?: string;
  specScore: number;
  specs: ProductSpecs;
  verdict: string;
  editorialReview: string;
  pros: string[];
  cons: string[];
  dealBadge?: string;
  isFestiveDeal?: boolean;
  isFeatured?: boolean;
  rating: string;
  reviews: string;
  createdAt: string;
}

export interface BuyingGuide {
  _id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  heroImage: string;
  content: string;
  recommendedProductIds: string[];
}

export interface FestiveCampaign {
  id: string;
  title: string;
  badge: string;
  discountHeadline: string;
  countdownEnd: string;
  active: boolean;
  themeColor: string;
  bannerCta: string;
  targetCategory?: string;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  affiliateStoreId: string;
  tickerText: string;
  tickerCountdownEnd: string;
  tickerActive: boolean;
  defaultPriceMode: 'indicative' | 'safe_cta';
  contactEmail?: string;
  footerAbout?: string;
  affiliateDisclosure?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

