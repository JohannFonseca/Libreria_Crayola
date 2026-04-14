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
      <Card className="w-full max-w-2xl p-0 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
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
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 focus:border-primary focus:outline-none min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium">Imagen del Producto</label>
              <div 
                className="relative aspect-square rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center overflow-hidden hover:border-primary transition-colors cursor-pointer"
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
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t font-semibold">
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
