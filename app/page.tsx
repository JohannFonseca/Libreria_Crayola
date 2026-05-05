'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Zap, Users, Building, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { LocationsSection } from '@/components/layout/LocationsSection';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Hero Section - Clean & Centered */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-sm font-bold text-primary mb-10 border border-primary/10 shadow-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Líderes en Guanacaste desde hace 10 años</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-neutral-900 mb-8 leading-[1.05]">
              Tu papelería de confianza, <br />
              <span className="text-primary">ahora digital.</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-xl text-neutral-500 mb-12 leading-relaxed">
              Abastecemos su negocio, escuela u hogar con productos de la más alta calidad. 
              Explore nuestro catálogo, cotice rápido y reciba atención personalizada vía WhatsApp.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/catalog" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-16 px-10 text-xl rounded-2xl gap-2 shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all group">
                  Explorar Catálogo
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#sobre-nosotros" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:w-auto h-16 px-10 text-xl text-neutral-600 hover:bg-neutral-100 rounded-2xl">
                  Nuestra Historia
                </Button>
              </a>
            </div>
            
            <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto pt-12 border-t border-neutral-100">
              <div className="space-y-1">
                <div className="text-3xl font-black text-neutral-900 tracking-tighter">10+</div>
                <div className="text-xs text-neutral-500 uppercase tracking-[0.2em] font-bold">Años sirviendo</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-neutral-900 tracking-tighter">5k+</div>
                <div className="text-xs text-neutral-500 uppercase tracking-[0.2em] font-bold">Productos listos</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-neutral-900 tracking-tighter">100%</div>
                <div className="text-xs text-neutral-500 uppercase tracking-[0.2em] font-bold">Costarricense</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Abstract Background Design */}
        <div className="absolute top-0 inset-x-0 -z-10 h-full w-full pointer-events-none overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[600px] w-[600px] bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] bg-blue-50/50 blur-[100px] rounded-full translate-x-1/2" />
          <div className="absolute top-1/2 left-0 h-[300px] w-[300px] bg-indigo-50/50 blur-[80px] rounded-full -translate-x-1/2" />
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="py-32 bg-neutral-50/50 border-y border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-6">Excelencia & Compromiso</h2>
            <p className="text-4xl font-bold text-neutral-900 tracking-tight">Diseñado para simplificar su abastecimiento.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Calidad Garantizada', 
                desc: 'Solo trabajamos con marcas líderes para asegurar que cada artículo cumpla con sus expectativas.',
                icon: ShoppingBag,
                color: 'text-blue-600',
                bgColor: 'bg-blue-600/5'
              },
              { 
                title: 'Atención Inmediata', 
                desc: 'Nuestro sistema de cotización por WhatsApp le brinda respuestas rápidas y personalizadas.',
                icon: Zap,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-600/5'
              },
              { 
                title: 'Respaldo Local', 
                desc: 'Con presencia física en Liberia y Bagaces, brindamos la seguridad de un servicio cercano.',
                icon: Shield,
                color: 'text-green-600',
                bgColor: 'bg-green-600/5'
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white p-12 rounded-[40px] border border-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className={`mb-8 h-20 w-20 rounded-3xl ${f.bgColor} ${f.color} flex items-center justify-center`}>
                  <f.icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900">{f.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-lg">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Text Focused */}
      <section id="sobre-nosotros" className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-6">Nuestra Historia</h2>
              <h3 className="text-5xl lg:text-6xl font-black text-neutral-900 leading-tight">
                Raíces en Guanacaste, <br />
                <span className="text-neutral-400">servimos a todo el país.</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <p className="text-xl text-neutral-600 leading-relaxed">
                Librería Crayola nació con un objetivo claro: modernizar y facilitar el acceso a suministros de papelería y oficina de alta calidad en la región.
              </p>
              <p className="text-xl text-neutral-600 leading-relaxed">
                Hoy, desde nuestra base en Bagaces, nos hemos consolidado como el aliado estratégico para empresas e instituciones que valoran la rapidez, la confianza y el trato humano.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-12 border-t border-neutral-100">
              {[
                'Atención Personalizada',
                'Logística de Vanguardia',
                'Calidad de Exportación',
                'Valores Familiares'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-lg font-bold text-neutral-800">{item}</span>
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
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl bg-neutral-900 rounded-[64px] p-12 lg:p-24 text-white text-center relative overflow-hidden shadow-3xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter">¿Listo para renovar su stock?</h2>
            <p className="text-neutral-400 text-xl lg:text-2xl leading-relaxed">
              Descubra por qué somos la opción preferida de las empresas en Guanacaste. 
              Explore nuestro catálogo y hablemos por WhatsApp.
            </p>
            <div className="pt-4">
              <Link href="/catalog">
                <Button className="h-20 px-14 text-2xl rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95">
                  Comenzar Cotización
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Subtle design elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-primary blur-[160px] rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-blue-600 blur-[160px] rounded-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
