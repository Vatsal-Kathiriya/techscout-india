import { NextResponse } from 'next/server';
import { getProductByIdFromDb, updateProductInDb, deleteProductFromDb } from '@/lib/dbService';
import { isRequestAuthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET a product by id / asin / slug
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await getProductByIdFromDb(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE a product (Owner Only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized: Owner access required.' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { id } = await params;

    const updatedProduct = await updateProductInDb(id, body);

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a product (Owner Only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized: Owner access required.' }, { status: 401 });
  }
  try {
    const { id } = await params;

    await deleteProductFromDb(id);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
