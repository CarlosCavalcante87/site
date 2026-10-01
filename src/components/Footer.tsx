import React from 'react';
import { Flame, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onGoHome?: () => void;
  onOpenAdmin: () => void;
  onSelectCategory?: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onGoHome,
}) => {
  const handleScrollToTop = () => {
    onGoHome?.();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Col 1: Brand & Key Guarantees */}
          <div className="md:col-span-7">
            <button
              type="button"
              onClick={handleScrollToTop}
              className="flex items-center gap-2 mb-3 cursor-pointer group text-left transition-transform active:scale-95"
              title="Voltar ao topo"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center group-hover:bg-orange-700 transition-colors shadow-xs">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <span className="font-extrabold text-slate-900 text-lg font-display group-hover:text-orange-600 transition-colors">
                Ofertas do Dia
              </span>
            </button>
            <ul className="space-y-2 mb-4 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sem preços desatualizados (compra na fonte)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Links 100% verificados e seguros</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Atualizações diárias de promoções</span>
              </li>
            </ul>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Compras 100% seguras nas lojas oficiais</span>
            </div>
          </div>

          {/* Col 2: Aviso de transparência, Copyright e Acesso Admin */}
          <div className="md:col-span-5 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5 text-xs text-center md:text-left">
              <p className="font-bold text-slate-900">
                Aviso de transparência:
              </p>
              <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed md:whitespace-nowrap">
                Seus cliques ajudam a manter nossas promoções <br className="md:hidden" />diárias no ar!
              </p>
              <p className="text-[11px] text-slate-500">
                Preços e disponibilidade sujeitos a alteração.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
              <span>© {new Date().getFullYear()} Ofertas do Dia.</span>
              <span className="text-slate-300">•</span>
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center justify-center p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Acesso restrito"
                aria-label="Acesso administrativo"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
