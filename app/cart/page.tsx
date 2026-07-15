'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, FileText, Send, ArrowLeft, MapPin, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { generateWhatsAppLink, BRANCHES, BranchId } from '@/lib/whatsapp-helper';
import { generatePDF } from '@/lib/pdf-generator';
import { trackEvent } from '@/lib/api/analytics';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();
  const [selectedBranch, setSelectedBranch] = React.useState<BranchId>('liberia');

  if (totalItems === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <div className="mb-6 rounded-3xl bg-neutral-50 border border-neutral-100 p-8 w-24 h-24 flex items-center justify-center mx-auto text-neutral-400 shadow-sm">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black text-neutral-900 mb-3">Tu cotización está vacía</h1>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Navega por nuestro catálogo de productos y agrega los artículos que necesitas cotizar para sucursal Liberia o Bagaces.
        </p>
        <Link href="/catalog">
          <Button className="h-12 px-8 font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-102 transition-all">
            Ir al Catálogo de Productos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-100">
        <div className="flex items-center gap-4">
          <Link href="/catalog">
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 shadow-sm h-10 px-4 text-xs font-bold">
              <ArrowLeft className="h-4 w-4" />
              Catálogo
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">Tu Cotización</h1>
        </div>
        <div className="text-xs sm:text-sm text-neutral-400 font-medium">
          Tienes <span className="font-bold text-neutral-700">{totalItems} artículos</span> en tu lista.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Products List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            return (
              <Card key={`${item.id}-${item.selectedColor}`} className="p-4 sm:p-5 border-neutral-100 hover:shadow-md transition-shadow duration-300 rounded-2xl bg-white shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  
                  {/* Product Image */}
                  <div className="h-20 w-20 flex-shrink-0 bg-neutral-50 rounded-xl overflow-hidden relative border border-neutral-100/60 p-2 flex items-center justify-center">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-neutral-300 font-bold">Sin imagen</span>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-base sm:text-lg text-neutral-800 leading-tight">{item.name}</h3>
                    <div className="flex flex-wrap gap-2.5 items-center">
                      {item.selectedColor && (
                        <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 border-none text-[9px] font-black rounded-md uppercase py-0.5 px-2">
                          Color: {item.selectedColor}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Quantity Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-neutral-200 bg-neutral-50/50 rounded-xl px-1.5 py-0.5 shadow-inner">
                        <button
                          className="p-1.5 hover:text-primary transition-colors hover:scale-110 active:scale-90"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-neutral-700 text-sm">{item.quantity}</span>
                        <button
                          className="p-1.5 hover:text-primary transition-colors hover:scale-110 active:scale-90"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      <button
                        className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-105"
                        onClick={() => removeItem(item.id, item.selectedColor)}
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </Card>
            );
          })}

          <div className="flex justify-end pt-2">
            <Button variant="ghost" className="text-red-500 hover:bg-red-50/80 rounded-xl font-bold text-sm h-10 px-4" onClick={clearCart}>
              Vaciar Carrito
            </Button>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <Card className="sticky top-24 p-6 sm:p-8 bg-neutral-50 border border-neutral-100 rounded-3xl shadow-sm">
            <h2 className="text-lg font-black text-neutral-900 mb-6 uppercase tracking-wider pb-3 border-b border-neutral-200/50">Resumen de Cotización</h2>
            
            <div className="space-y-3.5 mb-8 pb-5 border-b border-neutral-200/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-700 font-bold">Total de artículos</span>
                <span className="font-black text-primary text-lg">{totalItems} unidades</span>
              </div>
            </div>

            <div className="mb-8 space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                Enviar cotización a
              </label>
              <div className="flex flex-col gap-2.5">
                {(Object.keys(BRANCHES) as BranchId[]).map((id) => {
                  const isSelected = selectedBranch === id;
                  const Icon = id === 'giovanny' ? User : MapPin;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedBranch(id)}
                      className={`w-full flex items-center gap-3.5 p-3.5 text-left rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
                        isSelected
                          ? 'border-primary/40 bg-primary/5 text-primary shadow-sm'
                          : 'border-neutral-200/60 bg-white text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'
                      }`}
                    >
                      <div className={`p-2 rounded-xl transition-colors duration-300 ${isSelected ? 'bg-primary/10 text-primary' : 'bg-neutral-100 text-neutral-400'}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-black tracking-tight">
                          {BRANCHES[id].name}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-bold mt-0.5">
                          {BRANCHES[id].label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full gap-2.5 py-4 rounded-xl font-bold bg-[#25D366] text-white hover:bg-[#20ba59] border-none shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.01] transition-all h-12 text-sm" 
                onClick={() => {
                  items.forEach(item => trackEvent(item.id, 'send_whatsapp'));
                  window.location.href = generateWhatsAppLink(items, selectedBranch);
                }}
              >
                <Send className="h-4.5 w-4.5 fill-white" />
                Enviar a WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2.5 py-4 rounded-xl font-bold border-neutral-300 bg-white hover:bg-neutral-50 hover:scale-[1.01] transition-all h-12 text-sm text-neutral-700"
                onClick={() => generatePDF(items)}
              >
                <FileText className="h-4.5 w-4.5 text-neutral-500" />
                Descargar PDF
              </Button>
            </div>

            <p className="mt-6 text-[10px] text-neutral-400 text-center leading-normal font-medium max-w-xs mx-auto">
              La cotización se enviará de forma automática al número oficial del destino seleccionado.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}

