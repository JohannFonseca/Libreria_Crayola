'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Building2, User } from 'lucide-react';
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

export default function CatalogPage() {
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getPublicProducts();
      setProducts(data || []);
    } catch (e) {
      console.error('Error loading catalog:', e);
    } finally {
      // Un pequeño delay artificial para que la transición no sea brusca
      setTimeout(() => setLoading(false), 400);
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
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Nuestro Catálogo
          </h1>
          <p className="max-w-2xl text-lg text-neutral-500">
            Explora nuestra amplia gama de productos de alta calidad para oficina y estudio.
          </p>
        </motion.div>
      </header>

      <AnimatePresence mode="wait">
        {!loading && searchTerm === '' && selectedCategory === 'Todas' && selectedClientType === 'todos' && featuredProducts.length > 0 && (
          <motion.div
            key="featured"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
      <div className="mb-12 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-sm focus:shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-neutral-100 rounded-full p-1 shrink-0 self-start md:self-auto shadow-inner">
            {(['todos', 'normal', 'empresa'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedClientType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedClientType === type 
                    ? 'bg-white shadow-md text-primary scale-105' 
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {type === 'normal' && <User className="w-4 h-4" />}
                {type === 'empresa' && <Building2 className="w-4 h-4" />}
                {type === 'todos' ? 'Todos' : type === 'normal' ? 'Normal' : 'Empresas'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Categories as filter chips */}
        {categoriesList.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <SlidersHorizontal className="h-4 w-4 mr-2 text-neutral-400 shrink-0" />
            {categoriesList.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'outline'}
                className={`rounded-full px-5 text-sm h-9 transition-all duration-300 shrink-0 ${
                  selectedCategory === cat ? 'scale-105 shadow-md shadow-primary/20' : 'hover:bg-neutral-50'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
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
            className="grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4 mt-8"
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
            className="grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4 mt-8"
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="mb-6 rounded-full bg-neutral-100 p-8">
              <Search className="h-12 w-12 text-neutral-400" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">No encontramos resultados</h3>
            <p className="mt-2 text-neutral-500 max-w-sm">
              Intenta buscar con otros términos o cambia los filtros aplicados.
            </p>
            <Button 
              variant="outline" 
              className="mt-8 rounded-full"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
                setSelectedClientType('todos');
              }}
            >
              Limpiar todos los filtros
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
