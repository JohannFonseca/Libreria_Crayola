'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Sparkles, Shield, Zap, Users, Building, 
  ShoppingBag, BookOpen, Briefcase, Palette, Laptop, Pencil, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationsSection } from '@/components/layout/LocationsSection';
import { BrandsSection } from '@/components/layout/BrandsSection';
import { ProductDetail } from '@/components/catalog/ProductDetail';
import { supabase } from '@/lib/supabaseClient';
import { Category, Product } from '@/lib/types';
import { getPublicProducts } from '@/lib/api/products';
import { useCart } from '@/context/CartContext';
import { trackEvent } from '@/lib/api/analytics';

// Category icon mapper
const categoryIcons: Record<string, React.ComponentType<any>> = {
  escolar: BookOpen,
  oficina: Briefcase,
  arte: Palette,
  manualidades: Palette,
  tecnologia: Laptop,
  escritorio: Pencil,
  papeleria: Sparkles,
};

const getCategoryIcon = (name: string) => {
  const normalized = name.toLowerCase();
  for (const key in categoryIcons) {
    if (normalized.includes(key)) {
      return categoryIcons[key];
    }
  }
  return Sparkles;
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { addItem } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (e) {
      console.error('Error fetching categories for homepage:', e);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await getPublicProducts();
      setProducts(data || []);
    } catch (e) {
      console.error('Error fetching products for homepage:', e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = (product: Product, color?: string) => {
    trackEvent(product.id, 'add_to_cart');
    addItem(product, color);
    setSelectedProduct(null);
  };

  const handleViewProduct = (product: Product) => {
    trackEvent(product.id, 'view_product');
    setSelectedProduct(product);
  };

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Hero Section - Split Layout */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-24 overflow-hidden bg-gradient-bg-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-bold text-primary border border-primary/10 shadow-sm">
                  <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                  <span>Líderes en Guanacaste desde hace 5 años</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-neutral-900 leading-[1.05]">
                  Tu papelería de confianza, <br />
                  <span className="gradient-text-crayola">ahora digital.</span>
                </h1>
                
                <p className="max-w-xl text-lg sm:text-xl text-neutral-500 leading-relaxed font-medium">
                  Abastecemos su negocio, escuela u hogar con productos de la más alta calidad. 
                  Explore nuestro catálogo, cotice rápido y reciba atención personalizada en segundos.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Link href="/catalog" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-2xl gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all group shine-effect">
                    Explorar Catálogo
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <a href="#sobre-nosotros" className="w-full sm:w-auto">
                  <Button variant="ghost" className="w-full sm:w-auto h-14 px-8 text-lg font-bold text-neutral-600 hover:bg-neutral-100/80 rounded-2xl">
                    Nuestra Historia
                  </Button>
                </a>
              </motion.div>
              
              {/* Stats Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-3 gap-6 pt-10 border-t border-neutral-100 max-w-lg"
              >
                <div className="space-y-1">
                  <div className="text-3xl font-black text-neutral-900 tracking-tighter">5+</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-black">Años de Servicio</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-neutral-900 tracking-tighter">5k+</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-black">Productos</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-neutral-900 tracking-tighter">100%</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-black">Guanacasteco</div>
                </div>
              </motion.div>
            </div>
            
            {/* Right Column: Interactive Showcase */}
            <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center h-[500px]">
              {/* Decorative blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-primary/10 rounded-full blur-[80px] -z-10 animate-pulse" />
              
              {/* Mockup Card 1: Product Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="absolute z-20 -top-8 left-4 w-72 p-5 bg-white border border-neutral-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-video w-full rounded-2xl bg-neutral-50 flex items-center justify-center p-3 mb-4 relative overflow-hidden">
                  <img src="/cuaderno_crayola.png" alt="Cuaderno Crayola" className="h-full w-full object-contain" />
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Destacado
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Papelería Premium</span>
                  <h4 className="font-bold text-neutral-800 text-base">Cuaderno Espiral Especial</h4>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-neutral-400 font-medium">Librería Crayola</span>
                    <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">En Stock</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Mockup Card 2: Quote Summary Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="absolute z-10 bottom-6 right-0 w-64 p-5 bg-white/90 backdrop-blur-md border border-white/60 rounded-3xl shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-neutral-800">Tu Cotización</h5>
                    <p className="text-[10px] text-neutral-400">Listo para WhatsApp</p>
                  </div>
                </div>
                <div className="space-y-2 border-t border-neutral-100 pt-3">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-500">3x Cuadernos</span>
                    <span className="font-semibold text-neutral-700">Seleccionado</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-500">1x Lapiceros Gel</span>
                    <span className="font-semibold text-neutral-700">Seleccionado</span>
                  </div>
                  <div className="flex justify-between text-xs font-black border-t border-neutral-100 pt-2 text-neutral-900">
                    <span>Total Artículos</span>
                    <span>4 unidades</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 inset-x-0 -z-10 h-full w-full pointer-events-none overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[600px] w-[600px] bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] bg-blue-50/50 blur-[100px] rounded-full translate-x-1/2" />
        </div>
      </section>

      {/* Categories Quick Access Section */}
      <section className="py-24 bg-white border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-black text-primary uppercase tracking-[0.2em] block mb-2">Comienza a Explorar</span>
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight sm:text-4xl">
                Compra por Categoría
              </h2>
            </div>
            <Link href="/catalog" className="text-primary hover:text-primary/80 font-bold text-sm flex items-center gap-1.5 transition-colors shrink-0 group">
              Ver todo el catálogo
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 rounded-3xl bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((cat) => {
                const IconComponent = getCategoryIcon(cat.name);
                return (
                  <Link 
                    key={cat.id} 
                    href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                    className="group block"
                  >
                    <div className="bg-neutral-50 border border-neutral-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                      <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-neutral-600 group-hover:text-primary group-hover:bg-white shadow-sm transition-colors duration-300 mb-6">
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <h3 className="font-bold text-neutral-800 text-lg group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-neutral-400 text-xs mt-1 font-medium group-hover:text-primary/70 transition-colors">
                        Explorar productos
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              No hay categorías registradas en el catálogo.
            </div>
          )}
        </div>
      </section>

      {/* Brands Section */}
      <BrandsSection 
        products={products}
        loading={loadingProducts}
        onViewDetail={handleViewProduct}
        onAddToCart={handleAddToCart}
      />

      {/* Value Pillars Section */}
      <section className="py-24 bg-neutral-50/50 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black text-primary uppercase tracking-[0.2em] block mb-2">Excelencia & Compromiso</span>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight sm:text-4xl">
              Diseñado para simplificar su abastecimiento
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Calidad Garantizada', 
                desc: 'Solo trabajamos con marcas líderes para asegurar que cada artículo cumpla con sus expectativas.',
                icon: ShoppingBag,
                color: 'text-primary',
                bgColor: 'bg-primary/5'
              },
              { 
                title: 'Atención Inmediata', 
                desc: 'Nuestro sistema de cotización por WhatsApp le brinda respuestas rápidas y personalizadas.',
                icon: Zap,
                color: 'text-amber-500',
                bgColor: 'bg-amber-500/5'
              },
              { 
                title: 'Respaldo Local', 
                desc: 'Con presencia física en Liberia y Bagaces, brindamos la seguridad de un servicio cercano.',
                icon: Shield,
                color: 'text-emerald-500',
                bgColor: 'bg-emerald-500/5'
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -6 }}
                className="bg-white p-10 rounded-[32px] border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className={`mb-6 h-16 w-16 rounded-2xl ${f.bgColor} ${f.color} flex items-center justify-center`}>
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-900">{f.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Text Focused */}
      <section id="sobre-nosotros" className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-100">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div>
              <span className="text-xs font-black text-primary uppercase tracking-[0.2em] block mb-2">Nuestra Historia</span>
              <h3 className="text-4xl lg:text-5xl font-black text-neutral-900 leading-tight">
                Raíces en Guanacaste, <br />
                <span className="text-neutral-400">servimos a todo el país.</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left pt-4">
              <p className="text-base sm:text-lg text-neutral-500 leading-relaxed font-medium">
                Librería Crayola nació con un objetivo claro: modernizar y facilitar el acceso a suministros de papelería, arte y oficina de alta calidad en la provincia de Guanacaste.
              </p>
              <p className="text-base sm:text-lg text-neutral-500 leading-relaxed font-medium">
                Hoy, desde nuestra base en Bagaces y nuestra sucursal en Liberia, nos hemos consolidado como el aliado estratégico para empresas e instituciones que valoran la rapidez, la confianza y el trato humano.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 pt-10 border-t border-neutral-100">
              {[
                'Atención Personalizada',
                'Logística de Vanguardia',
                'Calidad de Marcas',
                'Valores Familiares'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-base font-bold text-neutral-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Locations Section */}
      <div className="bg-neutral-50/50">
        <LocationsSection />
      </div>

      {/* CTA Section - Professional High-Contrast */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl bg-neutral-950 rounded-[48px] p-12 lg:p-20 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">¿Listo para renovar su stock?</h2>
            <p className="text-neutral-400 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
              Descubra por qué somos la opción preferida de las empresas en Guanacaste. 
              Explore nuestro catálogo y hablemos por WhatsApp.
            </p>
            <div className="pt-4">
              <Link href="/catalog">
                <Button className="h-16 px-10 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/95 text-white shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] shine-effect">
                  Comenzar Cotización
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Subtle design elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-primary blur-[160px] rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-blue-600 blur-[160px] rounded-full" />
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

