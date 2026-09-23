import React from 'react';
import { StoreType } from '../types';
import { StoreLogo } from './StoreLogo';
import { LayoutGrid } from 'lucide-react';

interface HeroProps {
  selectedStore: string;
  onSelectStore: (store: string) => void;
  selectedBadge?: string;
  onSelectBadge?: (badge: string) => void;
}

const STORES: StoreType[] = ['Shopee', 'Amazon', 'Mercado Livre', 'Shein', 'Magalu', 'AliExpress'];

export const Hero: React.FC<HeroProps> = ({
  selectedStore,
  onSelectStore,
}) => {
  return (
    <section className="bg-transparent pt-1 pb-3 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Store Logo Navigation Bar - Touch-optimized for Mobile */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
          {/* 'Todas as Lojas' Button */}
          <button
            onClick={() => onSelectStore('')}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              selectedStore === ''
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
            }`}
            title="Ver todas as lojas parceiras"
            aria-label="Ver todas as lojas"
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span className="text-xs font-semibold">Todas</span>
          </button>

          {/* Individual Store Logo Buttons */}
          {STORES.map((store) => {
            const isSelected = selectedStore === store;
            return (
              <button
                key={store}
                onClick={() => onSelectStore(isSelected ? '' : store)}
                className={`shrink-0 flex items-center justify-center gap-1.5 px-2.5 py-2 sm:px-3.5 sm:py-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                }`}
                title={`Filtrar ofertas da loja ${store}`}
                aria-label={`Filtrar por ${store}`}
              >
                <StoreLogo store={store} size="md" />
                {/* Store name visible on tablet/desktop, compact logo on mobile */}
                <span
                  className={`hidden sm:inline text-xs font-bold ${
                    isSelected ? 'text-orange-700' : 'text-slate-700'
                  }`}
                >
                  {store}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
