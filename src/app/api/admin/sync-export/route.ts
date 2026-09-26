import { NextResponse } from 'next/server';
import {
  exportAllSiteData,
  getProducts,
  getGuides,
  getSiteConfig,
  getFestiveCampaigns,
} from '@/lib/jsonDb';
import {
  isAtlasConnected,
  pullAllFromAtlas,
  syncProductToAtlas,
  syncGuideToAtlas,
  syncCampaignToAtlas,
  syncConfigToAtlas,
} from '@/lib/atlasSync';

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    // 1. Pull directly from Atlas into JSON
    if (body.action === 'atlas-pull') {
      const pullRes = await pullAllFromAtlas();
      if (!pullRes.success) {
        return NextResponse.json({ error: pullRes.error }, { status: 500 });
      }
      exportAllSiteData();
      return NextResponse.json({
        message: 'Successfully pulled latest data from MongoDB Atlas cluster.',
        ...pullRes,
      });
    }

    // 2. Push local JSON into Atlas
    if (body.action === 'atlas-push') {
      const products = getProducts();
      const guides = getGuides();
      const campaigns = getFestiveCampaigns();
      const config = getSiteConfig();

      await Promise.all([
        ...products.map((p) => syncProductToAtlas(p)),
        ...guides.map((g) => syncGuideToAtlas(g)),
        ...campaigns.map((c) => syncCampaignToAtlas(c)),
        syncConfigToAtlas(config),
      ]);

      return NextResponse.json({
        message: 'Successfully pushed all local data into MongoDB Atlas.',
        counts: {
          products: products.length,
          guides: guides.length,
          campaigns: campaigns.length,
        },
      });
    }

    // 3. Default export to public/site-data.json and sync to Atlas
    const result = exportAllSiteData();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const atlasActive = await isAtlasConnected();

    return NextResponse.json({
      message: 'Successfully exported site-data.json for production / deployment.',
      atlasConnected: atlasActive,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const atlasActive = await isAtlasConnected();
    return NextResponse.json({
      config: getSiteConfig(),
      campaigns: getFestiveCampaigns(),
      guides: getGuides(),
      productsCount: getProducts().length,
      atlasConnected: atlasActive,
      atlasHost: 'genz-tech.sr0iu6z.mongodb.net',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
