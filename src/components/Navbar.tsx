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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/70 shadow-xs">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer transition-opacity hover:opacity-90 min-w-0"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Flame className="w-4.5 h-4.5 fill-current" />
          </div>
          <span className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 truncate">
            Achados do Dia
          </span>
          <span className="hidden sm:inline-flex text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-1 tabular-nums shrink-0">
            {totalProductsCount} achados
          </span>
        </button>

        {/* Action: WhatsApp "Tirar Dúvidas" Button in place of the former Admin button */}
        <button
          onClick={handleOpenWhatsApp}
          className="flex items-center gap-1.5 sm:gap-2 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-full shadow-sm shadow-emerald-500/20 transition-all duration-200 cursor-pointer font-bold text-xs sm:text-sm border border-emerald-400/30 shrink-0"
          title="Falar conosco no WhatsApp para tirar dúvidas"
          aria-label="Tirar dúvidas pelo WhatsApp"
        >
          <div className="relative flex items-center justify-center shrink-0">
            <WhatsAppIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white fill-current animate-icon-pulse" />
          </div>
          <span className="tracking-tight whitespace-nowrap font-medium sm:font-bold">
            Tirar Dúvidas
          </span>
        </button>
      </div>
    </header>
  );
};
