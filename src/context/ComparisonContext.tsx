'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/store';

interface ComparisonContextType {
  selectedIds: string[];
  selectedProducts: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Restore from sessionStorage on load
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('genztech_compare');
      if (stored) {
        setSelectedProducts(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('genztech_compare', JSON.stringify(selectedProducts));
    } catch {
      // ignore
    }
  }, [selectedProducts]);

  const addToCompare = (product: Product): boolean => {
    if (selectedProducts.some((p) => p._id === product._id)) {
      return false;
    }
    if (selectedProducts.length >= 4) {
      alert('You can compare up to 4 devices simultaneously.');
      return false;
    }
    setSelectedProducts((prev) => [...prev, product]);
    setIsDrawerOpen(true);
    return true;
  };

  const removeFromCompare = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== id && p.asin !== id));
  };

  const clearCompare = () => {
    setSelectedProducts([]);
  };

  const isInCompare = (id: string) => {
    return selectedProducts.some((p) => p._id === id || p.asin === id);
  };

  return (
    <ComparisonContext.Provider
      value={{
        selectedIds: selectedProducts.map((p) => p._id),
        selectedProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const ctx = useContext(ComparisonContext);
  if (!ctx) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return ctx;
}
