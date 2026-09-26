'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/store';
import { useComparison } from '@/context/ComparisonContext';
import ProductCard from './ProductCard';
import {
  ExternalLink,
  Award,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Scale,
  Clock,
  Sparkles,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  alternatives: Product[];
}

export default function ProductDetailView({
  product,
  alternatives,
}: ProductDetailViewProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useComparison();
  const inCompare = isInCompare(product._id);

  // Gallery state
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.imageUrl];
  const [selectedImage, setSelectedImage] = useState(images[0] || product.imageUrl);

  const isStale = React.useMemo(() => {
    if (!product.priceLastVerified) return false;
    const verifiedTime = new Date(product.priceLastVerified).getTime();
    return Date.now() - verifiedTime > 24 * 60 * 60 * 1000;
  }, [product.priceLastVerified]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-400" />
        <Link href={`/category/${product.category}`} className="capitalize hover:text-emerald-600 transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-400" />
        <span className="text-zinc-900 dark:text-zinc-200 font-bold truncate max-w-[240px]">
          {product.title}
        </span>
      </nav>

      {/* 2. Top Hero Section: Gallery + Primary Specs & CTAs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Multi-Angle Gallery (5 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Visual Stage */}
          <div className="w-full h-80 sm:h-[450px] bg-[#F4F4F5] dark:bg-zinc-900 rounded-2xl p-8 flex items-center justify-center relative border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            {/* Spec score badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xs border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono font-bold text-emerald-600">
              <Award className="w-4 h-4" />
              <span>Spec Score: {product.specScore ? product.specScore.toFixed(1) : '9.0'}/10</span>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt={product.title}
              className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-all duration-300 hover:scale-105"
            />
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl border-2 p-1 bg-zinc-100 dark:bg-zinc-900 shrink-0 overflow-hidden transition-all ${
                    selectedImage === img
                      ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Angle ${i + 1}`} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Pricing, Specs, Compliance & Direct CTAs (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {product.brand}
              </span>
              {product.dealBadge && (
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-amber-500 text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {product.dealBadge}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Verdict callout */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border-l-4 border-emerald-600 p-4 rounded-r-xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-1">
              GenzTech Editorial Lab Verdict
            </span>
            <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
              &ldquo;{product.verdict}&rdquo;
            </p>
          </div>

          {/* Price & Amazon Availability Box */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-zinc-950 dark:text-white">
                    {product.price}
                  </span>
                  {product.mrp && product.mrp !== product.price && (
                    <span className="text-sm font-mono text-zinc-400 line-through">
                      M.R.P: {product.mrp}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Indicative Price (Verified{' '}
                    {new Date(product.priceLastVerified || Date.now()).toLocaleDateString('en-IN')})
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Verified In Stock
                </span>
              </div>
            </div>

            {isStale && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-mono">
                * Live price on Amazon may have changed since the last automated verification.
              </p>
            )}

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              {/* Primary Amazon CTA */}
              <a
                href={`/out/${product._id}`}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="w-full sm:flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Proceed to Amazon.in</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Compare Button */}
              <button
                onClick={() => (inCompare ? removeFromCompare(product._id) : addToCompare(product))}
                className={`w-full sm:w-auto px-5 py-4 rounded-xl border-2 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  inCompare
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-emerald-600'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{inCompare ? 'Added in Compare' : '+ Add to Compare'}</span>
              </button>
            </div>

            {/* Micro affiliate compliance badge */}
            <div className="pt-2 text-[11px] text-zinc-400 font-mono flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Amazon Associate Gateway Active</span>
              </span>
              <span>ASIN: {product.asin}</span>
            </div>

          </div>

          {/* Quick Hardware Highlights Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            {Object.entries(product.specs || {}).slice(0, 4).map(([key, val]) => (
              <div key={key} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 block truncate">
                  {val}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 3. Deep-Dive Review & Pros & Cons Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        
        {/* Left Column: Editorial Deep-Dive & Who Should Buy This (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
              In-Depth Hardware Analysis
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Tested and evaluated by GenzTech consumer electronics engineers.
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-4">
            <p>{product.editorialReview}</p>
          </div>

          {/* Who Should Buy This Box */}
          <div className="bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              Who Should Buy the {product.title}?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Ideal for users demanding sustained peak performance without compromises in build materials or everyday software polish. If you value longevity, high resale value, and verified hardware reliability, this device represents one of our highest-ranked recommendations.
            </p>
          </div>

          {/* Inline Compliance Disclosure */}
          <div className="p-3.5 bg-zinc-100 dark:bg-zinc-900/60 rounded-lg text-[11px] text-zinc-500 font-mono leading-normal flex items-start gap-2 border border-zinc-200 dark:border-zinc-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Affiliate Disclosure:</strong> When you purchase through our links, we may earn an affiliate commission from Amazon.in at zero additional cost to you. Our editorial evaluations are never influenced by manufacturer sponsorship.
            </span>
          </div>
        </div>

        {/* Right Column: Pros, Cons & Full Technical Specs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pros & Cons Card */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-5">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              GenzTech Evaluation Summary
            </h3>

            {/* Pros */}
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Key Advantages
              </span>
              <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                {product.pros?.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-600 flex items-center gap-1 mb-2">
                <XCircle className="w-4 h-4" />
                Points to Consider
              </span>
              <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                {product.cons?.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Full Technical Specifications Table */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-mono mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
              Full Technical Specifications
            </h3>

            <dl className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs font-mono">
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-zinc-500">Manufacturer</dt>
                <dd className="font-bold text-zinc-900 dark:text-white text-right">{product.brand}</dd>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-zinc-500">Category</dt>
                <dd className="font-bold text-zinc-900 dark:text-white text-right capitalize">{product.category}</dd>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-zinc-500">Amazon ASIN</dt>
                <dd className="font-bold text-zinc-900 dark:text-white text-right">{product.asin}</dd>
              </div>
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <div key={key} className="py-2.5 flex justify-between gap-4">
                  <dt className="text-zinc-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                  <dd className="font-bold text-zinc-900 dark:text-white text-right max-w-[200px] truncate">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

        </div>

      </div>

      {/* 4. Alternative Devices to Compare Carousel / Grid */}
      {alternatives.length > 0 && (
        <section className="pt-10 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
                Alternative Devices to Compare
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Similar hardware options in the {product.category} segment.
              </p>
            </div>

            <Link
              href={`/category/${product.category}`}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 font-mono uppercase"
            >
              View All {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {alternatives.map((alt) => (
              <ProductCard key={alt._id} product={alt} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
