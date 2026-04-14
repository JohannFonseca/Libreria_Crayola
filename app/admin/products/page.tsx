'use client';

import React from 'react';
import { Plus, Search, Edit2, Trash2, MoreVertical, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/lib/types';
import { getProducts, deleteProduct } from '@/lib/api/products';
import { ProductModal } from '@/components/admin/ProductModal';
import { supabase } from '@/lib/supabaseClient';

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | undefined>(undefined);

  React.useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (e) {
      alert('Error eliminando producto');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
          <p className="text-neutral-500">Crea, edita y elimina productos de tu catálogo público.</p>
        </div>
        <Button 
          className="gap-2 rounded-xl"
          onClick={() => {
            setEditingProduct(undefined);
            setShowModal(true);
          }}
        >
          <Plus className="h-5 w-5" />
          Nuevo Producto
        </Button>
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSuccess={fetchProducts}
        />
      )}

      <Card className="p-0 border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200 bg-neutral-50/50 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-12 pr-4 text-sm focus:border-primary focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/30">
                <th className="px-6 py-4 text-sm font-semibold text-neutral-600">Imagen</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-600">Nombre</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-600">Categoría</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-600">Fecha</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-600 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-neutral-400">
                    Cargando productos...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-neutral-400">
                    No hay productos todavía.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 rounded-lg bg-neutral-100 overflow-hidden relative">
                         {product.image_url && <img src={product.image_url} className="h-full w-full object-cover" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-900">{product.name}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{(product as any).categories?.name || 'Sin categoría'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            setEditingProduct(product);
                            setShowModal(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
