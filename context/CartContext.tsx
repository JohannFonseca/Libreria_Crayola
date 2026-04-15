'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { CartItem, Product } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, color?: string) => void;
  removeItem: (id: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<{name: string, image?: string} | null>(null);
  const [showToast, setShowToast] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = (product: Product, color?: string) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id && item.selectedColor === color
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1, selectedColor: color }];
    });

    setLastAddedItem({ name: product.name, image: product.image_url });
    setShowToast(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowToast(false), 4000);
  };

  const removeItem = (id: string, color?: string) => {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.selectedColor === color)));
  };

  const updateQuantity = (id: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeItem(id, color);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedColor === color ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems }}
    >
      {children}

      <AnimatePresence>
        {showToast && lastAddedItem && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="fixed left-4 right-4 top-6 z-[101] mx-auto flex max-w-sm items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:bottom-10 sm:left-auto sm:right-10 sm:top-auto sm:max-w-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Check className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900">Agregado con éxito</p>
                <p className="truncate text-xs text-neutral-500">{lastAddedItem.name}</p>
              </div>
            </div>
            
            <Link 
              href="/cart"
              onClick={() => setShowToast(false)}
              className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition-all hover:bg-primary/90 active:scale-95"
            >
              Ver Carrito
              <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
