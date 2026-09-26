import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    asin: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    brand: { type: String, default: 'GenzTech' },
    category: { type: String, default: 'accessories' },
    price: { type: String, required: true },
    mrp: { type: String, required: true },
    priceMode: { type: String, default: 'indicative' },
    priceLastVerified: { type: String },
    imageUrl: { type: String, required: true },
    gallery: { type: [String], default: [] },
    affiliateUrl: { type: String, required: true },
    url: { type: String },
    specScore: { type: Number, default: 9.0 },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
    verdict: { type: String },
    editorialReview: { type: String },
    pros: { type: [String], default: [] },
    cons: { type: [String], default: [] },
    dealBadge: { type: String },
    isFestiveDeal: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    rating: { type: String, default: '4.5' },
    reviews: { type: String, default: '1,000' },
    createdAt: { type: String },
  },
  {
    strict: false,
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
