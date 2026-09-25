import { Category, Product } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-organizadores',
    name: 'Organizadores',
    slug: 'organizadores',
    iconName: 'Boxes',
    description: 'Gavetas, armários, maquiagem e caixas funcionais'
  },
  {
    id: 'cat-cozinha',
    name: 'Cozinha & Casa',
    slug: 'cozinha-casa',
    iconName: 'Utensils',
    description: 'Eletroportáteis, utensílios práticos e potes herméticos'
  },
  {
    id: 'cat-tecnologia',
    name: 'Tecnologia & Gadgets',
    slug: 'tecnologia-gadgets',
    iconName: 'Smartphone',
    description: 'Fones, suportes, cabos inteligentes e iluminação LED'
  },
  {
    id: 'cat-conforto',
    name: 'Casa & Conforto',
    slug: 'casa-conforto',
    iconName: 'Home',
    description: 'Umidificadores, difusores, iluminação decorativa e aromatizadores'
  },
  {
    id: 'cat-banheiro',
    name: 'Banheiro & Cuidados',
    slug: 'banheiro-cuidados',
    iconName: 'Sparkles',
    description: 'Dispensers automáticos, tapetes super absorventes e higiene'
  },
  {
    id: 'cat-utilidades',
    name: 'Utilidades Incríveis',
    slug: 'utilidades-incriveis',
    iconName: 'Package',
    description: 'Soluções rápidas e virais para o dia a dia'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Organizador Giratório 360° em Acrílico Diamond Premium',
    subtitle: 'O queridinho do TikTok que organiza perfumes, maquiagens e cosméticos ocupando pouco espaço.',
    store: 'Shopee',
    affiliateUrl: 'https://shopee.com.br',
    category: 'Organizadores',
    images: [
      '/images/organizador_acrilico_giratorio_1790120510574.jpg',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    description: `O Organizador Giratório 360° Diamond é a solução definitiva para quem deseja transformar a bancada do banheiro, closet ou penteadeira. Fabricado em acrílico reforçado de alta espessura com acabamento lapidado, ele não amarela com o tempo e suporta pesos elevados de perfumes e cremes importados.

Possui 4 bandejas modulares com altura ajustável em 6 níveis diferentes, permitindo acomodar desde pequenos batons até frascos altos de tônicos e loções. O sistema de rolamento em esferas de aço na base proporciona um giro 360° ultra silencioso e estável sem qualquer risco de tombamento.

Fácil de montar, desmontar e lavar em água corrente com sabão neutro. Economize até 70% do espaço da sua penteadeira mantendo tudo visível e ao alcance das mãos.`,
    highlights: [
      'Giro de 360 graus suave com rolamento de aço reforçado',
      'Prateleiras com 6 níveis de regulagem de altura sob medida',
      'Acrílico cristal espesso e ultra transparente que não amarela',
      'Capacidade para até 30 pincéis, 20 cremes e dezenas de perfumes',
      'Fácil montagem sem ferramentas e higienização simplificada'
    ],
    badges: ['Destaque', 'Viral no TikTok', 'Frete Grátis'],
    originalPrice: 129.90,
    price: 89.90,
    isFeatured: true,
    order: 1,
    clicksCount: 1420,
    rating: 4.9,
    reviewCount: 384,
    createdAt: '2026-03-20T10:00:00.000Z',
    verifiedDeal: true
  },
  {
    id: 'prod-2',
    title: 'Mini Processador e Triturador Elétrico sem Fio Recarregável USB',
    subtitle: 'Pique alho, cebola, temperos, nozes e legumes em apenas 5 segundos sem esforço e sem cheiro nas mãos.',
    store: 'Amazon',
    affiliateUrl: 'https://amazon.com.br',
    category: 'Cozinha & Casa',
    images: [
      '/images/mini_processador_portatil_1790120527360.jpg',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    description: `Diga adeus ao cheiro de alho e cebola grudado nas mãos e ao cansaço de picar condimentos na tábua. O Mini Processador Elétrico Portátil conta com motor potente de alto torque e lâminas triplas de aço inoxidável 304 com afiação cirúrgica.

Basta colocar os ingredientes no recipiente higiênico livre de BPA, travar a tampa e pressionar o botão único superior. Em apenas 5 a 10 segundos, seus ingredientes ficam perfeitamente triturados no ponto desejado para refogados, molhos, vinagrete, patês ou papinhas de bebê.

Possui bateria interna de lítio com recarga rápida via USB Type-C que dura mais de 35 utilizações com uma única carga. Corpo lavável à prova de respingos para enxágue instantâneo na torneira.`,
    highlights: [
      'Lâminas triplas curvas em aço inox 304 ultra afiadas',
      'Operação One-Touch: acionamento imediato por pressão no topo',
      'Bateria recarregável via USB-C com autonomia para dezenas de usos',
      'Copo resistente livre de BPA com trava magnética de segurança',
      'Tamanho compacto que cabe em qualquer gaveta de talheres'
    ],
    badges: ['Mais Vendido', 'Cupom Ativo', 'Frete Grátis'],
    originalPrice: 79.90,
    price: 39.90,
    isFeatured: true,
    order: 2,
    clicksCount: 2310,
    rating: 4.8,
    reviewCount: 950,
    createdAt: '2026-03-21T12:00:00.000Z',
    verifiedDeal: true
  },
  {
    id: 'prod-3',
    title: 'Umidificador e Aromatizador Ultrassônico com Efeito Chama de Fogo LED',
    subtitle: 'Ambiente aconchegante, ar hidratado e fragrância relaxante com projeção visual de lareira.',
    store: 'Mercado Livre',
    affiliateUrl: 'https://mercadolivre.com.br',
    category: 'Casa & Conforto',
    images: [
      '/images/umidificador_chama_led_1790120545471.jpg',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
    ],
    description: `O Umidificador Ultrassônico Efeito Chama une aromaterapia terapêutica e sofisticação decorativa. Através de tecnologia de névoa fria ultrassônica combinada com iluminação LED inteligente âmbar, ele simula com perfeição as chamas dançantes de uma aconchegante lareira sem produzir calor nem fogo.

Compatível com óleos essenciais naturais solúveis em água (basta pingar 3 a 5 gotas na água para perfumar o quarto, sala ou escritório). Melhora a respiração e a qualidade do sono aliviando o ressecamento do ar condicionado.

Conta com sensor de segurança com desligamento automático quando a água atinge o nível mínimo, além de temporizador programável e funcionamento ultra silencioso com ruído inferior a 25 decibéis.`,
    highlights: [
      'Projeção de chama LED hiper-realista em tons quentes',
      'Compatível com óleos essenciais para aromaterapia pura',
      'Sensor inteligente de desligamento automático sem água',
      'Operação silenciosa ideal para noites de sono serenas',
      'Alimentação prática via cabo USB com baixo consumo energético'
    ],
    badges: ['Tendência', 'Destaque', 'Garantia Loja'],
    originalPrice: 189.90,
    price: 119.90,
    isFeatured: true,
    order: 3,
    clicksCount: 1890,
    rating: 4.9,
    reviewCount: 420,
    createdAt: '2026-03-19T14:30:00.000Z',
    verifiedDeal: true
  },
  {
    id: 'prod-4',
    title: 'Luminária de Mesa Articulada Minimalista com Carregador por Indução',
    subtitle: 'Iluminação para estudos e home office com temperatura de cor ajustável e recarga sem fio para celular.',
    store: 'AliExpress',
    affiliateUrl: 'https://aliexpress.com',
    category: 'Tecnologia & Gadgets',
    images: [
      '/images/luminaria_inducao_minimalista_1790120556704.jpg',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    description: `Modernize seu espaço de trabalho ou cabeceira com a luminária LED de design escandinavo minimalista. Equipada com uma base com placa de indução Qi de 15W, ela recarrega seu smartphone compatível simplesmente repousando o aparelho sobre a base, eliminando o emaranhado de fios na mesa.

Possui haste dobrável de alumínio aeronáutico com rotação multidirecional e difusor antirreflexo livre de cintilação (Flicker-Free), protegendo a visão durante leituras prolongadas e sessões de trabalho noturnas.

Controle por sensor tátil intuitivo que alterna entre 3 temperaturas de cor (Branco Frio para foco, Neutro para leitura e Branco Quente para descanso) com ajuste contínuo de intensidade luminosa (dimmer).`,
    highlights: [
      'Carregamento wireless por indução rápida de até 15W na base',
      '3 temperaturas de cor (Fria, Neutra e Quente) com dimmer contínuo',
      'Iluminação suave livre de reflexos com proteção ocular',
      'Estrutura articulada dobrável em alumínio anodizado',
      'Timer automático de desligamento para a hora de dormir'
    ],
    badges: ['Novidade', 'Mais Vendido'],
    originalPrice: 159.90,
    price: 97.90,
    isFeatured: true,
    order: 4,
    clicksCount: 970,
    rating: 4.7,
    reviewCount: 215,
    createdAt: '2026-03-18T09:15:00.000Z',
    verifiedDeal: true
  },
  {
    id: 'prod-5',
    title: 'Dispenser Automático de Sabonete em Espuma com Sensor Infravermelho',
    subtitle: 'Higiene sem toque com sensor de aproximação ultra rápido e economia de até 50% de sabonete líquido.',
    store: 'Shopee',
    affiliateUrl: 'https://shopee.com.br',
    category: 'Banheiro & Cuidados',
    images: [
      '/images/dispenser_sensor_espuma_1790120594683.jpg',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    ],
    description: `Eleve o padrão de higiene e modernidade do seu banheiro ou pia da cozinha. O dispenser automático inteligente dispensa sabonete em uma nuvem cremosa e aveludada de espuma sem que você precise encostar um único dedo no aparelho.

Seu sensor óptico infravermelho de alta precisão reage em apenas 0,25 segundos assim que detecta a aproximação das mãos a até 5 cm de distância. O sistema de micronebulização mistura ar e sabonete na proporção ideal de 12:1, resultando em uma espuma abundante e gastando até metade do sabonete líquido habitual.

Com bateria interna recarregável com autonomia de até 90 dias com uso familiar diário, ele possui proteção IPX5 resistente à umidade e borrifos de água.`,
    highlights: [
      'Sensor de proximidade infravermelho com resposta em 0,25s',
      'Converte sabonete líquido em espuma rica economizando produto',
      'Bateria interna recarregável por USB (dura até 3 meses por carga)',
      'À prova de água padrão IPX5 para pias e bancadas úmidas',
      'Reservatório translúcido de 350ml para fácil monitoramento de nível'
    ],
    badges: ['Frete Grátis', 'Viral no TikTok'],
    originalPrice: 119.90,
    price: 69.90,
    isFeatured: false,
    order: 5,
    clicksCount: 1140,
    rating: 4.8,
    reviewCount: 310,
    createdAt: '2026-03-17T11:45:00.000Z',
    verifiedDeal: true
  },
  {
    id: 'prod-6',
    title: 'Kit de Potes Herméticos Modulares com Tampa de Bambu e Vedação de Silicone',
    subtitle: 'Organização de despensa digna de Pinterest com vidro borossilicato transparente e vedação anti-umidade.',
    store: 'Mercado Livre',
    affiliateUrl: 'https://mercadolivre.com.br',
    category: 'Cozinha & Casa',
    images: [
      '/images/kit_potes_hermeticos_1790120605012.jpg',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ],
    description: `Transforme seus armários e gavetas de mantimentos com o conjunto de potes herméticos em vidro borossilicato de alta resistência e tampas ecológicas em bambu maciço antibacteriano.

Cada pote possui um anel de vedação em silicone alimentício que isola totalmente o interior contra a entrada de ar, carunchos e umidade externa. Seus grãos, massas, café, castanhas e biscoitos continuam crocantes e frescos por muito mais tempo.

O vidro transparente cristalino facilita a identificação imediata do conteúdo e nível restante. O design com rebaixo nas tampas de bambu permite empilhamento vertical seguro, otimizando ao máximo prateleiras e gavetões.`,
    highlights: [
      'Vidro borossilicato atóxico resistente a variações térmicas',
      'Tampas maciças de bambu natural com anel de silicone hermético',
      'Design modular perfeitamente empilhável para despensas organizadas',
      'Livre de odores e manchas; vidro lavável em lava-louças',
      'Ideal para grãos, café, massas, cereais e especiarias'
    ],
    badges: ['Destaque', 'Mais Vendido'],
    originalPrice: 149.90,
    price: 99.90,
    isFeatured: true,
    order: 6,
    clicksCount: 1640,
    rating: 4.9,
    reviewCount: 520,
    createdAt: '2026-03-16T15:20:00.000Z',
    verifiedDeal: true
  },
  {
    id: 'prod-7',
    title: 'Selador Térmico Portátil de Embalagens e Sacos Plásticos Magnético',
    subtitle: 'Feche sacos de salgadinhos, biscoitos e congelados hermeticamente em segundos como de fábrica.',
    store: 'Shopee',
    affiliateUrl: 'https://shopee.com.br',
    category: 'Utilidades Incríveis',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    description: `Nunca mais deixe batatas fritas, biscoitos ou cereais murcharem por ficarem abertos no pacote! O Mini Selador Térmico 2 em 1 utiliza aquecimento instantâneo em micropulsos para refazer a selagem hermética original de sacos plásticos e embalagens metalizadas.

De um lado possui o elemento selador térmico ultra rápido que não requer pré-aquecimento longo; do outro lado, conta com uma lâmina de corte retrátil protegida para abrir encomendas e sachês com segurança.

Possui ímã na base para ficar sempre fixado na porta da geladeira, pronto para uso rápido no dia a dia. Funciona com bateria recarregável USB.`,
    highlights: [
      'Função dupla 2 em 1: sela termicamente e corta embalagens',
      'Aquecimento instantâneo sem necessidade de esperar esquentar',
      'Mantém alimentos crocantes e previne desperdício',
      'Base magnética para fixação direta na geladeira',
      'Bateria interna recarregável com trava de proteção infantil'
    ],
    badges: ['Viral no TikTok', 'Cupom Ativo'],
    originalPrice: 49.90,
    price: 27.90,
    isFeatured: false,
    order: 7,
    clicksCount: 890,
    rating: 4.6,
    reviewCount: 180,
    createdAt: '2026-03-15T08:10:00.000Z',
    verifiedDeal: true
  },
  {
    id: 'prod-8',
    title: 'Tapete Mágico Super Absorvente Diatomita Secagem Instantânea',
    subtitle: 'Água absorvida e evaporada em 10 segundos, base antiderrapante emborrachada e zero mofo.',
    store: 'Shein',
    affiliateUrl: 'https://shein.com',
    category: 'Banheiro & Cuidados',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
    ],
    description: `Acabe de vez com o chão molhado e tapetes encharcados após o banho. O Tapete Mágico Ultra Absorvente é confeccionado com microcamadas de terra diatomácea natural combinada com borracha flexível antiderrapante.

Ao pisar com os pés molhados, a água é sugada instantaneamente para o interior dos microporos minerais e se dissipa pelo ar em poucos segundos, deixando a superfície completamente seca, fria e sem cheiro de umidade.

Diferente dos tapetes felpudos tradicionais que acumulam ácaros e demoram horas no varal, ele não solta fiapos, previne escorregões com sua base emborrachada de alta aderência e pode ser limpo com um simples pano úmido.`,
    highlights: [
      'Tecnologia de terra diatomita com secagem em até 10 segundos',
      'Base antiderrapante com padrão texturizado de segurança máxima',
      'Não acumula odores, mofo ou bactérias comuns de tecidos',
      'Design ultrafino que não prende embaixo de portas',
      'Fácil higienização rápida com água corrente ou pano úmido'
    ],
    badges: ['Frete Grátis', 'Tendência'],
    originalPrice: 69.90,
    price: 39.90,
    isFeatured: false,
    order: 8,
    clicksCount: 780,
    rating: 4.7,
    reviewCount: 290,
    createdAt: '2026-03-14T16:00:00.000Z',
    verifiedDeal: true
  }
];

export const INITIAL_BANNERS = [
  {
    id: 'banner-1',
    title: 'Top Achadinhos Virais do Momento',
    subtitle: 'Itens que explodiram nas redes sociais selecionados com links oficiais e cupons testados.',
    badge: '🔥 Mais Vendidos',
    imageUrl: '/images/banner_achadinhos_virais_1790121462152.jpg',
    linkUrl: '#produtos',
    buttonText: 'Explorar Ofertas',
    tagCategory: 'Utilidades Incríveis',
    isActive: true,
  },
  {
    id: 'banner-2',
    title: 'Organização Prática para Sua Casa',
    subtitle: 'Soluções inteligentes em acrílico, bambu e organizadores que transformam qualquer cômodo.',
    badge: '✨ Casa & Decor',
    imageUrl: '/images/banner_organizacao_casa_1790121471097.jpg',
    linkUrl: '#produtos',
    buttonText: 'Ver Organizadores',
    tagCategory: 'Organizadores',
    isActive: true,
  },
  {
    id: 'banner-3',
    title: 'Gadgets & Tecnologia que Valem a Pena',
    subtitle: 'Iluminação inteligente, fones bluetooth e utilidades inovadoras para facilitar o seu dia a dia.',
    badge: '⚡ Tech & Inovação',
    imageUrl: '/images/banner_gadgets_tecnologia_1790121480292.jpg',
    linkUrl: '#produtos',
    buttonText: 'Conferir Gadgets',
    tagCategory: 'Tecnologia & Gadgets',
    isActive: true,
  }
];

export const INITIAL_SITE_CONFIG = {
  whatsappNumber: '5511999999999',
  whatsappDefaultMessage: 'Olá! Estava navegando no Ofertas do Dia e gostaria de tirar algumas dúvidas sobre as ofertas e promoções.',
  mobileDoubleColumns: true,
};

