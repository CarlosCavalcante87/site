import React from 'react';
import { ExternalLink, Star, ArrowRight, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { STORE_CONFIG } from '../services/storage';
import { StoreLogo } from './StoreLogo';

interface ProductCardProps {
  product: Product;
  onOpenProduct: (product: Product) => void;
  onDirectStoreClick: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenProduct,
  onDirectStoreClick,
}) => {
  const storeConfig = STORE_CONFIG[product.store] || STORE_CONFIG.Outro;
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80';

  return (
    <article
      onClick={() => onOpenProduct(product)}
      className={`group bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200 cursor-pointer text-left ${
        product.isFeatured
          ? 'border-2 border-amber-400/90 shadow-sm shadow-amber-500/15 hover:border-amber-500 hover:shadow-xl'
          : 'border border-slate-200/90 hover:border-orange-300 hover:shadow-lg'
      }`}
    >
      {/* Image Area with Store & Status Badges */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
        <img
          src={mainImage}
          alt={product.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback image in case of error
            const target = e.currentTarget;
            target.src = 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Store Badge (top left) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            style={{
              backgroundColor: storeConfig.bg,
              color: storeConfig.text,
              borderColor: storeConfig.border,
            }}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold border shadow-xs backdrop-blur-xs"
          >
            <StoreLogo store={product.store} size="xs" />
            <span className="text-[11px] font-bold">{product.store}</span>
          </span>
        </div>

        {/* Value/Feature Badge (top right) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1">
          {product.isFeatured && (
            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-white text-white" />
              <span>Destaque</span>
            </span>
          )}
          {product.badges && product.badges.length > 0 && product.badges[0] !== 'Destaque' && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-900/80 backdrop-blur-xs text-white">
              {product.badges[0]}
            </span>
          )}
        </div>

        {/* Quick view overlay hint on hover */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-orange-600" />
            Ver Fotos e Detalhes
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-2 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Category & Social Proof */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 mb-1 sm:mb-1.5">
            <span className="font-semibold text-orange-600 truncate mr-1">{product.category}</span>
            {product.rating && (
              <div className="flex items-center gap-1 text-slate-600 font-medium shrink-0">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                <span className="tabular-nums">{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-slate-400 text-[10px] sm:text-[11px]">({product.reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-slate-900 text-xs sm:text-base leading-snug line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-orange-600 transition-colors">
            {product.title}
          </h3>

          {/* Key Highlight / Catchphrase */}
          {product.highlights && product.highlights.length > 0 && (
            <ul className="text-[11px] sm:text-xs text-slate-600 space-y-1 mb-2 sm:mb-2.5">
              <li className="flex items-start gap-1.5 line-clamp-1">
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="truncate">{product.highlights[0]}</span>
              </li>
              {product.highlights[1] && (
                <li className="flex items-start gap-1.5 line-clamp-1 text-slate-500">
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="truncate">{product.highlights[1]}</span>
                </li>
              )}
            </ul>
          )}

          {/* Price with strikethrough (Ancoragem / Desconto) */}
          {(product.price != null || product.originalPrice != null) && (
            <div className="mb-2 sm:mb-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="shrink-0 text-xs sm:text-sm">💰</span>
              {product.originalPrice != null && (
                <span className="text-slate-400 line-through text-[11px] sm:text-xs">
                  De R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
              {product.price != null && (
                <span className="font-black text-emerald-600 text-xs sm:text-sm">
                  {product.originalPrice != null ? 'por ' : ''}R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button Row - 50% / 50% space for "Ver Detalhes" and "Ir à Loja" */}
        <div className="pt-2 sm:pt-3 border-t border-slate-100 grid grid-cols-2 gap-1.5 sm:gap-2.5">
          {/* Primary View Action */}
          <button
            type="button"
            onClick={() => onOpenProduct(product)}
            className="w-full py-1.5 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-[10px] sm:text-xs md:text-sm flex items-center justify-center gap-1 sm:gap-1.5 transition-colors cursor-pointer min-w-0"
          >
            <span className="whitespace-nowrap font-bold">Ver Detalhes</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
          </button>

          {/* Direct Partner Store Shortcut */}
          <button
            type="button"
            onClick={(e) => onDirectStoreClick(product, e)}
            className="w-full py-1.5 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] sm:text-xs md:text-sm flex items-center justify-center gap-1 sm:gap-1.5 transition-colors cursor-pointer min-w-0"
            title={`Abrir direto no site oficial do parceiro (${product.store})`}
          >
            <span className="whitespace-nowrap font-bold">Ir à Loja</span>
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 shrink-0" />
          </button>
        </div>
      </div>
    </article>
  );
};
