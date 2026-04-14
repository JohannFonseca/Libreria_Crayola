'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, FileText, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { generateWhatsAppLink } from '@/lib/whatsapp-helper';
import { generatePDF } from '@/lib/pdf-generator';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();

  if (totalItems === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-neutral-500 mb-8">Agrega algunos productos del catálogo para comenzar tu cotización.</p>
        <Link href="/catalog">
          <Button>Ir al Catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/catalog">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Tu Cotización</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <Card key={`${item.id}-${item.selectedColor}`} className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden relative">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  {item.selectedColor && (
                    <Badge variant="secondary" className="mt-1">
                      Color: {item.selectedColor}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-200 rounded-full px-2">
                    <button
                      className="p-1 hover:text-primary transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      className="p-1 hover:text-primary transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                    onClick={() => removeItem(item.id, item.selectedColor)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}

          <div className="flex justify-end">
            <Button variant="ghost" className="text-red-500 hover:bg-red-50" onClick={clearCart}>
              Vaciar Carrito
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24 p-8 bg-neutral-50/50 border-neutral-200">
            <h2 className="text-xl font-bold mb-6">Resumen</h2>
            
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-200">
              <span className="text-neutral-600">Total de productos</span>
              <span className="text-2xl font-bold">{totalItems}</span>
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full gap-3 py-4" 
                onClick={() => window.location.href = generateWhatsAppLink(items)}
              >
                <Send className="h-5 w-5" />
                Enviar a WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-3 py-4"
                onClick={() => generatePDF(items)}
              >
                <FileText className="h-5 w-5" />
                Descargar PDF
              </Button>
            </div>

            <p className="mt-6 text-xs text-neutral-400 text-center">
              La cotización se enviará directamente al número oficial de la librería.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
