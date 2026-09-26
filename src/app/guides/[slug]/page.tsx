import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGuideBySlugFromDb, getProductsFromDb } from '@/lib/dbService';
import ProductCard from '@/components/ProductCard';
import {
  Clock,
  User,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  Share2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlugFromDb(slug);
  if (!guide) return { title: 'Guide Not Found | GenzTech.in' };

  return {
    title: `${guide.title} | GenzTech.in Buying Guide`,
    description: guide.excerpt,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      url: `https://genz-tech.in/guides/${guide.slug}`,
      type: 'article',
      publishedTime: guide.publishedAt,
      authors: [guide.author],
      images: guide.heroImage ? [{ url: guide.heroImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.excerpt,
      images: guide.heroImage ? [guide.heroImage] : [],
    },
  };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlugFromDb(slug);

  if (!guide) {
    notFound();
  }

  // Schema for Article
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: guide.title,
    description: guide.excerpt,
    image: guide.heroImage ? [guide.heroImage] : [],
    datePublished: guide.publishedAt,
    author: {
      '@type': 'Person',
      name: guide.author,
      jobTitle: guide.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'GenzTech.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://genz-tech.in/favicon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://genz-tech.in/guides/${guide.slug}`,
    },
  };

  // Fetch recommended products
  const allProducts = await getProductsFromDb();
  const recommendedProducts = allProducts.filter((p) =>
    guide.recommendedProductIds?.includes(p._id) || guide.recommendedProductIds?.includes(p.slug)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 py-8 space-y-10 font-sans">
        
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-400" />
        <Link href="/guides" className="hover:text-emerald-600 transition-colors">
          Buying Guides
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-400" />
        <span className="text-zinc-900 dark:text-zinc-200 font-bold truncate max-w-[200px]">
          {guide.title}
        </span>
      </nav>

      {/* 2. Article Header */}
      <header className="space-y-4">
        <span className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
          {guide.category} Field Guide
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 dark:text-white tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
          {guide.subtitle || guide.excerpt}
        </p>

        {/* Author Byline & Metadata */}
        <div className="pt-4 pb-4 border-y border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                {guide.author}
              </span>
              <span className="text-[11px] text-zinc-400">{guide.authorRole}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {guide.readTime}
            </span>
            <span>•</span>
            <span>Published {new Date(guide.publishedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
          </div>
        </div>
      </header>

      {/* 3. Hero Visual */}
      <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-sm relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={guide.heroImage}
          alt={guide.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 4. Mandatory Amazon Affiliate Notice */}
      <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-l-4 border-emerald-600 rounded-r-xl text-xs text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">
        <strong>Transparency &amp; Ethics:</strong> GenzTech.in evaluates hardware independently. The product recommendations below are backed by testing metrics. When you buy through our links, we may earn an Amazon affiliate fee that helps sustain our test laboratory.
      </div>

      {/* 5. Main Body Content */}
      <div className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed space-y-6 text-sm sm:text-base">
        {guide.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white pt-6 border-t border-zinc-100 dark:border-zinc-800">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('---')) {
            return <hr key={idx} className="my-6 border-zinc-200 dark:border-zinc-800" />;
          }
          if (paragraph.includes('|')) {
            // Simple markdown table renderer
            const lines = paragraph.trim().split('\n');
            const headers = lines[0].split('|').filter(Boolean).map((s) => s.trim());
            const rows = lines.slice(2).map((line) => line.split('|').filter(Boolean).map((s) => s.trim()));
            return (
              <div key={idx} className="overflow-x-auto my-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-100 dark:bg-zinc-800">
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} className="p-3 font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {rows.map((r, rIdx) => (
                      <tr key={rIdx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                        {r.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3">{cell.replace(/\*\*/g, '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* 6. Embedded Recommended Product Cards */}
      {recommendedProducts.length > 0 && (
        <section className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Tested &amp; Recommended
            </span>
            <h2 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
              Featured Devices from this Guide
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Top performing hardware options matching our guide benchmark criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recommendedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Back to Guides link */}
      <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </Link>
      </div>

    </article>
    </>
  );
}
