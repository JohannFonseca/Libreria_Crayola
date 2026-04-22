'use client';

import React from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Product } from '@/lib/types';
import { uploadImage } from '@/lib/api/storage';
import { createProduct, updateProduct } from '@/lib/api/products';

interface ProductModalProps {
  product?: Product;
  categories: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductModal = ({ product, categories, onClose, onSuccess }: ProductModalProps) => {
  const [name, setName] = React.useState(product?.name || '');
  const [description, setDescription] = React.useState(product?.description || '');
  const [categoryId, setCategoryId] = React.useState(product?.category_id || '');
  const [precioVenta, setPrecioVenta] = React.useState(product?.precio_venta?.toString() || '');
  const [tipoCliente, setTipoCliente] = React.useState<'normal' | 'empresa' | 'ambos'>(product?.tipo_cliente || 'ambos');
  const [visible, setVisible] = React.useState(product?.visible_en_web || false);
  const [destacado, setDestacado] = React.useState(product?.destacado || false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState(product?.image_url || '');
  const [loading, setLoading] = React.useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product?.image_url || '';

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productData = {
        name,
        description,
        category_id: categoryId || null,
        image_url: imageUrl,
        precio_venta: precioVenta ? parseFloat(precioVenta) : null,
        tipo_cliente: tipoCliente,
        visible_en_web: visible,
        destacado: destacado,
      };

      if (product) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto. Asegúrate de que el bucket "products" exista en Supabase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-4xl p-0 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Nombre del Producto</label>
                  <input
                    required
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2 focus:border-primary focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <select
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2 focus:border-primary focus:outline-none bg-white"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">Sin categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Cliente (Opcional)</label>
                  <select
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2 focus:border-primary focus:outline-none bg-white"
                    value={tipoCliente}
                    onChange={(e) => setTipoCliente(e.target.value as 'normal' | 'empresa' | 'ambos')}
                  >
                    <option value="ambos">Ambos (Público General)</option>
                    <option value="normal">Solo Normal</option>
                    <option value="empresa">Solo Empresa</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Precio de Venta (₡)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2 focus:border-primary focus:outline-none"
                    placeholder="Ej. 1500 (Opcional)"
                    value={precioVenta}
                    onChange={(e) => setPrecioVenta(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 focus:border-primary focus:outline-none min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Imagen del Producto</label>
                <div 
                  className="relative aspect-square rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center overflow-hidden hover:border-primary transition-colors cursor-pointer bg-neutral-50"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-neutral-300 mb-2" />
                      <span className="text-sm text-neutral-400">Click para subir</span>
                    </>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4">
                <h3 className="font-medium text-sm text-neutral-900 border-b pb-2">Opciones del Catálogo</h3>
                
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">Visible en Web</div>
                    <div className="text-xs text-neutral-500">Aparecerá en el sitio público</div>
                  </div>
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${visible ? 'bg-green-500' : 'bg-neutral-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${visible ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                  <input type="checkbox" className="hidden" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">Producto Destacado</div>
                    <div className="text-xs text-neutral-500">Mostrar en sección principal</div>
                  </div>
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${destacado ? 'bg-primary' : 'bg-neutral-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${destacado ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                  <input type="checkbox" className="hidden" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t font-semibold sticky bottom-0 bg-white shadow-[0_-10px_10px_-10px_rgba(0,0,0,0.05)]">
            <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2 min-w-[120px]">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {product ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
