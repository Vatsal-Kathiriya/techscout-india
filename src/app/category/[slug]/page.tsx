import { getProductsFromDb } from '@/lib/dbService';
import ProductExplorer from '@/components/ProductExplorer';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const CATEGORY_NAMES: Record<string, { title: string; subtitle: string }> = {
  smartphones: {
    title: 'Flagship 5G Smartphones',
    subtitle: 'Compare camera sensors, display refresh rates, and processor benchmarks on Amazon India.',
  },
  laptops: {
    title: 'Gaming & Creator Laptops',
    subtitle: 'Analyze GPU TGP wattage, OLED displays, and battery longevity across top Windows & Mac notebooks.',
  },
  audio: {
    title: 'Active Noise Cancelling (ANC) & Audio Gear',
    subtitle: 'Laboratory-grade acoustic evaluations of wireless over-ears and true wireless earbuds.',
  },
  smartwatches: {
    title: 'Smartwatches & Wrist Wearables',
    subtitle: 'Compare health sensors, dual-band GPS accuracy, and multi-day battery endurance.',
  },
  gaming: {
    title: 'Gaming Consoles & Handheld PCs',
    subtitle: 'Next-gen consoles, 90Hz OLED handhelds, and competitive esports gear.',
  },
  accessories: {
    title: 'High-Performance PC & Tech Accessories',
    subtitle: 'Ergonomic mice, custom mechanical keyboards, high-wattage power banks, and rugged SSDs.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();
  const cat = CATEGORY_NAMES[lowerSlug];
  return {
    title: `${cat ? cat.title : 'Category'} | GenzTech.in`,
    description: cat ? cat.subtitle : 'Compare tech devices and hardware specs on GenzTech.in',
    alternates: {
      canonical: `/category/${lowerSlug}`,
    },
    openGraph: {
      title: `${cat ? cat.title : 'Category'} | GenzTech.in`,
      description: cat ? cat.subtitle : 'Compare tech devices and hardware specs on GenzTech.in',
      url: `https://genz-tech.in/category/${lowerSlug}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ brand?: string; bracket?: string }>;
}) {
  const { slug } = await params;
  const sParams = await searchParams;
  const lowerSlug = slug.toLowerCase();

  const validCategories = ['smartphones', 'laptops', 'audio', 'smartwatches', 'gaming', 'accessories'];
  if (!validCategories.includes(lowerSlug)) {
    notFound();
  }

  const products = await getProductsFromDb();
  const info = CATEGORY_NAMES[lowerSlug] || {
    title: 'Hardware Devices',
    subtitle: 'Explore our curated hardware catalog.',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://genz-tech.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: info.title,
        item: `https://genz-tech.in/category/${lowerSlug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductExplorer
        initialProducts={products}
        defaultCategory={lowerSlug}
        defaultBrand={sParams.brand || ''}
        title={info.title}
        subtitle={info.subtitle}
      />
    </>
  );
}
