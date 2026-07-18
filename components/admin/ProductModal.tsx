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
  brands: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductModal = ({ product, categories, brands = [], onClose, onSuccess }: ProductModalProps) => {
  const [name, setName] = React.useState(product?.name || '');
  const [description, setDescription] = React.useState(product?.description || '');
  const [categoryId, setCategoryId] = React.useState(product?.category_id || '');
  const [brandId, setBrandId] = React.useState(product?.brand_id || '');
  const [precioVenta, setPrecioVenta] = React.useState(product?.precio_venta?.toString() || '');
  const [visible, setVisible] = React.useState(product?.visible_en_web || false);
  const [destacado, setDestacado] = React.useState(product?.destacado || false);
  const [barcode, setBarcode] = React.useState(product?.barcode || '');
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
        brand_id: brandId || null,
        image_url: imageUrl,
        precio_venta: precioVenta ? parseFloat(precioVenta) : null,
        tipo_cliente: 'ambos',
        visible_en_web: visible,
        destacado: destacado,
        barcode: barcode || null,
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
      <Card className="w-full max-w-5xl p-0 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b bg-white">
          <h2 className="text-lg font-bold text-neutral-800">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={onClose} disabled={loading}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSave} className="p-5 flex-1 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Nombre del Producto</label>
                <input
                  required
                  placeholder="Ej. Lápiz Mongol #2"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm focus:border-primary focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Categoría</label>
                <select
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm focus:border-primary focus:outline-none bg-white"
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
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Marca (Opcional)</label>
                <select
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm focus:border-primary focus:outline-none bg-white"
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                >
                  <option value="">Sin marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Precio de Venta (₡)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej. 1500"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm focus:border-primary focus:outline-none"
                  value={precioVenta}
                  onChange={(e) => setPrecioVenta(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Código de Barras (Opcional)</label>
                <input
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="Ej. 7702111..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Descripción</label>
                <textarea
                  placeholder="Detalles o especificaciones del producto..."
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm focus:border-primary focus:outline-none min-h-[82px] max-h-[82px] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Imagen del Producto</label>
                <div className="flex items-center gap-3.5 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                  <div className="h-14 w-14 rounded-lg border border-neutral-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                    {imagePreview ? (
                      <img src={imagePreview} className="h-full w-full object-contain" />
                    ) : (
                      <Upload className="h-5 w-5 text-neutral-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-lg px-2.5 h-8 py-1 font-bold border-neutral-300 bg-white hover:bg-neutral-100"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      {imagePreview ? 'Cambiar' : 'Subir'}
                    </Button>
                    <p className="text-[9px] text-neutral-400 mt-0.5">Tamaño máx. 2MB</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <div className="text-xs font-semibold text-neutral-800">Visible en Web</div>
                    <div className="text-[9px] text-neutral-400">Mostrar públicamente</div>
                  </div>
                  <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${visible ? 'bg-green-500' : 'bg-neutral-300'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${visible ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <input type="checkbox" className="hidden" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <div className="text-xs font-semibold text-neutral-800">Destacado</div>
                    <div className="text-[9px] text-neutral-400">Mostrar en el home</div>
                  </div>
                  <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${destacado ? 'bg-primary' : 'bg-neutral-300'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${destacado ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <input type="checkbox" className="hidden" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} />
                </label>
              </div>
            </div>
            
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t font-semibold bg-white">
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
