'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { Search, SlidersHorizontal, Building2, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
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

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedClientType, setSelectedClientType] = useState<'todos' | 'normal' | 'empresa'>('todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Pre-select category if set in query parameters
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

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
    return products.filter(p => {
      const name = p.name || '';
      const description = p.description || '';
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || p.categories?.name === selectedCategory;
      const matchesClient = selectedClientType === 'todos' || !p.tipo_cliente || p.tipo_cliente === 'ambos' || p.tipo_cliente === selectedClientType;
      return matchesSearch && matchesCategory && matchesClient;
    });
  }, [products, searchTerm, selectedCategory, selectedClientType]);

  const handleAddToCart = (product: Product, color?: string) => {
    trackEvent(product.id, 'add_to_cart');
    addItem(product, color);
    setSelectedProduct(null);
  };

  const handleViewProduct = (product: Product) => {
    trackEvent(product.id, 'view_product');
    setSelectedProduct(product);
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

      <AnimatePresence mode="wait">
        {!loading && searchTerm === '' && selectedCategory === 'Todas' && selectedClientType === 'todos' && featuredProducts.length > 0 && (
          <motion.div
            key="featured"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <FeaturedSection 
              products={featuredProducts} 
              onViewDetail={handleViewProduct}
              onAddToCart={handleAddToCart}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="mb-12 flex flex-col gap-6 p-6 sm:p-8 bg-neutral-50/50 rounded-3xl border border-neutral-100/80 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, descripción, marca..."
              className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-neutral-200/60 rounded-2xl p-1 shrink-0 w-full md:w-auto shadow-inner">
            {(['todos', 'normal', 'empresa'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedClientType(type)}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                  selectedClientType === type 
                    ? 'bg-white shadow-sm text-primary scale-102' 
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {type === 'normal' && <User className="w-4 h-4" />}
                {type === 'empresa' && <Building2 className="w-4 h-4" />}
                {type === 'todos' ? 'Todos los Clientes' : type === 'normal' ? 'Normal' : 'Empresas'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Categories as filter chips */}
        {categoriesList.length > 1 && (
          <div className="flex items-center gap-2 pt-3 border-t border-neutral-200/50 overflow-x-auto pb-1 hide-scrollbar">
            <div className="flex items-center gap-1.5 text-neutral-400 shrink-0 mr-2 text-xs font-bold uppercase tracking-wider">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Categorías:</span>
            </div>
            <div className="flex gap-2 shrink-0">
              {categoriesList.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'primary' : 'outline'}
                  className={`rounded-xl px-4 text-xs h-9 transition-all duration-300 font-bold shrink-0 ${
                    selectedCategory === cat 
                      ? 'scale-102 shadow-md shadow-primary/10' 
                      : 'bg-white hover:bg-neutral-100 hover:text-neutral-800 border-neutral-200'
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4 mt-8"
          >
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </motion.div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4 mt-8"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants} layout>
                <ProductCard
                  product={product}
                  onViewDetail={handleViewProduct}
                  onAddToCart={(p) => handleAddToCart(p)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="mb-6 rounded-3xl bg-neutral-100 p-6 text-neutral-400">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">No encontramos resultados</h3>
            <p className="mt-2 text-neutral-500 max-w-sm text-sm">
              Intenta buscar con otros términos o cambia los filtros seleccionados.
            </p>
            <Button 
              variant="outline" 
              className="mt-6 rounded-xl font-bold"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
                setSelectedClientType('todos');
              }}
            >
              Limpiar filtros
            </Button>
          </motion.div>
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
      fallback={
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

