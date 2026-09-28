'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useComparison } from '@/context/ComparisonContext';
import ThemeToggle from './ThemeToggle';
import {
  Search,
  Scale,
  Sparkles,
  Flame,
  ChevronDown,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Gamepad2,
  Cpu,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Tag,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { Product, SiteConfig } from '@/types/store';

// 9 Core categories for Strip & Mega Menu
const CATEGORIES = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    href: '/category/smartphones',
    icon: Smartphone,
    brands: ['Apple', 'Samsung', 'OnePlus', 'Nothing', 'Google Pixel'],
    brackets: ['Under ₹15,000', '₹15K–₹35K', '₹35K–₹70K', 'Ultra Flagship'],
    featured: {
      title: 'iPhone 16 Pro Max',
      spec: 'A18 Pro | 6.9\" 120Hz | 48MP',
      href: '/products/prod-sp-01',
      badge: 'Editor Choice',
    },
  },
  {
    id: 'laptops',
    name: 'Laptops',
    href: '/category/laptops',
    icon: Laptop,
    brands: ['Apple MacBook', 'ASUS ROG', 'Dell XPS', 'Lenovo Legion', 'HP Omen'],
    brackets: ['Under ₹50,000', '₹50K–₹90K', '₹90K–₹1.5L', 'Creator & RTX 4080+'],
    featured: {
      title: 'ROG Zephyrus G16',
      spec: 'Core Ultra 9 | RTX 4070 | 240Hz OLED',
      href: '/products/prod-lp-02',
      badge: 'Top Gaming Rig',
    },
  },
  {
    id: 'audio',
    name: 'Earbuds & Headphones',
    href: '/category/audio',
    icon: Headphones,
    brands: ['Sony', 'Apple AirPods', 'Bose', 'Sennheiser', 'JBL'],
    brackets: ['Under ₹3,000', '₹3K–₹8K', '₹8K–₹20K', 'Audiophile & Flagship ANC'],
    featured: {
      title: 'Sony WH-1000XM5',
      spec: 'Industry Leading ANC | 30h LDAC',
      href: '/products/prod-au-01',
      badge: 'Gold Standard ANC',
    },
  },
  {
    id: 'smartwatches',
    name: 'Smartwatches',
    href: '/category/smartwatches',
    icon: Watch,
    brands: ['Apple Watch', 'Samsung Galaxy Watch', 'Garmin', 'OnePlus', 'Amazfit'],
    brackets: ['Under ₹5,000', '₹5K–₹15K', '₹15K–₹35K', 'Rugged Multisport'],
    featured: {
      title: 'Apple Watch Ultra 2',
      spec: '3000 nits | Dual L1+L5 GPS | 49mm Titanium',
      href: '/products/prod-sw-01',
      badge: 'Adventure Pick',
    },
  },
  {
    id: 'gaming',
    name: 'Gaming',
    href: '/category/gaming',
    icon: Gamepad2,
    brands: ['Sony PlayStation', 'Valve Steam Deck', 'ASUS ROG Ally', 'Nintendo', 'Xbox'],
    brackets: ['Controllers & Gear', 'Handheld PCs', 'Home Consoles', 'VR Headsets'],
    featured: {
      title: 'Steam Deck OLED',
      spec: '90Hz HDR OLED | 1TB NVMe | SteamOS',
      href: '/products/prod-gm-02',
      badge: 'Top Handheld',
    },
  },
  {
    id: 'accessories',
    name: 'Accessories',
    href: '/category/accessories',
    icon: Cpu,
    brands: ['Logitech', 'Keychron', 'Anker', 'SanDisk', 'Elgato'],
    brackets: ['Mice & Mechanical Keyboards', 'Power Banks & GaN', 'Fast Portable SSDs', 'Desk Audio'],
    featured: {
      title: 'Logitech MX Master 3S',
      spec: '8K DPI | Quiet Click | MagSpeed',
      href: '/products/prod-ac-01',
      badge: 'Productivity King',
    },
  },
  {
    id: 'deals',
    name: 'Best Deals',
    href: '/deals',
    icon: Flame,
    isSpecial: true,
  },
  {
    id: 'guides',
    name: 'Buying Guides',
    href: '/guides',
    icon: BookOpen,
  },
  {
    id: 'compare',
    name: 'Compare',
    href: '/compare',
    icon: Scale,
  },
];

export default function Header() {
  const router = useRouter();
  const { selectedProducts, setIsDrawerOpen } = useComparison();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Mega menu state (desktop)
  const [activeMegaCategory, setActiveMegaCategory] = useState<string | null>(null);

  // Site config state
  const [config, setConfig] = useState<SiteConfig | null>(null);

  // Live countdown state for festive banner
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Fetch product list for instant live search and site config
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllProducts(data);
      })
      .catch((err) => console.error('Failed to load products for search:', err));

    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setConfig(data);
      })
      .catch((err) => console.error('Failed to load site config in header:', err));
  }, []);

  // Festive countdown ticker synced with admin target date
  useEffect(() => {
    const updateCountdown = () => {
      const targetTime = config?.tickerCountdownEnd
        ? new Date(config.tickerCountdownEnd).getTime()
        : Date.now() + 14 * 3600 * 1000 + 28 * 60 * 1000;
      const diff = Math.max(0, targetTime - Date.now());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [config?.tickerCountdownEnd]);

  // Live debounced search filtering
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const filtered = allProducts.filter((p) => {
      const matchCat =
        selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchText =
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.specs && Object.values(p.specs).some((val) => val?.toLowerCase().includes(q)));
      return matchCat && matchText;
    });

    setSearchResults(filtered.slice(0, 6));
    setIsSearchOpen(true);
    setSelectedIndex(-1);
  }, [searchQuery, selectedCategory, allProducts]);

  // Click outside to close search
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchOpen || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        router.push(`/products/${searchResults[selectedIndex]._id}`);
        setIsSearchOpen(false);
      } else {
        router.push(`/products?q=${encodeURIComponent(searchQuery)}&cat=${selectedCategory}`);
        setIsSearchOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?q=${encodeURIComponent(searchQuery)}&cat=${selectedCategory}`);
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm bg-white dark:bg-zinc-950 transition-colors">



      {/* ========================================================================= */}
      {/* TIER 2: MAIN SEARCH & BRAND BAR                                          */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-4 md:gap-6">
        
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center shrink-0 group py-0.5" aria-label="GenzTech.in Home">
          {config?.brandName && config.brandName !== 'GenzTech' && config.brandName !== 'GenzTech.in' ? (
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
                {config.brandName}
              </span>
              <span className="hidden sm:block text-[10px] text-zinc-500 font-medium tracking-wide">
                {config?.tagline || 'Smart Tech. Better Choices.'}
              </span>
            </div>
          ) : (
            <>
              <Image
                src="/logo-horizontal.png"
                alt="GenzTech.in - Smart Tech. Better Choices."
                width={280}
                height={49}
                priority
                className="h-7 sm:h-9 md:h-11 w-auto object-contain dark:hidden"
              />
              <Image
                src="/logo-horizontal-dark.png"
                alt="GenzTech.in - Smart Tech. Better Choices."
                width={280}
                height={49}
                priority
                className="h-7 sm:h-9 md:h-11 w-auto object-contain hidden dark:block"
              />
            </>
          )}
        </Link>

        {/* Unified Scoped Search Bar — desktop full, mobile icon */}
        <div ref={searchRef} className="relative flex-1 min-w-0">
          {/* Desktop search */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex w-full shadow-sm rounded-lg overflow-hidden border-2 border-zinc-300 dark:border-zinc-700 focus-within:border-emerald-600 transition-colors">
            {/* Scoped Category Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="hidden md:block bg-zinc-100 dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 px-3 py-2.5 border-r border-zinc-300 dark:border-zinc-700 focus:outline-none cursor-pointer max-w-[130px] truncate"
            >
              <option value="all">All Categories</option>
              <option value="smartphones">Smartphones</option>
              <option value="laptops">Laptops</option>
              <option value="audio">Earbuds & Audio</option>
              <option value="smartwatches">Smartwatches</option>
              <option value="gaming">Gaming Gear</option>
              <option value="accessories">Accessories</option>
            </select>

            {/* Input field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
              placeholder="Search laptops, smartphones, earbuds..."
              className="w-full px-3 py-2.5 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
            />

            {/* Submit button */}
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-5 flex items-center justify-center transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Search Button */}
          <button
            onClick={() => setMobileSearchOpen((o) => !o)}
            className="sm:hidden p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Instant Debounced Autocomplete Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl overflow-hidden z-50 divide-y divide-zinc-100 dark:divide-zinc-800">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500 font-mono">
                  No matching hardware for &ldquo;{searchQuery}&rdquo;. Press Enter to explore catalog.
                </div>
              ) : (
                searchResults.map((prod, idx) => (
                  <div
                    key={prod._id}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => {
                      router.push(`/products/${prod._id}`);
                      setIsSearchOpen(false);
                    }}
                    className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      selectedIndex === idx
                        ? 'bg-zinc-100 dark:bg-zinc-800/80'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-950 rounded p-1 flex items-center justify-center shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {prod.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                          <span className="capitalize text-emerald-600 font-semibold">{prod.category}</span>
                          <span>•</span>
                          <span>{prod.specs.processor || prod.specs.display || prod.brand}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {prod.price}
                      </span>
                      <Link
                        href={`/out/${prod._id}`}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white rounded text-xs transition-colors flex items-center gap-1 font-bold"
                        title="Check Price on Amazon"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              )}

              <div className="bg-zinc-50 dark:bg-zinc-950 p-2.5 text-center text-xs text-zinc-500 font-mono flex items-center justify-between px-4">
                <span className="hidden sm:inline">Use ↑ ↓ to navigate, Enter to select</span>
                <Link
                  href={`/products?q=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="text-emerald-600 hover:underline font-bold flex items-center gap-1"
                >
                  View all results <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Buttons - desktop only */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link
            href="/deals"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Today&apos;s Deals</span>
          </Link>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-emerald-600 transition-colors relative"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>Compare</span>
            {selectedProducts.length > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-emerald-600 text-white rounded-full text-[10px] font-mono">
                {selectedProducts.length}
              </span>
            )}
          </button>
          
          <div className="ml-1 border-l pl-3 border-zinc-200 dark:border-zinc-800">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Compare badge */}
        {selectedProducts.length > 0 && (
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden flex items-center gap-1 px-2 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shrink-0"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{selectedProducts.length}</span>
          </button>
        )}
      </div>

      {/* Mobile Search Bar (expands below header on tap) */}
      {mobileSearchOpen && (
        <div className="sm:hidden border-t border-zinc-200 dark:border-zinc-800 px-3 py-2.5 bg-white dark:bg-zinc-950">
          <form onSubmit={handleSearchSubmit} className="flex w-full shadow-sm rounded-lg overflow-hidden border-2 border-zinc-300 dark:border-zinc-700 focus-within:border-emerald-600 transition-colors">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
              placeholder="Search products..."
              autoFocus
              className="w-full px-3 py-2.5 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 flex items-center justify-center transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TIER 3: HORIZONTAL CATEGORY STRIP — Desktop Only                         */}
      {/* ========================================================================= */}
      <div
        className="hidden md:block bg-zinc-50 dark:bg-zinc-900/90 border-y border-zinc-200 dark:border-zinc-800 relative"
        onMouseLeave={() => setActiveMegaCategory(null)}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isMegaOpen = activeMegaCategory === cat.id;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => cat.brands && setActiveMegaCategory(cat.id)}
                className="relative shrink-0"
              >
                <Link
                  href={cat.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
                    cat.isSpecial
                      ? 'text-amber-600 dark:text-amber-400 hover:text-amber-700 border-transparent'
                      : isMegaOpen
                      ? 'text-emerald-600 border-emerald-600 bg-white dark:bg-zinc-950'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${cat.isSpecial ? 'text-amber-500' : 'text-zinc-500'}`} />
                  <span>{cat.name}</span>
                  {cat.brands && <ChevronDown className="w-3 h-3 text-zinc-400" />}
                </Link>

                {/* Amazon-style Mega Menu Dropdown */}
                {isMegaOpen && cat.brands && (
                  <div className={`absolute top-full ${CATEGORIES.indexOf(cat) > 4 ? 'right-0' : 'left-0'} w-80 sm:w-96 bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-b-xl shadow-2xl p-5 z-50 grid grid-cols-2 gap-4`}>
                    <div>
                      <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Top Brands
                      </h4>
                      <ul className="space-y-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                        {cat.brands.map((b) => (
                          <li key={b}>
                            <Link
                              href={`/category/${cat.id}?brand=${encodeURIComponent(b)}`}
                              className="hover:text-emerald-600 flex items-center gap-1"
                              onClick={() => setActiveMegaCategory(null)}
                            >
                              <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                              {b}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 mt-4 mb-2">
                        Price Brackets
                      </h4>
                      <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {cat.brackets?.map((brk) => (
                          <li key={brk}>
                            <Link
                              href={`/category/${cat.id}?bracket=${encodeURIComponent(brk)}`}
                              className="hover:text-emerald-600"
                              onClick={() => setActiveMegaCategory(null)}
                            >
                              {brk}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Featured Deal Card - Dynamically resolved from DB catalog */}
                    {(() => {
                      const dynamicProd =
                        allProducts.find(
                          (p) => p.category === cat.id && (p.isFeatured || p.dealBadge)
                        ) || allProducts.find((p) => p.category === cat.id);

                      const featTitle = dynamicProd?.title || cat.featured?.title;
                      const featSpec =
                        dynamicProd?.specs?.processor ||
                        dynamicProd?.specs?.display ||
                        dynamicProd?.specs?.ramStorage ||
                        dynamicProd?.brand ||
                        cat.featured?.spec;
                      const featHref = dynamicProd
                        ? `/products/${dynamicProd._id}`
                        : cat.featured?.href;
                      const featBadge =
                        dynamicProd?.dealBadge ||
                        (dynamicProd?.isFeatured
                          ? 'Editor Choice'
                          : cat.featured?.badge || 'Featured Deal');

                      if (!featTitle || !featHref) return null;

                      return (
                        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded">
                              {featBadge}
                            </span>
                            <h5 className="text-xs font-bold text-zinc-900 dark:text-white mt-2 leading-snug line-clamp-2">
                              {featTitle}
                            </h5>
                            {featSpec && (
                              <p className="text-[11px] text-zinc-500 font-mono mt-1 line-clamp-1">
                                {featSpec}
                              </p>
                            )}
                          </div>
                          <Link
                            href={featHref}
                            onClick={() => setActiveMegaCategory(null)}
                            className="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            View Details <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE FULL-SCREEN MENU DRAWER                                           */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-[85vw] max-w-sm h-full bg-white dark:bg-zinc-950 flex flex-col shadow-2xl overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/logo-horizontal.png"
                  alt="GenzTech.in"
                  width={160}
                  height={30}
                  className="h-7 w-auto object-contain dark:hidden"
                />
                <Image
                  src="/logo-horizontal-dark.png"
                  alt="GenzTech.in"
                  width={160}
                  height={30}
                  className="h-7 w-auto object-contain hidden dark:block"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search inside drawer */}
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <form onSubmit={handleSearchSubmit} className="flex rounded-lg overflow-hidden border-2 border-zinc-300 dark:border-zinc-700 focus-within:border-emerald-600 transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2.5 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-4 flex items-center justify-center"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Links row */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <Link
                href="/deals"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-300 rounded-lg"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Today&apos;s Deals
              </Link>
              <Link
                href="/compare"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                Compare
                {selectedProducts.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px]">
                    {selectedProducts.length}
                  </span>
                )}
              </Link>
              <ThemeToggle />
            </div>

            {/* Category list */}
            <nav className="flex-1 overflow-y-auto">
              <div className="px-4 pt-3 pb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                  Browse Categories
                </span>
              </div>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isExpanded = mobileExpandedCat === cat.id;

                return (
                  <div key={cat.id}>
                    {/* Category Row */}
                    <div
                      className={`flex items-center justify-between mx-4 my-0.5 rounded-xl transition-colors ${
                        cat.isSpecial
                          ? 'bg-amber-50 dark:bg-amber-950/30'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <Link
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 flex-1 px-3 py-3 text-sm font-semibold ${
                          cat.isSpecial
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${cat.isSpecial ? 'text-amber-500' : 'text-emerald-600'}`} />
                        {cat.name}
                      </Link>
                      {cat.brands && (
                        <button
                          onClick={() => setMobileExpandedCat(isExpanded ? null : cat.id)}
                          className="px-3 py-3 text-zinc-400"
                          aria-label={`Expand ${cat.name}`}
                        >
                          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Expanded sub-links */}
                    {isExpanded && cat.brands && (
                      <div className="mx-4 mb-1 bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-hidden">
                        <div className="px-4 pt-3 pb-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                            Top Brands
                          </span>
                        </div>
                        {cat.brands.map((b) => (
                          <Link
                            key={b}
                            href={`/category/${cat.id}?brand=${encodeURIComponent(b)}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:text-emerald-600"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0" />
                            {b}
                          </Link>
                        ))}
                        {cat.brackets && (
                          <>
                            <div className="px-4 pt-3 pb-1 border-t border-zinc-200 dark:border-zinc-800 mt-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                                Price Brackets
                              </span>
                            </div>
                            {cat.brackets.map((brk) => (
                              <Link
                                key={brk}
                                href={`/category/${cat.id}?bracket=${encodeURIComponent(brk)}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:text-emerald-600"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
                                {brk}
                              </Link>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Footer of drawer */}
            <div className="px-4 py-4 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 shrink-0">
              <p>Reader-supported. Amazon Associate.</p>
              <Link href="/affiliate-disclosure" className="text-emerald-500 underline">Disclosure</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
