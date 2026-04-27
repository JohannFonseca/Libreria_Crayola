'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Eye } from 'lucide-react';
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
    <Card className="group overflow-hidden p-0 flex flex-col h-full border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      <div 
        className="relative aspect-square cursor-pointer overflow-hidden bg-white p-2"
        onClick={() => onViewDetail(product)}
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            Sin imagen
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
      </div>

      <CardContent className="p-3 sm:p-5 flex flex-col flex-1 bg-white">
        <div className="mb-2 flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1.5 py-0 uppercase tracking-wider">
            {product.categories?.name || 'Varios'}
          </Badge>
          {product.tipo_cliente === 'empresa' && (
            <Badge className="text-[9px] sm:text-[10px] px-1.5 py-0 uppercase tracking-wider bg-neutral-800 text-white">
              Empresa
            </Badge>
          )}
        </div>
        
        <h3 className="mb-1 text-sm sm:text-lg font-bold text-foreground line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[3.5rem]">
          {product.name}
        </h3>

        <div className="mt-auto pt-2">
          <div className="mb-3 font-extrabold text-base sm:text-xl text-primary">
            ₡{product.precio_venta?.toLocaleString() || '0'}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button 
              className="flex-1 gap-1.5 sm:gap-2 h-8 sm:h-10 text-[11px] sm:text-sm font-bold" 
              size="sm"
              onClick={() => onAddToCart(product)}
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Añadir</span>
              <span className="xs:hidden">Añadir</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="aspect-square p-0 h-8 sm:h-10 w-8 sm:w-10 border-neutral-200"
              onClick={() => onViewDetail(product)}
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
