/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  SlidersHorizontal, 
  PackageOpen, 
  X,
  ShoppingBag,
  Star
} from 'lucide-react';
import { Product, Category, SortOption, Banner, SiteConfig } from './types';
import { 
  getStoredProducts, 
  getStoredCategories, 
  trackProductClick,
  trackProductView,
  getStoredBanners,
  getStoredSiteConfig,
  setAdminPassword
} from './services/storage';
import {
  subscribeToProducts,
  subscribeToCategories,
  subscribeToBanners,
  subscribeToSiteConfig,
  subscribeToAdminPassword,
  trackCloudProductClick,
  trackCloudProductView,
  initializeFirestoreSeed
} from './services/firebaseService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BannerSlider } from './components/BannerSlider';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => getStoredSiteConfig());
  
  // Navigation View State: 'home' | 'detail' | 'admin'
  const [currentView, setCurrentView] = useState<'home' | 'detail' | 'admin'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load data on mount & handle URL hash sync
  const refreshData = () => {
    const loadedProducts = getStoredProducts();
    const loadedCategories = getStoredCategories();
    const loadedBanners = getStoredBanners();
    const loadedConfig = getStoredSiteConfig();
    setProducts(loadedProducts);
    setCategories(loadedCategories);
    setBanners(loadedBanners);
    setSiteConfig(loadedConfig);
  };

  useEffect(() => {
    refreshData();

    // Initialize Firestore seed if collections are new
    initializeFirestoreSeed();

    // Attach real-time cloud listeners
    const unsubProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    const unsubCategories = subscribeToCategories((cloudCategories) => {
      if (cloudCategories && cloudCategories.length > 0) {
        setCategories(cloudCategories);
      }
    });

    const unsubBanners = subscribeToBanners((cloudBanners) => {
      if (cloudBanners && cloudBanners.length > 0) {
        setBanners(cloudBanners);
      }
    });

    const unsubAdminAuth = subscribeToAdminPassword((cloudPassword) => {
      setAdminPassword(cloudPassword);
    });

    const unsubSiteConfig = subscribeToSiteConfig((cloudConfig) => {
      if (cloudConfig) {
        setSiteConfig(cloudConfig);
      }
    });

    // Check URL hash for direct deep linking (e.g. #produto/prod-1 or #admin)
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#produto/')) {
        const prodId = hash.replace('#produto/', '');
        setSelectedProductId(prodId);
        setCurrentView('detail');
      } else if (hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      unsubProducts();
      unsubCategories();
      unsubBanners();
      unsubAdminAuth();
      unsubSiteConfig();
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  // Navigation handlers
  const handleOpenProduct = (product: Product) => {
    trackProductView(product.id);
    trackCloudProductView(product.id);
    setSelectedProductId(product.id);
    setCurrentView('detail');
    window.location.hash = `#produto/${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setSelectedProductId(null);
    setCurrentView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    if (currentView === 'admin') {
      handleGoHome();
    } else {
      setCurrentView('admin');
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDirectStoreClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    trackProductClick(product.id);
    trackCloudProductClick(product.id);
    refreshData();
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
    showToast(`Redirecionando para a loja oficial ${product.store}...`);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.store.toLowerCase().includes(q) ||
          (p.highlights && p.highlights.some((h) => h.toLowerCase().includes(q)))
      );
    }

    // Filter by Category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Store
    if (selectedStore) {
      result = result.filter((p) => p.store === selectedStore);
    }

    // Filter by Badge
    if (selectedBadge) {
      if (selectedBadge === 'Destaque' || selectedBadge === 'Destaques') {
        result = result.filter((p) => p.isFeatured || (p.badges && p.badges.includes('Destaque')));
      } else {
        result = result.filter((p) => p.badges && p.badges.includes(selectedBadge));
      }
    }

    // Filter by onlyFeatured
    if (onlyFeatured) {
      result = result.filter((p) => p.isFeatured);
    }

    // Sorting
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => (b.clicksCount || 0) - (a.clicksCount || 0));
        break;
      case 'latest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'featured':
      default:
        // Organização Manual definida no Painel Admin (Posição #1, #2, #3, #4...)
        result.sort((a, b) => {
          const orderA = typeof a.order === 'number' && a.order > 0 ? a.order : 9999;
          const orderB = typeof b.order === 'number' && b.order > 0 ? b.order : 9999;
          if (orderA !== orderB) return orderA - orderB;
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (b.clicksCount || 0) - (a.clicksCount || 0);
        });
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedStore, selectedBadge, onlyFeatured, sortBy]);

  // Achadinhos marcados no Admin com "Exibir este achadinho com destaque prioritário na página inicial"
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.isFeatured);
  }, [products]);

  // Selected product object for Detail view
  const currentProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return products.find((p) => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedStore || selectedBadge || onlyFeatured);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStore('');
    setSelectedBadge('');
    setOnlyFeatured(false);
    setSortBy('featured');
  };

  // Mobile Grid Class based on Admin Configuration (Dupla vs Simples)
  const isMobileDouble = siteConfig.mobileDoubleColumns !== false;
  const productsGridClass = isMobileDouble
    ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-800 antialiased">
      {/* Global Navbar */}
      <Navbar
        onGoHome={handleGoHome}
        onOpenAdmin={handleOpenAdmin}
        isAdminActive={currentView === 'admin'}
        totalProductsCount={products.length}
      />

      <main className="flex-1">
        {/* VIEW 1: HOME PAGE (Catalog + Prominent Categories) */}
        {currentView === 'home' && (
          <div>
            {/* 3 Banners Section right at the top (where the text 'Achados do Dia para Facilitar a Sua Vida' was) */}
            <BannerSlider
              banners={banners}
              onSelectCategory={(catName) => {
                setSelectedCategory(catName);
                const catalogEl = document.getElementById('catalogo-achados');
                if (catalogEl) {
                  catalogEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Store filters */}
            <Hero
              selectedStore={selectedStore}
              onSelectStore={setSelectedStore}
              selectedBadge={selectedBadge}
              onSelectBadge={setSelectedBadge}
              products={products}
            />

            {/* Search Bar & Buscar Button */}
            <CategoryNav
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* SEÇÃO EXCLUSIVA: ÁREA DE DESTAQUE PRIORITÁRIO */}
            {featuredProducts.length > 0 && !searchQuery && !selectedCategory && !selectedStore && !selectedBadge && !onlyFeatured && (
              <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
                <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white rounded-3xl border-2 border-amber-300 p-5 sm:p-7 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
                        <Sparkles className="w-6 h-6 fill-current" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                            Achadinhos em Destaque Prioritário
                          </h2>
                          <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                            ★ Top Destaques
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Itens marcados com destaque prioritário no painel administrativo
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{featuredProducts.length} {featuredProducts.length === 1 ? 'item em destaque' : 'itens em destaque'}</span>
                      </span>
                    </div>
                  </div>

                  <div className={productsGridClass}>
                    {featuredProducts.map((product) => (
                      <ProductCard
                        key={`featured-area-${product.id}`}
                        product={product}
                        onOpenProduct={handleOpenProduct}
                        onDirectStoreClick={handleDirectStoreClick}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Main Products Grid Section */}
            <section id="catalogo-achados" className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
              {/* Controls bar: Results Count & Active Filter Pills */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      {onlyFeatured 
                        ? 'Achadinhos em Destaque' 
                        : (selectedCategory || 'Todos os Achados do Dia')}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 tabular-nums">
                    ({filteredProducts.length} {filteredProducts.length === 1 ? 'oferta' : 'ofertas encontradas'})
                  </span>

                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      Limpar filtros
                    </button>
                  )}
                </div>

                {featuredProducts.length > 0 && (
                  <button
                    onClick={() => setOnlyFeatured(!onlyFeatured)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer w-fit ${
                      onlyFeatured
                        ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                        : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${onlyFeatured ? 'fill-white text-white' : 'fill-amber-500 text-amber-500'}`} />
                    <span>{onlyFeatured ? 'Mostrando Apenas Destaques' : 'Ver Apenas Destaques'}</span>
                  </button>
                )}
              </div>

              {/* Product Cards Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
                  <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    Nenhum achadinho encontrado
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Não encontramos nenhum produto com os filtros selecionados. Tente remover palavras-chave ou categorias.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Ver Todos os Produtos
                  </button>
                </div>
              ) : (
                <div className={productsGridClass}>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenProduct={handleOpenProduct}
                      onDirectStoreClick={handleDirectStoreClick}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW 2: PRODUCT DETAIL PAGE */}
        {currentView === 'detail' && currentProduct && (
          <ProductDetail
            product={currentProduct}
            allProducts={products}
            onBack={handleGoHome}
            onSelectRelated={handleOpenProduct}
            onShowToast={showToast}
          />
        )}

        {/* VIEW 3: ADMIN PANEL */}
        {currentView === 'admin' && (
          <AdminPanel
            products={products}
            categories={categories}
            onRefreshData={refreshData}
            onCloseAdmin={handleGoHome}
            onShowToast={showToast}
            onViewProduct={handleOpenProduct}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onGoHome={handleGoHome}
        onOpenAdmin={handleOpenAdmin}
        onSelectCategory={(catName) => {
          setSelectedCategory(catName);
          handleGoHome();
        }}
      />

      {/* Global Notification Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
