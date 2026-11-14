'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IMAGES = [
  {
    src: '/carrusel-1.jpg',
    alt: 'Norma y Kiut - Novedades escolares y papelería',
    href: '/catalog?category=Escolar'
  },
  {
    src: '/carrusel-2.jpg',
    alt: 'Resistol Ferretero - Adhesivos y pegamentos industriales',
    href: '/catalog?brandId=983d2b51-0244-448e-94a6-c5af3f8d1aa3'
  },
  {
    src: '/carrusel-3.jpg',
    alt: 'Casio - Variedad de calculadoras científicas y de oficina',
    href: '/catalog?search=calculadora'
  },
  {
    src: '/carrusel-4.jpg',
    alt: 'Faber-Castell y Artline - Arte y escritura profesional',
    href: '/catalog?brandId=e962e3f4-0311-4cce-891a-0d526656202a'
  },
  {
    src: '/carrusel-5.jpg',
    alt: 'Crayola Oficial - Creatividad, colores y témperas',
    href: '/catalog?brandId=3ec216f3-bd2f-476c-9352-87a6258acad2'
  }
];

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  }, []);

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Reset autoplay timer when index changes
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(handleNext, 5000); // Change slide every 5 seconds

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [handleNext, currentIndex]);

  const activeImage = IMAGES[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-neutral-100 shadow-[0_15px_40px_rgba(0,0,0,0.06)] group bg-neutral-50 aspect-[2/1] md:aspect-[3024/748]">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Link href={activeImage.href} className="block w-full h-full cursor-pointer">
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-[1.01]"
                draggable="false"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/70 hover:bg-white text-neutral-800 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 z-20"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/70 hover:bg-white text-neutral-800 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 z-20"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-neutral-900/30 px-3 py-1.5 rounded-full backdrop-blur-md">
        {IMAGES.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
