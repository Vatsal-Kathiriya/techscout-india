import mongoose from 'mongoose';

const SiteConfigSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'global-config' },
    brandName: { type: String, default: 'GenzTech.in' },
    tagline: { type: String, default: 'Smart Tech. Better Choices.' },
    heroHeadline: { type: String, default: 'Smart Tech. Better Choices.' },
    heroSubheadline: { type: String, default: 'Discover useful technology, compare products and find smarter buying options.' },
    affiliateStoreId: { type: String, default: 'genztech019-21' },
    tickerText: { type: String },
    tickerCountdownEnd: { type: String },
    tickerActive: { type: Boolean, default: true },
    defaultPriceMode: { type: String, default: 'indicative' },
    contactEmail: { type: String },
    footerAbout: { type: String },
    affiliateDisclosure: { type: String },
    primaryCtaText: { type: String },
    primaryCtaLink: { type: String },
    secondaryCtaText: { type: String },
    secondaryCtaLink: { type: String },
  },
  {
    strict: false,
    timestamps: true,
  }
);

export default mongoose.models.SiteConfig || mongoose.model('SiteConfig', SiteConfigSchema);
