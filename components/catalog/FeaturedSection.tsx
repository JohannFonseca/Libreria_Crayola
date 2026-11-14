'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/types';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface FeaturedSectionProps {
  products: Product[];
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  title?: string;
  subtitle?: string;
  showAllLink?: boolean;
}

export const FeaturedSection = ({ 
  products, 
  onViewDetail, 
  onAddToCart,
  title = "Productos Destacados",
  subtitle = "Selección curada de artículos premium listos para entrega o retiro inmediato en Guanacaste",
  showAllLink = true
}: FeaturedSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-14 sm:mb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            {title}
          </h2>
          <p className="text-sm text-neutral-500 mt-1 max-w-xl font-medium">
            {subtitle}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {showAllLink && (
            <Link 
              href="/catalog" 
              className="text-primary hover:text-primary/80 font-bold text-xs sm:text-sm flex items-center gap-1 transition-colors group mr-2"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}

          {products.length > 3 && (
            <div className="flex gap-1.5">
              <button 
                onClick={scrollLeft}
                className="h-10 w-10 flex items-center justify-center rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-600 transition-all shadow-xs active:scale-95"
                aria-label="Desplazar a la izquierda"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={scrollRight}
                className="h-10 w-10 flex items-center justify-center rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-600 transition-all shadow-xs active:scale-95"
                aria-label="Desplazar a la derecha"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 pt-1 snap-x snap-mandatory hide-scrollbar"
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="w-[260px] sm:w-[300px] md:w-[320px] snap-start shrink-0 flex flex-col"
            >
              <ProductCard
                product={product}
                onViewDetail={onViewDetail}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
