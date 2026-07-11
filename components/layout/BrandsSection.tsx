'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Button } from '@/components/ui/Button';
import { Product } from '@/lib/types';

interface Brand {
  id: string;
  name: string;
  query: string;
  color: string; // Theme color (used for borders, active state, glow)
  bgColor: string; // Tailwind background hover/active
  textColor: string; // Text styling
  desc: string;
  logoPath: string; // Path to brand logo image
}

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
  const brands: Brand[] = [
    {
      id: 'crayola',
      name: 'Crayola',
      query: 'crayola',
      color: '#10B981', // Emerald green
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      desc: 'Creatividad, colores vibrantes y diversión para todas las edades.',
      logoPath: '/MarcasManpaLider/Crayola.jpeg'
    },
    {
      id: 'norma',
      name: 'Norma',
      query: 'norma',
      color: '#3B82F6', // Blue
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      desc: 'Cuadernos y papelería escolar de la más alta resistencia y diseño.',
      logoPath: '/MarcasManpaLider/Norma.png'
    },
    {
      id: 'bic',
      name: 'BIC',
      query: 'bic',
      color: '#F59E0B', // Yellow/Orange
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      desc: 'Escritura suave y duradera con la marca líder en bolígrafos y marcadores.',
      logoPath: '/MarcasManpaLider/Bic.jpeg'
    },
    {
      id: 'lider',
      name: 'El Líder',
      query: 'lider',
      color: '#4F46E5', // Indigo
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      desc: 'Cuadernos, blocks y papel para oficina de gran durabilidad.',
      logoPath: '/MarcasManpaLider/ElLider.png'
    },
    {
      id: 'resistol',
      name: 'Resistol',
      query: 'resistol',
      color: '#EF4444', // Red
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      desc: 'Pegamentos, adhesivos y soluciones escolares y de oficina de alta resistencia.',
      logoPath: '/MarcasManpaLider/Resistol.png'
    },
    {
      id: 'skipper',
      name: 'Skipper',
      query: 'skipper',
      color: '#06B6D4', // Cyan/Teal
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
      desc: 'Papelería y útiles con diseños modernos y funcionales.',
      logoPath: '/MarcasManpaLider/Skipper.jpeg'
    },
    {
      id: 'articolor',
      name: 'Articolor',
      query: 'articolor',
      color: '#EC4899', // Pink
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      desc: 'Témperas, plastilinas y pinturas escolares para potenciar tu creatividad.',
      logoPath: '/MarcasManpaLider/articolor.png'
    },
    {
      id: 'chenson',
      name: 'Chenson',
      query: 'chenson',
      color: '#8B5CF6', // Purple
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      desc: 'Bultos, mochilas y cartucheras duraderas con diseños espectaculares.',
      logoPath: '/MarcasManpaLider/chenson.png'
    }
  ];

  const [selectedBrandId, setSelectedBrandId] = useState<string>(brands[0].id);

  const selectedBrand = useMemo(() => {
    return brands.find(b => b.id === selectedBrandId) || brands[0];
  }, [selectedBrandId]);

  // Filter products in memory with accent-insensitivity
  const brandProducts = useMemo(() => {
    if (loading || !products.length) return [];
    
    const query = normalizeText(selectedBrand.query);
    return products.filter(p => {
      const name = normalizeText(p.name || '');
      const desc = normalizeText(p.description || '');
      return name.includes(query) || desc.includes(query);
    }).slice(0, 4); // Limit to top 4 products for homepage visual cleanliness
  }, [products, selectedBrand, loading]);

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

  return (
    <section className="py-24 bg-white border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-black text-primary uppercase tracking-[0.2em] block mb-2">Marcas de Confianza</span>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight sm:text-4xl">
              Nuestras Marcas Destacadas
            </h2>
            <p className="mt-2 text-neutral-500 text-sm sm:text-base max-w-xl font-medium">
              Trabajamos con los fabricantes líderes para garantizar calidad insuperable. Selecciona una marca para ver sus productos disponibles y agrégalos a tu cotización.
            </p>
          </div>
          <Link 
            href={`/catalog?search=${encodeURIComponent(selectedBrand.name)}`}
            className="text-primary hover:text-primary/80 font-bold text-sm flex items-center gap-1.5 transition-colors shrink-0 group self-start sm:self-end"
          >
            Ver todo de {selectedBrand.name}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Brands Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-10">
          {brands.map((brand) => {
            const isSelected = brand.id === selectedBrandId;
            return (
              <button
                key={brand.id}
                onClick={() => setSelectedBrandId(brand.id)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-3xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-neutral-200 bg-white shadow-lg'
                    : 'border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-neutral-200 hover:shadow-md'
                }`}
                style={{
                  boxShadow: isSelected ? `0 10px 25px -5px ${brand.color}15, 0 8px 10px -6px ${brand.color}10` : '',
                  borderColor: isSelected ? brand.color : ''
                }}
              >
                {/* Brand Logo Wrapper */}
                <div className="w-full relative h-12 mb-2.5 transition-transform duration-300 flex items-center justify-center">
                  <Image
                    src={brand.logoPath}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                    className="object-contain p-1 rounded-lg"
                  />
                </div>

                {/* Brand Name */}
                <span className={`text-[10px] font-black tracking-wide uppercase transition-colors text-center ${
                  isSelected ? brand.textColor : 'text-neutral-500'
                }`}>
                  {brand.name}
                </span>

                {/* Active Indicator Line */}
                {isSelected && (
                  <motion.div
                    layoutId="activeBrandIndicator"
                    className="absolute -bottom-1 left-1/3 right-1/3 h-1.5 rounded-full"
                    style={{ backgroundColor: brand.color }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Brand Details Bar */}
        <div className="mb-12 p-6 rounded-3xl border border-neutral-100 bg-neutral-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm" style={{ backgroundColor: `${selectedBrand.color}12`, color: selectedBrand.color }}>
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-neutral-900 text-base">Colección de {selectedBrand.name}</h4>
              <p className="text-neutral-500 text-xs sm:text-sm font-medium">{selectedBrand.desc}</p>
            </div>
          </div>
          <Link href={`/catalog?search=${encodeURIComponent(selectedBrand.name)}`}>
            <Button variant="outline" className="text-xs font-bold rounded-2xl h-10 border-neutral-200 bg-white hover:bg-neutral-50 transition-all flex items-center gap-1.5">
              <span>Explorar todo de {selectedBrand.name}</span>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* Dynamic Products Showcase */}
        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[360px] rounded-3xl bg-neutral-50 border border-neutral-100 animate-pulse flex flex-col p-5">
                    <div className="aspect-square bg-neutral-100/80 rounded-2xl mb-4" />
                    <div className="h-4 bg-neutral-100/80 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-neutral-100/80 rounded w-1/2 mb-4" />
                    <div className="h-8 bg-neutral-100/80 rounded-xl mt-auto" />
                  </div>
                ))}
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

      </div>
    </section>
  );
};
