'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Product,
  BuyingGuide,
  FestiveCampaign,
  SiteConfig,
  HardwareCategory,
} from '@/types/store';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Settings,
  BookOpen,
  ShieldCheck,
  Download,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  RefreshCw,
  X,
  Save,
  Tag,
  Flame,
  Globe,
  Sliders,
  Calendar,
  FileText,
  DollarSign,
  Check,
  Lock,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

const CATEGORIES: HardwareCategory[] = [
  'smartphones',
  'laptops',
  'audio',
  'smartwatches',
  'gaming',
  'accessories',
];

const THEME_COLORS = [
  { id: 'emerald', label: 'Tech Emerald', bg: 'bg-emerald-600', text: 'text-emerald-600' },
  { id: 'amber', label: 'Conversion Amber', bg: 'bg-amber-500', text: 'text-amber-500' },
  { id: 'cyan', label: 'Electric Cyan', bg: 'bg-cyan-600', text: 'text-cyan-600' },
  { id: 'purple', label: 'Ultra Violet', bg: 'bg-purple-600', text: 'text-purple-600' },
  { id: 'rose', label: 'Signal Rose', bg: 'bg-rose-600', text: 'text-rose-600' },
];

export default function AdminControlPanel() {
  // =========================================================================
  // 0. OWNER AUTHENTICATION GATE STATE
  // =========================================================================
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'deals' | 'guides' | 'config' | 'auditor'
  >('overview');

  // =========================================================================
  // 1. PRODUCTS STATE
  // =========================================================================
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Amazon Scraper State
  const [asinInput, setAsinInput] = useState('');
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Manual Product Creation Modal
  const [showManualProductModal, setShowManualProductModal] = useState(false);
  const [manualProductForm, setManualProductForm] = useState<Partial<Product>>({
    title: '',
    brand: '',
    category: 'smartphones',
    price: '',
    mrp: '',
    priceMode: 'indicative',
    imageUrl: '',
    affiliateUrl: '',
    specScore: 9.0,
    dealBadge: '',
    isFestiveDeal: false,
    isFeatured: false,
    verdict: '',
    editorialReview: '',
    specs: {
      processor: '',
      display: '',
      battery: '',
      ramStorage: '',
      gpu: '',
      os: '',
      weight: '',
    },
    pros: [],
    cons: [],
  });
  const [manualProsInput, setManualProsInput] = useState('');
  const [manualConsInput, setManualConsInput] = useState('');
  const [creatingProduct, setCreatingProduct] = useState(false);

  // Edit Product Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [editProsInput, setEditProsInput] = useState('');
  const [editConsInput, setEditConsInput] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // =========================================================================
  // 2. FESTIVE CAMPAIGNS STATE
  // =========================================================================
  const [campaigns, setCampaigns] = useState<FestiveCampaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<FestiveCampaign | null>(null);
  const [campaignForm, setCampaignForm] = useState<Partial<FestiveCampaign>>({
    title: '',
    badge: 'Limited Time Festive Deal',
    discountHeadline: '',
    countdownEnd: new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16),
    active: true,
    themeColor: 'emerald',
    bannerCta: "Explore Today's Deals",
    targetCategory: 'all',
  });
  const [campaignActionLoading, setCampaignActionLoading] = useState(false);

  // =========================================================================
  // 3. BUYING GUIDES STATE
  // =========================================================================
  const [guides, setGuides] = useState<BuyingGuide[]>([]);
  const [loadingGuides, setLoadingGuides] = useState(false);
  const [showAddGuideModal, setShowAddGuideModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState<BuyingGuide | null>(null);
  const [guideForm, setGuideForm] = useState<Partial<BuyingGuide>>({
    title: '',
    subtitle: '',
    excerpt: '',
    category: 'laptops',
    readTime: '8 min read',
    author: 'Aarav Sharma',
    authorRole: 'Hardware Testing Lead',
    heroImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200&auto=format&fit=crop',
    content: '### Testing Methodology & Verdict\n\nProvide extensive technical breakdown with comparison tables and benchmark telemetry.',
    recommendedProductIds: [],
  });
  const [guideActionLoading, setGuideActionLoading] = useState(false);

  // =========================================================================
  // 4. SITE CONFIG & BRANDING STATE
  // =========================================================================
  const [configForm, setConfigForm] = useState<SiteConfig>({
    brandName: 'GenzTech.in',
    tagline: 'Smart Tech. Better Choices.',
    heroHeadline: 'Smart Tech. Better Choices.',
    heroSubheadline: 'Discover useful technology, compare products and find smarter buying options.',
    affiliateStoreId: 'genztech019-21',
    tickerText: 'Great Indian Tech Festival: Up to 45% Off Flagship Laptops & 5G Phones — Verified Deals Live',
    tickerCountdownEnd: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    tickerActive: true,
    defaultPriceMode: 'indicative',
    contactEmail: 'contact@genztech.in',
    footerAbout: "India's independent consumer hardware intelligence platform. We test, benchmark, and compare flagship smartphones, laptops, ANC headphones, and smart gear to help you make smarter purchasing decisions on Amazon.in.",
    affiliateDisclosure: 'GenzTech.in is reader-supported. As an Amazon Associate, we earn from qualifying purchases.',
    primaryCtaText: 'Explore Products',
    primaryCtaLink: '/products',
    secondaryCtaText: "Today's Deals",
    secondaryCtaLink: '/deals',
  });
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [saveConfigLoading, setSaveConfigLoading] = useState(false);
  const [configMessage, setConfigMessage] = useState('');

  // =========================================================================
  // 5. EXPORT & DATABASE SYNC STATE
  // =========================================================================
  const [exportStatus, setExportStatus] = useState<string>('');
  const [atlasConnected, setAtlasConnected] = useState<boolean | null>(null);
  const [syncingAtlas, setSyncingAtlas] = useState(false);

  // Fetch initial data
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      const res = await fetch('/api/admin/campaigns');
      const data = await res.json();
      if (Array.isArray(data)) setCampaigns(data);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const fetchGuides = async () => {
    setLoadingGuides(true);
    try {
      const res = await fetch('/api/admin/guides');
      const data = await res.json();
      if (Array.isArray(data)) setGuides(data);
    } catch (err) {
      console.error('Failed to fetch guides:', err);
    } finally {
      setLoadingGuides(false);
    }
  };

  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await fetch('/api/admin/config');
      const data = await res.json();
      if (data && !data.error) setConfigForm(data);
    } catch (err) {
      console.error('Failed to fetch config:', err);
    } finally {
      setLoadingConfig(false);
    }
  };

  const fetchAtlasStatus = async () => {
    try {
      const res = await fetch('/api/admin/sync-export');
      const data = await res.json();
      setAtlasConnected(Boolean(data.atlasConnected));
    } catch {
      setAtlasConnected(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        fetchProducts();
        fetchCampaigns();
        fetchGuides();
        fetchConfig();
        fetchAtlasStatus();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecked(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
        fetchProducts();
        fetchCampaigns();
        fetchGuides();
        fetchConfig();
        fetchAtlasStatus();
      } else {
        setAuthError(data.error || 'Invalid owner authentication key.');
      }
    } catch (err: any) {
      setAuthError('Authentication failed: ' + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {}
    setIsAuthenticated(false);
    setProducts([]);
    setCampaigns([]);
    setGuides([]);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        productCategoryFilter === 'all' || p.category === productCategoryFilter;
      const matchesSearch =
        !productSearch.trim() ||
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.asin.toLowerCase().includes(productSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, productCategoryFilter, productSearch]);

  // =========================================================================
  // HANDLERS: PRODUCTS
  // =========================================================================
  const handleAddProductScraper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asinInput.trim()) return;

    setSyncLoading(true);
    setSyncMessage('Connecting to Amazon Gateway...');

    const rawInput = asinInput.trim();
    const fullUrlMatch = rawInput.match(/(https?:\/\/[^\s\)\>]+)/i);
    const targetInput = fullUrlMatch ? fullUrlMatch[1] : rawInput;

    try {
      setSyncMessage('Resolving redirect and scraping metadata from Amazon.in...');
      const syncRes = await fetch('/api/amazon/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: targetInput }),
      });
      const syncData = await syncRes.json();

      if (!syncRes.ok) throw new Error(syncData.error || 'Failed to fetch from Amazon');

      setSyncMessage('Storing validated product with genztech019-21 tag...');
      const saveRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncData),
      });
      const saveData = await saveRes.json();

      if (!saveRes.ok) throw new Error(saveData.error || 'Failed to persist product');

      setSyncMessage('Device synchronized and published successfully!');
      setAsinInput('');
      fetchProducts();
    } catch (err: any) {
      setSyncMessage(`Error: ${err.message}`);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleCreateManualProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualProductForm.title || !manualProductForm.price) {
      alert('Title and Price are required.');
      return;
    }

    setCreatingProduct(true);
    try {
      const pros = manualProsInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const cons = manualConsInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...manualProductForm,
        pros: pros.length > 0 ? pros : ['Reliable performance', 'Great build quality'],
        cons: cons.length > 0 ? cons : ['Premium pricing'],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create product');
      }

      setShowManualProductModal(false);
      setManualProsInput('');
      setManualConsInput('');
      setManualProductForm({
        title: '',
        brand: '',
        category: 'smartphones',
        price: '',
        mrp: '',
        priceMode: 'indicative',
        imageUrl: '',
        affiliateUrl: '',
        specScore: 9.0,
        dealBadge: '',
        isFestiveDeal: false,
        isFeatured: false,
        verdict: '',
        editorialReview: '',
        specs: {},
      });
      fetchProducts();
    } catch (err: any) {
      alert(`Error creating product: ${err.message}`);
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id && p.asin !== id && p.slug !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditForm({ ...p, specs: { ...(p.specs || {}) } });
    setEditProsInput(p.pros?.join('\n') || '');
    setEditConsInput(p.cons?.join('\n') || '');
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaveLoading(true);
    try {
      const pros = editProsInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const cons = editConsInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...editForm,
        pros,
        cons,
      };

      const res = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? { ...p, ...updated } : p))
        );
        setEditingProduct(null);
      } else {
        alert(updated.error || 'Failed to update product');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  // =========================================================================
  // HANDLERS: FESTIVE CAMPAIGNS
  // =========================================================================
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.title || !campaignForm.discountHeadline) {
      alert('Title and Headline are required.');
      return;
    }
    setCampaignActionLoading(true);
    try {
      if (editingCampaign) {
        // Update
        const res = await fetch('/api/admin/campaigns', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...campaignForm, id: editingCampaign.id }),
        });
        if (!res.ok) throw new Error('Failed to update campaign');
      } else {
        // Create
        const res = await fetch('/api/admin/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaignForm),
        });
        if (!res.ok) throw new Error('Failed to create campaign');
      }
      setShowAddCampaignModal(false);
      setEditingCampaign(null);
      fetchCampaigns();
    } catch (err: any) {
      alert(`Error saving campaign: ${err.message}`);
    } finally {
      setCampaignActionLoading(false);
    }
  };

  const handleToggleCampaign = async (campaign: FestiveCampaign) => {
    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...campaign, active: !campaign.active }),
      });
      if (res.ok) fetchCampaigns();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCampaign = async (id: string, title: string) => {
    if (!confirm(`Delete campaign "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/campaigns?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchCampaigns();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================================
  // HANDLERS: BUYING GUIDES
  // =========================================================================
  const handleSaveGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideForm.title || !guideForm.content) {
      alert('Title and Content are required.');
      return;
    }
    setGuideActionLoading(true);
    try {
      if (editingGuide) {
        // Update
        const res = await fetch('/api/admin/guides', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...guideForm, _id: editingGuide._id, slug: editingGuide.slug }),
        });
        if (!res.ok) throw new Error('Failed to update guide');
      } else {
        // Create
        const res = await fetch('/api/admin/guides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(guideForm),
        });
        if (!res.ok) throw new Error('Failed to create guide');
      }
      setShowAddGuideModal(false);
      setEditingGuide(null);
      fetchGuides();
    } catch (err: any) {
      alert(`Error saving guide: ${err.message}`);
    } finally {
      setGuideActionLoading(false);
    }
  };

  const handleDeleteGuide = async (id: string, title: string) => {
    if (!confirm(`Delete guide "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/guides?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchGuides();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================================
  // HANDLERS: SITE CONFIG
  // =========================================================================
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveConfigLoading(true);
    setConfigMessage('');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configForm),
      });
      if (res.ok) {
        setConfigMessage('Site configuration and header branding saved successfully! Changes are live.');
        setTimeout(() => setConfigMessage(''), 5000);
      } else {
        const err = await res.json();
        setConfigMessage(`Error: ${err.error || 'Failed to save configuration'}`);
      }
    } catch (err: any) {
      setConfigMessage(`Error: ${err.message}`);
    } finally {
      setSaveConfigLoading(false);
    }
  };

  // One-Click Export site-data.json
  const handleExportSiteData = async () => {
    setExportStatus('Compiling site-data.json for GitHub Pages...');
    try {
      const res = await fetch('/api/admin/sync-export', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setExportStatus(`Success! Exported ${data.count} products to public/site-data.json.`);
      } else {
        setExportStatus(`Export failed: ${data.error}`);
      }
    } catch (err: any) {
      setExportStatus(`Error: ${err.message}`);
    }
  };

  // Sync with MongoDB Atlas Cluster
  const handleSyncAtlas = async (direction: 'push' | 'pull' = 'push') => {
    setSyncingAtlas(true);
    setExportStatus(
      direction === 'pull'
        ? 'Pulling latest catalog from MongoDB Atlas cluster...'
        : 'Pushing local catalog to MongoDB Atlas cluster...'
    );
    try {
      const res = await fetch('/api/admin/sync-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: direction === 'pull' ? 'atlas-pull' : 'atlas-push' }),
      });
      const data = await res.json();
      if (res.ok) {
        setExportStatus(data.message || 'Synced successfully with Atlas');
        fetchProducts();
        fetchCampaigns();
        fetchGuides();
        fetchConfig();
        fetchAtlasStatus();
      } else {
        setExportStatus(`Atlas sync error: ${data.error}`);
      }
    } catch (err: any) {
      setExportStatus(`Atlas sync failed: ${err.message}`);
    } finally {
      setSyncingAtlas(false);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const festiveDeals = products.filter((p) => p.isFestiveDeal || p.dealBadge).length;
    const activeCamps = campaigns.filter((c) => c.active).length;
    const totalGuides = guides.length;
    const now = Date.now();
    const stalePrices = products.filter((p) => {
      if (!p.priceLastVerified) return true;
      return now - new Date(p.priceLastVerified).getTime() > 24 * 3600 * 1000;
    }).length;

    // Compliance check
    const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    const issues: string[] = [];

    products.forEach((p) => {
      if (!p.imageUrl || p.imageUrl.includes('placeholder')) {
        issues.push(`Product "${p.title.slice(0, 24)}" has missing or invalid image URL.`);
      }
      if (emojiRegex.test(p.title) || emojiRegex.test(p.verdict || '')) {
        issues.push(`Product "${p.title.slice(0, 24)}" contains prohibited emoji in text.`);
      }
      if (
        p.affiliateUrl &&
        !p.affiliateUrl.includes('genztech019-21') &&
        !p.affiliateUrl.includes('link.amazon') &&
        !p.affiliateUrl.includes('amzn.to')
      ) {
        issues.push(`Product "${p.title.slice(0, 24)}" is missing Associate tag "genztech019-21".`);
      }
    });

    return { total, festiveDeals, activeCamps, totalGuides, stalePrices, complianceIssues: issues };
  }, [products, campaigns, guides]);

  // 1. Loading state while checking owner credentials
  if (!authChecked) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">
          Verifying security clearance...
        </div>
        <p className="text-xs text-zinc-500 mt-1">GenzTech.in Protected System</p>
      </div>
    );
  }

  // 2. Lockscreen challenge if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-sans">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Owner Access Required</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
              GenzTech.in Admin Console
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
              This control center is strictly restricted to the platform owner. Enter your owner passkey to access inventory, festive campaigns, and CMS configuration.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-xl text-xs font-mono text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Owner Passkey / Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter secret owner passkey"
                  className="w-full pl-10 pr-10 py-3 bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-950 dark:text-white font-mono placeholder:text-zinc-400 focus:outline-none focus:border-emerald-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading || !passwordInput.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Key...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Control Center</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs font-mono text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              &larr; Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Central Management System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
            GenzTech.in Admin Control Center
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Full management access across hardware inventory, festive campaigns, buying guides, and site configuration.
          </p>
        </div>

        {/* Global Actions: Atlas Cluster Sync & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-2 ${
              atlasConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                atlasConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
              }`}
            />
            <span>{atlasConnected ? 'Atlas: Connected' : 'Local JSON Mode'}</span>
          </div>

          {atlasConnected && (
            <button
              onClick={() => handleSyncAtlas('push')}
              disabled={syncingAtlas}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Push current catalog directly into MongoDB Atlas cluster"
            >
              <RefreshCw className={`w-3 h-3 ${syncingAtlas ? 'animate-spin' : ''}`} />
              <span>{syncingAtlas ? 'Syncing...' : 'Sync Atlas'}</span>
            </button>
          )}

          <button
            onClick={handleExportSiteData}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export site-data.json</span>
          </button>

          <button
            onClick={handleSignOut}
            className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Lock administrative console and end session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {exportStatus && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span>{exportStatus}</span>
          <button onClick={() => setExportStatus('')} className="p-1 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800 scrollbar-none text-xs font-mono font-bold">
        {[
          { id: 'overview', label: 'Overview Metrics', icon: LayoutDashboard },
          { id: 'products', label: 'Product Manager (CRUD)', icon: Package },
          { id: 'deals', label: 'Festive Campaigns', icon: Sparkles },
          { id: 'guides', label: 'Buying Guides CMS', icon: BookOpen },
          { id: 'config', label: 'Store Config & Branding', icon: Settings },
          { id: 'auditor', label: 'Amazon Policy Auditor', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.id === 'auditor' && metrics.complianceIssues.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW METRICS                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                Total Products Catalog
              </span>
              <div className="text-3xl font-black font-mono text-zinc-950 dark:text-white mt-1">
                {metrics.total}
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">Active devices in database</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-500">
                Active Campaigns &amp; Deals
              </span>
              <div className="text-3xl font-black font-mono text-amber-500 mt-1">
                {metrics.activeCamps} / {metrics.festiveDeals} Deals
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">Active banners on homepage</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600">
                Amazon Tag Status
              </span>
              <div className="text-xl font-black font-mono text-emerald-600 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                <span>{configForm.affiliateStoreId || 'genztech019-21'}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">Universal redirect gateway active</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                Published Buying Guides
              </span>
              <div className="text-3xl font-black font-mono text-zinc-950 dark:text-white mt-1">
                {metrics.totalGuides}
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">Editorial articles published</p>
            </div>

          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Quick Administrative Actions
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold">
              <button
                onClick={() => setActiveTab('products')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Synchronize Amazon Product</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('products');
                  setShowManualProductModal(true);
                }}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Add Product Manually</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('deals');
                  setShowAddCampaignModal(true);
                }}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Festive Campaign</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('guides');
                  setShowAddGuideModal(true);
                }}
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Write Buying Guide</span>
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit Site Config &amp; Ticker</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRODUCT MANAGER (CRUD + AMAZON SYNC + MANUAL CREATOR)              */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-8">
          
          {/* Top Options: Scraper vs Manual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1: Amazon Link Scraper */}
            <div className="md:col-span-2 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Synchronize via Amazon URL / ASIN
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Auto-Crawler</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Paste any Amazon.in link (SiteStripe short link like <code>https://link.amazon/...</code> or full URL) or 10-digit ASIN. Our crawler extracts title, verified price, high-res image, and binds <code>{configForm.affiliateStoreId || 'genztech019-21'}</code>.
              </p>

              <form onSubmit={handleAddProductScraper} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={asinInput}
                  onChange={(e) => setAsinInput(e.target.value)}
                  placeholder="Paste Amazon.in URL, Short Link, or ASIN..."
                  className="flex-1 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 font-mono"
                />
                <button
                  type="submit"
                  disabled={syncLoading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {syncLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{syncLoading ? 'Syncing...' : 'Fetch & Save'}</span>
                </button>
              </form>

              {syncMessage && (
                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  {syncMessage}
                </p>
              )}
            </div>

            {/* Box 2: Manual Product Creator Trigger */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-6 rounded-2xl border-2 border-zinc-800 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase mb-2">
                  <Package className="w-4 h-4" />
                  <span>Manual Creator</span>
                </div>
                <h3 className="text-base font-bold">Add Custom Hardware</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Create a custom product entry manually with bespoke specifications, pros/cons, laboratory verdict, and custom price modes.
                </p>
              </div>
              <button
                onClick={() => setShowManualProductModal(true)}
                className="mt-4 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Product Form</span>
              </button>
            </div>

          </div>

          {/* Search, Filter & Inventory Table */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs space-y-4">
            
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Live Product Inventory ({filteredProducts.length} of {products.length})
                </h3>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by title, brand, ASIN..."
                    className="pl-8 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono text-zinc-900 dark:text-white capitalize focus:outline-none focus:border-emerald-600"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <button
                  onClick={fetchProducts}
                  className="p-1.5 text-zinc-500 hover:text-emerald-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  title="Refresh Inventory"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-950 font-mono text-[11px] text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="p-3 w-16">Visual</th>
                    <th className="p-3">Title &amp; ASIN</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price &amp; Mode</th>
                    <th className="p-3">Spec Score</th>
                    <th className="p-3">Deals/Badges</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="p-3">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded p-1 flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.imageUrl} alt={p.title} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-zinc-900 dark:text-white line-clamp-1 max-w-xs">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-2 mt-0.5">
                          <span>ASIN: {p.asin}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold">{p.brand}</span>
                        </div>
                      </td>
                      <td className="p-3 capitalize font-mono text-zinc-600 dark:text-zinc-400">
                        {p.category}
                      </td>
                      <td className="p-3 font-mono">
                        <span className="font-bold text-zinc-900 dark:text-white block">{p.price}</span>
                        <span className="text-[10px] text-zinc-400">Mode: {p.priceMode || 'indicative'}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-600">
                        {p.specScore?.toFixed(1) || '9.0'}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap items-center gap-1">
                          {p.isFestiveDeal && (
                            <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold font-mono">
                              Festive
                            </span>
                          )}
                          {p.dealBadge && (
                            <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded text-[10px] font-mono">
                              {p.dealBadge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-zinc-500 hover:text-emerald-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Edit All Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`/out/${p._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Test Gateway Redirect"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteProduct(p._id, p.title)}
                            className="p-1.5 text-zinc-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FESTIVE DEALS & HERO BANNER MANAGER                                */}
      {/* ========================================================================= */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Festive Campaigns &amp; Deals Hub ({campaigns.length})
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Configure high-conversion festive banners, countdown targets, discount headlines, and theme accents on GenzTech.in.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCampaign(null);
                  setCampaignForm({
                    title: '',
                    badge: 'Limited Time Festive Deal',
                    discountHeadline: '',
                    countdownEnd: new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16),
                    active: true,
                    themeColor: 'emerald',
                    bannerCta: "Explore Today's Deals",
                    targetCategory: 'all',
                  });
                  setShowAddCampaignModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Campaign</span>
              </button>
            </div>

            {/* Campaign Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                    camp.active
                      ? 'border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 opacity-75'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {camp.badge || 'Campaign'}
                      </span>
                      <button
                        onClick={() => handleToggleCampaign(camp)}
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded cursor-pointer ${
                          camp.active
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {camp.active ? '● LIVE ACTIVE' : 'INACTIVE'}
                      </button>
                    </div>

                    <h4 className="font-black text-sm text-zinc-950 dark:text-white">
                      {camp.title}
                    </h4>

                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {camp.discountHeadline}
                    </p>

                    <div className="text-[11px] font-mono text-zinc-500 space-y-1 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Target: {new Date(camp.countdownEnd).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-emerald-500" />
                        <span className="capitalize">Theme: {camp.themeColor} • Category: {camp.targetCategory || 'all'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs">
                    <span className="font-mono text-zinc-400 text-[10px]">CTA: {camp.bannerCta}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCampaign(camp);
                          setCampaignForm(camp);
                          setShowAddCampaignModal(true);
                        }}
                        className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 rounded cursor-pointer"
                        title="Edit Campaign"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(camp.id, camp.title)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 rounded cursor-pointer"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: BUYING GUIDES CMS                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Editorial Buying Guides CMS ({guides.length})
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Publish comprehensive technical buyer guides to satisfy Amazon Associates original editorial content criteria.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingGuide(null);
                  setGuideForm({
                    title: '',
                    subtitle: '',
                    excerpt: '',
                    category: 'laptops',
                    readTime: '8 min read',
                    author: 'Aarav Sharma',
                    authorRole: 'Hardware Testing Lead',
                    heroImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200&auto=format&fit=crop',
                    content: '### Key Evaluation Criteria\n\nDetail the hardware parameters tested in your laboratory.',
                    recommendedProductIds: [],
                  });
                  setShowAddGuideModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write New Buying Guide</span>
              </button>
            </div>

            {/* Guides Table / Cards */}
            <div className="space-y-3 pt-2">
              {guides.map((guide) => (
                <div
                  key={guide._id}
                  className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={guide.heroImage} alt={guide.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white line-clamp-1">
                        {guide.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 font-mono capitalize mt-0.5">
                        Category: {guide.category} • {guide.readTime} • Author: {guide.author} ({guide.authorRole})
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400 line-clamp-1 mt-1 text-[11px]">
                        {guide.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <Link
                      href={`/guides/${guide.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg font-mono text-[11px] flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View</span>
                    </Link>
                    <button
                      onClick={() => {
                        setEditingGuide(guide);
                        setGuideForm(guide);
                        setShowAddGuideModal(true);
                      }}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteGuide(guide._id, guide.title)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 rounded cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: STORE CONFIG & BRANDING (FULL GRANULAR ACCESS)                     */}
      {/* ========================================================================= */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveConfig} className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-600" />
                  Site-Wide Configuration &amp; Branding CMS
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Control all public branding, hero text, CTAs, announcement tickers, and Amazon compliance parameters.
                </p>
              </div>

              <button
                type="submit"
                disabled={saveConfigLoading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {saveConfigLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saveConfigLoading ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>

            {configMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{configMessage}</span>
              </div>
            )}

            {/* Section A: Brand Identity & Amazon Store Tag */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>1. Brand Identity &amp; Amazon Tracking</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={configForm.brandName || ''}
                    onChange={(e) => setConfigForm({ ...configForm, brandName: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Tagline</label>
                  <input
                    type="text"
                    required
                    value={configForm.tagline || ''}
                    onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Amazon Associate Store ID</label>
                  <input
                    type="text"
                    required
                    value={configForm.affiliateStoreId || ''}
                    onChange={(e) => setConfigForm({ ...configForm, affiliateStoreId: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={configForm.contactEmail || ''}
                    onChange={(e) => setConfigForm({ ...configForm, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Homepage Hero & Primary CTAs */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>2. Homepage Hero Stage &amp; Call To Actions</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Main Hero Headline</label>
                  <input
                    type="text"
                    value={configForm.heroHeadline || ''}
                    onChange={(e) => setConfigForm({ ...configForm, heroHeadline: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Hero Subheadline</label>
                  <input
                    type="text"
                    value={configForm.heroSubheadline || ''}
                    onChange={(e) => setConfigForm({ ...configForm, heroSubheadline: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Primary CTA Label &amp; Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Label"
                      value={configForm.primaryCtaText || ''}
                      onChange={(e) => setConfigForm({ ...configForm, primaryCtaText: e.target.value })}
                      className="w-1/2 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Path (e.g. /products)"
                      value={configForm.primaryCtaLink || ''}
                      onChange={(e) => setConfigForm({ ...configForm, primaryCtaLink: e.target.value })}
                      className="w-1/2 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Secondary CTA Label &amp; Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Label"
                      value={configForm.secondaryCtaText || ''}
                      onChange={(e) => setConfigForm({ ...configForm, secondaryCtaText: e.target.value })}
                      className="w-1/2 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Path (e.g. /deals)"
                      value={configForm.secondaryCtaLink || ''}
                      onChange={(e) => setConfigForm({ ...configForm, secondaryCtaLink: e.target.value })}
                      className="w-1/2 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section C: Tier 1 Announcement Bar & Countdown */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>3. Header Tier 1 Announcement Bar &amp; Live Timer</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs font-mono">
                <div className="sm:col-span-6">
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Top Announcement Ticker Text</label>
                  <input
                    type="text"
                    value={configForm.tickerText || ''}
                    onChange={(e) => setConfigForm({ ...configForm, tickerText: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Countdown Target Date/Time (ISO)</label>
                  <input
                    type="text"
                    value={configForm.tickerCountdownEnd || ''}
                    onChange={(e) => setConfigForm({ ...configForm, tickerCountdownEnd: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configForm.tickerActive}
                      onChange={(e) => setConfigForm({ ...configForm, tickerActive: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-zinc-900 dark:text-white">Ticker Active</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section D: Compliance & Policies */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>4. Amazon Associates Policies &amp; Statements</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Default Price Mode</label>
                  <select
                    value={configForm.defaultPriceMode || 'indicative'}
                    onChange={(e) => setConfigForm({ ...configForm, defaultPriceMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  >
                    <option value="indicative">Mode A: Indicative with Timestamp (Verified &lt;24h)</option>
                    <option value="safe_cta">Mode B: Policy-Safe CTA Button (&quot;Check Price on Amazon&quot;)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Affiliate Disclosure Statement</label>
                  <input
                    type="text"
                    value={configForm.affiliateDisclosure || ''}
                    onChange={(e) => setConfigForm({ ...configForm, affiliateDisclosure: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Footer About Description</label>
                  <textarea
                    rows={2}
                    value={configForm.footerAbout || ''}
                    onChange={(e) => setConfigForm({ ...configForm, footerAbout: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white font-sans text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button
                type="submit"
                disabled={saveConfigLoading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {saveConfigLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saveConfigLoading ? 'Persisting...' : 'Save Configuration'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: AMAZON COMPLIANCE AUDITOR                                          */}
      {/* ========================================================================= */}
      {activeTab === 'auditor' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Amazon Associates Operating Agreement Auditor
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Automated verification scan ensuring compliance with Amazon Associates Program policies.
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                metrics.complianceIssues.length === 0
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {metrics.complianceIssues.length === 0 ? '100% Policy Compliant' : `${metrics.complianceIssues.length} Warnings`}
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mandatory Affiliate Disclosure displayed prominently on Header, Footer, and /affiliate-disclosure</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All outgoing affiliate links include rel=&ldquo;sponsored nofollow noopener&rdquo; and route through /out/[id]</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Indicative prices display verification timestamp with staleness notice if older than 24 hours</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero prohibited emoji placeholders in product titles or category headers</span>
              </div>
            </div>

            {metrics.complianceIssues.length > 0 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-mono">
                  <AlertTriangle className="w-4 h-4" /> Detected Policy Anomalies:
                </span>
                <ul className="space-y-1 text-xs text-amber-700 dark:text-amber-400 font-mono">
                  {metrics.complianceIssues.map((issue, idx) => (
                    <li key={idx}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT PRODUCT DETAILS                                               */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-600" />
                Edit Hardware Product: {editingProduct.title.slice(0, 32)}...
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Brand</label>
                  <input
                    type="text"
                    value={editForm.brand || ''}
                    onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={editForm.category || 'smartphones'}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white capitalize"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Spec Score (1.0 - 10.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={editForm.specScore ?? 9.0}
                    onChange={(e) => setEditForm({ ...editForm, specScore: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Price (e.g. ₹24,999)</label>
                  <input
                    type="text"
                    value={editForm.price || ''}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Original M.R.P.</label>
                  <input
                    type="text"
                    value={editForm.mrp || ''}
                    onChange={(e) => setEditForm({ ...editForm, mrp: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Price Mode</label>
                  <select
                    value={editForm.priceMode || 'indicative'}
                    onChange={(e) => setEditForm({ ...editForm, priceMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  >
                    <option value="indicative">Mode A: Indicative with Timestamp</option>
                    <option value="safe_cta">Mode B: Policy-Safe CTA Button</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">High-Res Image URL</label>
                  <input
                    type="text"
                    value={editForm.imageUrl || ''}
                    onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Affiliate Destination URL</label>
                  <input
                    type="text"
                    value={editForm.affiliateUrl || ''}
                    onChange={(e) => setEditForm({ ...editForm, affiliateUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Deal Badge Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Editor Choice Flagship"
                    value={editForm.dealBadge || ''}
                    onChange={(e) => setEditForm({ ...editForm, dealBadge: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editForm.isFestiveDeal)}
                      onChange={(e) => setEditForm({ ...editForm, isFestiveDeal: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <span className="font-bold text-zinc-900 dark:text-white">Festive Deal Spotlight</span>
                  </label>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editForm.isFeatured)}
                      onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <span className="font-bold text-zinc-900 dark:text-white">Featured Hardware</span>
                  </label>
                </div>
              </div>

              {/* Hardware Specs */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Hardware Specifications
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-0.5">Processor</label>
                    <input
                      type="text"
                      value={editForm.specs?.processor || ''}
                      onChange={(e) => setEditForm({ ...editForm, specs: { ...(editForm.specs || {}), processor: e.target.value } })}
                      className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-0.5">Display</label>
                    <input
                      type="text"
                      value={editForm.specs?.display || ''}
                      onChange={(e) => setEditForm({ ...editForm, specs: { ...(editForm.specs || {}), display: e.target.value } })}
                      className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-0.5">RAM &amp; Storage</label>
                    <input
                      type="text"
                      value={editForm.specs?.ramStorage || ''}
                      onChange={(e) => setEditForm({ ...editForm, specs: { ...(editForm.specs || {}), ramStorage: e.target.value } })}
                      className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-0.5">Battery / Endurance</label>
                    <input
                      type="text"
                      value={editForm.specs?.battery || ''}
                      onChange={(e) => setEditForm({ ...editForm, specs: { ...(editForm.specs || {}), battery: e.target.value } })}
                      className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Pros (One per line)</label>
                  <textarea
                    rows={3}
                    value={editProsInput}
                    onChange={(e) => setEditProsInput(e.target.value)}
                    placeholder="Enter pros, one line each..."
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white font-sans text-xs"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Cons (One per line)</label>
                  <textarea
                    rows={3}
                    value={editConsInput}
                    onChange={(e) => setEditConsInput(e.target.value)}
                    placeholder="Enter cons, one line each..."
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white font-sans text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1">Editorial Verdict</label>
                <textarea
                  rows={2}
                  value={editForm.verdict || ''}
                  onChange={(e) => setEditForm({ ...editForm, verdict: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saveLoading ? 'Saving...' : 'Save Product Changes'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MANUAL PRODUCT CREATOR                                             */}
      {/* ========================================================================= */}
      {showManualProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                Create New Hardware Product Entry
              </h3>
              <button
                onClick={() => setShowManualProductModal(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualProduct} className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony WH-1000XM5 Wireless ANC Headphones"
                  value={manualProductForm.title || ''}
                  onChange={(e) => setManualProductForm({ ...manualProductForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony"
                    value={manualProductForm.brand || ''}
                    onChange={(e) => setManualProductForm({ ...manualProductForm, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Category *</label>
                  <select
                    value={manualProductForm.category || 'smartphones'}
                    onChange={(e) => setManualProductForm({ ...manualProductForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white capitalize"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Spec Score (1.0 - 10.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={manualProductForm.specScore ?? 9.0}
                    onChange={(e) => setManualProductForm({ ...manualProductForm, specScore: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Price * (e.g. ₹29,990)</label>
                  <input
                    type="text"
                    required
                    placeholder="₹29,990"
                    value={manualProductForm.price || ''}
                    onChange={(e) => setManualProductForm({ ...manualProductForm, price: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">M.R.P. (e.g. ₹34,990)</label>
                  <input
                    type="text"
                    placeholder="₹34,990"
                    value={manualProductForm.mrp || ''}
                    onChange={(e) => setManualProductForm({ ...manualProductForm, mrp: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Price Display Mode</label>
                  <select
                    value={manualProductForm.priceMode || 'indicative'}
                    onChange={(e) => setManualProductForm({ ...manualProductForm, priceMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  >
                    <option value="indicative">Mode A: Indicative with Timestamp</option>
                    <option value="safe_cta">Mode B: Policy-Safe CTA Button</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={manualProductForm.imageUrl || ''}
                    onChange={(e) => setManualProductForm({ ...manualProductForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Affiliate Destination URL</label>
                  <input
                    type="text"
                    placeholder="https://www.amazon.in/dp/...?tag=genztech019-21"
                    value={manualProductForm.affiliateUrl || ''}
                    onChange={(e) => setManualProductForm({ ...manualProductForm, affiliateUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Deal Badge Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller"
                    value={manualProductForm.dealBadge || ''}
                    onChange={(e) => setManualProductForm({ ...manualProductForm, dealBadge: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(manualProductForm.isFestiveDeal)}
                      onChange={(e) => setManualProductForm({ ...manualProductForm, isFestiveDeal: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <span className="font-bold text-zinc-900 dark:text-white">Festive Deal Spotlight</span>
                  </label>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(manualProductForm.isFeatured)}
                      onChange={(e) => setManualProductForm({ ...manualProductForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <span className="font-bold text-zinc-900 dark:text-white">Featured Hardware</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1">Editorial Verdict</label>
                <textarea
                  rows={2}
                  placeholder="Summary of performance and target audience..."
                  value={manualProductForm.verdict || ''}
                  onChange={(e) => setManualProductForm({ ...manualProductForm, verdict: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowManualProductModal(false)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingProduct}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{creatingProduct ? 'Publishing...' : 'Publish Product'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CAMPAIGN CREATOR & EDITOR                                          */}
      {/* ========================================================================= */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {editingCampaign ? 'Edit Festive Campaign' : 'Create New Festive Campaign'}
              </h3>
              <button
                onClick={() => setShowAddCampaignModal(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="p-6 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Great Indian Tech Festival"
                  value={campaignForm.title || ''}
                  onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Limited Time Festive Deal"
                  value={campaignForm.badge || ''}
                  onChange={(e) => setCampaignForm({ ...campaignForm, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1">Discount Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Up to 45% Off Flagship Laptops, 5G Phones & ANC Gear"
                  value={campaignForm.discountHeadline || ''}
                  onChange={(e) => setCampaignForm({ ...campaignForm, discountHeadline: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Countdown End (ISO / DateTime)</label>
                  <input
                    type="text"
                    required
                    placeholder="YYYY-MM-DDTHH:MM"
                    value={campaignForm.countdownEnd || ''}
                    onChange={(e) => setCampaignForm({ ...campaignForm, countdownEnd: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Theme Accent Color</label>
                  <select
                    value={campaignForm.themeColor || 'emerald'}
                    onChange={(e) => setCampaignForm({ ...campaignForm, themeColor: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white capitalize"
                  >
                    {THEME_COLORS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Banner CTA Text</label>
                  <input
                    type="text"
                    value={campaignForm.bannerCta || "Explore Today's Deals"}
                    onChange={(e) => setCampaignForm({ ...campaignForm, bannerCta: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(campaignForm.active)}
                      onChange={(e) => setCampaignForm({ ...campaignForm, active: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <span className="font-bold text-zinc-900 dark:text-white">Active on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddCampaignModal(false)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={campaignActionLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{campaignActionLoading ? 'Saving...' : 'Save Campaign'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BUYING GUIDE CREATOR & EDITOR                                      */}
      {/* ========================================================================= */}
      {showAddGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                {editingGuide ? 'Edit Buying Guide' : 'Write New Buying Guide'}
              </h3>
              <button
                onClick={() => setShowAddGuideModal(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuide} className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1">Guide Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Ultimate Gaming Laptop Buying Guide (2026 Edition)"
                  value={guideForm.title || ''}
                  onChange={(e) => setGuideForm({ ...guideForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white font-sans text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1">Subtitle / Engineering Focus</label>
                <input
                  type="text"
                  placeholder="e.g. GPU TGP Wattage, OLED vs IPS Panels & Thermal Throttling"
                  value={guideForm.subtitle || ''}
                  onChange={(e) => setGuideForm({ ...guideForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={guideForm.category || 'laptops'}
                    onChange={(e) => setGuideForm({ ...guideForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white capitalize"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    value={guideForm.readTime || '8 min read'}
                    onChange={(e) => setGuideForm({ ...guideForm, readTime: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">Author Name &amp; Role</label>
                  <input
                    type="text"
                    value={guideForm.author || ''}
                    onChange={(e) => setGuideForm({ ...guideForm, author: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1">Hero Image URL</label>
                <input
                  type="text"
                  value={guideForm.heroImage || ''}
                  onChange={(e) => setGuideForm({ ...guideForm, heroImage: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1">Executive Excerpt</label>
                <textarea
                  rows={2}
                  value={guideForm.excerpt || ''}
                  onChange={(e) => setGuideForm({ ...guideForm, excerpt: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1">Markdown Body Content *</label>
                <textarea
                  rows={10}
                  required
                  value={guideForm.content || ''}
                  onChange={(e) => setGuideForm({ ...guideForm, content: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddGuideModal(false)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={guideActionLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{guideActionLoading ? 'Saving...' : 'Publish Guide'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
