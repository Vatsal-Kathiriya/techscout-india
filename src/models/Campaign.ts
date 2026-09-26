import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    badge: { type: String, required: true },
    discountHeadline: { type: String, required: true },
    countdownEnd: { type: String, required: true },
    active: { type: Boolean, default: true },
    themeColor: { type: String, default: 'emerald' },
    bannerCta: { type: String, default: 'Explore Deals' },
    targetCategory: { type: String, default: 'all' },
  },
  {
    strict: false,
    timestamps: true,
  }
);

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
