import { NextResponse } from 'next/server';
import { getSiteConfigFromDb } from '@/lib/dbService';
import { saveSiteConfig } from '@/lib/jsonDb';
import { syncConfigToAtlas } from '@/lib/atlasSync';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await getSiteConfigFromDb();
    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updated = saveSiteConfig(body);
    syncConfigToAtlas(updated).catch(() => {});
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
