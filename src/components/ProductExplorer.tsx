'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Product, HardwareCategory } from '@/types/store';
import {
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  RotateCcw,
} from 'lucide-react';

interface ProductExplorerProps {
  initialProducts: Product[];
  defaultCategory?: string;
  defaultBrand?: string;
  defaultQuery?: string;
  title?: string;
  subtitle?: string;
}

const ALL_CATEGORIES: { id: HardwareCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'smartphones', label: 'Smartphones' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'audio', label: 'Earbuds & Headphones' },
  { id: 'smartwatches', label: 'Smartwatches' },
  { id: 'gaming', label: 'Gaming Gear' },
  { id: 'accessories', label: 'Accessories' },
];

export default function ProductExplorer({
  initialProducts,
  defaultCategory = 'all',
  defaultBrand = '',
  defaultQuery = '',
  title = 'Hardware Product Explorer',
  subtitle = 'Compare technical specifications and verified Amazon pricing across our catalog.',
}: ProductExplorerProps) {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    defaultBrand ? [defaultBrand] : []
  );
  const [priceBracket, setPriceBracket] = useState<string>('all');
  const [festiveOnly, setFestiveOnly] = useState<boolean>(false);
  const [minScore, setMinScore] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [searchFilter, setSearchFilter] = useState<string>(defaultQuery);

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  // Mobile Filter Drawer Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Get unique brands dynamically from current category
  const availableBrands = useMemo(() => {
    const pool =
      selectedCategory === 'all'
        ? initialProducts
        : initialProducts.filter(
            (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
          );
    const brandsSet = new Set<string>();
    pool.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }, [initialProducts, selectedCategory]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setPriceBracket('all');
    setFestiveOnly(false);
    setMinScore(0);
    setSearchFilter('');
    setSortOption('featured');
    setCurrentPage(1);
  };

  // Filtered & Sorted List
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Category filter
        if (
          selectedCategory !== 'all' &&
          p.category.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }

        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }

        // Festive deal only
        if (festiveOnly && !p.isFestiveDeal && !p.dealBadge) {
          return false;
        }

        // Spec score
        if (minScore > 0 && (p.specScore || 0) < minScore) {
          return false;
        }

        // Search text
        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchSpecs =
            p.specs && Object.values(p.specs).some((v) => v?.toLowerCase().includes(q));
          if (!matchTitle && !matchBrand && !matchSpecs) return false;
        }

        // Price bracket
        const priceNum = parseInt(p.price.replace(/\D/g, ''), 10) || 0;
        if (priceBracket === 'under_15k' && priceNum >= 15000) return false;
        if (priceBracket === '15k_35k' && (priceNum < 15000 || priceNum > 35000)) return false;
        if (priceBracket === '35k_75k' && (priceNum < 35000 || priceNum > 75000)) return false;
        if (priceBracket === 'above_75k' && priceNum <= 75000) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = parseInt(a.price.replace(/\D/g, ''), 10) || 0;
        const priceB = parseInt(b.price.replace(/\D/g, ''), 10) || 0;

        if (sortOption === 'score_desc') {
          return (b.specScore || 0) - (a.specScore || 0);
        }
        if (sortOption === 'price_asc') {
          return priceA - priceB;
        }
        if (sortOption === 'price_desc') {
          return priceB - priceA;
        }
        if (sortOption === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // 'featured' default: score + festive deals first
        return (b.specScore || 0) - (a.specScore || 0);
      });
  }, [
    initialProducts,
    selectedCategory,
    selectedBrands,
    festiveOnly,
    minScore,
    searchFilter,
    priceBracket,
    sortOption,
  ]);

  // Pagination Slicing
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Title & Stats */}
      <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>
      </div>

      {/* Top Mobile Filter Button & Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-xl shadow-xs">
        
        <div className="flex items-center gap-3">
          {/* Mobile open filters */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-xs font-bold rounded-lg"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters ({selectedBrands.length + (selectedCategory !== 'all' ? 1 : 0)})</span>
          </button>

          <span className="text-xs text-zinc-500 font-mono">
            {filteredProducts.length === 0 ? (
              '0 products found'
            ) : (
              <>
                Showing <strong className="text-zinc-900 dark:text-zinc-100">{startIndex}–{endIndex}</strong> of{' '}
                <strong className="text-zinc-900 dark:text-zinc-100">{filteredProducts.length}</strong> devices
              </>
            )}
          </span>
        </div>

        {/* Sort & Items per page */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="score_desc">Spec Score: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Releases</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
            <span className="hidden md:inline">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
            </select>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* ===================================================================== */}
        {/* AMAZON-STYLE LEFT FACETED SIDEBAR FILTERS                             */}
        {/* ===================================================================== */}
        <aside
          className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:relative md:inset-auto md:bg-transparent md:backdrop-blur-none md:z-0 md:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="h-full md:h-auto w-80 max-w-[85vw] md:w-full bg-white dark:bg-zinc-950 md:bg-transparent p-6 md:p-0 overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 md:hidden">
              <span className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Filter Devices
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reset all filters */}
            {(selectedBrands.length > 0 ||
              selectedCategory !== 'all' ||
              priceBracket !== 'all' ||
              festiveOnly ||
              minScore > 0 ||
              searchFilter) && (
              <button
                onClick={resetAllFilters}
                className="w-full py-2 px-3 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Active Filters</span>
              </button>
            )}

            {/* 1. Category Filter */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Department
              </h3>
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                {ALL_CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedBrands([]);
                        setCurrentPage(1);
                      }}
                      className={`text-left w-full px-2.5 py-1.5 rounded-md transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Brand Filter */}
            {availableBrands.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  Brand / Manufacturer
                </h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {availableBrands.map((b) => (
                    <label
                      key={b}
                      className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer hover:text-emerald-600 py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => toggleBrand(b)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-zinc-300 dark:border-zinc-700 cursor-pointer"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Price Bracket Filter */}
            <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Price Bracket (INR)
              </h3>
              <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                {[
                  { id: 'all', label: 'Any Price' },
                  { id: 'under_15k', label: 'Under ₹15,000' },
                  { id: '15k_35k', label: '₹15,000 – ₹35,000' },
                  { id: '35k_75k', label: '₹35,000 – ₹75,000' },
                  { id: 'above_75k', label: '₹75,000+ Flagships' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 cursor-pointer hover:text-emerald-600 py-0.5"
                  >
                    <input
                      type="radio"
                      name="price_bracket"
                      checked={priceBracket === item.id}
                      onChange={() => {
                        setPriceBracket(item.id);
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Minimum Spec Score Filter */}
            <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  GenzTech Spec Score
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  {minScore > 0 ? `${minScore.toFixed(1)}+` : 'All'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="9.5"
                step="0.5"
                value={minScore}
                onChange={(e) => {
                  setMinScore(parseFloat(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>Any</span>
                <span>8.0+</span>
                <span>9.0+</span>
                <span>9.5+</span>
              </div>
            </div>

            {/* 5. Festive Deal Only Toggle */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <label className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={festiveOnly}
                  onChange={(e) => {
                    setFestiveOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                <span>⚡ Festive Deals Only</span>
              </label>
            </div>

          </div>
        </aside>

        {/* ===================================================================== */}
        {/* MAIN RESULTS GRID & PAGINATION                                        */}
        {/* ===================================================================== */}
        <main className="md:col-span-3">
          {paginatedProducts.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-16 text-center text-zinc-500">
              <p className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                No matching hardware products found.
              </p>
              <p className="text-xs text-zinc-400 mb-6">
                Try loosening your filters or resetting your search term.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Multi-Page Pagination Bar */}
              {totalPages > 1 && (
                <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                  
                  <span className="text-zinc-500">
                    Page {currentPage} of {totalPages}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-emerald-600 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pNum = idx + 1;
                      return (
                        <button
                          key={pNum}
                          onClick={() => setCurrentPage(pNum)}
                          className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-colors ${
                            currentPage === pNum
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-600'
                          }`}
                        >
                          {pNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-emerald-600 flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}
            </>
          )}
        </main>

      </div>

    </div>
  );
}
