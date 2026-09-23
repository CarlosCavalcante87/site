import React from 'react';
import { X, Image as ImageIcon, CheckCircle, Smartphone, Monitor, Sparkles, FileText, Lightbulb } from 'lucide-react';

interface BannerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BannerGuideModal: React.FC<BannerGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative text-slate-800 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Guia de Formatos e Dimensões dos Banners
            </h2>
            <p className="text-xs text-slate-500">
              Orientações completas para criar e usar banners atraentes no Achados do Dia.
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs text-slate-600">
          {/* Section 1: Dimensions */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-orange-600" />
              1. Dimensões Recomendadas (Largura x Altura)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span>Banner Panorâmico (Padrão)</span>
                  <span className="text-orange-600 font-mono text-[11px]">Recomendado</span>
                </div>
                <div className="text-base font-extrabold text-slate-900 font-mono">
                  1200 x 360 px
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Proporção ~10:3 ou 3:1. Encaixa perfeitamente na largura do container sem ocupar espaço vertical excessivo.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span>Banner de Alta Resolução</span>
                  <span className="text-slate-500 font-mono text-[11px]">2x Retina</span>
                </div>
                <div className="text-base font-extrabold text-slate-900 font-mono">
                  1920 x 576 px
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mesma proporção com o dobro de densidade de pixels para telas 4K e Retina.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 text-amber-900">
              <Smartphone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Margem de segurança para Celular:</strong> No smartphone, as bordas laterais podem ter recorte sutil. Mantenha os textos principais, títulos e produtos no centro do banner com uma margem de segurança de pelo menos <strong>60px</strong> em cada lateral.
              </span>
            </div>
          </div>

          {/* Section 2: Formats */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              2. Formatos de Arquivo Ideais
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                  .WEBP (Melhor Opção)
                </span>
                <p className="text-[11px] text-slate-600 mt-1.5">
                  Formato moderno recomendado pelo Google. Reduz o peso do arquivo em até 70% sem perder nitidez.
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                  .PNG
                </span>
                <p className="text-[11px] text-slate-600 mt-1.5">
                  Ideal se o seu banner tiver textos pequenos sobrepostos ou ilustrações com bordas precisas.
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                  .JPG / .JPEG
                </span>
                <p className="text-[11px] text-slate-600 mt-1.5">
                  Excelente para fotografias realistas de produtos com muitos detalhes de iluminação e degradês.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Weight & Performance */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              3. Peso do Arquivo & Velocidade do Site
            </h3>
            <p className="text-xs text-slate-600 mb-2">
              Para garantir que o site abra instantaneamente no celular com internet 4G/5G:
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Tamanho máximo ideal:</strong> Menos de <strong>200 KB</strong> por banner (o ideal fica entre <strong>80 KB e 150 KB</strong>).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Ferramentas gratuitas para comprimir:</strong> TinyPNG (tinypng.com) ou Squoosh (squoosh.app).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Onde criar:</strong> No Canva, utilize o modelo &quot;Banner para Site&quot; ou configure tamanho personalizado para <strong>1200 x 360 px</strong>.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Best Practices for High Conversion */}
          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/60">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-orange-600" />
              4. Dicas de Ouro para Alta Conversão nos 3 Banners
            </h3>
            <ul className="space-y-1.5 text-[11px] text-slate-700">
              <li>• <strong>Banner 1 (Principal):</strong> Destaque os achados mais virais com chamada forte (ex: &quot;Top Virais do TikTok com Cupom Ativo&quot;).</li>
              <li>• <strong>Banner 2 (Nicho/Solução):</strong> Foque em dor e solução (ex: &quot;Chega de Bagunça: Organizadores Inteligentes para sua Casa&quot;).</li>
              <li>• <strong>Banner 3 (Tecnologia/Praticidade):</strong> Destaque utilidades tecnológicas e gadgets inovadores do dia a dia.</li>
              <li>• <strong>Contraste:</strong> Garanta que os textos tenham fundo escuro ou sombreado para facilitar a leitura.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Entendido, fechar guia
          </button>
        </div>
      </div>
    </div>
  );
};
