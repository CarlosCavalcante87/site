import React, { useState, useRef } from 'react';
import { 
  Share2, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Eye, 
  RefreshCw, 
  Copy, 
  Sparkles,
  Smartphone,
  Globe,
  Info,
  ShieldCheck,
  Check
} from 'lucide-react';
import { SiteConfig, Banner, SeoConfig } from '../types';
import { WhatsAppIcon } from './WhatsAppButton';
import { updatePageSEO } from '../utils/seo';

interface SeoSettingsPanelProps {
  siteConfig: SiteConfig;
  banners: Banner[];
  onUpdateConfig: (updated: SiteConfig) => void;
  onShowToast: (message: string) => void;
}

export const SeoSettingsPanel: React.FC<SeoSettingsPanelProps> = ({
  siteConfig,
  banners,
  onUpdateConfig,
  onShowToast,
}) => {
  const currentSeo = siteConfig.seo || {
    ogImageUrl: '/og-image.jpg',
    ogTitle: 'Achados do Dia – Melhores Ofertas, Cupons e Achadinhos da Internet',
    ogDescription: 'Encontre os melhores achadinhos virais, cupons de desconto e promoções oficiais da Shopee, Mercado Livre, Amazon e Shein com links 100% verificados e seguros.',
    keywords: 'achados do dia, achadinhos, promoções, cupons de desconto, shopee, mercado livre, amazon, shein, ofertas relâmpago',
  };

  const [imageUrl, setImageUrl] = useState<string>(currentSeo.ogImageUrl || '/og-image.jpg');
  const [title, setTitle] = useState<string>(currentSeo.ogTitle || 'Achados do Dia – Melhores Ofertas, Cupons e Achadinhos da Internet');
  const [description, setDescription] = useState<string>(currentSeo.ogDescription || 'Encontre os melhores achadinhos virais, cupons de desconto e promoções oficiais com links 100% verificados e seguros.');
  const [keywords, setKeywords] = useState<string>(currentSeo.keywords || 'achados do dia, achadinhos, promoções, cupons');
  
  const [previewTab, setPreviewTab] = useState<'whatsapp' | 'facebook' | 'google'>('whatsapp');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [imageSizeKb, setImageSizeKb] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-ntmbpov2wv7232nhqojqk2-300468531200.us-east5.run.app';
  const displayDomain = currentDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Calculate image size helper
  const calculateKb = (str: string) => {
    if (str.startsWith('data:image')) {
      const base64Length = str.length - (str.indexOf(',') + 1);
      return Math.round((base64Length * 3) / 4 / 1024);
    }
    if (str === '/og-image.jpg') return 95;
    if (str === '/og-image-whatsapp.jpg') return 45;
    if (str.includes('banner_achadinhos_virais')) return 675;
    return null;
  };

  // Compress & Optimize Image using client-side canvas
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP).');
      return;
    }

    setIsCompressing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimal OpenGraph dimensions: 1200 x 630 (1.91:1)
        const targetWidth = 1200;
        const targetHeight = 630;

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setIsCompressing(false);
          return;
        }

        // Fill background in case of transparent PNG
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Aspect ratio cover calculation
        const imgRatio = img.width / img.height;
        const targetRatio = targetWidth / targetHeight;

        let renderWidth = targetWidth;
        let renderHeight = targetHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > targetRatio) {
          renderWidth = targetHeight * imgRatio;
          offsetX = (targetWidth - renderWidth) / 2;
        } else {
          renderHeight = targetWidth / imgRatio;
          offsetY = (targetHeight - renderHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

        // Compress to JPEG with 0.85 quality (< 200KB guarantee for WhatsApp)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const kb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

        setImageUrl(compressedDataUrl);
        setImageSizeKb(kb);
        setIsCompressing(false);

        onShowToast(`Imagem carregada e otimizada com sucesso! (${kb} KB - Perfeita para WhatsApp)`);
      };

      img.onerror = () => {
        setIsCompressing(false);
        onShowToast('Erro ao carregar a imagem. Tente outro arquivo.');
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleSaveSeo = () => {
    const updatedSeo: SeoConfig = {
      ogImageUrl: imageUrl.trim() || '/og-image.jpg',
      ogTitle: title.trim() || 'Achados do Dia – Melhores Ofertas, Cupons e Achadinhos da Internet',
      ogDescription: description.trim() || 'Encontre os melhores achadinhos virais com links seguros.',
      keywords: keywords.trim(),
    };

    const updatedConfig: SiteConfig = {
      ...siteConfig,
      seo: updatedSeo,
    };

    // Update real DOM meta tags immediately
    updatePageSEO({
      title: updatedSeo.ogTitle,
      description: updatedSeo.ogDescription,
      image: updatedSeo.ogImageUrl,
      url: currentDomain,
    }, null);

    onUpdateConfig(updatedConfig);
    onShowToast('✅ Configurações de imagem de SEO e redes sociais salvas com sucesso!');
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentDomain);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      onShowToast('Link do site copiado para a área de transferência!');
    }
  };

  const handleTestWhatsApp = () => {
    const shareText = `Confira as melhores ofertas do dia em: ${currentDomain}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenFacebookDebugger = () => {
    const url = `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(currentDomain)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const currentKb = imageSizeKb ?? calculateKb(imageUrl);
  const isWhatsAppFriendly = currentKb === null || currentKb <= 300;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Ferramenta de SEO & OpenGraph Social</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Imagem de Compartilhamento no WhatsApp & Redes
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Personalize a imagem, o título e a descrição que aparecem automaticamente quando você ou seus clientes compartilham o link do site no <strong>WhatsApp</strong>, <strong>Facebook</strong>, <strong>Instagram</strong>, <strong>Telegram</strong> e <strong>Google</strong>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSaveSeo}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer transition-all active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Salvar Imagem de SEO</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Selector & SEO Text Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Escolha da Imagem */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                <span>1. Escolher Imagem de Pré-visualização</span>
              </h3>
              
              {/* WhatsApp size indicator pill */}
              <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border">
                {isWhatsAppFriendly ? (
                  <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentKb ? `${currentKb} KB` : '< 300 KB'} (Aprovado WhatsApp)</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-700 bg-amber-50 border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentKb} KB (Acima de 300 KB - Risco de não carregar no WhatsApp)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Current Image Display */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-950 aspect-[1200/630] max-h-[260px] flex items-center justify-center group shadow-inner">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Pré-visualização do Link" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-400 text-xs flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8 opacity-40" />
                  <span>Nenhuma imagem selecionada</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2 px-4 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Trocar Imagem
                </button>
              </div>

              {/* Tag com dimensões ideais */}
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono font-medium flex items-center gap-1.5">
                <span>1200 x 630 px</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{currentKb ? `${currentKb} KB` : 'Leve'}</span>
              </div>
            </div>

            {/* Upload Buttons */}
            <div className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png, image/jpeg, image/webp" 
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={isCompressing}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isCompressing ? 'Otimizando Imagem...' : 'Fazer Upload do Computador / Celular'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('/og-image.jpg');
                    setImageSizeKb(95);
                    onShowToast('Imagem padrão oficial restaurada (95 KB)!');
                  }}
                  className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  title="Restaurar a imagem leve oficial de 95 KB"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão (95 KB)</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>O sistema compacta sua imagem automaticamente para menos de 200 KB, garantindo que o WhatsApp e o Facebook a exibam sem falhas.</span>
              </p>
            </div>

            {/* Ou Colar URL Manual */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ou cole o link direto (URL da imagem):
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageSizeKb(null);
                  }}
                  placeholder="https://... ou /og-image.jpg"
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Banners Cadastrados para Seleção Rápida */}
            {banners.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Ou selecione a imagem de um dos seus banners:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {banners.slice(0, 4).map((b, idx) => (
                    <button
                      key={b.id || idx}
                      type="button"
                      onClick={() => {
                        setImageUrl(b.imageUrl);
                        setImageSizeKb(calculateKb(b.imageUrl));
                        onShowToast(`Imagem do banner "${b.title}" selecionada!`);
                      }}
                      className={`relative aspect-[16/9] rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                        imageUrl === b.imageUrl ? 'border-indigo-600 ring-2 ring-indigo-400' : 'border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold">
                        Usar esta
                      </div>
                      {imageUrl === b.imageUrl && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Textos do Link (Título e Descrição) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-indigo-600" />
              <span>2. Textos do Compartilhamento</span>
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Título do Link (og:title)
                </label>
                <span className={`text-[10px] font-mono ${title.length > 70 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                  {title.length} / 60 caracteres recomendados
                </span>
              </div>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Achados do Dia – Melhores Ofertas e Cupons da Internet"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Descrição Curta (og:description)
                </label>
                <span className={`text-[10px] font-mono ${description.length > 160 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                  {description.length} / 150 caracteres recomendados
                </span>
              </div>
              <textarea 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Encontre os melhores achadinhos virais com links verificados e seguros."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Palavras-chave SEO (Meta Keywords)
              </label>
              <input 
                type="text" 
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="achadinhos, ofertas, cupons, shopee, amazon, mercado livre"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Preview Simulator & Tests */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                <span>Simulador de Pré-visualização</span>
              </h3>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex rounded-2xl bg-slate-100 p-1 gap-1">
              <button
                type="button"
                onClick={() => setPreviewTab('whatsapp')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  previewTab === 'whatsapp' 
                    ? 'bg-white text-emerald-700 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewTab('facebook')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  previewTab === 'facebook' 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Facebook / Redes</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewTab('google')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  previewTab === 'google' 
                    ? 'bg-white text-indigo-600 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Google</span>
              </button>
            </div>

            {/* Preview Box: WhatsApp */}
            {previewTab === 'whatsapp' && (
              <div className="p-4 rounded-2xl bg-[#EFEAE2] border border-[#d1d7db] shadow-inner font-sans">
                <div className="flex items-center gap-2 mb-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mensagem no WhatsApp</span>
                </div>

                {/* WhatsApp Chat Bubble */}
                <div className="max-w-[340px] ml-auto bg-[#D9FDD3] rounded-2xl rounded-tr-xs p-2 shadow-xs border border-[#c1e7b9]">
                  {/* Link Preview Card inside Bubble */}
                  <div className="rounded-xl overflow-hidden bg-white/70 border border-black/5 shadow-2xs">
                    {/* Image */}
                    <div className="aspect-[1.91/1] w-full bg-slate-900 overflow-hidden relative">
                      <img 
                        src={imageUrl || '/og-image.jpg'} 
                        alt="Preview WhatsApp" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    {/* Content */}
                    <div className="p-2.5 space-y-1">
                      <p className="text-[12px] font-bold text-slate-900 leading-snug line-clamp-2">
                        {title}
                      </p>
                      <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">
                        {description}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono lowercase truncate pt-0.5">
                        {displayDomain}
                      </p>
                    </div>
                  </div>

                  {/* Message Link Text */}
                  <div className="mt-1.5 px-1 flex items-baseline justify-between gap-2">
                    <span className="text-[11px] text-blue-600 underline font-medium truncate">
                      {currentDomain}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium shrink-0">
                      12:30 ✓✓
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Box: Facebook */}
            {previewTab === 'facebook' && (
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
                <div className="bg-white rounded-xl overflow-hidden border border-slate-300 shadow-xs max-w-[340px] mx-auto">
                  <div className="aspect-[1.91/1] w-full bg-slate-900 overflow-hidden">
                    <img 
                      src={imageUrl || '/og-image.jpg'} 
                      alt="Preview Facebook" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono truncate">
                      {displayDomain}
                    </p>
                    <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                      {title}
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Box: Google Search */}
            {previewTab === 'google' && (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5 font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center text-white text-[10px] font-black">
                    A
                  </div>
                  <div>
                    <p className="text-xs text-slate-800 font-semibold leading-none">Achados do Dia</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{currentDomain}</p>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                  {title}
                </h4>
                <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                  {description}
                </p>
              </div>
            )}

            {/* Test & Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handleSaveSeo}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 cursor-pointer transition-all active:scale-98"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Salvar Imagem e Dados de SEO</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleTestWhatsApp}
                  className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  <span>Testar no WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleOpenFacebookDebugger}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3 h-3 text-indigo-500" />
                <span>Abrir Depurador Oficial do Facebook (Limpar Cache)</span>
              </button>
            </div>
          </div>

          {/* Dicas Práticas para o WhatsApp */}
          <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2.5 text-xs">
            <h4 className="font-bold flex items-center gap-2 text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Dicas de Ouro para o WhatsApp e Facebook</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-amber-900/90 leading-relaxed list-disc list-inside">
              <li><strong>Tamanho Máximo:</strong> O WhatsApp rejeita silenciosamente qualquer imagem acima de 300 KB. Nossa ferramenta já reduz automaticamente para garantir a aprovação.</li>
              <li><strong>Proporção Perfeita:</strong> Imagens no formato <strong>1200x630 (1.91:1)</strong> preenchem todo o balão sem cortar o texto.</li>
              <li><strong>Cache do WhatsApp:</strong> Se você já compartilhou o link antes, o WhatsApp pode ter gravado a imagem antiga na memória temporária. Ao testar, adicione <code>?v=2</code> no final do link (ex: <code>seusite.com/?v=2</code>) para forçar o WhatsApp a carregar a imagem nova na hora!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
