'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Building2, User } from 'lucide-react';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductDetail } from '@/components/catalog/ProductDetail';
import { FeaturedSection } from '@/components/catalog/FeaturedSection';
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

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getPublicProducts();
      setProducts(data || []);
    } catch (e) {
      console.error('Error loading catalog:', e);
    } finally {
      setLoading(false);
    }
  };

  const categoriesList = useMemo(() => {
    const cats = new Set(products.map(p => p.categories?.name).filter(Boolean));
    return ['Todas', ...Array.from(cats)] as string[];
  }, [products]);

  const featuredProducts = useMemo(() => {
    return products.filter(p => p.destacado);
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || p.categories?.name === selectedCategory;
    const matchesClient = selectedClientType === 'todos' || p.tipo_cliente === selectedClientType;
    return matchesSearch && matchesCategory && matchesClient;
  });

  const handleAddToCart = (product: Product, color?: string) => {
    trackEvent(product.id, 'add_to_cart');
    addItem(product, color);
    setSelectedProduct(null);
  };

  const handleViewProduct = (product: Product) => {
    trackEvent(product.id, 'view_product');
    setSelectedProduct(product);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Nuestro Catálogo
        </h1>
        <p className="max-w-2xl text-lg text-neutral-500">
          Explora nuestra amplia gama de productos de alta calidad para oficina y estudio.
        </p>
      </header>

      {/* Solo mostrar destacados si no hay búsquedas activas y hay productos destacados */}
      {!loading && searchTerm === '' && selectedCategory === 'Todas' && selectedClientType === 'todos' && (
        <FeaturedSection 
          products={featuredProducts} 
          onViewDetail={handleViewProduct}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Filters & Search */}
      <div className="mb-12 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-neutral-100 rounded-full p-1 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setSelectedClientType('todos')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedClientType === 'todos' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedClientType('normal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedClientType === 'normal' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <User className="w-4 h-4" /> Normal
            </button>
            <button
              onClick={() => setSelectedClientType('empresa')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedClientType === 'empresa' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <Building2 className="w-4 h-4" /> Empresas
            </button>
          </div>
        </div>
        
        {/* Categories as filter chips */}
        {categoriesList.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 mr-2 text-neutral-500" />
            {categoriesList.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'outline'}
                className="rounded-full px-4 text-sm h-8"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="h-full flex">
            <ProductCard
              product={product}
              onViewDetail={handleViewProduct}
              onAddToCart={(p) => handleAddToCart(p)}
            />
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
          <div className="mb-4 rounded-full bg-primary/10 p-6">
            <Search className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900">Cargando catálogo...</h3>
          <p className="mt-2 text-neutral-500">Preparando los mejores productos para ti.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-neutral-100 p-6">
            <Search className="h-10 w-10 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900">No encontramos resultados</h3>
          <p className="mt-2 text-neutral-500">Intenta buscar con otros términos o filtros.</p>
        </div>
      ) : null}

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
