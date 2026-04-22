import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle2, XCircle, Star, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/lib/types';

interface InventoryRowProps {
  product: Product;
  categories: any[];
  onUpdate: (id: string, updates: Partial<Product>) => Promise<void>;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function InventoryRow({ product, categories, onUpdate, onEdit, onDelete }: InventoryRowProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localPrice, setLocalPrice] = useState(product.precio_venta?.toString() || '');
  const [priceEditing, setPriceEditing] = useState(false);

  const handleUpdate = async (updates: Partial<Product>) => {
    setIsUpdating(true);
    try {
      await onUpdate(product.id, updates);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriceSave = (e?: React.FocusEvent | React.KeyboardEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    setPriceEditing(false);
    
    const numPrice = parseFloat(localPrice);
    if (!isNaN(numPrice) && numPrice !== product.precio_venta) {
      handleUpdate({ precio_venta: numPrice });
    } else if (localPrice === '' && product.precio_venta !== null) {
      handleUpdate({ precio_venta: null });
    }
  };

  return (
    <tr className={`hover:bg-neutral-50 transition-colors group ${isUpdating ? 'opacity-50' : ''}`}>
      <td className="px-6 py-4">
        <div className="h-12 w-12 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-200">
           {product.image_url ? (
             <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
           ) : (
             <ImageIcon className="h-5 w-5 text-neutral-400" />
           )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-neutral-900">{product.name}</div>
        <div className="text-xs text-neutral-500 line-clamp-1 max-w-[200px]">{product.description}</div>
      </td>
      <td className="px-6 py-4">
        <select 
          className="bg-transparent border border-transparent hover:border-neutral-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm w-full max-w-[150px]"
          value={product.category_id || ''}
          onChange={(e) => handleUpdate({ category_id: e.target.value })}
        >
          <option value="">Sin categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4">
        <select 
          className="bg-transparent border border-transparent hover:border-neutral-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          value={product.tipo_cliente || 'normal'}
          onChange={(e) => handleUpdate({ tipo_cliente: e.target.value as 'normal' | 'empresa' })}
        >
          <option value="normal">Normal</option>
          <option value="empresa">Empresa</option>
        </select>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-neutral-500">₡</span>
          {priceEditing ? (
            <input
              autoFocus
              type="number"
              className="w-24 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={localPrice}
              onChange={(e) => setLocalPrice(e.target.value)}
              onBlur={handlePriceSave}
              onKeyDown={handlePriceSave}
            />
          ) : (
            <div 
              className={`w-24 px-2 py-1 rounded border border-transparent hover:border-neutral-200 cursor-text text-sm ${!product.precio_venta ? 'text-red-400 italic' : ''}`}
              onClick={() => setPriceEditing(true)}
            >
              {product.precio_venta ? product.precio_venta.toLocaleString() : 'Sin precio'}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => handleUpdate({ destacado: !product.destacado })}
          className={`p-1.5 rounded-full transition-colors ${product.destacado ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-neutral-400 hover:bg-neutral-100'}`}
          title={product.destacado ? 'Quitar destacado' : 'Hacer destacado'}
        >
          <Star className="h-5 w-5" fill={product.destacado ? "currentColor" : "none"} />
        </button>
      </td>
      <td className="px-6 py-4">
        <button 
          onClick={() => handleUpdate({ visible_en_web: !product.visible_en_web })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${product.visible_en_web ? 'bg-green-500' : 'bg-neutral-300'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.visible_en_web ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onEdit(product)}
            title="Editar producto"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(product.id)}
            title="Eliminar producto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
