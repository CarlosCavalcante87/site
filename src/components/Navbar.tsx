import React from 'react';
import { Flame, Lock } from 'lucide-react';

interface NavbarProps {
  onGoHome: () => void;
  onOpenAdmin: () => void;
  isAdminActive: boolean;
  totalProductsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onOpenAdmin,
  isAdminActive,
  totalProductsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/70 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group cursor-pointer transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs">
            <Flame className="w-4.5 h-4.5 fill-current" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
            Achados do Dia
          </span>
          <span className="hidden sm:inline-flex text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-1 tabular-nums">
            {totalProductsCount} achados
          </span>
        </button>

        {/* Action: Admin Button */}
        <button
          onClick={onOpenAdmin}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border cursor-pointer ${
            isAdminActive
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Acessar painel administrativo"
        >
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>{isAdminActive ? 'Sair do Admin' : 'Admin'}</span>
        </button>
      </div>
    </header>
  );
};
