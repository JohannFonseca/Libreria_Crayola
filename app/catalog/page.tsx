'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { Search, SlidersHorizontal, X, Tag, Sparkles, Check, DollarSign } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductDetail } from '@/components/catalog/ProductDetail';
import { FeaturedSection } from '@/components/catalog/FeaturedSection';
import { ProductCardSkeleton } from '@/components/catalog/ProductCardSkeleton';
import { Button } from '@/components/ui/Button';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { getPublicProducts } from '@/lib/api/products';
import { trackEvent } from '@/lib/api/analytics';

// Accent normalization helper to make search accent-insensitive
const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const AVAILABLE_BRANDS = [
  { name: 'Crayola', query: 'crayola' },
  { name: 'Norma', query: 'norma' },
  { name: 'BIC', query: 'bic' },
  { name: 'El Líder', query: 'lider' },
  { name: 'Resistol', query: 'resistol' },
  { name: 'Skipper', query: 'skipper' },
  { name: 'Articolor', query: 'articolor' },
  { name: 'Chenson', query: 'chenson' }
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [visibleCount, setVisibleCount] = useState(20);


  useEffect(() => {
    fetchProducts();
  }, []);

  // Pre-select category or search term if set in query parameters
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [categoryParam, searchParam]);

  // Reset visibleCount back to 20 whenever any search or filter state changes
  useEffect(() => {
    setVisibleCount(20);
  }, [searchTerm, selectedCategory, selectedBrands, minPrice, maxPrice, onlyFeatured]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getPublicProducts();
      setProducts(data || []);
    } catch (e) {
      console.error('Error loading catalog:', e);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const categoriesList = useMemo(() => {
    const cats = new Set(products.map(p => p.categories?.name).filter(Boolean));
    return ['Todas', ...Array.from(cats)] as string[];
  }, [products]);

  const featuredProducts = useMemo(() => {
    return products.filter(p => p.destacado);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normSearch = normalizeText(searchTerm);
    return products.filter(p => {
      // 1. Search term check
      const normName = normalizeText(p.name || '');
      const normDescription = normalizeText(p.description || '');
      const matchesSearch = normName.includes(normSearch) || 
                            normDescription.includes(normSearch);
      
      // 2. Category check
      const matchesCategory = selectedCategory === 'Todas' || p.categories?.name === selectedCategory;
      
      // 3. Brands check
      const matchesBrands = selectedBrands.length === 0 || selectedBrands.some(brandQuery => {
        const normBrand = normalizeText(brandQuery);
        return normName.includes(normBrand) || normDescription.includes(normBrand);
      });
      
      // 4. Price range check
      const price = p.precio_venta;
      const matchesMinPrice = !minPrice || (price !== null && price >= parseFloat(minPrice));
      const matchesMaxPrice = !maxPrice || (price !== null && price <= parseFloat(maxPrice));
      
      // 5. Featured check
      const matchesFeatured = !onlyFeatured || p.destacado;
      
      return matchesSearch && matchesCategory && matchesBrands && matchesMinPrice && matchesMaxPrice && matchesFeatured;
    });
  }, [products, searchTerm, selectedCategory, selectedBrands, minPrice, maxPrice, onlyFeatured]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);



  const handleAddToCart = (product: Product, color?: string) => {
    trackEvent(product.id, 'add_to_cart');
    addItem(product, color);
    setSelectedProduct(null);
  };

  const handleViewProduct = (product: Product) => {
    trackEvent(product.id, 'view_product');
    setSelectedProduct(product);
  };

  const handleToggleBrand = (brandQuery: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandQuery)
        ? prev.filter(b => b !== brandQuery)
        : [...prev, brandQuery]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todas');
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
    setOnlyFeatured(false);
  };

  const handleQuickPriceRange = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  } as const;

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'Todas') count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (minPrice) count++;
    if (maxPrice) count++;
    if (onlyFeatured) count++;
    return count;
  }, [selectedCategory, selectedBrands, minPrice, maxPrice, onlyFeatured]);

  // Sidebar / Drawer filters template
  const FiltersContent = () => (
    <div className="space-y-6 bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">

      {/* Brands Section — PRIMERO */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-xs text-neutral-400 uppercase tracking-widest flex items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-primary" />
          <span>Marcas</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_BRANDS.map((brand) => {
            const isChecked = selectedBrands.includes(brand.query);
            return (
              <button
                key={brand.query}
                onClick={() => handleToggleBrand(brand.query)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border transition-all duration-200 shadow-sm ${
                  isChecked
                    ? 'bg-primary text-white border-primary shadow-primary/30 shadow-md scale-105'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary/50 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                {brand.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Section */}
      <div className="space-y-4 pt-5 border-t border-neutral-100">
        <h4 className="font-extrabold text-xs text-neutral-400 uppercase tracking-widest flex items-center gap-2">
          <span>Categorías</span>
        </h4>
        <div className="relative">
          <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar pb-6">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center justify-between text-left text-sm py-2 px-3 rounded-xl font-bold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary/5 text-primary'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <span>{cat}</span>
                {selectedCategory === cat && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
          {/* Fade indicator at bottom */}
          <div className="absolute bottom-0 left-0 right-2 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Featured Section */}
      <div className="space-y-4 pt-5 border-t border-neutral-100">
        <button
          onClick={() => setOnlyFeatured(prev => !prev)}
          className="flex items-center justify-between w-full text-left py-1"
        >
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-neutral-800">Solo Destacados</span>
            <span className="text-[10px] text-neutral-400 font-medium">Mostrar destacados del home</span>
          </div>
          <div className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 ${
            onlyFeatured ? 'bg-primary' : 'bg-neutral-200'
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-all duration-300 ${
              onlyFeatured ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </div>
        </button>
      </div>

      {/* Reset button */}
      <div className="pt-5 border-t border-neutral-100">
        <Button
          variant="outline"
          onClick={handleResetFilters}
          className="w-full text-xs font-bold rounded-xl py-2 border-neutral-200 text-neutral-500 hover:text-neutral-950 bg-white hover:bg-neutral-50 transition-all"
        >
          Limpiar todos los filtros
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-black text-primary uppercase tracking-[0.2em] block mb-2">Abastecimiento Integral</span>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
            Nuestro Catálogo
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-neutral-500 leading-relaxed">
            Explora nuestra amplia gama de productos de papelería, oficina y arte. Selecciona los productos que deseas y genera tu cotización al instante.
          </p>
        </motion.div>
      </header>


      {/* Dynamic Products Showcase & Filter Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Filter Sidebar (Desktop only) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 z-10 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 hide-scrollbar">
          <FiltersContent />
        </aside>

        {/* Right Column: Search bar, active tags & product grid */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* Top Panel: Search and Mobile Filter Trigger */}
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-neutral-50/50 p-4 sm:p-5 rounded-3xl border border-neutral-100/80 shadow-sm">
            <div className="relative w-full flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, descripción, marca..."
                className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Mobile Filters Toggle Button */}
            <Button
              variant="outline"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 h-12 px-6 rounded-2xl w-full sm:w-auto font-bold border-neutral-200 bg-white hover:bg-neutral-50"
            >
              <SlidersHorizontal className="h-5 w-5 text-neutral-500" />
              <span>Filtrar</span>
              {activeFiltersCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Active filter badges / chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400 mr-1">Filtros activos:</span>
              
              {/* Category chip */}
              {selectedCategory !== 'Todas' && (
                <div className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-xs font-bold px-3 py-1 rounded-full border border-neutral-200">
                  <span>Cat: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('Todas')} className="hover:text-primary">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Brand chips */}
              {selectedBrands.map((brandQuery) => {
                const brandObj = AVAILABLE_BRANDS.find(b => b.query === brandQuery);
                return (
                  <div key={brandQuery} className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-xs font-bold px-3 py-1 rounded-full border border-neutral-200">
                    <span>Marca: {brandObj?.name || brandQuery}</span>
                    <button onClick={() => handleToggleBrand(brandQuery)} className="hover:text-primary">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}

              {/* Price chips */}
              {(minPrice || maxPrice) && (
                <div className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-xs font-bold px-3 py-1 rounded-full border border-neutral-200">
                  <span>Precio: {minPrice ? `₡${minPrice}` : '₡0'} - {maxPrice ? `₡${maxPrice}` : 'Cualquier'}</span>
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="hover:text-primary">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Featured chip */}
              {onlyFeatured && (
                <div className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-xs font-bold px-3 py-1 rounded-full border border-neutral-200">
                  <span>Solo Destacados</span>
                  <button onClick={() => setOnlyFeatured(false)} className="hover:text-primary">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Reset all button */}
              <button 
                onClick={handleResetFilters}
                className="text-xs text-primary hover:underline font-bold ml-2 transition-all"
              >
                Limpiar todo
              </button>
            </div>
          )}

          {/* Catalog grid */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center w-full gap-4 mt-4"
                >
                  <div className="relative flex items-center justify-center h-12 w-12">
                    <div className="absolute h-12 w-12 rounded-full border-4 border-primary/10 animate-pulse" />
                    <div className="absolute h-12 w-12 rounded-full border-4 border-t-primary animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-neutral-800 text-lg">Cargando Catálogo...</h4>
                    <p className="text-xs text-neutral-400 font-medium">Buscando los mejores productos para ti</p>
                  </div>
                </motion.div>
              ) : filteredProducts.length > 0 ? (
                <>
                  <motion.div 
                    key="grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-3 mt-4"
                  >
                    {displayedProducts.map((product) => (
                      <motion.div key={product.id} variants={itemVariants} layout>
                        <ProductCard
                          product={product}
                          onViewDetail={handleViewProduct}
                          onAddToCart={(p) => handleAddToCart(p)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Load more button */}
                  {visibleCount < filteredProducts.length && (
                    <div className="h-16 w-full flex items-center justify-center mt-6">
                      <button
                        onClick={() => setVisibleCount((prev) => Math.min(prev + 20, filteredProducts.length))}
                        className="flex items-center gap-2 text-sm font-semibold text-primary bg-white px-6 py-2.5 rounded-full border border-primary/20 shadow-sm hover:bg-primary/5 hover:shadow-md transition-all duration-200"
                      >
                        Cargar más productos
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-neutral-200 rounded-[32px] bg-neutral-50/20 px-6 mt-4"
                >
                  <div className="mb-6 rounded-3xl bg-neutral-100 p-6 text-neutral-400">
                    <Search className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">No encontramos resultados</h3>
                  <p className="mt-2 text-neutral-500 max-w-sm text-sm">
                    Intenta cambiar los filtros seleccionados o buscar con otros términos.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6 rounded-xl font-bold"
                    onClick={handleResetFilters}
                  >
                    Limpiar todos los filtros
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Filter Sidebar */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/60"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-neutral-100 mb-6">
                <h3 className="font-black text-lg text-neutral-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                  <span>Filtros</span>
                </h3>
                <button 
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500 font-bold"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FiltersContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense 
      fallback = {
        <div className="mx-auto max-w-7xl px-4 py-32 text-center text-neutral-400">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            Cargando catálogo...
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
