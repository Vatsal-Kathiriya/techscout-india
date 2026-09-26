import { NextResponse } from 'next/server';
import { getSiteConfigFromDb } from '@/lib/dbService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await getSiteConfigFromDb();
    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
