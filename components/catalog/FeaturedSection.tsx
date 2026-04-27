'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/types';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedSectionProps {
  products: Product[];
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product, color?: string) => void;
}

export const FeaturedSection = ({ products, onViewDetail, onAddToCart }: FeaturedSectionProps) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Productos Destacados</h2>
        </div>
        
        {products.length > 3 && (
          <div className="flex gap-2">
            <button 
              onClick={scrollLeft}
              className="p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors shadow-sm"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5 text-neutral-600" />
            </button>
            <button 
              onClick={scrollRight}
              className="p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors shadow-sm"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5 text-neutral-600" />
            </button>
          </div>
        )}
      </div>

      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory hide-scrollbar"
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] sm:min-w-[320px] max-w-[350px] snap-start shrink-0">
              <ProductCard
                product={product}
                onViewDetail={onViewDetail}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Scrollbar hide utility is needed in globals.css */}
    </div>
  );
};
