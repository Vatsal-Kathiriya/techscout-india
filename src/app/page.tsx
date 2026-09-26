import React from 'react';
import Link from 'next/link';
import {
  getProductsFromDb,
  getCampaignsFromDb,
  getGuidesFromDb,
  getSiteConfigFromDb,
} from '@/lib/dbService';
import ProductCard from '@/components/ProductCard';
import HomeClientSections from '@/components/HomeClientSections';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  BookOpen,
  TrendingUp,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'GenzTech.in | Smart Tech. Better Choices.',
  description:
    'Discover useful technology, compare products and find smarter buying options on Amazon India. Authoritative hardware specs, benchmarks and verified festive deals.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const [products, campaigns, guides, config] = await Promise.all([
    getProductsFromDb(),
    getCampaignsFromDb(),
    getGuidesFromDb(),
    getSiteConfigFromDb(),
  ]);

  const festiveProducts = products.filter((p) => p.isFestiveDeal || p.dealBadge);
  const featuredProducts = products.filter((p) => p.isFeatured || p.specScore >= 9.4);
  const activeCampaign = campaigns.find((c) => c.active) || campaigns[0];

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-zinc-950 font-sans pb-20 transition-colors">
      
      {/* ========================================================================= */}
      {/* 1. SPLIT HERO & FESTIVE CAMPAIGN STAGE                                   */}
      {/* ========================================================================= */}
      <section className="border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900/60 py-8 lg:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Main Hero Banner */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Festive Campaign Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>{activeCampaign?.title ? `${activeCampaign.title} Live` : 'Festive Tech Deals Live'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 dark:text-white tracking-tight leading-[1.1]">
                {config.heroHeadline || 'Smart Tech. Better Choices.'}
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
                {config.heroSubheadline ||
                  'Discover useful technology, compare products and find smarter buying options on Amazon.in with laboratory-grade hardware telemetry.'}
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={config.primaryCtaLink || '/products'}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                >
                  <span>{config.primaryCtaText || 'Explore Products'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href={config.secondaryCtaLink || '/deals'}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>{config.secondaryCtaText || "Today's Deals"}</span>
                </Link>

                <Link
                  href="/compare"
                  className="px-5 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-bold rounded-xl transition-all"
                >
                  Compare Hardware
                </Link>
              </div>

              {/* Trust signals */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Amazon Verified Pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Independent Lab Benchmarks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Zero Biased Sponsorships</span>
                </div>
              </div>

            </div>

            {/* Right Side Bento Quad-Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              
              {/* Card 1: 5G Smartphones */}
              <Link
                href="/category/smartphones"
                className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-4 rounded-xl hover:border-emerald-600 transition-all group flex flex-col justify-between h-44 shadow-xs"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 tracking-wider">
                    Category // 01
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-1 group-hover:text-emerald-600 transition-colors">
                    Top 5G Smartphones
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-1">A18 Pro vs Snapdragon 8 Gen 3</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded p-1 flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=200"
                      alt="Smartphones"
                      className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>
                </div>
              </Link>

              {/* Card 2: Gaming Laptops */}
              <Link
                href="/category/laptops"
                className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-4 rounded-xl hover:border-emerald-600 transition-all group flex flex-col justify-between h-44 shadow-xs"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 tracking-wider">
                    Category // 02
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-1 group-hover:text-emerald-600 transition-colors">
                    Gaming Laptops by GPU
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-1">RTX 4060 to RTX 4080 (140W TGP)</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded p-1 flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=200"
                      alt="Laptops"
                      className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>
                </div>
              </Link>

              {/* Card 3: ANC Earbuds */}
              <Link
                href="/category/audio"
                className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-4 rounded-xl hover:border-emerald-600 transition-all group flex flex-col justify-between h-44 shadow-xs"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 tracking-wider">
                    Category // 03
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-1 group-hover:text-emerald-600 transition-colors">
                    ANC Earbuds & Audio
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-1">Sony XM5 vs AirPods Pro 2</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded p-1 flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=200"
                      alt="Audio"
                      className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>
                </div>
              </Link>

              {/* Card 4: Lightning Deals */}
              <Link
                href="/deals"
                className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-4 rounded-xl hover:shadow-lg transition-all group flex flex-col justify-between h-44 shadow-xs"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-100 tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" />
                    Festive Hub
                  </span>
                  <h3 className="text-sm font-bold mt-1 text-white leading-snug">
                    Today&apos;s Lightning Deals
                  </h3>
                  <p className="text-[11px] text-amber-100/90 mt-1">Up to 45% Verified Drops</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-white underline underline-offset-2 flex items-center gap-1">
                    View Deals <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FESTIVE DEALS CAROUSEL / SPOTLIGHT ("TODAY'S BEST DEALS")              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-6">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-zinc-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-emerald-700/60">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-zinc-950 text-xs font-black uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5 fill-current" />
                {activeCampaign?.badge || 'Featured Festive Drops'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {activeCampaign?.discountHeadline || "Today's Best Deals & Price Drops"}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                Curated electronics with verified price history on Amazon India.
              </p>
            </div>

            <Link
              href="/deals"
              className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shrink-0 self-start md:self-auto"
            >
              <span>Explore All {festiveProducts.length} Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Festive Deals Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {festiveProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE CATEGORY TABS & FILTERED HARDWARE MATRIX                  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <HomeClientSections products={products} />
      </section>

      {/* ========================================================================= */}
      {/* 4. ORIGINAL BUYING GUIDES & EDITORIAL HUB                                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>GenzTech Editorial Lab</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
              In-Depth Hardware Buying Guides
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Independent technical analysis, testing methodology, and comparison charts.
            </p>
          </div>

          <Link
            href="/guides"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start md:self-auto font-mono uppercase tracking-wider"
          >
            <span>All Buying Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide._id}
              href={`/guides/${guide.slug}`}
              className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-600 hover:shadow-lg transition-all group flex flex-col h-full"
            >
              <div className="h-44 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={guide.heroImage}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900/80 text-white backdrop-blur-xs">
                  {guide.readTime}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600">
                    {guide.category}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-1 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {guide.excerpt}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>By {guide.author}</span>
                  <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">
                    Read →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
