'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full bg-primary/10 px-6 py-2 text-sm font-semibold text-primary mb-8">
              Catálogo Actualizado 2024
            </span>
            <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl mb-8">
              Tu papelería de confianza, <br />
              <span className="text-primary italic">ahora digital.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-neutral-500 mb-12">
              Explora miles de productos para tu oficina, escuela u hogar. Cotiza rápido, 
              descarga tu lista y recíbela por WhatsApp en segundos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/catalog">
                <Button className="w-full sm:w-auto px-8 py-6 text-lg rounded-2xl gap-2 group">
                  Explorar Catálogo
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="ghost" className="w-full sm:w-auto px-8 py-6 text-lg text-neutral-600">
                Sobre nosotros
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 -z-10 h-full w-full opacity-30 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-primary/20 blur-[120px] rounded-full" />
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24 border-y border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: 'Selección Premium', 
                desc: 'Solo las mejores marcas para garantizar la mejor calidad en tus suministros.',
                icon: Sparkles 
              },
              { 
                title: 'Cotización Veloz', 
                desc: 'Sin precios públicos, pero con respuestas inmediatas vía WhatsApp.',
                icon: Zap 
              },
              { 
                title: 'Confianza Total', 
                desc: 'Más de 10 años sirviendo a la comunidad con excelencia y puntualidad.',
                icon: Shield 
              }
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="mb-6 rounded-[24px] bg-neutral-50 p-6 flex items-center justify-center text-primary border border-neutral-100">
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-neutral-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl bg-primary rounded-[48px] p-12 lg:p-20 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">¿Listo para renovar tu stock?</h2>
            <p className="text-white/80 text-lg lg:text-xl mb-12 max-w-2xl mx-auto">
              Nuestro equipo está listo para asesorarte. Agrega lo que necesites al carrito y te contactaremos de inmediato.
            </p>
            <Link href="/catalog">
              <Button className="bg-white text-primary hover:bg-white/90 px-10 py-6 text-xl rounded-2xl shadow-lg">
                Comenzar ahora
              </Button>
            </Link>
          </div>
          <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
