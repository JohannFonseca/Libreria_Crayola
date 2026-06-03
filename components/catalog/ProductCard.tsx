'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Eye, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetail, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden p-0 flex flex-col h-full border border-neutral-100 bg-white custom-shadow-hover rounded-3xl">
      <div 
        className="relative w-full aspect-square cursor-pointer overflow-hidden bg-neutral-50/50 p-4 flex-shrink-0"
        onClick={() => onViewDetail(product)}
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-108"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-300 font-medium text-sm">
            Sin imagen
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-primary/5" />
        
        {product.destacado && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm border-none">
              Destacado
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
        <div className="mb-2.5 flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider bg-neutral-100 text-neutral-600 border-none rounded-md">
            {product.categories?.name || 'Varios'}
          </Badge>
          {product.tipo_cliente === 'empresa' && (
            <Badge className="text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider bg-neutral-900 text-white border-none rounded-md">
              🏢 Empresa
            </Badge>
          )}
        </div>
        
        <h3 
          className="mb-1.5 text-sm sm:text-base font-bold text-neutral-800 line-clamp-2 leading-snug min-h-[2.5rem] cursor-pointer hover:text-primary transition-colors"
          onClick={() => onViewDetail(product)}
        >
          {product.name}
        </h3>

        <div className="mb-3 text-xs text-neutral-400 line-clamp-2 min-h-[2rem]">
          {product.description || 'Sin descripción adicional.'}
        </div>

        <div className="mt-auto pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <Button 
              className="flex-1 gap-1.5 h-9 sm:h-10 text-xs font-bold rounded-xl bg-primary text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shadow-primary/10" 
              size="sm"
              onClick={() => onAddToCart(product)}
            >
              <Plus className="h-4 w-4" />
              <span>Añadir</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="aspect-square p-0 h-9 sm:h-10 w-9 sm:w-10 border-neutral-200 rounded-xl hover:bg-neutral-50 hover:text-primary active:scale-[0.98] transition-all"
              onClick={() => onViewDetail(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

