'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Eye, Sparkles, Check, Building2, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/lib/types';
import { formatCRC } from '@/lib/formatters';

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetail, onAddToCart }: ProductCardProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const hasPrice = product.precio_venta !== null && product.precio_venta !== undefined && product.precio_venta > 0;

  return (
    <Card className="group relative overflow-hidden p-0 flex flex-col h-full border border-neutral-200/80 hover:border-primary/40 bg-white rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      {/* Image Container with Badges & Hover Overlay */}
      <div 
        className="relative w-full aspect-square cursor-pointer overflow-hidden bg-neutral-50/60 p-4 flex-shrink-0 flex items-center justify-center"
        onClick={() => onViewDetail(product)}
      >
        {product.image_url && !imageError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-108"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-300 gap-1 p-4 text-center">
            <ShoppingBag className="h-8 w-8 text-neutral-200" />
            <span className="text-[11px] font-semibold text-neutral-400">Librería Crayola</span>
          </div>
        )}

        {/* Soft gradient hover tint */}
        <div className="absolute inset-0 bg-neutral-900/0 transition-colors duration-300 group-hover:bg-neutral-900/5 pointer-events-none" />
        
        {/* Top Badges: Left = Status, Right = Brand Logo */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-1 pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {product.destacado && (
              <Badge className="bg-amber-500 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs border-none">
                Destacado
              </Badge>
            )}
            {product.tipo_cliente === 'empresa' && (
              <Badge className="bg-neutral-900 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs border-none">
                Empresa
              </Badge>
            )}
          </div>

          {/* Brand Logo / Tag */}
          {product.brands?.logo_url ? (
            <div className="h-7 max-w-[85px] px-2 py-0.5 rounded-xl bg-white/95 border border-neutral-200/80 shadow-xs flex items-center justify-center">
              <img 
                src={product.brands.logo_url} 
                alt={product.brands.name} 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : product.brands?.name ? (
            <span 
              className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border shadow-xs bg-white/95"
              style={{
                color: product.brands.color || '#374151',
                borderColor: product.brands.color ? `${product.brands.color}35` : '#e5e7eb',
              }}
            >
              {product.brands.name}
            </span>
          ) : null}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-neutral-800 font-bold text-xs shadow-lg backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 border border-neutral-100">
            <Eye className="h-3.5 w-3.5 text-primary" />
            Vista Rápida
          </span>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
        {/* Category Pill */}
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            {product.categories?.name || 'Varios'}
          </span>
        </div>
        
        {/* Title */}
        <h3 
          className="mb-1 text-sm sm:text-base font-bold text-neutral-900 line-clamp-2 leading-snug min-h-[2.5rem] cursor-pointer hover:text-primary transition-colors"
          onClick={() => onViewDetail(product)}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="mb-3 text-xs text-neutral-400 line-clamp-1">
          {product.description || 'Suministro de calidad para oficina y hogar.'}
        </p>

        {/* Price Tag Section */}
        <div className="mt-auto pt-3 border-t border-neutral-100">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 leading-none">
                {hasPrice ? 'Precio venta' : 'Cotización'}
              </span>
              <span className="text-base sm:text-lg font-black text-neutral-950 tracking-tight leading-none mt-1">
                {formatCRC(product.precio_venta)}
              </span>
            </div>
            {hasPrice && (
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md font-bold">
                IVA incl.
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              className={`flex-1 gap-1.5 h-10 text-xs font-bold rounded-xl transition-all shadow-sm ${
                isAdded 
                  ? 'bg-emerald-600 hover:bg-emerald-600 text-white shadow-emerald-500/20 scale-[0.98]'
                  : 'bg-primary hover:bg-primary/95 text-white hover:scale-[1.02] active:scale-[0.98] shadow-primary/20'
              }`}
              size="sm"
              onClick={handleAdd}
            >
              {isAdded ? (
                <>
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>¡Agregado!</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>Añadir</span>
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="aspect-square p-0 h-10 w-10 border-neutral-200 rounded-xl hover:bg-neutral-50 hover:text-primary active:scale-[0.98] transition-all"
              onClick={() => onViewDetail(product)}
              title="Ver detalles"
              aria-label="Ver detalles del producto"
            >
              <Eye className="h-4 w-4 text-neutral-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
