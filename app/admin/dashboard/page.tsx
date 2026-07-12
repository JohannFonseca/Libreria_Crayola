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
    { label: 'Vistas Totales', value: statsData.view, icon: Eye, color: 'text-blue-600', bg: 'from-blue-500/10 to-blue-500/5 border-blue-100/50' },
    { label: 'Agregados al Carrito', value: statsData.cart, icon: ShoppingCart, color: 'text-purple-600', bg: 'from-purple-500/10 to-purple-500/5 border-purple-100/50' },
    { label: 'Cotizaciones Iniciadas', value: statsData.whatsapp, icon: Send, color: 'text-emerald-600', bg: 'from-emerald-500/10 to-emerald-500/5 border-emerald-100/50' },
    { label: 'Productos Activos', value: statsData.products, icon: Package, color: 'text-orange-600', bg: 'from-orange-500/10 to-orange-500/5 border-orange-100/50' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-neutral-400 font-bold text-sm">Cargando datos analíticos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-neutral-900">
          Bienvenido, <span className="gradient-text-crayola">Admin</span>
        </h1>
        <p className="text-neutral-500 font-semibold mt-1">Aquí tienes un resumen detallado del rendimiento de tu catálogo público.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white border border-neutral-200/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 relative overflow-hidden group">
            <div className={`p-4 rounded-2xl bg-gradient-to-br border ${stat.bg} ${stat.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black text-neutral-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black text-neutral-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Products */}
        <div className="p-8 bg-white border border-neutral-200/60 rounded-[32px] shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
            <div>
              <h3 className="text-lg font-black text-neutral-900">Productos Populares</h3>
              <p className="text-xs text-neutral-400 font-bold mt-0.5">Productos con mayor número de vistas</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-neutral-50 flex items-center justify-center border border-neutral-100 text-neutral-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-5">
            {popular.length === 0 ? (
              <p className="text-sm text-neutral-400 font-bold text-center py-6">No hay suficientes datos aún.</p>
            ) : (
              popular.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50/70 transition-colors group">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center font-black text-neutral-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-neutral-800 truncate">{item.name}</p>
                    <p className="text-xs text-neutral-400 font-bold mt-0.5">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-neutral-900">{item.count}</p>
                    <p className="text-[10px] text-neutral-400 font-black uppercase tracking-wider">vistas</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-8 bg-white border border-neutral-200/60 rounded-[32px] shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
            <div>
              <h3 className="text-lg font-black text-neutral-900">Actividad Reciente</h3>
              <p className="text-xs text-neutral-400 font-bold mt-0.5">Eventos en tiempo real en la web</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-neutral-50 flex items-center justify-center border border-neutral-100 text-neutral-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-6">
             {recent.length === 0 ? (
               <p className="text-sm text-neutral-400 font-bold text-center py-6">No hay actividad reciente.</p>
             ) : (
               recent.map((item, i) => {
                 const bgMap: Record<string, string> = { 
                   view_product: 'bg-blue-500 ring-blue-100', 
                   add_to_cart: 'bg-purple-500 ring-purple-100', 
                   send_whatsapp: 'bg-emerald-500 ring-emerald-100' 
                 };
                 const textMap: Record<string, string> = { 
                   view_product: `Vio producto "${item.products?.name || '...'}"`, 
                   add_to_cart: `Agregó "${item.products?.name || '...'}" al carrito`, 
                   send_whatsapp: 'Inició cotización de WhatsApp' 
                 };
                 const date = new Date(item.created_at);
                 const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                 return (
                   <div key={i} className="flex gap-4 p-2 rounded-2xl hover:bg-neutral-50/50 transition-colors">
                      <div className="relative mt-1.5">
                        <div className={`h-2.5 w-2.5 rounded-full ${bgMap[item.event_type] || 'bg-gray-500 ring-gray-100'} ring-4`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-neutral-800 leading-tight truncate">{textMap[item.event_type] || 'Acción desconocida'}</p>
                        <p className="text-[10px] text-neutral-400 font-bold mt-1 uppercase tracking-wider">{date.toLocaleDateString()} a las {timeString}</p>
                      </div>
                   </div>
                 );
               })
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
