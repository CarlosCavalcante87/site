import React from 'react';
import { Search, X } from 'lucide-react';

interface CategoryNavProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogEl = document.getElementById('catalogo-achados');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white border-y border-slate-200/90 py-4 px-4 sm:px-6 shadow-xs">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-3.5 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="O que você procura hoje? Ex: organizador, fone, lâmpada..."
              className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 bg-slate-50 rounded-xl sm:rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/70 cursor-pointer"
                title="Limpar busca"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};
