import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getStoredSiteConfig } from '../services/storage';
import { subscribeToSiteConfig } from '../services/firebaseService';
import { SiteConfig } from '../types';

interface WhatsAppButtonProps {
  customNumber?: string;
  customMessage?: string;
  hasBottomBar?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  customNumber,
  customMessage,
  hasBottomBar = false,
}) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(() => getStoredSiteConfig());

  useEffect(() => {
    const unsub = subscribeToSiteConfig((newConfig) => {
      if (newConfig) {
        setConfig(newConfig);
      }
    });
    return () => unsub();
  }, []);

  const phone = customNumber || config.whatsappNumber || '5511999999999';
  const message = customMessage || config.whatsappDefaultMessage || 'Olá! Gostaria de tirar algumas dúvidas sobre as ofertas e achadinhos do Achados do Dia.';

  const handleOpenWhatsApp = () => {
    // Clean phone number: remove non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMsg = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`fixed ${hasBottomBar ? 'bottom-20 sm:bottom-6' : 'bottom-4 sm:bottom-6'} right-3 sm:right-6 z-40 flex flex-col items-end gap-2 group transition-all duration-300`}>
      {/* Floating preview badge / speech bubble (shows on click or hover) */}
      {isTooltipOpen && (
        <div className="bg-white text-slate-800 p-3 sm:p-3.5 rounded-2xl shadow-xl border border-slate-200 text-xs max-w-[280px] sm:max-w-xs mb-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Atendimento Online
            </span>
            <button
              onClick={() => setIsTooltipOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold p-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug mb-2.5">
            Dúvidas sobre algum produto, link de compra ou loja parceira? Fale conosco direto no WhatsApp!
          </p>
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Iniciar Conversa</span>
          </button>
        </div>
      )}

      {/* Main WhatsApp Pill Button */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={handleOpenWhatsApp}
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-lg shadow-emerald-500/25 transition-all duration-200 cursor-pointer font-bold text-xs sm:text-sm border border-emerald-400/30"
          aria-label="Tirar dúvidas pelo WhatsApp"
        >
          <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white"></span>
          </span>
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
          <span className="whitespace-nowrap tracking-tight font-display text-xs sm:text-sm">
            Tirar Dúvidas
          </span>
        </button>

        {/* Small toggle for preview bubble */}
        <button
          onClick={() => setIsTooltipOpen(!isTooltipOpen)}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-xs transition-colors cursor-pointer"
          title="Mais detalhes sobre o atendimento"
        >
          ?
        </button>
      </div>
    </div>
  );
};
