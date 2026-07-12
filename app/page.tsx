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
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-28 overflow-hidden bg-[#fafafa]">
        {/* Animated Custom Decorative Background Blobs & Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 -z-10 h-full w-full pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] bg-primary/10 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-1/3 -right-20 h-[500px] w-[500px] bg-amber-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute -bottom-20 left-10 h-[450px] w-[450px] bg-blue-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 text-xs sm:text-sm font-extrabold text-primary border border-primary/20 shadow-md backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-amber-500 animate-bounce" />
                  <span className="tracking-wide">Líderes en Guanacaste desde hace 5 años</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7.5xl font-black tracking-tight text-neutral-900 leading-[1.02]">
                  Tu proveedor de confianza <br />
                  <span className="gradient-text-crayola">en suministros.</span>
                </h1>
                
                <p className="max-w-xl text-lg sm:text-xl text-neutral-500 leading-relaxed font-semibold">
                  Abastecemos su negocio, escuela u hogar con productos de la más alta calidad. 
                  Explore nuestro catálogo, cotice rápido y reciba atención personalizada en segundos.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-center gap-4 pt-2"
              >
                <Link href="/catalog" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-16 px-10 text-lg font-black rounded-2xl gap-2.5 bg-primary hover:bg-primary/95 text-white shadow-xl shadow-primary/30 hover:shadow-primary/45 hover:scale-[1.02] active:scale-[0.98] transition-all group shine-effect">
                    Explorar Catálogo
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <a href="#sobre-nosotros" className="w-full sm:w-auto">
                  <Button variant="ghost" className="w-full sm:w-auto h-16 px-8 text-lg font-bold text-neutral-600 hover:bg-neutral-100/80 rounded-2xl border border-neutral-200/60 bg-white/50 backdrop-blur-sm">
                    Nuestra Historia
                  </Button>
                </a>
              </motion.div>
              
              {/* Stats Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="grid grid-cols-3 gap-6 pt-10 border-t border-neutral-200/80 max-w-lg"
              >
                <div className="space-y-1.5">
                  <div className="text-4xl font-black text-neutral-900 tracking-tighter bg-gradient-to-br from-neutral-900 to-neutral-700 bg-clip-text text-transparent">5+</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-black leading-none">Años de Servicio</div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-4xl font-black text-neutral-900 tracking-tighter bg-gradient-to-br from-neutral-900 to-neutral-700 bg-clip-text text-transparent">5k+</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-black leading-none">Productos</div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-4xl font-black text-neutral-900 tracking-tighter bg-gradient-to-br from-primary to-emerald-600 bg-clip-text text-transparent">100%</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-black leading-none">Guanacasteco</div>
                </div>
              </motion.div>
            </div>
            
            {/* Right Column: Interactive Showcase */}
            <div className="lg:col-span-5 hidden lg:flex flex-col gap-6 justify-center items-center w-full relative">
              {/* Glow effects mapped behind cards */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[80px] -z-10 animate-pulse" />
              
              {/* Floating Decorative Elements */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute top-4 right-12 z-30 bg-white p-3 rounded-2xl shadow-lg border border-neutral-100 flex items-center justify-center text-2xl"
              >
                ✏️
              </motion.div>
              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-4 -left-12 z-30 bg-white p-3.5 rounded-2xl shadow-lg border border-neutral-100 flex items-center justify-center text-2xl"
              >
                🎨
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-1/2 -left-10 z-30 bg-white p-3 rounded-2xl shadow-lg border border-neutral-100 flex items-center justify-center text-xl"
              >
                📐
              </motion.div>
              
              {/* Mockup Card: Quote Summary Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="w-full max-w-[420px] p-10 bg-white border border-neutral-200/60 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_60px_rgba(16,185,129,0.15)] transition-all duration-300 cursor-pointer relative z-20"
              >
                <div className="flex items-center gap-4.5 mb-7">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <ShoppingBag className="h-7 w-7" />
                  </div>
                  <div>
                    <h5 className="font-black text-xl text-neutral-800">Tu Cotización</h5>
                    <p className="text-xs text-neutral-400 font-extrabold mt-0.5">Listo para WhatsApp</p>
                  </div>
                </div>
                <div className="space-y-4 border-t border-neutral-100/80 pt-6">
                  <div className="flex justify-between items-center text-base">
                    <span className="text-neutral-600 font-semibold">3x Cuadernos</span>
                    <span className="text-[11px] font-black text-neutral-700 bg-neutral-100 px-3 py-1 rounded-lg">Seleccionado</span>
                  </div>
                  <div className="flex justify-between items-center text-base">
                    <span className="text-neutral-600 font-semibold">1x Lapiceros Gel</span>
                    <span className="text-[11px] font-black text-neutral-700 bg-neutral-100 px-3 py-1 rounded-lg">Seleccionado</span>
                  </div>
                  <div className="flex justify-between items-center text-base">
                    <span className="text-neutral-600 font-semibold">2x Témperas Crayola</span>
                    <span className="text-[11px] font-black text-neutral-700 bg-neutral-100 px-3 py-1 rounded-lg">Seleccionado</span>
                  </div>
                  <div className="flex justify-between items-center text-base font-black border-t border-neutral-100 pt-5 text-neutral-900">
                    <span>Total Artículos</span>
                    <span className="text-primary text-base bg-primary/5 px-3.5 py-1 rounded-xl">6 unidades</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <BrandsSection 
        products={products}
        loading={loadingProducts}
        onViewDetail={handleViewProduct}
        onAddToCart={handleAddToCart}
      />

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

