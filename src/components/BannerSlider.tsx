import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '../types';

interface BannerSliderProps {
  banners: Banner[];
  onSelectCategory?: (category: string) => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  banners,
}) => {
  const activeBanners = banners.filter((b) => b.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Touch swipe support for smooth mobile swiping
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = 45; // pixels

  // Auto-play every 6 seconds if not hovered or touched
  useEffect(() => {
    if (activeBanners.length <= 1 || isHovered) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [activeBanners.length, isHovered]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4 pb-2">
      {/* Banner puro sem textos e sem links */}
      <div 
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-100 shadow-sm group h-[140px] xs:h-[170px] sm:h-[220px] md:h-[270px] lg:h-[300px] border border-slate-200/80 select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Imagem do Banner em destaque total */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.title || 'Banner promocional'}
            className="w-full h-full object-cover object-center transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Setas de navegação (apenas se houver mais de 1 banner) */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Banner anterior"
              className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs items-center justify-center transition-all opacity-75 hover:opacity-100 cursor-pointer shadow-md border border-white/20"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Próximo banner"
              className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs items-center justify-center transition-all opacity-75 hover:opacity-100 cursor-pointer shadow-md border border-white/20"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Indicadores / Dots centralizados na parte inferior */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-xs">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-5 sm:w-6 bg-orange-500'
                    : 'w-1.5 sm:w-2 bg-white/60 hover:bg-white/90'
                }`}
                aria-label={`Ir para o banner ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
