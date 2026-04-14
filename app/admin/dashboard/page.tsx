'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Eye, ShoppingCart, Send, TrendingUp, Package, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function AdminDashboard() {
  const stats = [
    { label: 'Vistas Totales', value: '1,284', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Agregas al Carrito', value: '342', icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Cotizaciones Enviadas', value: '89', icon: Send, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Productos Activos', value: '156', icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido, Admin</h1>
        <p className="text-neutral-500">Aquí tienes un resumen del rendimiento de tu catálogo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 border-none shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Productos Populares</h3>
            <TrendingUp className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-neutral-100" />
                <div className="flex-1">
                  <p className="font-medium">Producto Ejemplo #{i}</p>
                  <p className="text-sm text-neutral-400">Escolar / Cuadernos</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">45</p>
                  <p className="text-xs text-neutral-400">vistas</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Actividad Reciente</h3>
            <Users className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-6">
             <div className="flex gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">Nueva cotización via WhatsApp</p>
                  <p className="text-xs text-neutral-400">Hace 5 minutos</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-purple-500" />
                <div>
                  <p className="text-sm font-medium">Producto "Calculadora" agregado al carrito</p>
                  <p className="text-xs text-neutral-400">Hace 12 minutos</p>
                </div>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
