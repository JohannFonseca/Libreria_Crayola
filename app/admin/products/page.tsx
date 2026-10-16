'use client';

import React from 'react';
import { Plus, Search, Trash2, AlertTriangle } from 'lucide-react';
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
  const [brands, setBrands] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [dbTotal, setDbTotal] = React.useState(0);
  const [dbVisibles, setDbVisibles] = React.useState(0);
  const [emptyHiddenCount, setEmptyHiddenCount] = React.useState(0);
  const [isCleaning, setIsCleaning] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'todos' | 'visibles' | 'ocultos'>('todos');
  const [brandFilter, setBrandFilter] = React.useState<string>('todas');
  const [showModal, setShowModal] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | undefined>(undefined);
  
  const PAGE_SIZE = 200;

  React.useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchAbsoluteTotals();
  }, []);

  const fetchAbsoluteTotals = async () => {
    const { count: total } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: visibles } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('visible_en_web', true);
    const { count: emptyHidden } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('visible_en_web', false).is('image_url', null);
    setDbTotal(total || 0);
    setDbVisibles(visibles || 0);
    setEmptyHiddenCount(emptyHidden || 0);
  };

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, brandFilter]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  };

  const fetchBrands = async () => {
    const { data } = await supabase.from('brands').select('*').order('name');
    setBrands(data || []);
  };

  const fetchProducts = async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const from = isLoadMore ? products.length : 0;
      const to = from + PAGE_SIZE - 1;

      const { products: newProducts, count } = await getAllProductsAdmin(from, to, {
        searchTerm,
        status: statusFilter,
        brandId: brandFilter
      });
      
      if (isLoadMore) {
        setProducts([...products, ...newProducts]);
      } else {
        setProducts(newProducts);
      }
      setTotalCount(count);
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
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

  const handleCleanEmptyProducts = async () => {
    const confirmDelete = window.confirm(
      `¿Deseas eliminar permanentemente los ${emptyHiddenCount} productos inactivos sin fotos de la base de datos?\n\n` +
      `• Se eliminarán únicamente los productos ocultos sin imagen que no se usan en la tienda web.\n` +
      `• Los ${dbVisibles} productos con fotos activos en el catálogo permanecerán 100% intactos.\n\n` +
      `Esta acción aligerará significativamente la base de datos de la librería.`
    );
    if (!confirmDelete) return;

    setIsCleaning(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('visible_en_web', false)
        .is('image_url', null);

      if (error) throw error;
      alert(`¡Limpieza completada con éxito! Se aligeró la base de datos.`);
      await fetchAbsoluteTotals();
      await fetchProducts();
    } catch (err: any) {
      console.error('Error al depurar productos:', err);
      alert('Error al depurar la base de datos: ' + (err.message || 'Verifica tus permisos de administrador'));
    } finally {
      setIsCleaning(false);
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

  // Con búsqueda en servidor, usamos directamente la lista de productos
  const filteredProducts = products;

  const visiblesCount = products.filter(p => p.visible_en_web).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario de Productos</h1>
          <p className="text-neutral-500 mt-1">Activa y configura qué productos se muestran en el catálogo público.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
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
          <span className="text-[11px] text-amber-800 font-bold bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
            ⚠️ Límite de fotos alcanzado
          </span>
        </div>
      </div>

      {emptyHiddenCount > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-red-950 flex items-center gap-2">
                <span>Aligerar Base de Datos ({emptyHiddenCount} productos inactivos sin fotos)</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-200 text-red-800">
                  Ocupa espacio
                </span>
              </h4>
              <p className="text-xs text-red-700 mt-1 leading-relaxed max-w-3xl">
                Se detectaron {emptyHiddenCount} productos ocultos que no tienen fotos ni se muestran en el catálogo web (son registros antiguos que hacen pesada la base de datos). Puedes eliminarlos de forma segura: tus {dbVisibles} productos con fotos permanecerán intactos.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={isCleaning}
            onClick={handleCleanEmptyProducts}
            className="border-red-300 bg-white hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl h-10 px-5 whitespace-nowrap self-end md:self-center shadow-xs transition-all"
          >
            {isCleaning ? 'Eliminando registros...' : `Eliminar ${emptyHiddenCount} productos inactivos`}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-neutral-200">
          <div className="text-sm font-medium text-neutral-500 mb-1">Total en Inventario</div>
          <div className="text-3xl font-bold">{dbTotal}</div>
        </Card>
        <Card className="p-6 border-neutral-200 bg-green-50/50 border-green-100">
          <div className="text-sm font-medium text-green-600 mb-1">Visibles en Web</div>
          <div className="text-3xl font-bold text-green-700">{dbVisibles}</div>
        </Card>
        <Card className="p-6 border-neutral-200">
          <div className="text-sm font-medium text-neutral-500 mb-1">Ocultos</div>
          <div className="text-3xl font-bold text-neutral-700">{dbTotal - dbVisibles}</div>
        </Card>
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          brands={brands}
          onClose={() => setShowModal(false)}
          onSuccess={fetchProducts}
        />
      )}

      <Card hover={false} className="p-0 border-neutral-200 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-neutral-200 bg-white flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <span className="text-sm text-neutral-500">
                Encontrados: <span className="font-bold text-primary">{totalCount}</span>
              </span>
            )}
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
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none min-w-[140px] bg-white"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              <option value="todas">Todas las marcas</option>
              <option value="sin_marca">Sin marca asignada</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-500">
                <th className="px-2.5 py-3 text-xs font-semibold uppercase tracking-wider w-16">Img</th>
                <th className="px-2.5 py-3 text-xs font-semibold uppercase tracking-wider w-72">Producto</th>
                <th className="px-2.5 py-3 text-xs font-semibold uppercase tracking-wider w-28">Código</th>
                <th className="px-2.5 py-3 text-xs font-semibold uppercase tracking-wider w-36">Categoría</th>
                <th className="px-2.5 py-3 text-xs font-semibold uppercase tracking-wider w-36">Marca</th>

                <th className="px-2.5 py-3 text-xs font-semibold uppercase tracking-wider text-center w-20">Destacar</th>
                <th className="px-2.5 py-3 text-xs font-semibold uppercase tracking-wider w-24">Web</th>
                <th className="px-2.5 py-3 text-xs font-semibold uppercase tracking-wider text-right w-24">Acciones</th>
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
                    brands={brands}
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

        {products.length < totalCount && (
          <div className="p-8 border-t border-neutral-100 bg-neutral-50/30 flex flex-col items-center gap-4">
            <p className="text-sm text-neutral-500">
              Mostrando {products.length} de {totalCount} productos
            </p>
            <Button 
              variant="outline" 
              onClick={() => fetchProducts(true)}
              disabled={loadingMore}
              className="px-10 h-11 rounded-xl bg-white"
            >
              {loadingMore ? 'Cargando...' : 'Cargar 200 más'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
