import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle2, XCircle, Star, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/lib/types';

interface InventoryRowProps {
  product: Product;
  categories: any[];
  brands: any[];
  onUpdate: (id: string, updates: Partial<Product>) => Promise<void>;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function InventoryRow({ product, categories, brands = [], onUpdate, onEdit, onDelete }: InventoryRowProps) {
  const [isUpdating, setIsUpdating] = useState(false);


  const handleUpdate = async (updates: Partial<Product>) => {
    setIsUpdating(true);
    try {
      await onUpdate(product.id, updates);
    } finally {
      setIsUpdating(false);
    }
  };



  return (
    <tr className={`hover:bg-neutral-50 transition-colors group ${isUpdating ? 'opacity-50' : ''}`}>
      <td className="px-2.5 py-3 w-16">
        <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-200">
           {product.image_url ? (
             <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
           ) : (
             <ImageIcon className="h-4 w-4 text-neutral-400" />
           )}
        </div>
      </td>
      <td className="px-2.5 py-3 w-72">
        <div className="font-semibold text-neutral-900 truncate max-w-[260px]" title={product.name}>{product.name}</div>
        <div className="text-xs text-neutral-500 line-clamp-1 max-w-[260px]" title={product.description || ''}>{product.description}</div>
      </td>
      <td className="px-2.5 py-3 w-28">
        <div className="text-xs font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded inline-block truncate max-w-[90px]" title={product.barcode || ''}>
          {product.barcode || '—'}
        </div>
      </td>
      <td className="px-2.5 py-3 w-36">
        <select 
          className="bg-transparent border border-transparent hover:border-neutral-200 rounded px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs w-full max-w-[124px]"
          value={product.category_id || ''}
          onChange={(e) => handleUpdate({ category_id: e.target.value || null })}
        >
          <option value="">Sin categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </td>
      <td className="px-2.5 py-3 w-36">
        <select 
          className="bg-transparent border border-transparent hover:border-neutral-200 rounded px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs w-full max-w-[124px]"
          value={product.brand_id || ''}
          onChange={(e) => handleUpdate({ brand_id: e.target.value || null })}
        >
          <option value="">Sin marca</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </td>


      <td className="px-2.5 py-3 w-20 text-center">
        <button
          onClick={() => handleUpdate({ destacado: !product.destacado })}
          className={`p-1 rounded-full transition-colors ${product.destacado ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-neutral-400 hover:bg-neutral-100'}`}
          title={product.destacado ? 'Quitar destacado' : 'Hacer destacado'}
        >
          <Star className="h-4.5 w-4.5" fill={product.destacado ? "currentColor" : "none"} />
        </button>
      </td>
      <td className="px-2.5 py-3 w-24">
        <button 
          onClick={() => handleUpdate({ visible_en_web: !product.visible_en_web })}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${product.visible_en_web ? 'bg-green-500' : 'bg-neutral-300'}`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${product.visible_en_web ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
        </button>
      </td>
      <td className="px-2.5 py-3 text-right w-24">
        <div className="flex justify-end gap-0.5">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1.5 text-neutral-500 hover:text-primary hover:bg-neutral-100 transition-all rounded-lg"
            onClick={() => onEdit(product)}
            title="Editar producto"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1.5 text-red-500 hover:text-red-650 hover:bg-red-50 transition-all rounded-lg"
            onClick={() => onDelete(product.id)}
            title="Eliminar producto"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
