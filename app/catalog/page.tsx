'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductDetail } from '@/components/catalog/ProductDetail';
import { Button } from '@/components/ui/Button';
import { Product, Category } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { getProducts } from '@/lib/api/products';

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { addItem } = useCart();

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (e) {
      console.error('Error loading catalog:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product, color?: string) => {
    addItem(product, color);
    setSelectedProduct(null);
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

      {/* Filters & Search */}
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 rounded-full px-6">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetail={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-neutral-100 p-6">
            <Search className="h-10 w-10 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900">No encontramos resultados</h3>
          <p className="mt-2 text-neutral-500">Intenta buscar con otros términos o filtros.</p>
        </div>
      )}

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
