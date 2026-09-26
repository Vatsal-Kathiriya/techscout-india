import "dotenv/config";
import { pathToFileURL } from "node:url";
import path from "node:path";
import mongoose from "mongoose";
import Product from "../src/models/Product.js";

const catalogModule = await import(pathToFileURL(path.resolve(process.cwd(), "../products-data.js")));
const catalog = catalogModule.default || catalogModule;
const products = catalog.products || [];

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required to seed the database.");

await mongoose.connect(process.env.MONGODB_URI);
for (const product of products) {
  await Product.findOneAndUpdate(
    { legacyId: product.id },
    {
      legacyId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.old,
      rating: Number(product.rating),
      reviews: product.reviews,
      badge: product.badge,
      deal: product.deal,
      image: product.image,
      description: product.description,
      specs: product.specs,
      bestFor: product.bestFor,
      pros: product.pros,
      consider: product.consider,
      outboundUrl: `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`,
      isPublished: true
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

console.log(`Seeded ${products.length} products.`);
await mongoose.disconnect();
