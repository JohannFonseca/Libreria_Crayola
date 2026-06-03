'use client';

import React from 'react';
import Image from 'next/image';
import { X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/lib/types';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, color?: string) => void;
}

export const ProductDetail = ({ product, onClose, onAddToCart }: ProductDetailProps) => {
  const [selectedColor, setSelectedColor] = React.useState<string | undefined>(
    product.colors?.[0]?.color_name
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in duration-300 border border-neutral-100">
        <button 
          className="absolute right-6 top-6 z-10 rounded-full bg-neutral-100/80 p-2.5 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 transition-all shadow-sm"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="relative aspect-square w-full bg-neutral-50/50 md:w-1/2 flex items-center justify-center p-8">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-8"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-300 font-bold">
                Sin imagen
              </div>
            )}
          </div>

          <div className="flex w-full flex-col p-8 md:w-1/2">
            <div className="mb-6">
              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge variant="secondary" className="bg-primary/5 text-primary border-none rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {product.categories?.name || 'Varios'}
                </Badge>
                {product.tipo_cliente === 'empresa' && (
                  <Badge className="bg-neutral-900 text-white border-none rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                    Empresa
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 leading-tight mb-2">
                {product.name}
              </h2>
            </div>

            <div className="mb-8 overflow-y-auto max-h-[220px] text-neutral-500 text-sm leading-relaxed pr-2">
              <p>{product.description || 'Este producto no cuenta con una descripción detallada en este momento.'}</p>
            </div>


            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Colores Disponibles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
                        selectedColor === color.color_name
                          ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:scale-102'
                      }`}
                      onClick={() => setSelectedColor(color.color_name)}
                    >
                      {color.color_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto">
              <Button 
                className="w-full gap-3 py-5 text-base font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]" 
                onClick={() => onAddToCart(product, selectedColor)}
              >
                <ShoppingCart className="h-5 w-5" />
                Agregar a la cotización
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
