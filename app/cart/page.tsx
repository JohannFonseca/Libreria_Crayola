'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, FileText, Send, ArrowLeft, MapPin, ShoppingBag, User, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { generateWhatsAppLink, generateMailtoLink, BRANCHES, BranchId } from '@/lib/whatsapp-helper';
import { generatePDF } from '@/lib/pdf-generator';
import { trackEvent } from '@/lib/api/analytics';
import { formatCRC } from '@/lib/formatters';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();

  const totalPrice = items.reduce((acc, item) => acc + (item.precio_venta || 0) * item.quantity, 0);
  const hasPrices = items.some(item => item.precio_venta !== null && item.precio_venta !== undefined && item.precio_venta > 0);

  if (totalItems === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <div className="mb-6 rounded-3xl bg-neutral-50 border border-neutral-100 p-8 w-24 h-24 flex items-center justify-center mx-auto text-neutral-400 shadow-sm">
          <ShoppingBag className="h-10 w-10 text-neutral-300" />
        </div>
        <h1 className="text-3xl font-black text-neutral-900 mb-3 tracking-tight">Tu cotización está vacía</h1>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Navega por nuestro catálogo de productos y agrega los artículos que necesitas cotizar para sucursal Liberia o Bagaces.
        </p>
        <Link href="/catalog">
          <Button className="h-12 px-8 font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-102 transition-all">
            Explorar Catálogo de Productos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-100">
        <div className="flex items-center gap-4">
          <Link href="/catalog">
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 shadow-xs h-10 px-4 text-xs font-bold">
              <ArrowLeft className="h-4 w-4" />
              Catálogo
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">Tu Lista de Cotización</h1>
            <p className="text-xs text-neutral-400 font-medium">Revisa tus artículos antes de enviarla a sucursal o descargar el PDF</p>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-neutral-500 font-medium bg-neutral-50 px-4 py-2 rounded-2xl border border-neutral-100">
          Total de artículos: <span className="font-black text-neutral-900">{totalItems} unidades</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Products List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const hasItemPrice = item.precio_venta !== null && item.precio_venta !== undefined && item.precio_venta > 0;
            const lineTotal = (item.precio_venta || 0) * item.quantity;

            return (
              <Card key={`${item.id}-${item.selectedColor}`} className="p-4 sm:p-5 border-neutral-200/70 hover:border-primary/20 hover:shadow-md transition-all duration-300 rounded-3xl bg-white shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  
                  {/* Product Image */}
                  <div className="h-20 w-20 flex-shrink-0 bg-neutral-50 rounded-2xl overflow-hidden relative border border-neutral-100 p-2 flex items-center justify-center">
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
                  <div className="flex-1 space-y-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-neutral-800 leading-tight">{item.name}</h3>
                    <div className="flex flex-wrap gap-2 items-center">
                      {item.selectedColor && (
                        <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 border-none text-[9px] font-black rounded-md uppercase py-0.5 px-2">
                          Color: {item.selectedColor}
                        </Badge>
                      )}
                      {item.barcode && (
                        <span className="text-[10px] font-mono text-neutral-400">SKU: {item.barcode}</span>
                      )}
                    </div>

                    {/* Unit Price badge */}
                    {hasItemPrice ? (
                      <div className="text-xs text-neutral-400 font-medium pt-0.5">
                        {formatCRC(item.precio_venta)} c/u
                      </div>
                    ) : (
                      <div className="text-[11px] text-amber-600 font-medium pt-0.5">
                        Precio a consultar por volumen
                      </div>
                    )}
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    {/* Line total price */}
                    {hasItemPrice && (
                      <div className="text-right sm:text-right min-w-[90px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Subtotal</span>
                        <span className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                          {formatCRC(lineTotal)}
                        </span>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-neutral-200 bg-neutral-50 rounded-xl px-1.5 py-0.5 shadow-inner">
                        <button
                          className="p-1.5 hover:text-primary transition-colors hover:scale-110 active:scale-90"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor)}
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-black text-neutral-800 text-sm">{item.quantity}</span>
                        <button
                          className="p-1.5 hover:text-primary transition-colors hover:scale-110 active:scale-90"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor)}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      <button
                        className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        onClick={() => removeItem(item.id, item.selectedColor)}
                        title="Eliminar producto"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </Card>
            );
          })}

          <div className="flex justify-between items-center pt-2">
            <Link href="/catalog" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              + Agregar más productos desde el catálogo
            </Link>
            <Button variant="ghost" className="text-red-500 hover:bg-red-50/80 rounded-xl font-bold text-xs h-9 px-3" onClick={clearCart}>
              Vaciar Carrito
            </Button>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <Card className="sticky top-24 p-6 sm:p-8 bg-neutral-50/90 border border-neutral-200/80 rounded-3xl shadow-sm">
            <h2 className="text-base font-black text-neutral-900 mb-6 uppercase tracking-wider pb-3 border-b border-neutral-200/60 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Resumen de Cotización</span>
            </h2>
            
            <div className="space-y-3 mb-6 pb-5 border-b border-neutral-200/60">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-600 font-semibold">Total de artículos</span>
                <span className="font-black text-neutral-900 text-base">{totalItems} unidades</span>
              </div>
              
              {hasPrices && (
                <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200/40">
                  <div className="flex flex-col">
                    <span className="text-neutral-900 font-black text-base">Total Estimado</span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">IVA incluido</span>
                  </div>
                  <span className="font-black text-primary text-2xl tracking-tight">
                    {formatCRC(totalPrice)}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-1">
                <MapPin className="h-4 w-4 text-primary" />
                Elija destino y canal de envío:
              </label>
              
              <div className="flex flex-col gap-3.5">
                {(Object.keys(BRANCHES) as BranchId[]).map((id) => {
                  const Icon = id === 'giovanny' ? User : MapPin;
                  return (
                    <div
                      key={id}
                      className="w-full p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-3 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-neutral-100 text-neutral-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-black tracking-tight text-neutral-800">
                            {id === 'giovanny' ? `Ejecutivo: ${BRANCHES[id].name}` : `Sucursal: ${BRANCHES[id].name}`}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wide">
                            {BRANCHES[id].label}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button 
                          className="w-full gap-2 py-2.5 rounded-xl font-bold bg-[#25D366] text-white hover:bg-[#20ba59] border-none shadow-sm flex items-center justify-center h-10 text-xs transition-transform active:scale-95" 
                          onClick={() => {
                            items.forEach(item => trackEvent(item.id, 'send_whatsapp'));
                            window.location.href = generateWhatsAppLink(items, id);
                          }}
                        >
                          <Send className="h-3.5 w-3.5 fill-white" />
                          Enviar Cotización por WhatsApp
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="outline" 
                            className="w-full gap-1.5 py-2 rounded-xl font-bold border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 h-9 text-[11px] transition-transform active:scale-95"
                            onClick={() => {
                              window.location.href = generateMailtoLink(items, id);
                            }}
                          >
                            <Mail className="h-3.5 w-3.5 text-neutral-400" />
                            Por Correo
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full gap-1.5 py-2 rounded-xl font-bold border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 h-9 text-[11px] transition-transform active:scale-95"
                            onClick={() => generatePDF(items, id)}
                          >
                            <FileText className="h-3.5 w-3.5 text-neutral-400" />
                            Descargar PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="mt-6 text-[11px] text-neutral-400 text-center leading-normal font-medium max-w-xs mx-auto">
              Precios válidos al momento de emitir la cotización. Sujetos a validación final de stock en mostrador.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}
