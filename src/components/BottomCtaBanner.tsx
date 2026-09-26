import React from 'react';
import { 
  MessageSquare, 
  ExternalLink, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  ArrowRight,
  Gift
} from 'lucide-react';
import { BottomCtaBannerConfig } from '../types';
import { WhatsAppIcon } from './WhatsAppButton';

interface BottomCtaBannerProps {
  config?: BottomCtaBannerConfig;
  whatsappNumber?: string;
  className?: string;
}

export const BottomCtaBanner: React.FC<BottomCtaBannerProps> = ({
  config,
  whatsappNumber = '5511999999999',
  className = '',
}) => {
  // If not enabled or explicitly set to false, don't render
  if (!config || config.isActive === false) {
    return null;
  }

  const cleanPhone = (whatsappNumber || '5511999999999').replace(/\D/g, '');
  const directMessage = config.whatsappMessage || 'Olá! Estava navegando no Ofertas do Dia e gostaria de pedir ajuda para encontrar uma oferta/produto confiável:';
  const encodedDirectMessage = encodeURIComponent(directMessage);
  const directWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedDirectMessage}`;

  const groupUrl = config.targetUrl?.trim() || '';

  const handleOpenDirect = () => {
    window.open(directWhatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGroup = () => {
    if (groupUrl) {
      window.open(groupUrl, '_blank', 'noopener,noreferrer');
    } else {
      handleOpenDirect();
    }
  };

  const handleOpenCustom = () => {
    if (config.targetUrl?.trim()) {
      window.open(config.targetUrl.trim(), '_blank', 'noopener,noreferrer');
    } else {
      handleOpenDirect();
    }
  };

  const linkType = config.linkType || 'whatsapp_direct';
  const hasGroupUrl = Boolean(groupUrl);

  return (
    <div className={`w-full max-w-7xl mx-auto px-3 sm:px-6 my-8 sm:my-12 ${className}`}>
      <section 
        aria-label="Chamada Especial WhatsApp"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 border-2 border-emerald-500/30 shadow-2xl shadow-emerald-950/40 p-6 sm:p-10 text-white"
      >
        {/* Decorative Glow Elements */}
        <div 
          aria-hidden="true" 
          className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
        />
        <div 
          aria-hidden="true" 
          className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
          {/* Left Column: Text, Value proposition & Badges */}
          <div className="flex-1 space-y-4">
            {/* Top Pill / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{config.badge || '🔍 Não encontrou o que procurava? Pedido 100% Gratuito!'}</span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              {config.title || 'Quer que a gente encontre um produto ou oferta específica para você?'}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
              {config.description || 'Se você precisa de qualquer equipamento, acessório ou achadinho confiável que não está na lista, fale conosco! Nós garimpamos o menor preço oficial com cupom e segurança pra você, sem nenhum custo.'}
            </p>

            {/* Benefit Bullets / Micro-proofs */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-emerald-300/90 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <Gift className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Garimpagem 100% Gratuita</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-emerald-300/90 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Links & Lojas Verificadas</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-emerald-300/90 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Atendimento no WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-conversion Action Buttons */}
          <div className="lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[260px] sm:min-w-[300px]">
            {/* Primary Action Button */}
            {linkType === 'whatsapp_direct' && (
              <button
                type="button"
                onClick={handleOpenDirect}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/45 transition-all transform active:scale-98 cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                </div>
                <span className="truncate">{config.buttonText || 'Pedir Oferta sem Custo no WhatsApp'}</span>
                <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            )}

            {linkType === 'whatsapp_group' && (
              <button
                type="button"
                onClick={handleOpenGroup}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/45 transition-all transform active:scale-98 cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="truncate">{config.buttonText || 'Entrar no Grupo VIP do WhatsApp'}</span>
                <ExternalLink className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform shrink-0" />
              </button>
            )}

            {linkType === 'custom_url' && (
              <button
                type="button"
                onClick={handleOpenCustom}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/45 transition-all transform active:scale-98 cursor-pointer group"
              >
                <span className="truncate">{config.buttonText || 'Abrir Link'}</span>
                <ExternalLink className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform shrink-0" />
              </button>
            )}

            {linkType === 'hybrid' && (
              <>
                <button
                  type="button"
                  onClick={handleOpenDirect}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/45 transition-all transform active:scale-98 cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                  </div>
                  <span className="truncate">{config.buttonText || 'Pedir Oferta sem Custo'}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {hasGroupUrl && (
                  <button
                    type="button"
                    onClick={handleOpenGroup}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span className="truncate">{config.secondaryButtonText || 'Entrar no Grupo VIP'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  </button>
                )}
              </>
            )}

            {/* Secondary button if direct type is active AND group link is filled */}
            {linkType === 'whatsapp_direct' && hasGroupUrl && (
              <button
                type="button"
                onClick={handleOpenGroup}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="truncate">{config.secondaryButtonText || 'Entrar no Grupo VIP de Ofertas'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              </button>
            )}

            {/* Secondary button if group type is active */}
            {linkType === 'whatsapp_group' && (
              <button
                type="button"
                onClick={handleOpenDirect}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-emerald-300" />
                </div>
                <span className="truncate">Pedir Produto Específico no Privado</span>
              </button>
            )}

            <p className="text-[11px] text-center text-slate-400 mt-1">
              💬 Resposta rápida • 100% gratuito e seguro
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
