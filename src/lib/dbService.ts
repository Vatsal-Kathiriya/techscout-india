import connectDB from './db';
import ProductModel from '@/models/Product';
import GuideModel from '@/models/Guide';
import CampaignModel from '@/models/Campaign';
import SiteConfigModel from '@/models/SiteConfig';
import { Product, BuyingGuide, FestiveCampaign, SiteConfig } from '@/types/store';
import {
  getProducts as getJsonProducts,
  getProductById as getJsonProductById,
  getProductBySlug as getJsonProductBySlug,
  updateProduct as updateJsonProduct,
  deleteProduct as deleteJsonProduct,
  deriveBrandFromTitle,
  getGuides as getJsonGuides,
  getGuideBySlug as getJsonGuideBySlug,
  updateGuide as updateJsonGuide,
  deleteGuide as deleteJsonGuide,
  getFestiveCampaigns as getJsonCampaigns,
  updateCampaign as updateJsonCampaign,
  deleteCampaign as deleteJsonCampaign,
  getSiteConfig as getJsonSiteConfig,
} from './jsonDb';

// --- PRODUCTS ---
export async function getProductsFromDb(): Promise<Product[]> {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      const docs = await ProductModel.find({}).lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          _id: d._id?.toString() || d.id || d.asin,
        })) as Product[];
      }
    }
  } catch (err) {
    console.warn('MongoDB Atlas getProducts fallback to local storage:', (err as any).message);
  }
  return getJsonProducts();
}

export async function getProductByIdFromDb(id: string): Promise<Product | null> {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      const doc = await ProductModel.findOne({
        $or: [{ _id: id }, { asin: id }, { slug: id }],
      }).lean();
      if (doc) {
        return {
          ...doc,
          _id: (doc as any)._id?.toString() || (doc as any).asin,
        } as Product;
      }
    }
  } catch (err) {
    console.warn('MongoDB Atlas getProductById fallback to local storage:', (err as any).message);
  }
  return getJsonProductById(id);
}

export async function getProductBySlugFromDb(slug: string): Promise<Product | null> {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      const doc = await ProductModel.findOne({
        $or: [{ slug }, { _id: slug }, { asin: slug }],
      }).lean();
      if (doc) {
        return {
          ...doc,
          _id: (doc as any)._id?.toString() || (doc as any).asin,
        } as Product;
      }
    }
  } catch (err) {
    console.warn('MongoDB Atlas getProductBySlug fallback to local storage:', (err as any).message);
  }
  return getJsonProductBySlug(slug);
}

export async function updateProductInDb(id: string, updates: Partial<Product>): Promise<Product | null> {
  // Ensure brand is derived from first word of title if brand is empty or 'GenzTech'
  if (updates.title || updates.brand) {
    const derived = deriveBrandFromTitle(updates.title, updates.brand);
    if (!updates.brand || updates.brand.toLowerCase() === 'genztech') {
      updates.brand = derived;
    }
  }

  let updatedProduct: Product | null = null;

  // 1. Try MongoDB Atlas if configured
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      const { _id, ...safeUpdates } = updates as any;
      if (safeUpdates.price) {
        safeUpdates.priceLastVerified = new Date().toISOString();
      }
      const doc = await ProductModel.findOneAndUpdate(
        { $or: [{ _id: id }, { asin: id }, { slug: id }] },
        { $set: safeUpdates },
        { returnDocument: 'after', new: true }
      ).lean();

      if (doc) {
        updatedProduct = {
          ...doc,
          _id: (doc as any)._id?.toString() || (doc as any).asin,
        } as Product;
      }
    } catch (err: any) {
      console.warn('MongoDB Atlas updateProductInDb error:', err.message);
    }
  }

  // 2. Also update local jsonDb / memory cache
  const jsonUpdated = updateJsonProduct(id, updates);
  if (!updatedProduct && jsonUpdated) {
    updatedProduct = jsonUpdated;
    if (process.env.MONGODB_URI) {
      try {
        await connectDB();
        await ProductModel.findOneAndUpdate(
          { $or: [{ _id: jsonUpdated._id }, { asin: jsonUpdated.asin }, { slug: jsonUpdated.slug }] },
          { $set: jsonUpdated },
          { upsert: true, returnDocument: 'after', new: true }
        );
      } catch (err: any) {
        console.warn('MongoDB Atlas upsert error:', err.message);
      }
    }
  }

  return updatedProduct;
}

export async function deleteProductFromDb(id: string): Promise<boolean> {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      await ProductModel.deleteMany({
        $or: [{ _id: id }, { asin: id }, { slug: id }],
      });
    } catch (err: any) {
      console.warn('MongoDB Atlas deleteProductFromDb error:', err.message);
    }
  }
  deleteJsonProduct(id);
  return true;
}

// --- GUIDES ---
export async function getGuidesFromDb(): Promise<BuyingGuide[]> {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      const docs = await GuideModel.find({}).lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          _id: d._id?.toString() || d.slug,
        })) as BuyingGuide[];
      }
    }
  } catch (err) {
    console.warn('MongoDB Atlas getGuides fallback to local storage:', (err as any).message);
  }
  return getJsonGuides();
}

export async function getGuideBySlugFromDb(slug: string): Promise<BuyingGuide | null> {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      const doc = await GuideModel.findOne({
        $or: [{ slug }, { _id: slug }],
      }).lean();
      if (doc) {
        return {
          ...doc,
          _id: (doc as any)._id?.toString() || (doc as any).slug,
        } as BuyingGuide;
      }
    }
  } catch (err) {
    console.warn('MongoDB Atlas getGuideBySlug fallback to local storage:', (err as any).message);
  }
  return getJsonGuideBySlug(slug);
}

export async function updateGuideInDb(id: string, updates: Partial<BuyingGuide>): Promise<BuyingGuide | null> {
  let updatedGuide: BuyingGuide | null = null;
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      const { _id, ...safeUpdates } = updates as any;
      const doc = await GuideModel.findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }] },
        { $set: safeUpdates },
        { returnDocument: 'after', new: true }
      ).lean();
      if (doc) {
        updatedGuide = {
          ...doc,
          _id: (doc as any)._id?.toString() || (doc as any).slug,
        } as BuyingGuide;
      }
    } catch (err: any) {
      console.warn('MongoDB Atlas updateGuideInDb error:', err.message);
    }
  }
  const jsonUpdated = updateJsonGuide(id, updates);
  if (!updatedGuide && jsonUpdated) {
    updatedGuide = jsonUpdated;
  }
  return updatedGuide;
}

export async function deleteGuideFromDb(id: string): Promise<boolean> {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      await GuideModel.deleteMany({
        $or: [{ _id: id }, { slug: id }],
      });
    } catch (err: any) {
      console.warn('MongoDB Atlas deleteGuideFromDb error:', err.message);
    }
  }
  deleteJsonGuide(id);
  return true;
}

// --- FESTIVE CAMPAIGNS ---
export async function getCampaignsFromDb(): Promise<FestiveCampaign[]> {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      const docs = await CampaignModel.find({}).lean();
      if (docs && docs.length > 0) {
        return docs as FestiveCampaign[];
      }
    }
  } catch (err) {
    console.warn('MongoDB Atlas getCampaigns fallback to local storage:', (err as any).message);
  }
  return getJsonCampaigns();
}

export async function updateCampaignInDb(id: string, updates: Partial<FestiveCampaign>): Promise<FestiveCampaign | null> {
  let updatedCampaign: FestiveCampaign | null = null;
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      const doc = await CampaignModel.findOneAndUpdate(
        { id },
        { $set: updates },
        { returnDocument: 'after', new: true }
      ).lean();
      if (doc) {
        updatedCampaign = doc as FestiveCampaign;
      }
    } catch (err: any) {
      console.warn('MongoDB Atlas updateCampaignInDb error:', err.message);
    }
  }
  const jsonUpdated = updateJsonCampaign(id, updates);
  if (!updatedCampaign && jsonUpdated) {
    updatedCampaign = jsonUpdated;
  }
  return updatedCampaign;
}

export async function deleteCampaignFromDb(id: string): Promise<boolean> {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      await CampaignModel.deleteMany({ id });
    } catch (err: any) {
      console.warn('MongoDB Atlas deleteCampaignFromDb error:', err.message);
    }
  }
  deleteJsonCampaign(id);
  return true;
}

// --- SITE CONFIG ---
export async function getSiteConfigFromDb(): Promise<SiteConfig> {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      const doc = await SiteConfigModel.findOne({ _id: 'global-config' }).lean();
      if (doc) {
        const { _id, __v, ...cleanDoc } = doc as any;
        return cleanDoc as SiteConfig;
      }
    }
  } catch (err) {
    console.warn('MongoDB Atlas getSiteConfig fallback to local storage:', (err as any).message);
  }
  return getJsonSiteConfig();
}
