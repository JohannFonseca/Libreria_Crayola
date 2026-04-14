'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { CartItem, Product } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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

    setToastMessage(`Agregado: ${product.name}`);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setToastMessage(null), 3000);
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
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 flex items-center gap-3 rounded-2xl bg-neutral-900/90 py-3 pl-4 pr-5 text-sm font-medium text-white shadow-2xl backdrop-blur-md sm:bottom-10 sm:right-10"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <p className="max-w-[200px] truncate">{toastMessage}</p>
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
