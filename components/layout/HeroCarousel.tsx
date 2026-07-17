'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IMAGES = [
  {
    src: '/carrusel-1.png',
    alt: 'Banner Promocional 1'
  },
  {
    src: '/carrusel-2.png',
    alt: 'Banner Promocional 2'
  },
  {
    src: '/carrusel-3.png',
    alt: 'Banner Promocional 3'
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
            <img
              src={IMAGES[currentIndex].src}
              alt={IMAGES[currentIndex].alt}
              className="w-full h-full object-cover select-none"
              draggable="false"
            />
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
