import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppButton';
import { getStoredSiteConfig } from '../services/storage';
import { subscribeToSiteConfig } from '../services/firebaseService';
import { SiteConfig } from '../types';

interface NavbarProps {
  onGoHome: () => void;
  onOpenAdmin?: () => void;
  isAdminActive?: boolean;
  totalProductsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  totalProductsCount,
}) => {
  const [config, setConfig] = useState<SiteConfig>(getStoredSiteConfig);

  useEffect(() => {
    const unsub = subscribeToSiteConfig((cloudConfig) => {
      setConfig(cloudConfig);
    });
    return () => unsub();
  }, []);

  const handleOpenWhatsApp = () => {
    const phone = config.whatsappNumber || '5511999999999';
    const cleanPhone = phone.replace(/\D/g, '');
    const message = config.whatsappDefaultMessage || 'Olá! Gostaria de tirar dúvidas sobre as promoções do Achados do Dia.';
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white shadow-md shadow-orange-600/15 border-b border-orange-600/30">
      {/* Top subtle announcement strip */}
      <div className="bg-orange-700/40 backdrop-blur-xs border-b border-orange-400/20 text-[11px] font-medium text-orange-100 py-1 px-4 text-center hidden sm:flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse"></span>
        <span>As melhores ofertas e achadinhos verificados com preços e links das lojas oficiais!</span>
      </div>

      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer transition-transform active:scale-98 min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white text-orange-600 flex items-center justify-center shadow-md shadow-black/10 shrink-0 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <span className="text-base sm:text-xl font-extrabold tracking-tight text-white drop-shadow-xs truncate font-display">
            Achados do Dia
          </span>
          <span className="hidden sm:inline-flex text-[11px] font-bold text-orange-100 bg-white/20 backdrop-blur-xs border border-white/25 px-2.5 py-0.5 rounded-full ml-1 tabular-nums shrink-0">
            {totalProductsCount} achados
          </span>
        </button>

        {/* Action: WhatsApp "Tirar Dúvidas" Button */}
        <button
          onClick={handleOpenWhatsApp}
          className="flex items-center gap-1.5 sm:gap-2 bg-white hover:bg-emerald-50 text-slate-900 active:scale-95 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-full shadow-md shadow-orange-950/20 transition-all duration-200 cursor-pointer font-bold text-xs sm:text-sm border border-white/40 shrink-0 hover:shadow-lg hover:-translate-y-0.5"
          title="Falar conosco no WhatsApp para tirar dúvidas"
          aria-label="Tirar dúvidas pelo WhatsApp"
        >
          <div className="relative flex items-center justify-center shrink-0">
            <WhatsAppIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#25D366] fill-current animate-icon-pulse" />
          </div>
          <span className="tracking-tight whitespace-nowrap font-bold text-emerald-700">
            Tirar Dúvidas
          </span>
        </button>
      </div>
    </header>
  );
};
