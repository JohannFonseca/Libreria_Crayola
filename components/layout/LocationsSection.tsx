'use client';

import React from 'react';
import { MapPin, Phone, ExternalLink, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const locations = [
  {
    id: 'liberia',
    name: 'Sucursal Liberia',
    address: 'Centro de Liberia, Guanacaste',
    phone: '+506 8446 6444',
    mapLink: 'https://maps.app.goo.gl/gmvax4dDDtRWG1AZ7',
    color: 'bg-primary'
  },
  {
    id: 'bagaces',
    name: 'Sucursal Bagaces',
    address: 'Centro de Bagaces, Guanacaste',
    phone: '+506 8617 9090',
    mapLink: 'https://maps.app.goo.gl/5zvyG22BUnxZKAtG7',
    color: 'bg-blue-600'
  }
];

export const LocationsSection = () => {
  return (
    <section id="ubicaciones" className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Nuestras Ubicaciones
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              Visítanos en cualquiera de nuestras dos sucursales en Guanacaste. 
              Estamos listos para brindarte la mejor atención.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {locations.map((loc, index) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <a 
                href={loc.mapLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="group relative overflow-hidden p-0 border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[32px] cursor-pointer hover:-translate-y-2">
                  <div className="flex flex-col h-full">
                    {/* Card Header with Location Name */}
                    <div className={`p-8 ${loc.color} text-white relative overflow-hidden`}>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <MapPin className="h-6 w-6" />
                          <span className="text-sm font-semibold uppercase tracking-widest opacity-80">Guanacaste</span>
                        </div>
                        <h3 className="text-3xl font-bold flex items-center gap-2">
                          {loc.name}
                          <ExternalLink className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                      </div>
                      {/* Decorative background shape */}
                      <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    </div>

                    {/* Card Body */}
                    <div className="p-8 bg-white space-y-6 flex-1 flex flex-col">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 bg-neutral-100 p-2 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <Navigation className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Dirección</p>
                            <p className="text-neutral-700 font-medium">{loc.address}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="mt-1 bg-neutral-100 p-2 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <Phone className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Teléfono / WhatsApp</p>
                            <p className="text-neutral-700 font-medium">{loc.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 mt-auto">
                        <Button className="w-full gap-3 py-6 text-lg rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300 pointer-events-none">
                          <ExternalLink className="h-5 w-5" />
                          Ver en Google Maps
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
