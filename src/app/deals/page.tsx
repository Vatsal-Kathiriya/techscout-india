import React from 'react';
import Link from 'next/link';
import { getProductsFromDb, getCampaignsFromDb } from '@/lib/dbService';
import ProductCard from '@/components/ProductCard';
import AdSense from '@/components/AdSense';
import { Sparkles, Flame, ShieldAlert, Clock, ArrowRight, Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Today's Best Festive Deals & Hardware Discounts | GenzTech.in",
  description:
    'Verified Amazon India festive discounts on 5G smartphones, creator laptops, ANC headphones, and gaming gear. Hand-picked drops with genuine price history.',
  alternates: {
    canonical: '/deals',
  },
  openGraph: {
    title: "Today's Best Festive Deals & Hardware Discounts | GenzTech.in",
    description:
      'Verified Amazon India festive discounts on 5G smartphones, creator laptops, ANC headphones, and gaming gear.',
    url: 'https://genz-tech.in/deals',
    type: 'website',
  },
};

export default async function DealsPage() {
  const [products, campaigns] = await Promise.all([
    getProductsFromDb(),
    getCampaignsFromDb(),
  ]);

  // Filter deal products
  const dealProducts = products.filter((p) => p.isFestiveDeal || p.dealBadge);
  const activeCampaign = campaigns.find((c) => c.active) || campaigns[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* 1. Festive Campaign Hero Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-amber-950 text-white rounded-2xl p-8 sm:p-12 border-2 border-emerald-800/80 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-zinc-950 text-xs font-mono font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{activeCampaign.badge || 'Limited Time Festive Deal'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {activeCampaign.title || 'Great Indian Tech Festival'}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {activeCampaign.discountHeadline ||
              'Up to 45% Off Flagship Laptops, 5G Phones & ANC Gear with Instant Amazon Bank Discounts.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-700">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Daily by GenzTech Testing Lab</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-700">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Amazon Associate Tag: genztech019-21</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Amazon Price Staleness Compliance Box */}
      <section className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold mb-0.5">Amazon Pricing Notice:</strong>
          Product deals, lightning coupons, and promotional bank offers on Amazon.in fluctuate continuously based on stock levels. The prices and availability displayed here are verified periodically. The final purchase price displayed on Amazon.in at checkout applies.
        </div>
      </section>

      {/* ADSENSE: DEALS PAGE */}
      <AdSense adSlot="deals-page" adFormat="auto" />

      {/* 3. Deal Product Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Verified Deal Highlights ({dealProducts.length})
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Devices offering notable price-to-performance reductions this week.
            </p>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-mono uppercase"
          >
            <span>Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
