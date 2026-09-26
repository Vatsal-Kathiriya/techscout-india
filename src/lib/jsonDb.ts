import fs from 'fs';
import path from 'path';
import {
  Product,
  BuyingGuide,
  FestiveCampaign,
  SiteConfig,
} from '@/types/store';
import {
  INITIAL_PRODUCTS,
  INITIAL_BUYING_GUIDES,
  INITIAL_FESTIVE_CAMPAIGNS,
  INITIAL_SITE_CONFIG,
} from './initialData';

const productsPath = path.join(process.cwd(), 'products.json');
const guidesPath = path.join(process.cwd(), 'guides.json');
const configPath = path.join(process.cwd(), 'site-config.json');
const campaignsPath = path.join(process.cwd(), 'campaigns.json');
const siteDataExportPath = path.join(process.cwd(), 'public', 'site-data.json');

// In serverless hosting (Netlify/Vercel/AWS Lambda), the file system is read-only (/var/task).
// safeWriteFile gracefully ignores EROFS errors so mutations don't crash.
function safeWriteFile(filePath: string, data: string) {
  try {
    fs.writeFileSync(filePath, data);
  } catch (err: any) {
    if (err.code === 'EROFS' || err.message?.includes('read-only')) {
      // Expected in serverless environments. Data is persisted to MongoDB Atlas directly.
      return;
    }
    console.warn(`[jsonDb] Could not write to ${filePath}:`, err.message);
  }
}

// In-memory runtime cache for serverless environments
let memoryProducts: Product[] | null = null;
let memoryGuides: BuyingGuide[] | null = null;
let memoryCampaigns: FestiveCampaign[] | null = null;
let memoryConfig: SiteConfig | null = null;

// --- PRODUCTS ---
export function getProducts(): Product[] {
  if (memoryProducts && memoryProducts.length > 0) {
    return memoryProducts;
  }
  try {
    if (!fs.existsSync(productsPath)) {
      safeWriteFile(productsPath, JSON.stringify(INITIAL_PRODUCTS, null, 2));
      memoryProducts = [...INITIAL_PRODUCTS];
      return memoryProducts;
    }
    const data = fs.readFileSync(productsPath, 'utf8');
    const parsed = JSON.parse(data);
    let list: Product[] = Array.isArray(parsed) ? parsed : [parsed];

    // If dataset has fewer than initial seed, merge them gracefully without duplicates
    if (list.length < INITIAL_PRODUCTS.length) {
      const existingAsins = new Set(list.map((p) => p.asin));
      const missing = INITIAL_PRODUCTS.filter((p) => !existingAsins.has(p.asin));
      list = [...list, ...missing];
      safeWriteFile(productsPath, JSON.stringify(list, null, 2));
    }
    memoryProducts = list;
    return memoryProducts;
  } catch (err) {
    console.error('getProducts error:', err);
    memoryProducts = [...INITIAL_PRODUCTS];
    return memoryProducts;
  }
}

export function getProductById(id: string): Product | null {
  const products = getProducts();
  return products.find((p) => p._id === id || p.slug === id || p.asin === id) || null;
}

export function getProductBySlug(slug: string): Product | null {
  const products = getProducts();
  return products.find((p) => p.slug === slug || p._id === slug || p.asin === slug) || null;
}

export function saveProducts(products: Product[]) {
  memoryProducts = products;
  safeWriteFile(productsPath, JSON.stringify(products, null, 2));
}

export function addProduct(product: Partial<Product>): Product {
  const products = getProducts();
  const titleSlug = (product.title || 'tech-item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newProduct: Product = {
    _id: Date.now().toString(),
    slug: product.slug || `${titleSlug}-${Date.now().toString().slice(-4)}`,
    asin: product.asin || `ASIN-${Date.now().toString().slice(-6)}`,
    title: product.title || 'Untitled Hardware',
    brand: product.brand || 'GenzTech',
    category: (product.category as any) || 'accessories',
    price: product.price || '₹0',
    mrp: product.mrp || product.price || '₹0',
    priceMode: product.priceMode || 'indicative',
    priceLastVerified: new Date().toISOString(),
    imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800',
    gallery: product.gallery || (product.imageUrl ? [product.imageUrl] : []),
    affiliateUrl: product.affiliateUrl || `https://www.amazon.in/?tag=${INITIAL_SITE_CONFIG.affiliateStoreId}`,
    url: product.url || `https://www.amazon.in/?tag=${INITIAL_SITE_CONFIG.affiliateStoreId}`,
    specScore: product.specScore || 9.0,
    specs: product.specs || {},
    verdict: product.verdict || 'Engineered for reliability and top tier performance.',
    editorialReview: product.editorialReview || product.verdict || 'A high performance addition to your technical workflow.',
    pros: product.pros && product.pros.length > 0 ? product.pros : ['Great build quality', 'Reliable performance'],
    cons: product.cons && product.cons.length > 0 ? product.cons : ['Premium pricing'],
    dealBadge: product.dealBadge,
    isFestiveDeal: Boolean(product.isFestiveDeal),
    isFeatured: Boolean(product.isFeatured),
    rating: product.rating || '4.5',
    reviews: product.reviews || '1,200',
    createdAt: new Date().toISOString(),
  };

  products.unshift(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p._id === id || p.asin === id || p.slug === id);
  if (index > -1) {
    products[index] = {
      ...products[index],
      ...updates,
      priceLastVerified: updates.price ? new Date().toISOString() : products[index].priceLastVerified,
    };
    saveProducts(products);
    return products[index];
  }
  return null;
}

export function deleteProduct(id: string) {
  let products = getProducts();
  products = products.filter((p) => p._id !== id && p.asin !== id && p.slug !== id);
  saveProducts(products);
}

// --- GUIDES ---
export function getGuides(): BuyingGuide[] {
  if (memoryGuides && memoryGuides.length > 0) {
    return memoryGuides;
  }
  try {
    if (!fs.existsSync(guidesPath)) {
      safeWriteFile(guidesPath, JSON.stringify(INITIAL_BUYING_GUIDES, null, 2));
      memoryGuides = [...INITIAL_BUYING_GUIDES];
      return memoryGuides;
    }
    const data = fs.readFileSync(guidesPath, 'utf8');
    memoryGuides = JSON.parse(data);
    return memoryGuides || INITIAL_BUYING_GUIDES;
  } catch (err) {
    memoryGuides = [...INITIAL_BUYING_GUIDES];
    return memoryGuides;
  }
}

export function getGuideBySlug(slug: string): BuyingGuide | null {
  const guides = getGuides();
  return guides.find((g) => g.slug === slug || g._id === slug) || null;
}

export function saveGuides(guides: BuyingGuide[]) {
  memoryGuides = guides;
  safeWriteFile(guidesPath, JSON.stringify(guides, null, 2));
}

export function addGuide(guide: Partial<BuyingGuide>): BuyingGuide {
  const guides = getGuides();
  const slug = (guide.title || 'guide')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newGuide: BuyingGuide = {
    _id: `guide-${Date.now()}`,
    slug: guide.slug || slug,
    title: guide.title || 'New Buying Guide',
    subtitle: guide.subtitle || 'Expert hardware recommendations',
    excerpt: guide.excerpt || 'In-depth analysis from our lab testing.',
    category: guide.category || 'tech',
    readTime: guide.readTime || '6 min read',
    author: guide.author || 'GenzTech Editorial',
    authorRole: guide.authorRole || 'Senior Tech Reviewer',
    publishedAt: new Date().toISOString().split('T')[0],
    heroImage: guide.heroImage || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200',
    content: guide.content || 'Comprehensive testing details coming soon.',
    recommendedProductIds: guide.recommendedProductIds || [],
  };

  guides.unshift(newGuide);
  saveGuides(guides);
  return newGuide;
}

export function updateGuide(id: string, updates: Partial<BuyingGuide>): BuyingGuide | null {
  const guides = getGuides();
  const index = guides.findIndex((g) => g._id === id || g.slug === id);
  if (index > -1) {
    guides[index] = { ...guides[index], ...updates };
    saveGuides(guides);
    return guides[index];
  }
  return null;
}

export function deleteGuide(id: string) {
  let guides = getGuides();
  guides = guides.filter((g) => g._id !== id && g.slug !== id);
  saveGuides(guides);
}

// --- SITE CONFIG ---
export function getSiteConfig(): SiteConfig {
  if (memoryConfig) {
    return memoryConfig;
  }
  try {
    if (!fs.existsSync(configPath)) {
      safeWriteFile(configPath, JSON.stringify(INITIAL_SITE_CONFIG, null, 2));
      memoryConfig = { ...INITIAL_SITE_CONFIG };
      return memoryConfig;
    }
    const data = fs.readFileSync(configPath, 'utf8');
    memoryConfig = JSON.parse(data);
    return memoryConfig || INITIAL_SITE_CONFIG;
  } catch {
    memoryConfig = { ...INITIAL_SITE_CONFIG };
    return memoryConfig;
  }
}

export function saveSiteConfig(config: Partial<SiteConfig>): SiteConfig {
  const current = getSiteConfig();
  const updated = { ...current, ...config };
  memoryConfig = updated;
  safeWriteFile(configPath, JSON.stringify(updated, null, 2));
  return updated;
}

// --- CAMPAIGNS ---
export function getFestiveCampaigns(): FestiveCampaign[] {
  if (memoryCampaigns && memoryCampaigns.length > 0) {
    return memoryCampaigns;
  }
  try {
    if (!fs.existsSync(campaignsPath)) {
      safeWriteFile(campaignsPath, JSON.stringify(INITIAL_FESTIVE_CAMPAIGNS, null, 2));
      memoryCampaigns = [...INITIAL_FESTIVE_CAMPAIGNS];
      return memoryCampaigns;
    }
    const data = fs.readFileSync(campaignsPath, 'utf8');
    memoryCampaigns = JSON.parse(data);
    return memoryCampaigns || INITIAL_FESTIVE_CAMPAIGNS;
  } catch {
    memoryCampaigns = [...INITIAL_FESTIVE_CAMPAIGNS];
    return memoryCampaigns;
  }
}

export function saveFestiveCampaigns(campaigns: FestiveCampaign[]) {
  memoryCampaigns = campaigns;
  safeWriteFile(campaignsPath, JSON.stringify(campaigns, null, 2));
}

export function addCampaign(campaign: Partial<FestiveCampaign>): FestiveCampaign {
  const campaigns = getFestiveCampaigns();
  const newCampaign: FestiveCampaign = {
    id: campaign.id || `campaign-${Date.now()}`,
    title: campaign.title || 'New Festive Campaign',
    badge: campaign.badge || 'Limited Time Festive Deal',
    discountHeadline: campaign.discountHeadline || 'Exclusive Discounts Available',
    countdownEnd: campaign.countdownEnd || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    active: campaign.active !== undefined ? campaign.active : true,
    themeColor: campaign.themeColor || 'emerald',
    bannerCta: campaign.bannerCta || 'View Deals',
    targetCategory: campaign.targetCategory || 'all',
  };
  campaigns.unshift(newCampaign);
  saveFestiveCampaigns(campaigns);
  return newCampaign;
}

export function updateCampaign(id: string, updates: Partial<FestiveCampaign>): FestiveCampaign | null {
  const campaigns = getFestiveCampaigns();
  const index = campaigns.findIndex((c) => c.id === id);
  if (index > -1) {
    campaigns[index] = { ...campaigns[index], ...updates };
    saveFestiveCampaigns(campaigns);
    return campaigns[index];
  }
  return null;
}

export function deleteCampaign(id: string) {
  let campaigns = getFestiveCampaigns();
  campaigns = campaigns.filter((c) => c.id !== id);
  saveFestiveCampaigns(campaigns);
}

// --- EXPORT FOR GITHUB PAGES ---
export function exportAllSiteData() {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    config: getSiteConfig(),
    campaigns: getFestiveCampaigns(),
    guides: getGuides(),
    products: getProducts(),
  };

  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(siteDataExportPath, JSON.stringify(exportPayload, null, 2));
    return { success: true, count: exportPayload.products.length, path: '/site-data.json' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
