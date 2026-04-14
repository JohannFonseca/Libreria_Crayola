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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          className="absolute right-6 top-6 z-10 rounded-full bg-neutral-100 p-2 text-neutral-500 hover:bg-neutral-200"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="relative aspect-square w-full bg-neutral-100 md:w-1/2">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-400">
                Sin imagen
              </div>
            )}
          </div>

          <div className="flex w-full flex-col p-8 md:w-1/2">
            <div className="mb-4">
              <Badge variant="primary" className="mb-2">Producto</Badge>
              <h2 className="text-3xl font-bold tracking-tight">{product.name}</h2>
            </div>

            <div className="mb-8 overflow-y-auto max-h-[200px] text-neutral-600">
              <p>{product.description}</p>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                  Colores Disponibles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        selectedColor === color.color_name
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
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
                className="w-full gap-3 py-6 text-lg" 
                onClick={() => onAddToCart(product, selectedColor)}
              >
                <ShoppingCart className="h-6 w-6" />
                Agregar a la cotización
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
