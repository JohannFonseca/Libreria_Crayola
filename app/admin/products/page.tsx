'use client';

import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Product } from '@/lib/types';
import { getAllProductsAdmin, deleteProduct, updateProductInline } from '@/lib/api/products';
import { ProductModal } from '@/components/admin/ProductModal';
import { InventoryRow } from '@/components/admin/InventoryRow';
import { supabase } from '@/lib/supabaseClient';

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'todos' | 'visibles' | 'ocultos'>('todos');
  const [clientFilter, setClientFilter] = React.useState<'todos' | 'normal' | 'empresa'>('todos');
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
      const data = await getAllProductsAdmin();
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

  const handleInlineUpdate = async (id: string, updates: Partial<Product>) => {
    try {
      const updated = await updateProductInline(id, updates);
      setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (e) {
      console.error('Error updating product inline', e);
      alert('Error al actualizar el producto');
      // Revert if error
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'visibles') matchesStatus = p.visible_en_web === true;
    if (statusFilter === 'ocultos') matchesStatus = p.visible_en_web === false;

    let matchesClient = true;
    if (clientFilter !== 'todos') matchesClient = p.tipo_cliente === clientFilter;

    return matchesSearch && matchesStatus && matchesClient;
  });

  const visiblesCount = products.filter(p => p.visible_en_web).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario de Productos</h1>
          <p className="text-neutral-500 mt-1">Activa y configura qué productos se muestran en el catálogo público.</p>
        </div>
        <Button 
          className="gap-2 rounded-xl h-11 px-6 shadow-sm"
          onClick={() => {
            setEditingProduct(undefined);
            setShowModal(true);
          }}
        >
          <Plus className="h-5 w-5" />
          Nuevo Producto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-neutral-200">
          <div className="text-sm font-medium text-neutral-500 mb-1">Total en Inventario</div>
          <div className="text-3xl font-bold">{products.length}</div>
        </Card>
        <Card className="p-6 border-neutral-200 bg-green-50/50 border-green-100">
          <div className="text-sm font-medium text-green-600 mb-1">Visibles en Web</div>
          <div className="text-3xl font-bold text-green-700">{visiblesCount}</div>
        </Card>
        <Card className="p-6 border-neutral-200">
          <div className="text-sm font-medium text-neutral-500 mb-1">Ocultos</div>
          <div className="text-3xl font-bold text-neutral-700">{products.length - visiblesCount}</div>
        </Card>
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSuccess={fetchProducts}
        />
      )}

      <Card className="p-0 border-neutral-200 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-neutral-200 bg-white flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-3 flex-wrap">
            <select
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none min-w-[140px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="todos">Todos los estados</option>
              <option value="visibles">🔴 Visibles en Web</option>
              <option value="ocultos">⚪ Ocultos</option>
            </select>

            <select
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none min-w-[140px]"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value as any)}
            >
              <option value="todos">Cualquier Cliente</option>
              <option value="normal">👤 Normal</option>
              <option value="empresa">🏢 Empresa</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-500">
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider w-20">Img</th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider w-40">Categoría</th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider w-36">Audiencia</th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider w-36">Precio (₡)</th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider w-24">Destacar</th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider w-32">Web</th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-right w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-32 text-center text-neutral-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                      Cargando inventario...
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-32 text-center text-neutral-400">
                    No se encontraron productos con estos filtros.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <InventoryRow
                    key={product.id}
                    product={product}
                    categories={categories}
                    onUpdate={handleInlineUpdate}
                    onEdit={(p) => {
                      setEditingProduct(p);
                      setShowModal(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
