'use client';

import React from 'react';
import Link from 'next/link';
import { useComparison } from '@/context/ComparisonContext';
import { X, ChevronDown, ChevronUp, Scale, ArrowRight } from 'lucide-react';

export default function ComparisonDrawer() {
  const {
    selectedProducts,
    removeFromCompare,
    clearCompare,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useComparison();

  if (selectedProducts.length === 0) return null;

  return (
    <aside
      aria-label="Product comparison tray"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t-2 border-emerald-600 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Header bar of drawer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <Scale className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                Device Comparison Tray
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-600 text-white rounded-full">
                  {selectedProducts.length}/4
                </span>
              </h3>
              <p className="text-xs text-zinc-500 hidden sm:block">
                Select up to 4 hardware products to evaluate side-by-side technical specifications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="text-xs font-semibold text-zinc-500 hover:text-red-600 dark:hover:text-red-400 px-2.5 py-1.5 rounded transition-colors"
            >
              Clear All
            </button>

            <Link
              href="/compare"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              title={isDrawerOpen ? 'Collapse tray' : 'Expand tray'}
            >
              {isDrawerOpen ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Products Tray */}
        {isDrawerOpen && (
          <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {selectedProducts.map((prod) => (
              <div
                key={prod._id}
                className="flex items-center gap-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-lg relative group"
              >
                <div className="w-12 h-12 bg-white dark:bg-zinc-950 rounded flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {prod.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {prod.price}
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-500">{prod.specs.processor || prod.brand}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCompare(prod._id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-700 text-white hover:bg-red-600 rounded-full flex items-center justify-center text-xs shadow-sm transition-colors"
                  title="Remove from comparison"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {Array.from({ length: 4 - selectedProducts.length }).map((_, idx) => (
              <div
                key={idx}
                className="hidden sm:flex items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-lg p-2 text-xs font-mono text-zinc-400"
              >
                + Empty Slot {selectedProducts.length + idx + 1}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
