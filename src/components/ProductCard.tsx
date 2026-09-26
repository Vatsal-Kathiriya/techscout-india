'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/store';
import { useComparison } from '@/context/ComparisonContext';
import {
  ExternalLink,
  Check,
  Plus,
  Clock,
  AlertTriangle,
  Award,
  Sparkles,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  displayMode?: 'indicative' | 'safe_cta';
}

export default function ProductCard({ product, displayMode }: ProductCardProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useComparison();
  const inCompare = isInCompare(product._id);

  // Active mode: either passed explicitly or read from product or default to indicative
  const mode = displayMode || product.priceMode || 'indicative';

  // Check staleness (if verified date is > 24 hours ago)
  const isStale = React.useMemo(() => {
    if (!product.priceLastVerified) return false;
    const verifiedTime = new Date(product.priceLastVerified).getTime();
    const now = Date.now();
    return now - verifiedTime > 24 * 60 * 60 * 1000;
  }, [product.priceLastVerified]);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product._id);
    } else {
      addToCompare(product);
    }
  };

  // Compute price tier badge for Mode B
  const priceBracket = React.useMemo(() => {
    const num = parseInt(product.price.replace(/\D/g, ''), 10);
    if (isNaN(num)) return 'Standard Tier';
    if (num < 15000) return 'Budget Choice (Under ₹15K)';
    if (num < 35000) return 'Mid-Range Value (₹15K–₹35K)';
    if (num < 75000) return 'Premium Tier (₹35K–₹75K)';
    return 'Ultra Flagship';
  }, [product.price]);

  return (
    <article className="group bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      
      {/* Top badges: Festive / Deal & Spec Score */}
      <div className="p-3 pb-0 flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.dealBadge ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              {product.dealBadge}
            </span>
          ) : product.isFestiveDeal ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-600 text-white">
              Festive Deal
            </span>
          ) : (
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-400">
              {product.brand}
            </span>
          )}
        </div>

        {/* Spec Score Badge */}
        <div
          className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded text-xs font-mono font-bold"
          title="GenzTech Hardware Spec Score (out of 10)"
        >
          <Award className="w-3 h-3 text-emerald-600" />
          <span>{product.specScore ? product.specScore.toFixed(1) : '9.0'}</span>
          <span className="text-[10px] text-zinc-400 font-normal">/10</span>
        </div>
      </div>

      {/* Product Visual Container (Soft Metallic Gray, mix-blend-multiply) */}
      <Link
        href={`/products/${product._id}`}
        className="block p-4 my-2"
        aria-label={`View full details of ${product.title}`}
      >
        <div className="w-full h-48 bg-[#F4F4F5] dark:bg-zinc-900 rounded-lg p-3 flex items-center justify-center relative overflow-hidden transition-colors">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>
      </Link>

      {/* Main Content Info */}
      <div className="p-4 pt-0 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link
            href={`/products/${product._id}`}
            className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-2"
          >
            {product.title}
          </Link>

          {/* Structured Hardware Spec Pills (3-4 items) */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.specs?.processor && (
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono rounded font-medium border border-zinc-200 dark:border-zinc-800">
                {product.specs.processor}
              </span>
            )}
            {product.specs?.display && (
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono rounded font-medium border border-zinc-200 dark:border-zinc-800">
                {product.specs.display}
              </span>
            )}
            {product.specs?.battery && (
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono rounded font-medium border border-zinc-200 dark:border-zinc-800">
                {product.specs.battery}
              </span>
            )}
            {product.specs?.ramStorage && (
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono rounded font-medium border border-zinc-200 dark:border-zinc-800">
                {product.specs.ramStorage}
              </span>
            )}
          </div>

          {/* Buying Guide Verdict snippet */}
          {product.verdict && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 italic mb-4 border-l-2 border-emerald-500 pl-2">
              &ldquo;{product.verdict}&rdquo;
            </p>
          )}
        </div>

        {/* Pricing & Compliance Section */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
          
          {/* MODE A: Indicative Price with Verification Timestamp */}
          {mode === 'indicative' ? (
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black font-mono text-zinc-950 dark:text-white">
                  {product.price}
                </span>
                {product.mrp && product.mrp !== product.price && (
                  <span className="text-xs font-mono text-zinc-400 line-through">
                    {product.mrp}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono mt-0.5">
                <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                <span>Indicative Price (Verified {new Date(product.priceLastVerified || Date.now()).toLocaleDateString('en-IN')})</span>
              </div>

              {isStale && (
                <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>Price may have updated on Amazon.in</span>
                </div>
              )}
            </div>
          ) : (
            /* MODE B: Strict Policy-Safe Bracket Badge */
            <div className="mb-3">
              <span className="inline-block px-2.5 py-1 text-[11px] font-bold font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-800">
                {priceBracket}
              </span>
              <p className="text-[10px] text-zinc-400 mt-1">
                Prices fluctuate continuously. Verify current live pricing on Amazon.
              </p>
            </div>
          )}

          {/* Action Row: Compare Checkbox & Primary Amazon CTA */}
          <div className="flex items-center gap-2">
            
            {/* + Compare Toggle Button */}
            <button
              onClick={toggleCompare}
              className={`px-3 py-2.5 text-xs font-mono font-bold rounded-lg border flex items-center gap-1 transition-all ${
                inCompare
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-emerald-600'
              }`}
              title={inCompare ? 'Remove from compare tray' : 'Add to side-by-side comparison'}
              aria-label={inCompare ? 'In compare tray' : 'Add to compare tray'}
            >
              {inCompare ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{inCompare ? 'Added' : 'Compare'}</span>
            </button>

            {/* Primary Amazon CTA with rel="sponsored nofollow noopener" and universal gateway */}
            <a
              href={`/out/${product._id}`}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all group/btn"
            >
              <span>{mode === 'safe_cta' ? 'Check Amazon Price' : 'View on Amazon'}</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </a>

          </div>
        </div>

      </div>

    </article>
  );
}
