'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Eye, ShoppingCart, Send, TrendingUp, Package, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { getAnalyticsStats, getPopularProducts, getRecentActivity } from '@/lib/api/analytics';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({ view: 0, cart: 0, whatsapp: 0, products: 0 });
  const [popular, setPopular] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAnalyticsStats(),
      getPopularProducts(),
      getRecentActivity()
    ]).then(([s, p, r]) => {
      setStatsData(s as any);
      setPopular(p);
      setRecent(r);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const stats = [
    { label: 'Vistas Totales', value: statsData.view, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Agregas al Carrito', value: statsData.cart, icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Cotizaciones Iniciadas', value: statsData.whatsapp, icon: Send, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Productos Activos', value: statsData.products, icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse text-neutral-500">
        <p>Cargando datos analíticos...</p>
      </div>
    );
  }

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
            {popular.length === 0 && <p className="text-sm text-neutral-500">No hay suficientes datos aún.</p>}
            {popular.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-neutral-400">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-neutral-400">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{item.count}</p>
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
             {recent.length === 0 && <p className="text-sm text-neutral-500">No hay actividad reciente.</p>}
             {recent.map((item, i) => {
               const bgMap: Record<string, string> = { view_product: 'bg-blue-500', add_to_cart: 'bg-purple-500', send_whatsapp: 'bg-green-500' };
               const textMap: Record<string, string> = { view_product: `Vio producto "${item.products?.name || '...'}"`, add_to_cart: `Agregó "${item.products?.name || '...'}" al carrito`, send_whatsapp: 'Inició cotización de WhatsApp' };
               const date = new Date(item.created_at);
               const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

               return (
                 <div key={i} className="flex gap-4">
                    <div className={`mt-1 h-2 w-2 rounded-full ${bgMap[item.event_type] || 'bg-gray-500'}`} />
                    <div>
                      <p className="text-sm font-medium">{textMap[item.event_type] || 'Acción desconocida'}</p>
                      <p className="text-xs text-neutral-400">{date.toLocaleDateString()} a las {timeString}</p>
                    </div>
                 </div>
               );
             })}
          </div>
        </Card>
      </div>
    </div>
  );
}
