import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  Smartphone, 
  Globe, 
  HelpCircle,
  Eye,
  Send,
  Facebook
} from 'lucide-react';
import { Product } from '../types';
import { WhatsAppIcon } from './WhatsAppButton';
import { getPublicBaseUrl } from '../utils/seo';
import { getStoredSiteConfig } from '../services/storage';

interface SocialSharePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onShowToast?: (msg: string) => void;
}

export const SocialSharePreviewModal: React.FC<SocialSharePreviewModalProps> = ({
  isOpen,
  onClose,
  product,
  onShowToast
}) => {
  const [activePlatform, setActivePlatform] = useState<'whatsapp' | 'facebook'>('whatsapp');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const siteConfig = getStoredSiteConfig();
  const baseUrl = siteConfig.siteUrl?.replace(/\/+$/, '') || getPublicBaseUrl();
  const pageUrl = product ? `${baseUrl}/?p=${product.id}` : baseUrl;
  const pageTitle = product 
    ? `${product.title} | Ofertas do Dia` 
    : (siteConfig.socialShareTitle || 'Achados do Dia – Melhores Ofertas, Cupons e Achadinhos da Internet');
  const pageDesc = product 
    ? (product.description 
        ? product.description.slice(0, 140) + '...'
        : `Confira a oferta oficial de ${product.title} na ${product.store}. Compre com desconto e link verificado!`)
    : (siteConfig.socialShareDescription || 'Encontre os melhores achadinhos virais, cupons de desconto e promoções oficiais da Shopee, Mercado Livre, Amazon e Shein com links 100% verificados e seguros.');
  
  const rawImg = product?.images?.[0] || siteConfig.socialShareImage || '/og-image.jpg';
  const imageUrl = rawImg.startsWith('http') 
    ? rawImg 
    : `${baseUrl}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;

  const cleanDomain = baseUrl.replace(/^https?:\/\//, '').split('/')[0];

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pageUrl).catch(() => {});
    }
    setCopiedLink(true);
    if (onShowToast) onShowToast('Link de teste copiado!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleTestWhatsApp = () => {
    // Open WhatsApp Web/App sending message to yourself
    const testMsg = `Teste de prévia do Achados do Dia:\n${pageUrl}?v=${Date.now()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(testMsg)}`, '_blank', 'noopener,noreferrer');
  };

  const handleTestFacebookDebugger = () => {
    const debuggerUrl = `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(pageUrl)}`;
    window.open(debuggerUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTestOpenGraphXyz = () => {
    const testUrl = `https://www.opengraph.xyz/url/${encodeURIComponent(pageUrl)}`;
    window.open(testUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative text-slate-800 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Simulador & Teste de Compartilhamento Social
            </h2>
            <p className="text-xs text-slate-500">
              {product ? `Prévia para "${product.title.slice(0, 40)}..."` : 'Prévia da Página Inicial do Site'}
            </p>
          </div>
        </div>

        {/* Tab switch between WhatsApp and Facebook */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => setActivePlatform('whatsapp')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePlatform === 'whatsapp'
                ? 'bg-white text-[#25D366] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <WhatsAppIcon className="w-4 h-4 fill-current" />
            <span>Prévia no WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePlatform('facebook')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePlatform === 'facebook'
                ? 'bg-white text-[#1877F2] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Facebook className="w-4 h-4 fill-current" />
            <span>Prévia no Facebook</span>
          </button>
        </div>

        {/* Preview Container */}
        <div className="mb-5">
          {activePlatform === 'whatsapp' ? (
            /* WhatsApp Message Preview Simulation */
            <div className="bg-[#EFEAE2] p-4 sm:p-5 rounded-2xl border border-[#DAD3C8] shadow-inner">
              <div className="text-[10px] uppercase font-bold text-[#8696A0] tracking-wider mb-2 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Simulação do Balão no WhatsApp</span>
              </div>

              {/* Chat Bubble */}
              <div className="max-w-sm sm:max-w-md bg-white rounded-2xl rounded-tl-xs p-2 shadow-xs border border-slate-200/60 ml-auto">
                {/* Link Preview Card inside Bubble */}
                <div className="bg-[#F0F2F5] rounded-xl overflow-hidden border border-slate-200/80 mb-2">
                  <div className="aspect-[1.91/1] w-full bg-slate-200 relative overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={pageTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/og-image.jpg';
                      }}
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1 mb-0.5">
                      {pageTitle}
                    </p>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-1">
                      {pageDesc}
                    </p>
                    <span className="text-[9px] text-[#54656F] uppercase tracking-wider font-medium">
                      {cleanDomain}
                    </span>
                  </div>
                </div>

                {/* Text & Time */}
                <div className="px-1 text-xs text-slate-800 break-all flex items-end justify-between gap-2">
                  <span className="text-[#027EB5] hover:underline font-mono text-[11px] truncate">
                    {pageUrl}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0">12:30</span>
                </div>
              </div>
            </div>
          ) : (
            /* Facebook Post Link Preview Simulation */
            <div className="bg-[#F0F2F5] p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-inner">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Simulação do Card no Facebook</span>
              </div>

              {/* Facebook Card */}
              <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm max-w-md mx-auto">
                <div className="aspect-[1.91/1] w-full bg-slate-200 relative overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={pageTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/og-image.jpg';
                    }}
                  />
                </div>
                <div className="p-3 bg-[#F0F2F5] border-t border-slate-200/70">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5 font-medium">
                    {cleanDomain}
                  </p>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                    {pageTitle}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug">
                    {pageDesc}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Technical Checklist */}
        <div className="mb-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Checklist de Conformidade Técnica
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span><strong>Imagem:</strong> Formato JPEG (1200x630 px)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span><strong>Tamanho:</strong> &lt; 300 KB (WhatsApp compatível)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span><strong>Tags:</strong> og:image, og:title, og:description</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span><strong>Fallback:</strong> link rel="image_src" ativo</span>
            </div>
          </div>
        </div>

        {/* Real Test Action Buttons */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-900 mb-1">
            Como Testar na Prática Antes da Publicação:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Button 1: Send to Self on WhatsApp */}
            <button
              type="button"
              onClick={handleTestWhatsApp}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Testar no WhatsApp</span>
            </button>

            {/* Button 2: Facebook Sharing Debugger */}
            <button
              type="button"
              onClick={handleTestFacebookDebugger}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
              <span>Facebook Debugger</span>
            </button>

            {/* Button 3: Copy Test Link */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 mt-3 leading-relaxed flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Importante para o teste real:</strong> O robô do WhatsApp e do Facebook só consegue buscar a imagem de links públicos (como a URL publicada ou prévia pública compartilhada). Se você colar um link privado de desenvolvimento (<code>ais-dev-...</code>), o robô do WhatsApp é barrado pelo login Google. Use o botão <strong>"Copiar Link"</strong> acima, que já gera a URL pública pronta!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
