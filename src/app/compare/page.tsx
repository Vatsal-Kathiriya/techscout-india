'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useComparison } from '@/context/ComparisonContext';
import {
  Scale,
  Sparkles,
  ExternalLink,
  X,
  Plus,
  Check,
  Eye,
  Award,
  Zap,
  ArrowRight,
  Battery,
  Cpu,
  Monitor,
  IndianRupee,
} from 'lucide-react';
import { Product } from '@/types/store';

export default function ComparePage() {
  const { selectedProducts, removeFromCompare, clearCompare, addToCompare } = useComparison();
  const [highlightDiff, setHighlightDiff] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchAddQuery, setSearchAddQuery] = useState('');

  // Fetch all products for modal picker
  React.useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAvailableProducts(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Quick comparison presets
  const loadPreset = (presetAsins: string[]) => {
    const matched = availableProducts.filter((p) => presetAsins.includes(p.asin) || presetAsins.includes(p._id));
    clearCompare();
    matched.slice(0, 4).forEach((p) => addToCompare(p));
  };

  // Spec keys to compare
  const specRows = useMemo(() => {
    return [
      { key: 'category', label: 'Department / Category', icon: null },
      { key: 'price', label: 'Verified Price', icon: IndianRupee },
      { key: 'specScore', label: 'GenzTech Spec Score', icon: Award },
      { key: 'processor', label: 'Chipset / Processor', icon: Cpu },
      { key: 'display', label: 'Display Panel & Refresh Rate', icon: Monitor },
      { key: 'battery', label: 'Battery Capacity & Charging', icon: Battery },
      { key: 'ramStorage', label: 'RAM & Internal Storage', icon: null },
      { key: 'weight', label: 'Chassis Weight & Materials', icon: null },
      { key: 'os', label: 'Operating System', icon: null },
    ];
  }, []);

  const getSpecValue = (prod: Product, key: string): string => {
    if (key === 'category') return prod.category.toUpperCase();
    if (key === 'price') return prod.price;
    if (key === 'specScore') return `${prod.specScore?.toFixed(1) || '9.0'} / 10`;
    if (prod.specs && (prod.specs as any)[key]) return (prod.specs as any)[key];
    return '—';
  };

  const isRowDifferent = (key: string): boolean => {
    if (selectedProducts.length < 2) return false;
    const firstVal = getSpecValue(selectedProducts[0], key);
    return selectedProducts.some((p) => getSpecValue(p, key) !== firstVal);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <Scale className="w-4 h-4" />
            <span>Side-by-Side Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
            Hardware Comparison Matrix
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Benchmark up to 4 devices simultaneously with difference highlighting and category winner assessments.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {selectedProducts.length >= 2 && (
            <button
              onClick={() => setHighlightDiff(!highlightDiff)}
              className={`px-3 py-2 text-xs font-bold font-mono rounded-xl border flex items-center gap-1.5 transition-all ${
                highlightDiff
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{highlightDiff ? 'Difference Highlight ON' : 'Highlight Differences'}</span>
            </button>
          )}

          {selectedProducts.length < 4 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Device</span>
            </button>
          )}

          {selectedProducts.length > 0 && (
            <button
              onClick={clearCompare}
              className="px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* 2. Empty or Incomplete State (<2 products) */}
      {selectedProducts.length < 2 ? (
        <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-600">
            <Scale className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {selectedProducts.length === 0
                ? 'Your comparison matrix is currently empty'
                : 'Select at least 1 more device to begin comparison'}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Select products using the &ldquo;+ Compare&rdquo; button across any product card or choose a curated showdown below:
            </p>
          </div>

          {/* Quick Presets */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block">
              Popular Benchmark Shootouts:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => loadPreset(['B0CHX1W1XY', 'B0CS5XVKD5', 'B0CQPNWZX8'])}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 rounded-xl text-xs font-bold transition-all border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                iPhone 16 Pro Max vs S24 Ultra vs OnePlus 12
              </button>

              <button
                onClick={() => loadPreset(['B09Y2LL45F', 'B0CHWRXH8B', 'B0CD27L7NV'])}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 rounded-xl text-xs font-bold transition-all border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Sony WH-1000XM5 vs AirPods Pro 2 vs Bose QC Ultra
              </button>

              <button
                onClick={() => loadPreset(['B0CM5JSGQY', 'B0CV1D347R', 'B0C7SND67R'])}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 rounded-xl text-xs font-bold transition-all border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                MacBook Pro 14 M3 vs ROG Zephyrus G16 vs Legion Pro 5
              </button>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <span>Explore Products Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* 3. Side-by-Side Comparison Matrix Table */
        <div className="space-y-6">
          
          {/* Winner by Category Badges */}
          <div className="bg-emerald-900 text-white p-5 rounded-2xl border border-emerald-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-200 block">
                  GenzTech Comparative Benchmark
                </span>
                <h3 className="text-sm font-bold text-white">
                  Top Recommended Device in this Selection:
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              <span className="px-3 py-1 bg-white text-emerald-950 font-bold rounded-lg shadow-sm">
                Winner: {selectedProducts.reduce((prev, curr) => (curr.specScore > prev.specScore ? curr : prev)).title.slice(0, 32)}...
              </span>
            </div>
          </div>

          {/* Side-by-Side Grid */}
          <div className="bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              
              {/* Product Card Headers */}
              <thead>
                <tr className="border-b-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <th className="p-4 w-48 text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider align-top">
                    Device Summary
                  </th>
                  {selectedProducts.map((prod) => (
                    <th key={prod._id} className="p-4 w-64 align-top border-l border-zinc-200 dark:border-zinc-800">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {prod.brand}
                          </span>
                          <button
                            onClick={() => removeFromCompare(prod._id)}
                            className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="w-full h-36 bg-[#F4F4F5] dark:bg-zinc-900 rounded-lg p-2 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prod.imageUrl}
                            alt={prod.title}
                            className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                          />
                        </div>

                        <div>
                          <Link
                            href={`/products/${prod._id}`}
                            className="text-xs font-bold text-zinc-900 dark:text-white hover:text-emerald-600 line-clamp-2 leading-snug"
                          >
                            {prod.title}
                          </Link>
                          <div className="text-base font-black font-mono text-zinc-900 dark:text-white mt-1">
                            {prod.price}
                          </div>
                        </div>

                        {/* CTA button */}
                        <a
                          href={`/out/${prod._id}`}
                          target="_blank"
                          rel="sponsored nofollow noopener"
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>Check Amazon</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Specification Rows */}
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs font-mono">
                {specRows.map((row) => {
                  const isDiff = isRowDifferent(row.key);
                  const Icon = row.icon;

                  return (
                    <tr
                      key={row.key}
                      className={
                        highlightDiff && isDiff
                          ? 'bg-amber-50/70 dark:bg-amber-950/20'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/40'
                      }
                    >
                      <td className="p-3.5 font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                        {Icon && <Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        <span>{row.label}</span>
                        {highlightDiff && isDiff && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 ml-auto shrink-0" title="Different across models"></span>
                        )}
                      </td>

                      {selectedProducts.map((prod) => (
                        <td
                          key={prod._id}
                          className="p-3.5 border-l border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                        >
                          {getSpecValue(prod, row.key)}
                        </td>
                      ))}
                    </tr>
                  );
                })}

                {/* Verdict Row */}
                <tr className="bg-zinc-50 dark:bg-zinc-900/60 font-sans">
                  <td className="p-3.5 font-bold text-zinc-600 dark:text-zinc-400 font-mono text-xs">
                    Lab Verdict
                  </td>
                  {selectedProducts.map((prod) => (
                    <td key={prod._id} className="p-3.5 border-l border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 italic">
                      &ldquo;{prod.verdict}&rdquo;
                    </td>
                  ))}
                </tr>
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* 4. Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                Select Hardware to Compare
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
              <input
                type="text"
                value={searchAddQuery}
                onChange={(e) => setSearchAddQuery(e.target.value)}
                placeholder="Search device by model name, brand or chipset..."
                className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {availableProducts
                .filter((p) => {
                  const q = searchAddQuery.toLowerCase();
                  return p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
                })
                .map((p) => {
                  const alreadySelected = selectedProducts.some((s) => s._id === p._id);
                  return (
                    <div
                      key={p._id}
                      className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded p-1 flex items-center justify-center shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.imageUrl} alt={p.title} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {p.title}
                          </h4>
                          <span className="text-[11px] font-mono text-emerald-600 font-bold">
                            {p.price}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (alreadySelected) {
                            removeFromCompare(p._id);
                          } else {
                            addToCompare(p);
                            if (selectedProducts.length + 1 >= 4) setShowAddModal(false);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
                          alreadySelected
                            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {alreadySelected ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" /> Select
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 text-right">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-lg text-xs font-bold"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
