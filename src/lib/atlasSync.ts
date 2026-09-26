import connectDB from './db';
import ProductModel from '@/models/Product';
import GuideModel from '@/models/Guide';
import CampaignModel from '@/models/Campaign';
import SiteConfigModel from '@/models/SiteConfig';
import { Product, BuyingGuide, FestiveCampaign, SiteConfig } from '@/types/store';
import fs from 'fs';
import path from 'path';

export async function isAtlasConnected(): Promise<boolean> {
  try {
    if (!process.env.MONGODB_URI) return false;
    await connectDB();
    return true;
  } catch (err) {
    return false;
  }
}

export async function syncProductToAtlas(product: Product) {
  try {
    if (!process.env.MONGODB_URI) return;
    await connectDB();
    await ProductModel.findOneAndUpdate(
      { $or: [{ _id: product._id }, { asin: product.asin }, { slug: product.slug }] },
      { $set: product },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.warn('Atlas product sync failed (continuing with JSON):', (err as any).message);
  }
}

export async function deleteProductFromAtlas(id: string) {
  try {
    if (!process.env.MONGODB_URI) return;
    await connectDB();
    await ProductModel.deleteMany({
      $or: [{ _id: id }, { asin: id }, { slug: id }],
    });
  } catch (err) {
    console.warn('Atlas product delete failed:', (err as any).message);
  }
}

export async function syncGuideToAtlas(guide: BuyingGuide) {
  try {
    if (!process.env.MONGODB_URI) return;
    await connectDB();
    await GuideModel.findOneAndUpdate(
      { $or: [{ _id: guide._id }, { slug: guide.slug }] },
      { $set: guide },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.warn('Atlas guide sync failed:', (err as any).message);
  }
}

export async function deleteGuideFromAtlas(id: string) {
  try {
    if (!process.env.MONGODB_URI) return;
    await connectDB();
    await GuideModel.deleteMany({
      $or: [{ _id: id }, { slug: id }],
    });
  } catch (err) {
    console.warn('Atlas guide delete failed:', (err as any).message);
  }
}

export async function syncCampaignToAtlas(campaign: FestiveCampaign) {
  try {
    if (!process.env.MONGODB_URI) return;
    await connectDB();
    await CampaignModel.findOneAndUpdate(
      { id: campaign.id },
      { $set: campaign },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.warn('Atlas campaign sync failed:', (err as any).message);
  }
}

export async function deleteCampaignFromAtlas(id: string) {
  try {
    if (!process.env.MONGODB_URI) return;
    await connectDB();
    await CampaignModel.deleteMany({ id });
  } catch (err) {
    console.warn('Atlas campaign delete failed:', (err as any).message);
  }
}

export async function syncConfigToAtlas(config: Partial<SiteConfig>) {
  try {
    if (!process.env.MONGODB_URI) return;
    await connectDB();
    await SiteConfigModel.findOneAndUpdate(
      { _id: 'global-config' },
      { $set: config },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.warn('Atlas config sync failed:', (err as any).message);
  }
}

export async function pullAllFromAtlas() {
  try {
    if (!process.env.MONGODB_URI) return { success: false, error: 'MONGODB_URI not defined' };
    await connectDB();

    const [products, guides, campaigns, configDoc] = await Promise.all([
      ProductModel.find({}).lean(),
      GuideModel.find({}).lean(),
      CampaignModel.find({}).lean(),
      SiteConfigModel.findOne({ _id: 'global-config' }).lean(),
    ]);

    const cwd = process.cwd();
    if (products && products.length > 0) {
      fs.writeFileSync(path.join(cwd, 'products.json'), JSON.stringify(products, null, 2));
    }
    if (guides && guides.length > 0) {
      fs.writeFileSync(path.join(cwd, 'guides.json'), JSON.stringify(guides, null, 2));
    }
    if (campaigns && campaigns.length > 0) {
      fs.writeFileSync(path.join(cwd, 'campaigns.json'), JSON.stringify(campaigns, null, 2));
    }
    if (configDoc) {
      const { _id, __v, ...cleanConfig } = configDoc as any;
      fs.writeFileSync(path.join(cwd, 'site-config.json'), JSON.stringify(cleanConfig, null, 2));
    }

    return {
      success: true,
      counts: {
        products: products.length,
        guides: guides.length,
        campaigns: campaigns.length,
        config: configDoc ? 1 : 0,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
