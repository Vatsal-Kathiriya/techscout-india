import mongoose from 'mongoose';

const GuideSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    excerpt: { type: String },
    category: { type: String, default: 'tech' },
    readTime: { type: String, default: '5 min read' },
    author: { type: String, default: 'GenzTech Editorial' },
    authorRole: { type: String, default: 'Senior Tech Reviewer' },
    publishedAt: { type: String },
    heroImage: { type: String },
    content: { type: String },
    recommendedProductIds: { type: [String], default: [] },
  },
  {
    strict: false,
    timestamps: true,
  }
);

export default mongoose.models.Guide || mongoose.model('Guide', GuideSchema);
