import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  legacyId: { type: Number, unique: true, sparse: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 180 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviews: { type: String, default: "0", maxlength: 30 },
  badge: { type: String, default: "PICK", maxlength: 40 },
  deal: { type: String, default: "", maxlength: 40 },
  image: { type: String, required: true, maxlength: 1000 },
  description: { type: String, required: true, maxlength: 2000 },
  specs: { type: [String], default: [] },
  bestFor: { type: String, default: "", maxlength: 160 },
  pros: { type: [String], default: [] },
  consider: { type: String, default: "", maxlength: 300 },
  outboundUrl: { type: String, default: "", maxlength: 1000 },
  isPublished: { type: Boolean, default: true, index: true }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
