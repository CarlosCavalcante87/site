import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Star, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  ChevronRight,
  Maximize2,
  Layers,
  Facebook
} from 'lucide-react';
import { Product } from '../types';
import { STORE_CONFIG, trackProductClick } from '../services/storage';
import { trackCloudProductClick } from '../services/firebaseService';
import { StoreLogo } from './StoreLogo';
import { WhatsAppIcon } from './WhatsAppButton';
import { PriceHistoryChart } from './PriceHistoryChart';
import { getPublicBaseUrl } from '../utils/seo';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectRelated: (product: Product) => void;
  onShowToast: (message: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  allProducts,
  onBack,
  onSelectRelated,
  onShowToast,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Touch swipe support for photo gallery
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Reset selected image index when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const storeConfig = STORE_CONFIG[product.store] || STORE_CONFIG.Outro;
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'];
  const activeImage = images[selectedImageIndex] || images[0];

  const handleNextPhoto = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevPhoto = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const onGalleryTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onGalleryTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onGalleryTouchEnd = () => {
    if (!touchStartX || !touchEndX || images.length <= 1) return;
    const distance = touchStartX - touchEndX;
    if (distance > 40) {
      handleNextPhoto();
    } else if (distance < -40) {
      handlePrevPhoto();
    }
  };

  // Related products from the same category
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleOpenPartnerLink = () => {
    trackProductClick(product.id);
    trackCloudProductClick(product.id);
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
    onShowToast(`Redirecionando para ${product.store}...`);
  };

  const getProductShareUrl = () => {
    const base = getPublicBaseUrl();
    return `${base}/?p=${product.id}`;
  };

  const getShareMessage = () => {
    const productUrl = getProductShareUrl();
    return `Olha essa oferta que encontrei no Ofertas do Dia: *${product.title}*!\n\nConfira aqui: ${productUrl}`;
  };

  const handleCopyLink = () => {
    const url = getProductShareUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedLink(true);
    onShowToast('Link do achadinho copiado para a área de transferência!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = (e?: React.MouseEvent) => {
    const shareMessage = getShareMessage();
    // Copy the text and URL directly to clipboard so the user can paste anywhere immediately
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareMessage).catch(() => {});
    }
    onShowToast('Link do achadinho copiado! Abrindo WhatsApp...');
  };

  const handleShareFacebook = () => {
    const url = getProductShareUrl();
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer,width=620,height=580');
    onShowToast('Abrindo compartilhamento do Facebook...');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-24 lg:pb-8">
      {/* Breadcrumb & Back Button */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 sm:mb-6 flex-wrap">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-orange-600 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para todos os produtos</span>
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 font-medium">{product.category}</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-400 truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-12">
        {/* Left Column: Photo Gallery (5-6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Main Photo Display with Touch Gestures */}
          <div 
            className="relative aspect-4/3 sm:aspect-square bg-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs group select-none"
            onTouchStart={onGalleryTouchStart}
            onTouchMove={onGalleryTouchMove}
            onTouchEnd={onGalleryTouchEnd}
          >
            <img
              src={activeImage}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Store Badge Overlay */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
              <span
                style={{
                  backgroundColor: storeConfig.bg,
                  color: storeConfig.text,
                  borderColor: storeConfig.border,
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold border shadow-xs backdrop-blur-xs"
              >
                <StoreLogo store={product.store} size="sm" />
                <span>{product.store}</span>
              </span>
            </div>

            {/* Zoom / Fullscreen Button */}
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/90 backdrop-blur-xs text-slate-700 flex items-center justify-center hover:bg-white transition-colors shadow-xs cursor-pointer"
              title="Ampliar foto"
            >
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Total Photos Badge */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[11px] sm:text-xs font-medium">
              Foto {selectedImageIndex + 1} de {images.length}
            </div>
          </div>

          {/* Thumbnails row if more than 1 image */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-orange-600 ring-2 ring-orange-500/20 shadow-xs'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Share & Social Row */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Share2 className="w-4 h-4 text-orange-600" />
              <span>Gostou? Compartilhe com amigos:</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(getShareMessage())}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs no-underline"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0 text-white" />
                <span>WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={handleShareFacebook}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Facebook className="w-3.5 h-3.5 fill-current" />
                <span>Facebook</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Full Description & CTA (6-7 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.isCollection && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-white" />
                  Vitrine / Coleção
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
                {product.category}
              </span>
              {product.badges?.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {badge}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Oferta Verificada
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
              {product.title}
            </h1>

            {/* Subtitle if available */}
            {product.subtitle && (
              <p className="text-sm text-slate-600 font-medium mb-4">
                {product.subtitle}
              </p>
            )}

            {/* Rating and Social Proof */}
            <div className="flex items-center gap-4 py-3 border-y border-slate-100 mb-6 text-xs text-slate-600">
              <div className="flex items-center gap-1 text-slate-900 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating !== undefined ? product.rating : '4.9'}</span>
                <span className="text-slate-400 font-normal">
                  ({product.reviewCount !== undefined ? product.reviewCount : 384} avaliações no parceiro)
                </span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1 text-orange-600 font-medium">
                <Flame className="w-3.5 h-3.5" />
                <span>{product.clicksCount !== undefined ? product.clicksCount : 1420} acessos este mês</span>
              </div>
            </div>

            {/* Key Highlights list */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mb-6 bg-orange-50/50 rounded-2xl p-4 border border-orange-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-orange-900 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  Destaques e Benefícios Deste Achadinho
                </h3>
                <ul className="space-y-2">
                  {product.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Description Section */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                Descrição
              </h3>
              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-200/80">
                {product.description}
              </div>
            </div>

            {/* Histórico de Preço (Automático, similar à imagem de referência) */}
            {(product.price != null || product.originalPrice != null) && (
              <div className="mb-6">
                <PriceHistoryChart
                  productId={product.id}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  customHistory={product.priceHistory}
                />
              </div>
            )}
          </div>

          {/* Call to Action Module - Notice: NO PRICE! Explains partner checkout */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <span className="text-xs font-semibold text-slate-300">
                  Disponível para compra em:
                </span>
                <span
                  style={{
                    backgroundColor: storeConfig.bg,
                    color: storeConfig.text,
                  }}
                  className="px-2.5 py-0.5 rounded-md text-xs font-bold"
                >
                  {product.store}
                </span>
              </div>

              {/* Price with strikethrough */}
              {(product.price != null || product.originalPrice != null) && (
                <div className="mb-4 pb-3.5 border-b border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">💰</span>
                    {product.originalPrice != null && (
                      <span className="text-slate-400 line-through text-xs sm:text-sm">
                        De R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    {product.price != null && (
                      <span className="font-extrabold text-emerald-400 text-sm sm:text-base">
                        {product.originalPrice != null ? 'por ' : ''}R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && product.price && product.originalPrice > product.price && (
                    <span className="text-[11px] font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded-lg shrink-0">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
              )}

              {/* Main Outbound Button */}
              <button
                onClick={handleOpenPartnerLink}
                className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl ${
                  product.isCollection
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25'
                    : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25'
                } text-white transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-3 text-center`}
              >
                <div className="flex flex-col items-center justify-center leading-snug">
                  <span className="font-bold text-xs sm:text-sm text-amber-100">
                    {product.isCollection ? '📁 Vitrine de Recomendações' : '⏳ Ver Oferta (Expira Hoje)'}
                  </span>
                  <span className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                    {product.isCollection
                      ? (product.collectionButtonText || `Explorar em ${product.store}`)
                      : (product.store || 'Ir à Loja Parceira')}
                  </span>
                </div>
                <ExternalLink className="w-5 h-5 shrink-0 text-white" />
              </button>

              <div className="mt-3.5 flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Compras 100% seguras nas lojas oficiais</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Outros achadinhos de {product.category}
              </h2>
              <p className="text-xs text-slate-500">
                Mais opções selecionadas para complementar o seu dia a dia
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectRelated(rel)}
                className="bg-white rounded-2xl border border-slate-200 p-3 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer flex gap-4 group"
              >
                <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={rel.images[0]}
                    alt={rel.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <span className="text-[11px] font-bold text-orange-600 block mb-1">
                      {rel.store}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 group-hover:text-orange-600">
                    <span>Ver detalhes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Action Bar for 1-tap conversion */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 px-4 shadow-xl flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-orange-600 uppercase block truncate">
            {product.store}
          </span>
          <p className="text-xs font-bold text-slate-900 truncate">
            {product.title}
          </p>
        </div>
        <button
          onClick={handleOpenPartnerLink}
          className="shrink-0 py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <div className="flex flex-col items-center text-center leading-tight">
            <span className="text-[10px] font-semibold text-orange-100 whitespace-nowrap">
              ⏳ Ver Oferta (Expira Hoje)
            </span>
            {product.store && (
              <span className="text-xs font-black text-white whitespace-nowrap">
                {product.store}
              </span>
            )}
          </div>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>

      {/* Fullscreen Photo Modal */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-orange-400 font-bold text-sm bg-white/20 px-3 py-1 rounded-full cursor-pointer"
            >
              Fechar ✕
            </button>
            <img
              src={activeImage}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white text-xs mt-3 text-center">
              {product.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
