import { getProductsFromDb } from '@/lib/dbService';
import ProductExplorer from '@/components/ProductExplorer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hardware Product Catalog | GenzTech.in',
  description:
    'Browse our full lab-tested hardware catalog across 5G smartphones, gaming laptops, audiophile ANC headphones, and smart gear on Amazon India.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Hardware Product Catalog | GenzTech.in',
    description:
      'Browse our full lab-tested hardware catalog across 5G smartphones, gaming laptops, audiophile ANC headphones, and smart gear on Amazon India.',
    url: 'https://genz-tech.in/products',
    type: 'website',
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; brand?: string }>;
}) {
  const params = await searchParams;
  const products = await getProductsFromDb();

  return (
    <ProductExplorer
      initialProducts={products}
      defaultCategory={params.cat || 'all'}
      defaultBrand={params.brand || ''}
      defaultQuery={params.q || ''}
      title="Hardware Products & Devices Catalog"
      subtitle="Explore lab-tested electronics with transparent hardware specifications and Amazon India pricing."
    />
  );
}
