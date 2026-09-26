import { NextResponse } from 'next/server';
import { getGuidesFromDb } from '@/lib/dbService';
import { addGuide, updateGuide, deleteGuide } from '@/lib/jsonDb';
import { syncGuideToAtlas, deleteGuideFromAtlas } from '@/lib/atlasSync';
import { isRequestAuthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const guides = await getGuidesFromDb();
    return NextResponse.json(guides);
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
    const created = addGuide(body);
    await syncGuideToAtlas(created);
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
    if (!body._id && !body.slug) {
      return NextResponse.json({ error: 'Guide _id or slug is required' }, { status: 400 });
    }
    const id = body._id || body.slug;
    const updated = updateGuide(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }
    await syncGuideToAtlas(updated);
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
      return NextResponse.json({ error: 'Guide id is required' }, { status: 400 });
    }
    deleteGuide(id);
    await deleteGuideFromAtlas(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
