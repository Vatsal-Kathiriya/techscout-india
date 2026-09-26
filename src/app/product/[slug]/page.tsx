import { getProductBySlugFromDb, getProductsFromDb } from '@/lib/dbService';
import ProductDetailView from '@/components/ProductDetailView';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlugFromDb(slug);
  if (!product) return { title: 'Product Not Found | GenzTech.in' };

  return {
    title: `${product.title} Review & Specs | GenzTech.in`,
    description:
      product.verdict ||
      `Technical review, hardware specifications, and verified Amazon India pricing for ${product.title}.`,
    alternates: {
      canonical: `/product/${product.slug || product._id}`,
    },
    openGraph: {
      title: `${product.title} | GenzTech.in`,
      description: product.verdict,
      url: `https://genz-tech.in/product/${product.slug || product._id}`,
      type: 'website',
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.verdict,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlugFromDb(slug);

  if (!product) {
    notFound();
  }

  // Parse numeric price for schema
  const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
  const reviewCount = parseInt((product.reviews || '120').replace(/[^0-9]/g, '')) || 120;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: [product.imageUrl, ...(product.gallery || [])],
    description: product.editorialReview || product.verdict,
    sku: product.asin,
    mpn: product.asin,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://genz-tech.in/product/${product.slug || product._id}`,
      priceCurrency: 'INR',
      price: numericPrice,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Amazon India',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || '4.5',
      reviewCount: reviewCount,
    },
  };

  // Find alternatives in the same category
  const allProducts = await getProductsFromDb();
  const alternatives = allProducts
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailView product={product} alternatives={alternatives} />
    </>
  );
}
