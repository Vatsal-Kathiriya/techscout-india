'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SiteConfig } from '@/types/store';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setConfig(data);
      })
      .catch((err) => console.error('Failed to load site config in footer:', err));
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="w-full bg-zinc-950 text-zinc-300 font-sans border-t border-zinc-800 transition-colors">
      
      {/* 1. Back to Top Action Bar */}
      <button
        onClick={scrollToTop}
        className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold font-mono uppercase tracking-widest text-center border-b border-zinc-800 transition-colors flex items-center justify-center gap-2 group cursor-pointer"
        aria-label="Back to top"
      >
        <span>Back to Top</span>
        <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>

      {/* 2. 4-Column Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tight text-white">
                {config?.brandName ? (
                  config.brandName
                ) : (
                  <>
                    Genz<span className="text-emerald-500">Tech</span>
                    <span className="text-xs text-emerald-500 font-mono">.in</span>
                  </>
                )}
              </span>
            </Link>
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider text-emerald-400">
              {config?.tagline || 'Smart Tech. Better Choices.'}
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {config?.footerAbout ||
                "India's independent consumer hardware intelligence platform. We test, benchmark, and compare flagship smartphones, laptops, ANC headphones, and smart gear to help you make smarter purchasing decisions on Amazon.in."}
            </p>

            {/* Newsletter signup */}
            <form onSubmit={handleSubscribe} className="pt-2">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Get Festive Price Drop Alerts
              </label>
              <div className="flex rounded-lg overflow-hidden border border-zinc-800 focus-within:border-emerald-500 transition-colors">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-zinc-900 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold transition-colors shrink-0"
                >
                  <Mail className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Subscribed! We will alert you on verified price drops.</span>
                </div>
              )}
            </form>
          </div>

          {/* Col 2: Top Tech Categories */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white mb-4 border-l-2 border-emerald-500 pl-2">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/category/smartphones" className="hover:text-emerald-400 transition-colors">
                  Flagship 5G Smartphones
                </Link>
              </li>
              <li>
                <Link href="/category/laptops" className="hover:text-emerald-400 transition-colors">
                  Gaming Laptops & MacBooks
                </Link>
              </li>
              <li>
                <Link href="/category/audio" className="hover:text-emerald-400 transition-colors">
                  Active Noise Cancelling (ANC) Earbuds
                </Link>
              </li>
              <li>
                <Link href="/category/smartwatches" className="hover:text-emerald-400 transition-colors">
                  Adventure & AMOLED Smartwatches
                </Link>
              </li>
              <li>
                <Link href="/category/gaming" className="hover:text-emerald-400 transition-colors">
                  Gaming Consoles & Handheld PCs
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="hover:text-emerald-400 transition-colors">
                  High Performance PC Peripherals
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Deals */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white mb-4 border-l-2 border-emerald-500 pl-2">
              Research & Deals
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/deals" className="hover:text-amber-400 transition-colors text-amber-400/90 font-medium">
                  ⚡ Today&apos;s Festive Lightning Deals
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-emerald-400 transition-colors">
                  Side-by-Side Device Comparison Tool
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-emerald-400 transition-colors">
                  Original Hardware Buying Guides
                </Link>
              </li>
              <li>
                <Link href="/guides/ultimate-gaming-laptop-buying-guide-2026" className="hover:text-emerald-400 transition-colors">
                  Gaming Laptop GPU TGP Guide (2026)
                </Link>
              </li>
              <li>
                <Link href="/guides/flagship-smartphone-camera-breakdown" className="hover:text-emerald-400 transition-colors">
                  1-Inch Camera Sensors vs AI Photography
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-emerald-400 transition-colors">
                  Explore Full Hardware Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal, Trust & Policies */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white mb-4 border-l-2 border-emerald-500 pl-2">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About Us & Editorial Standards
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Editorial Team
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-emerald-400 transition-colors font-semibold text-emerald-400">
                  Affiliate Disclosure Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-emerald-400 transition-colors">
                  Product Pricing & Specs Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy & Cookies
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Bottom Compliance Sub-Footer with Amazon Associates Mandatory Notice */}
      <div className="bg-zinc-900 border-t border-zinc-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-zinc-400 text-[11px] leading-relaxed flex flex-col md:flex-row items-start md:items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 md:mt-0" />
            <div className="flex-1">
              <strong className="text-white block mb-0.5">Amazon Associates Compliance Notice:</strong>
              GenzTech.in is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. Product prices and availability are accurate as of the date/time indicated and are subject to change on Amazon.in.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-xs text-zinc-500">
            <div>
              &copy; {new Date().getFullYear()} {config?.brandName || 'GenzTech.in'}. All Rights Reserved. Built with Next.js & Tailwind CSS.
            </div>
            <div className="flex items-center gap-4 text-zinc-400 font-mono text-[11px]">
              <span>Amazon Tag: {config?.affiliateStoreId || 'genztech019-21'}</span>
              <span>•</span>
              <Link href="/privacy-policy" className="hover:underline">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/disclaimer" className="hover:underline">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
