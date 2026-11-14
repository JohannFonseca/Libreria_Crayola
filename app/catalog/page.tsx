'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { Search, X, Sparkles, ArrowUpDown, Tag, ChevronDown, Check } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductDetail } from '@/components/catalog/ProductDetail';
import { ProductCardSkeleton } from '@/components/catalog/ProductCardSkeleton';
import { Button } from '@/components/ui/Button';
import { Product, Brand } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { getPublicProducts } from '@/lib/api/products';
import { trackEvent } from '@/lib/api/analytics';
import { supabase } from '@/lib/supabaseClient';

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const brandIdParam = searchParams.get('brandId');

  const [searchTerm, setSearchTerm] = useState(searchParam || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'Todas');
  const [selectedBrandId, setSelectedBrandId] = useState<string>(brandIdParam || '');
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'destacados' | 'precio-asc' | 'precio-desc' | 'nombre-asc'>('destacados');

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(32);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, brandsResponse] = await Promise.all([
          getPublicProducts(),
          supabase.from('brands').select('*').order('name'),
        ]);

        if (isMounted) {
          setProducts(productsData || []);
          setBrands(brandsResponse.data || []);
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchTerm(searchParam);
    if (brandIdParam) setSelectedBrandId(brandIdParam);
  }, [categoryParam, searchParam, brandIdParam]);

  const categoriesList = useMemo(() => {
    const cats = new Set(products.map(p => p.categories?.name).filter(Boolean));
    return ['Todas', ...Array.from(cats)] as string[];
  }, [products]);

  const activeBrand = useMemo(() => {
    if (!selectedBrandId) return null;
    return brands.find(b => b.id === selectedBrandId) || null;
  }, [brands, selectedBrandId]);

  const filteredProducts = useMemo(() => {
    const normSearch = normalizeText(searchTerm.trim());

    return products.filter((p) => {
      if (normSearch) {
        const normName = normalizeText(p.name || '');
        const normDesc = normalizeText(p.description || '');
        const normBrand = normalizeText(p.brands?.name || '');
        if (!normName.includes(normSearch) && !normDesc.includes(normSearch) && !normBrand.includes(normSearch)) {
          return false;
        }
      }

      if (selectedCategory !== 'Todas' && p.categories?.name !== selectedCategory) {
        return false;
      }

      if (selectedBrandId) {
        if (p.brand_id && p.brand_id !== selectedBrandId) return false;
        if (!p.brand_id) {
          const brandObj = brands.find(b => b.id === selectedBrandId);
          if (brandObj) {
            const normBrandName = normalizeText(brandObj.name || '');
            const normName = normalizeText(p.name || '');
            if (!normName.includes(normBrandName)) return false;
          } else {
            return false;
          }
        }
      }

      if (onlyFeatured && !p.destacado) {
        return false;
      }

      return true;
    });
  }, [products, searchTerm, selectedCategory, selectedBrandId, onlyFeatured, brands]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'precio-asc') {
      return list.sort((a, b) => (a.precio_venta ?? Infinity) - (b.precio_venta ?? Infinity));
    }
    if (sortBy === 'precio-desc') {
      return list.sort((a, b) => (b.precio_venta ?? -Infinity) - (a.precio_venta ?? -Infinity));
    }
    if (sortBy === 'nombre-asc') {
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    // 'destacados' default
    return list.sort((a, b) => {
      if (a.destacado && !b.destacado) return -1;
      if (!a.destacado && b.destacado) return 1;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });
  }, [filteredProducts, sortBy]);

  const displayedProducts = useMemo(() => {
    return sortedProducts.slice(0, visibleCount);
  }, [sortedProducts, visibleCount]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todas');
    setSelectedBrandId('');
    setOnlyFeatured(false);
    setVisibleCount(32);
  };

  const handleAddToCart = (product: Product, color?: string, quantity?: number) => {
    trackEvent(product.id, 'add_to_cart');
    addItem(product, color, quantity);
    setSelectedProduct(null);
  };

  const handleViewProduct = (product: Product) => {
    trackEvent(product.id, 'view_product');
    setSelectedProduct(product);
  };

  const hasActiveFilters = selectedCategory !== 'Todas' || selectedBrandId || onlyFeatured || searchTerm;

  return (
    <div className="min-h-screen bg-[#fafafc] pb-24">
      {/* Clean, Integrated Header */}
      <section className="bg-white border-b border-neutral-200/60 pt-8 pb-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                Catálogo de Productos
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
                Suministros de papelería, oficina, arte y escolares de marcas líderes
              </p>
            </div>

            {/* Elegant Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                id="catalog-search-input"
                type="text"
                placeholder="Buscar artículo, marca, SKU..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(32);
                }}
                className="w-full h-11 pl-10 pr-9 rounded-2xl border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-800 placeholder:text-neutral-400 focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Clean Category Pills & Brand Selector */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-100">
            {/* Category horizontal scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1">
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setVisibleCount(32);
                    }}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Brand Dropdown Filter */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsBrandDropdownOpen((prev) => !prev)}
                className={`h-9 px-3 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                  selectedBrandId
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <Tag className="h-3.5 w-3.5" />
                <span className="truncate max-w-[120px]">
                  {activeBrand ? activeBrand.name : 'Marcas'}
                </span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {/* Dropdown Menu */}
              {isBrandDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsBrandDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-11 w-64 max-h-80 overflow-y-auto bg-white rounded-2xl border border-neutral-200 shadow-xl z-50 p-2 custom-scrollbar">
                    <button
                      onClick={() => {
                        setSelectedBrandId('');
                        setIsBrandDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                        selectedBrandId === '' ? 'bg-primary/10 text-primary' : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>Todas las marcas</span>
                      {selectedBrandId === '' && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <div className="my-1 border-t border-neutral-100" />
                    {brands.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBrandId(b.id);
                          setIsBrandDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
                          selectedBrandId === b.id ? 'bg-primary/10 text-primary' : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {b.logo_url ? (
                          <div className="h-5 w-8 bg-neutral-50 rounded border border-neutral-100 p-0.5 flex items-center justify-center shrink-0">
                            <img src={b.logo_url} alt="" className="max-h-full max-w-full object-contain" />
                          </div>
                        ) : (
                          <span className="h-5 w-5 rounded bg-neutral-100 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {b.name.substring(0, 2)}
                          </span>
                        )}
                        <span className="truncate flex-1">{b.name}</span>
                        {selectedBrandId === b.id && <Check className="h-3.5 w-3.5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Body */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Active Filters & Controls Strip */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          {/* Active filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-neutral-500">
              Mostrando <span className="text-neutral-900 font-black">{displayedProducts.length}</span> de <span className="text-neutral-900 font-black">{filteredProducts.length}</span> productos
            </span>

            {selectedCategory !== 'Todas' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-200/80 text-neutral-800">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('Todas')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {activeBrand && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                Marca: {activeBrand.name}
                <button onClick={() => setSelectedBrandId('')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {onlyFeatured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                Solo Destacados
                <button onClick={() => setOnlyFeatured(false)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-primary hover:underline ml-1"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Right Toolbar: Destacados button & Sort */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setOnlyFeatured(prev => !prev)}
              className={`h-9 px-3 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                onlyFeatured
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <span>Destacados</span>
            </button>

            <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl px-2.5 h-9 shadow-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-neutral-700 focus:outline-none cursor-pointer"
              >
                <option value="destacados">Orden: Destacados</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="nombre-asc">Nombre: A - Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={handleViewProduct}
                  onAddToCart={(p) => handleAddToCart(p)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < sortedProducts.length && (
              <div className="flex justify-center mt-12 mb-6">
                <Button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 32, sortedProducts.length))}
                  className="h-12 px-8 rounded-2xl font-bold bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50 shadow-xs gap-2"
                  variant="outline"
                >
                  Cargar más productos ({sortedProducts.length - visibleCount} restantes)
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center border border-dashed border-neutral-200 rounded-3xl bg-white p-8">
            <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-neutral-800 mb-1">No encontramos artículos</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
              No hay productos con los filtros o términos seleccionados.
            </p>
            <Button onClick={handleResetFilters} className="rounded-xl font-bold text-xs h-10 px-5">
              Restablecer Filtros
            </Button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fafafc]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <span className="text-xs font-bold text-neutral-400">Cargando catálogo...</span>
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
