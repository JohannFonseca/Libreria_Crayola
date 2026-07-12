'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Button } from '@/components/ui/Button';
import { Product, Brand } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';

interface BrandsSectionProps {
  products: Product[];
  loading: boolean;
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

// Accent normalization helper to make search accent-insensitive
const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const BrandsSection = ({ products, loading, onViewDetail, onAddToCart }: BrandsSectionProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .or('visible_en_web.eq.true,visible_en_web.is.null') // Only visible brands
          .order('name');
        if (error) throw error;
        setBrands(data || []);
      } catch (e) {
        console.error('Error fetching brands for BrandsSection:', e);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    if (brands.length > 0 && !selectedBrandId) {
      setSelectedBrandId(brands[0].id);
    }
  }, [brands, selectedBrandId]);

  const selectedBrand = useMemo(() => {
    return brands.find(b => b.id === selectedBrandId) || null;
  }, [brands, selectedBrandId]);

  // Filter products by brand_id with fallback to name matching
  const brandProducts = useMemo(() => {
    if (loading || !products.length || !selectedBrandId || !selectedBrand) return [];
    
    // 1. Filter by brand_id
    const filtered = products.filter(p => p.brand_id === selectedBrandId);
    if (filtered.length > 0) {
      return filtered.slice(0, 4);
    }
    
    // 2. Fallback: Filter by brand name match as a whole word
    const query = normalizeText(selectedBrand.name || '');
    try {
      const regex = new RegExp('\\b' + query + '\\b', 'i');
      return products.filter(p => {
        const name = normalizeText(p.name || '');
        const desc = normalizeText(p.description || '');
        return regex.test(name) || regex.test(desc);
      }).slice(0, 4);
    } catch (e) {
      return products.filter(p => {
        const name = normalizeText(p.name || '');
        const desc = normalizeText(p.description || '');
        return name.includes(query) || desc.includes(query);
      }).slice(0, 4);
    }
  }, [products, selectedBrandId, selectedBrand, loading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  } as const;

  if (loadingBrands) {
    return (
      <section className="py-28 bg-white border-b border-neutral-100 flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-neutral-400 text-sm font-bold mt-4">Cargando marcas destacadas...</p>
      </section>
    );
  }

  // If no visible brands are registered, don't show the section or show a simple placeholder
  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="relative py-28 bg-white border-b border-neutral-100 overflow-hidden">
      {/* Decorative Glow Blobs for Premium Aesthetic */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      {selectedBrand && (
        <div 
          className="absolute bottom-10 right-10 w-80 h-80 rounded-full blur-[120px] pointer-events-none -z-10 transition-all duration-700" 
          style={{ backgroundColor: `${selectedBrand.color}08` }}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-black text-primary bg-primary/5 border border-primary/10 tracking-widest uppercase">
              <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Calidad y Confianza</span>
            </div>
            <h2 className="text-4xl font-black text-neutral-900 tracking-tight sm:text-5xl">
              Nuestras Marcas Destacadas
            </h2>
            <p className="text-neutral-500 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
              Trabajamos con los fabricantes líderes del mercado para garantizar suministros excepcionales. Selecciona tu marca favorita para explorar sus productos.
            </p>
          </div>
          {selectedBrand && (
            <Link 
              href={`/catalog?brandId=${selectedBrand.id}`}
              className="text-primary hover:text-primary/80 font-black text-sm flex items-center gap-1.5 transition-colors shrink-0 group self-start sm:self-end bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-2xl border border-primary/10"
            >
              Ver todo de {selectedBrand.name}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* Brands Selector Flex — Premium horizontal scroll slider */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-200/80 scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory">
          {brands.map((brand) => {
            const isSelected = brand.id === selectedBrandId;
            return (
              <motion.button
                key={brand.id}
                onClick={() => setSelectedBrandId(brand.id)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex flex-col items-center justify-center p-5 rounded-[24px] border-2 transition-all duration-300 cursor-pointer overflow-hidden flex-shrink-0 w-36 sm:w-40 snap-start ${
                  isSelected
                    ? 'bg-white shadow-xl scale-[1.02] z-10'
                    : 'border-neutral-100 bg-neutral-50/40 hover:bg-white hover:border-neutral-200 hover:shadow-md'
                }`}
                style={{
                  boxShadow: isSelected ? `0 20px 30px -10px ${brand.color}25, 0 10px 15px -10px ${brand.color}15` : '',
                  borderColor: isSelected ? brand.color : 'transparent'
                }}
              >
                {/* Active Soft Colored Background Glow inside button */}
                {isSelected && (
                  <div className="absolute inset-0 opacity-10 bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(135deg, ${brand.color}, transparent)` }} />
                )}

                {/* Brand Logo Wrapper */}
                <div className="w-full relative h-14 mb-3 transition-transform duration-300 flex items-center justify-center">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain p-1 rounded-lg"
                    />
                  ) : (
                    <div 
                      className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm uppercase"
                      style={{ 
                        backgroundColor: isSelected ? 'transparent' : `${brand.color}15`, 
                        color: isSelected ? 'currentColor' : brand.color 
                      }}
                    >
                      {brand.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
 
                {/* Brand Name */}
                <span className={`text-xs font-black tracking-wide uppercase transition-colors text-center ${
                  isSelected ? brand.text_color || 'text-primary' : 'text-neutral-500'
                }`}>
                  {brand.name}
                </span>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <motion.div
                    layoutId="activeBrandIndicator"
                    className="absolute bottom-0 left-6 right-6 h-1 rounded-full"
                    style={{ backgroundColor: brand.color }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Brand Details Bar — Premium Glassmorphic / Gradient Layout */}
        {selectedBrand && (
          <div 
            className="mb-14 p-8 rounded-[36px] border transition-all duration-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
            style={{ 
              borderColor: `${selectedBrand.color}20`,
              background: `linear-gradient(135deg, ${selectedBrand.color}10, ${selectedBrand.color}03, #ffffff)`
            }}
          >
            {/* Subtle logo accent on background */}
            {selectedBrand.logo_url && (
              <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-[0.03] pointer-events-none flex items-center justify-end pr-10">
                <img src={selectedBrand.logo_url} alt="" className="h-44 object-contain grayscale" />
              </div>
            )}

            <div className="flex items-center gap-5 relative z-10">
              <div 
                className="h-16 w-16 rounded-[22px] flex items-center justify-center font-bold text-lg shadow-inner transition-colors duration-500" 
                style={{ backgroundColor: `${selectedBrand.color}18`, color: selectedBrand.color }}
              >
                <Sparkles className="h-7 w-7 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider block mb-0.5" style={{ color: selectedBrand.color }}>Marca Destacada</span>
                <h4 className="font-black text-neutral-900 text-xl md:text-2xl transition-all duration-300">Colección de {selectedBrand.name}</h4>
                <p className="text-neutral-600 text-sm md:text-base font-semibold mt-1 max-w-2xl leading-relaxed">{selectedBrand.description || 'Suministros y artículos de oficina y escolares.'}</p>
              </div>
            </div>
            <Link href={`/catalog?brandId=${selectedBrand.id}`} className="relative z-10 shrink-0">
              <Button 
                className="font-bold rounded-2xl h-12 px-6 shadow-md transition-all hover:scale-[1.03] active:scale-[0.97]"
                style={{ 
                  backgroundColor: selectedBrand.color, 
                  color: '#ffffff',
                  boxShadow: `0 10px 20px -5px ${selectedBrand.color}40`
                }}
              >
                <span>Explorar catálogo de {selectedBrand.name}</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}

        {/* Dynamic Products Showcase */}
        {selectedBrand && (
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center w-full gap-4"
                >
                  <div className="relative flex items-center justify-center h-12 w-12">
                    <div className="absolute h-12 w-12 rounded-full border-4 border-primary/10 animate-pulse" />
                    <div className="absolute h-12 w-12 rounded-full border-4 border-t-primary animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-neutral-800 text-lg">Cargando destacados...</h4>
                    <p className="text-xs text-neutral-400 font-medium">Buscando productos de {selectedBrand.name}</p>
                  </div>
                </motion.div>
              ) : brandProducts.length > 0 ? (
                <motion.div
                  key={selectedBrandId}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                  {brandProducts.map((product) => (
                    <motion.div key={product.id} variants={itemVariants} layout>
                      <ProductCard
                        product={product}
                        onViewDetail={onViewDetail}
                        onAddToCart={onAddToCart}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-neutral-200 rounded-[32px] bg-neutral-50/30 px-6"
                >
                  <div className="mb-4 rounded-2xl bg-neutral-100 p-4 text-neutral-400">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">Productos no publicados aún</h3>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-sm font-medium">
                    Próximamente agregaremos el catálogo de {selectedBrand.name} a la web. ¡Puedes consultar y cotizar cualquier artículo de esta marca directo por WhatsApp!
                  </p>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <a 
                      href={`https://wa.me/50684466444?text=${encodeURIComponent(`Hola! Quisiera cotizar productos de la marca ${selectedBrand.name} que vi en la página web.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="h-10 px-5 text-xs font-bold rounded-xl gap-2 shadow-sm">
                        Consultar {selectedBrand.name} por WhatsApp
                      </Button>
                    </a>
                    <Link href="/catalog">
                      <Button variant="outline" className="h-10 px-5 text-xs font-bold rounded-xl bg-white border-neutral-200 hover:bg-neutral-50">
                        Ver Catálogo General
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
};
