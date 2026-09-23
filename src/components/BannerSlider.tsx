import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight
} from 'lucide-react';
import { Banner } from '../types';

interface BannerSliderProps {
  banners: Banner[];
  onSelectCategory?: (category: string) => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  banners,
  onSelectCategory,
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

  const handleBannerClick = (banner: Banner) => {
    if (banner.tagCategory && onSelectCategory) {
      onSelectCategory(banner.tagCategory);
      const catalogEl = document.getElementById('catalogo-achados');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (banner.linkUrl) {
      if (banner.linkUrl.startsWith('http')) {
        window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
      } else if (banner.linkUrl.startsWith('#')) {
        const target = document.querySelector(banner.linkUrl);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4 pb-2">
      {/* Main Interactive Carousel Frame with Touch & Swipe Gestures */}
      <div 
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 shadow-md group min-h-[250px] sm:min-h-[320px] md:min-h-[360px] h-[260px] sm:h-[340px] md:h-[380px] border border-slate-200/60 select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Background Image with smooth transitions */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlays to guarantee perfect text contrast on mobile and desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/75 sm:via-slate-900/60 to-slate-900/30 sm:to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
        </div>

        {/* Content Box with Fluid Mobile Spacing */}
        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-10 md:px-14 max-w-xl sm:max-w-2xl text-left py-4">
          {/* Badge */}
          {currentBanner.badge && (
            <div className="mb-2 sm:mb-3">
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-orange-600 text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-xs">
                {currentBanner.badge}
              </span>
            </div>
          )}

          {/* Title - Fluid typography */}
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight font-display tracking-tight mb-1.5 sm:mb-2 drop-shadow-xs line-clamp-2">
            {currentBanner.title}
          </h2>

          {/* Subtitle */}
          <p className="text-[11px] sm:text-sm text-slate-200 font-medium leading-relaxed mb-4 sm:mb-6 line-clamp-2 max-w-lg drop-shadow-xs">
            {currentBanner.subtitle}
          </p>

          {/* Action Button */}
          <div>
            <button
              onClick={() => handleBannerClick(currentBanner)}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-white hover:bg-orange-500 hover:text-white text-slate-950 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 shadow-md active:scale-95 cursor-pointer group/btn"
            >
              <span>{currentBanner.buttonText || 'Ver Ofertas'}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Navigation Arrows (Touch & Click friendly) */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Banner anterior"
              className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/50 hover:bg-slate-900/80 text-white backdrop-blur-xs items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer border border-white/20"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Próximo banner"
              className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/50 hover:bg-slate-900/80 text-white backdrop-blur-xs items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer border border-white/20"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Indicator dots & progress pill */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-10 md:left-14 z-20 flex items-center gap-1.5 sm:gap-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 sm:w-8 bg-orange-500'
                    : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
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
