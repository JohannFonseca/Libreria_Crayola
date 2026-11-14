'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Menu, Search, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Auto focus when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchClick = () => {
    if (pathname === '/catalog') {
      const el = document.getElementById('catalog-search-input');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    setIsSearchOpen((prev) => !prev);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/catalog?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200/50 bg-white/80 backdrop-blur-lg shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative h-10 w-auto sm:h-12 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
            <img src="/LogoGrande.png" alt="Logo" className="h-full w-auto object-contain mix-blend-multiply" />
          </div>
          <span className="text-xl font-black tracking-tight text-neutral-900 sm:text-2xl group-hover:text-primary transition-colors duration-300">
            Librería <span className="text-primary">Crayola</span>
          </span>
        </Link>

        {/* Center Nav Links (Hidden when search is expanded on desktop) */}
        {!isSearchOpen && (
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
        )}

        {/* Desktop Expandable Search Input */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.form
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%', maxWidth: '420px' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center relative mx-4"
            >
              <Search className="absolute left-3.5 h-4 w-4 text-neutral-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar artículo, marca, papelería..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-20 rounded-full border border-neutral-200 bg-neutral-50/80 text-xs font-semibold text-neutral-800 placeholder:text-neutral-400 focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <Button
                  type="submit"
                  size="sm"
                  className="h-7 px-2.5 rounded-full text-[10px] font-bold bg-primary hover:bg-primary/95 text-white"
                >
                  Buscar
                </Button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                  title="Cerrar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Right Actions: Search Toggle, Cart, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearchClick}
            className={`rounded-full hover:bg-neutral-100/80 transition-colors h-10 w-10 p-0 flex items-center justify-center ${
              isSearchOpen ? 'bg-neutral-100 text-primary' : 'text-neutral-600'
            }`}
            title="Buscar productos"
            aria-label="Buscar productos"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Cart Button */}
          <Link href="/cart">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative rounded-full hover:bg-neutral-100/80 transition-colors h-10 w-10 p-0"
              title="Ver cotización / carrito"
            >
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

          {/* Mobile Menu Hamburger */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden rounded-full hover:bg-neutral-100/80 h-10 w-10 p-0 flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menú principal"
          >
            {isMenuOpen ? <X className="h-5 w-5 text-neutral-600" /> : <Menu className="h-5 w-5 text-neutral-600" />}
          </Button>
        </div>
      </div>

      {/* Mobile Search & Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-neutral-100 bg-white shadow-lg overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Quick Search on Mobile */}
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar en el catálogo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-2xl border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-800 placeholder:text-neutral-400 focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                />
                <button
                  type="submit"
                  className="absolute right-2 h-7 w-7 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Navigation Links */}
              <div className="space-y-1 pt-1">
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

