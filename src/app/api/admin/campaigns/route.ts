import { NextResponse } from 'next/server';
import { getCampaignsFromDb } from '@/lib/dbService';
import { addCampaign, updateCampaign, deleteCampaign } from '@/lib/jsonDb';
import { syncCampaignToAtlas, deleteCampaignFromAtlas } from '@/lib/atlasSync';
import { isRequestAuthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const campaigns = await getCampaignsFromDb();
    return NextResponse.json(campaigns);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized: Owner access required.' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const created = addCampaign(body);
    await syncCampaignToAtlas(created);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized: Owner access required.' }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Campaign id is required' }, { status: 400 });
    }
    const updated = updateCampaign(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    await syncCampaignToAtlas(updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized: Owner access required.' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Campaign id is required' }, { status: 400 });
    }
    deleteCampaign(id);
    await deleteCampaignFromAtlas(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
