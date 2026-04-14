'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 transition-transform hover:scale-105">
              <img src="/logo.jpeg" alt="Logo" className="h-full w-full object-contain rounded-xl shadow-sm" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">Librería Crayola</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Inicio
            </Link>
            <Link href="/catalog" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Catálogo
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white p-4 space-y-4">
          <Link href="/" className="block text-sm font-medium p-2" onClick={() => setIsMenuOpen(false)}>
            Inicio
          </Link>
          <Link href="/catalog" className="block text-sm font-medium p-2" onClick={() => setIsMenuOpen(false)}>
            Catálogo
          </Link>
        </div>
      )}
    </nav>
  );
};
