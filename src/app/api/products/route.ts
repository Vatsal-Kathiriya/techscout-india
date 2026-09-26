import { NextResponse } from 'next/server';
import { getProductsFromDb } from '@/lib/dbService';
import { addProduct } from '@/lib/jsonDb';
import { syncProductToAtlas } from '@/lib/atlasSync';
import { isRequestAuthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getProductsFromDb();
    return NextResponse.json(products);
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
    const newProduct = addProduct(body);
    // Persist to MongoDB Atlas asynchronously
    syncProductToAtlas(newProduct).catch(() => {});
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
