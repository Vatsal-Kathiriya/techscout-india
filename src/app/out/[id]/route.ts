import { NextResponse } from 'next/server';
import { getProductByIdFromDb } from '@/lib/dbService';
import { getUniversalRedirectUrl } from '@/lib/affiliate';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getProductByIdFromDb(id);

  const destination = getUniversalRedirectUrl(product);

  return NextResponse.redirect(destination, {
    status: 307,
    headers: {
      'Referrer-Policy': 'no-referrer-when-downgrade',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
