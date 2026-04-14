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
    <Card className="group overflow-hidden p-0">
      <div 
        className="relative aspect-square cursor-pointer overflow-hidden bg-neutral-100"
        onClick={() => onViewDetail(product)}
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            Sin imagen
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
      </div>

      <CardContent className="p-4">
        <div className="mb-1">
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
            Categoría
          </Badge>
        </div>
        <h3 className="mb-1 text-lg font-semibold text-foreground">{product.name}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-neutral-500">
          {product.description}
        </p>

        <div className="flex items-center gap-2">
          <Button 
            className="flex-1 gap-2" 
            size="sm"
            onClick={() => onAddToCart(product)}
          >
            <Plus className="h-4 w-4" />
            Añadir
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="aspect-square p-0"
            onClick={() => onViewDetail(product)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
