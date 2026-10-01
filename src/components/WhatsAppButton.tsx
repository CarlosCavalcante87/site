import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getStoredSiteConfig } from '../services/storage';
import { subscribeToSiteConfig } from '../services/firebaseService';
import { SiteConfig } from '../types';

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
  const message = customMessage || config.whatsappDefaultMessage || 'Olá! Gostaria de tirar algumas dúvidas sobre as ofertas e promoções do Ofertas do Dia.';

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
            <WhatsAppIcon className="w-4 h-4 fill-current" />
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
          <div className="relative flex items-center justify-center shrink-0">
            <WhatsAppIcon className="w-5 h-5 text-white fill-current animate-icon-pulse" />
          </div>
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
