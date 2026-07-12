'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { totalItems } = useCart();
  const pathname = usePathname();

  const isLinkActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Catálogo', path: '/catalog' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200/50 bg-white/75 backdrop-blur-lg shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-auto sm:h-12 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
            <img src="/LogoGrande.png" alt="Logo" className="h-full w-auto object-contain mix-blend-multiply" />
          </div>
          <span className="text-xl font-black tracking-tight text-neutral-900 sm:text-2xl group-hover:text-primary transition-colors duration-300">
            Librería <span className="text-primary">Crayola</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative py-2 text-sm font-semibold tracking-wide transition-colors duration-300 ${
                  active ? 'text-primary' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/catalog" className="hidden sm:inline-block">
            <Button variant="ghost" size="sm" className="rounded-full hover:bg-neutral-100/80 transition-colors h-10 w-10 p-0">
              <Search className="h-5 w-5 text-neutral-600" />
            </Button>
          </Link>
          
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="relative rounded-full hover:bg-neutral-100/80 transition-colors h-10 w-10 p-0">
              <ShoppingCart className="h-5 w-5 text-neutral-600" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-md shadow-primary/30"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden rounded-full hover:bg-neutral-100/80 h-10 w-10 p-0 flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5 text-neutral-600" /> : <Menu className="h-5 w-5 text-neutral-600" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-neutral-100 bg-white shadow-lg overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => {
                const active = isLinkActive(link.path);
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-base font-bold transition-all ${
                      active 
                        ? 'bg-primary/5 text-primary' 
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link 
                href="/catalog" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              >
                <Search className="h-5 w-5" /> Buscar productos
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

