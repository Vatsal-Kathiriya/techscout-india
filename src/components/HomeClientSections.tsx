'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/store';
import { Layers, SlidersHorizontal, Eye } from 'lucide-react';

interface HomeClientSectionsProps {
  products: Product[];
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All Hardware' },
  { id: 'smartphones', label: 'Smartphones' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'audio', label: 'Audio & ANC' },
  { id: 'smartwatches', label: 'Smartwatches' },
  { id: 'gaming', label: 'Gaming Gear' },
  { id: 'accessories', label: 'Peripherals' },
];

const BUDGET_TABS = [
  { id: 'all', label: 'All Budgets' },
  { id: 'under-10k', label: 'Under ₹10K' },
  { id: '10k-25k', label: '₹10K–₹25K' },
  { id: '25k-50k', label: '₹25K–₹50K' },
  { id: 'above-50k', label: '₹50K+ Flagships' },
];

export default function HomeClientSections({ products }: HomeClientSectionsProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBudget, setActiveBudget] = useState('all');
  const [priceModeOverride, setPriceModeOverride] = useState<'indicative' | 'safe_cta'>('indicative');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      const matchCategory =
        activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase();

      // Budget filter
      const numPrice = parseInt(p.price.replace(/\D/g, ''), 10) || 0;
      let matchBudget = true;
      if (activeBudget === 'under-10k') {
        matchBudget = numPrice > 0 && numPrice < 10000;
      } else if (activeBudget === '10k-25k') {
        matchBudget = numPrice >= 10000 && numPrice <= 25000;
      } else if (activeBudget === '25k-50k') {
        matchBudget = numPrice > 25000 && numPrice <= 50000;
      } else if (activeBudget === 'above-50k') {
        matchBudget = numPrice > 50000;
      }

      return matchCategory && matchBudget;
    });
  }, [products, activeCategory, activeBudget]);

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <Layers className="w-4 h-4" />
            <span>Hardware Catalog Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
            Curated Tech Devices
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Showing {filteredProducts.length} verified products tested by GenzTech.
          </p>
        </div>

        {/* Amazon Associates Compliance Mode Toggle Switch */}
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-xl shadow-xs self-start md:self-auto">
          <Eye className="w-4 h-4 text-zinc-500 ml-2" />
          <span className="text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400">
            Price Display:
          </span>
          <button
            onClick={() => setPriceModeOverride('indicative')}
            className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors font-bold ${
              priceModeOverride === 'indicative'
                ? 'bg-emerald-600 text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Mode A (Timestamped)
          </button>
          <button
            onClick={() => setPriceModeOverride('safe_cta')}
            className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors font-bold ${
              priceModeOverride === 'safe_cta'
                ? 'bg-emerald-600 text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Mode B (Policy Safe CTA)
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Budget Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1 shrink-0">
          <SlidersHorizontal className="w-3 h-3" /> Budget:
        </span>
        {BUDGET_TABS.map((bt) => (
          <button
            key={bt.id}
            onClick={() => setActiveBudget(bt.id)}
            className={`px-3 py-1 rounded-lg font-mono transition-colors cursor-pointer text-xs ${
              activeBudget === bt.id
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            {bt.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 font-mono">
          <p className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            No devices found in this filter range.
          </p>
          <p className="text-xs mt-1 text-zinc-400">
            Try adjusting your budget or selecting a different category.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveBudget('all');
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p._id} product={p} displayMode={priceModeOverride} />
          ))}
        </div>
      )}

    </div>
  );
}
