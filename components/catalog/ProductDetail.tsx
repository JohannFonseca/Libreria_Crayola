'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingCart, MessageCircle, Plus, Minus, Sparkles, Building2, MapPin, Truck, Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/lib/types';
import { formatCRC } from '@/lib/formatters';
import { BRANCHES } from '@/lib/whatsapp-helper';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, color?: string, quantity?: number) => void;
}

export const ProductDetail = ({ product, onClose, onAddToCart }: ProductDetailProps) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]?.color_name
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedColor, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 600);
  };

  const handleDirectWhatsApp = () => {
    const phoneNumber = BRANCHES.liberia.phone;
    const priceText = product.precio_venta ? ` por ${formatCRC(product.precio_venta)}` : '';
    const colorText = selectedColor ? ` (Color: ${selectedColor})` : '';
    const message = `Hola Librería Crayola! Me interesa consultar la disponibilidad inmediata de: *${product.name}*${colorText}${priceText}. Cantidad aproximada: ${quantity}.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const hasPrice = product.precio_venta !== null && product.precio_venta !== undefined && product.precio_venta > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-neutral-100 z-10 custom-scrollbar">
        {/* Close Button */}
        <button 
          className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-all shadow-md border border-neutral-100"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left: Product Image */}
          <div className="relative aspect-square w-full bg-gradient-to-br from-neutral-50 to-neutral-100/50 md:w-1/2 flex items-center justify-center p-8 sm:p-12">
            {product.image_url && !imageError ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-8 transition-transform duration-500 hover:scale-105"
                onError={() => setImageError(true)}
                priority
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-neutral-300 gap-2">
                <ShoppingBag className="h-12 w-12 text-neutral-200" />
                <span className="text-sm font-semibold text-neutral-400">Sin imagen disponible</span>
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
              {product.destacado && (
                <Badge className="bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs border-none">
                  Destacado
                </Badge>
              )}
              {product.tipo_cliente === 'empresa' && (
                <Badge className="bg-neutral-900 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs border-none">
                  Empresa
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Product Details & Actions */}
          <div className="flex w-full flex-col p-6 sm:p-8 md:w-1/2">
            {/* Category and Brand row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-lg px-2.5 py-1 text-[11px] font-black uppercase tracking-wider">
                {product.categories?.name || 'Varios'}
              </Badge>
              {product.brands?.logo_url ? (
                <div className="h-7 max-w-[90px] px-2 py-0.5 rounded-lg bg-neutral-100 border border-neutral-200/80 flex items-center justify-center">
                  <img src={product.brands.logo_url} alt={product.brands.name} className="max-h-full max-w-full object-contain" />
                </div>
              ) : product.brands?.name ? (
                <span 
                  className="px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border shadow-xs"
                  style={{
                    backgroundColor: product.brands.bg_color ? `${product.brands.bg_color}15` : '#f3f4f6',
                    color: product.brands.color || '#374151',
                    borderColor: product.brands.color ? `${product.brands.color}30` : '#e5e7eb',
                  }}
                >
                  {product.brands.name}
                </span>
              ) : null}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 leading-tight mb-4">
              {product.name}
            </h2>

            {/* Price Box */}
            <div className="mb-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 block mb-0.5">
                  {hasPrice ? 'Precio Unitario' : 'Modalidad de venta'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
                    {formatCRC(product.precio_venta)}
                  </span>
                  {hasPrice && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      IVA incluido
                    </span>
                  )}
                </div>
              </div>
              {product.barcode && (
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Código / SKU</span>
                  <span className="text-xs font-mono font-bold text-neutral-600">{product.barcode}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6 text-neutral-600 text-sm leading-relaxed max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
              <p>{product.description || 'Suministro de papelería seleccionado con los más altos estándares de durabilidad y calidad para su uso en oficinas, centros educativos o el hogar.'}</p>
            </div>

            {/* Color variants if present */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Colores Disponibles:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 border ${
                        selectedColor === color.color_name
                          ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20 scale-105'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedColor(color.color_name)}
                    >
                      {color.color_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6 flex items-center justify-between p-3 rounded-2xl bg-neutral-50/70 border border-neutral-100">
              <span className="text-xs font-bold text-neutral-600">Cantidad para cotizar:</span>
              <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-2 py-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1 text-neutral-500 hover:text-primary transition-colors disabled:opacity-30"
                  disabled={quantity <= 1}
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-black text-sm text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1 text-neutral-500 hover:text-primary transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Availability info pill */}
            <div className="mb-6 grid grid-cols-2 gap-2 text-[11px] text-neutral-500">
              <div className="flex items-center gap-1.5 bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">Liberia & Bagaces</span>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                <Truck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Envíos a todo el país</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto space-y-2.5">
              <Button 
                className={`w-full gap-2.5 h-12 text-sm font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] ${
                  justAdded 
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                    : 'bg-primary hover:bg-primary/95 text-white shadow-primary/25 hover:scale-[1.01]'
                }`}
                onClick={handleAdd}
              >
                {justAdded ? (
                  <>
                    <Check className="h-5 w-5 stroke-[3]" />
                    ¡Agregado a la cotización!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Agregar {quantity > 1 ? `(${quantity})` : ''} a la cotización
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="w-full flex items-center justify-center gap-2 h-11 text-xs font-extrabold rounded-2xl border border-emerald-500/30 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-700 transition-all active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                Consultar disponibilidad por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
