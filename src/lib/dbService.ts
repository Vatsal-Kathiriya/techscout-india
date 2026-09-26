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
  getGuides as getJsonGuides,
  getGuideBySlug as getJsonGuideBySlug,
  getFestiveCampaigns as getJsonCampaigns,
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
