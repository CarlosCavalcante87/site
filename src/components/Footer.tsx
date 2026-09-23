import React from 'react';
import { Flame, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onGoHome: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onGoHome,
  onOpenAdmin,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Key Guarantees */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <span className="font-extrabold text-slate-900 text-lg font-display">
                Achados do Dia
              </span>
            </div>
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

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Categorias Populares
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('Organizadores')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Organizadores
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Cozinha & Casa')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Cozinha & Utensílios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Tecnologia & Gadgets')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Tecnologia & Gadgets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Casa & Conforto')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Casa & Aconchego
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Administração
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onGoHome}
                  className="hover:text-orange-600 transition-colors"
                >
                  Página Inicial (Todos os Produtos)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-orange-600 transition-colors inline-flex items-center gap-1.5 font-semibold text-slate-800"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cadastrar Produtos (Admin)</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Notice */}
        <div className="pt-8 border-t border-slate-100 text-[11px] text-slate-600 leading-normal flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="max-w-2xl text-center sm:text-left">
            <strong>Aviso de transparência:</strong> O Achados do Dia participa de programas de afiliados oficiais (Shopee, Amazon, Mercado Livre, etc.). Não realizamos vendas diretas nem cobramos valores dos clientes. Ao clicar nos links de produtos, você é direcionado diretamente para a plataforma parceira onde o pagamento e a entrega são processados pela própria loja.
          </p>
          <div className="text-slate-600 shrink-0">
            © {new Date().getFullYear()} Achados do Dia.
          </div>
        </div>
      </div>
    </footer>
  );
};
