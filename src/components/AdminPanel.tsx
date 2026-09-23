import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  BarChart3, 
  Package, 
  Layers, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  X, 
  Sparkles, 
  Lock, 
  Unlock, 
  Search, 
  Flame,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  MessageCircle,
  HelpCircle,
  Monitor,
  Smartphone,
  Sliders,
  FileText
} from 'lucide-react';
import { Category, Product, StoreType, Banner, SiteConfig } from '../types';
import { 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  resetToInitialCatalog, 
  exportCatalogJSON, 
  importCatalogJSON,
  saveCategories,
  STORE_CONFIG,
  getAdminPassword,
  setAdminPassword,
  verifyAdminCredentials,
  getAdminSession,
  setAdminSession,
  DEFAULT_ADMIN_CONFIG,
  getStoredBanners,
  saveBanners,
  getStoredSiteConfig,
  saveStoredSiteConfig
} from '../services/storage';
import { StoreLogo } from './StoreLogo';
import {
  addProductToCloud,
  updateProductInCloud,
  deleteProductFromCloud,
  saveBannersToCloud,
  saveCategoriesToCloud,
  deleteCategoryFromCloud,
  saveSiteConfigToCloud
} from '../services/firebaseService';
import { BannerGuideModal } from './BannerGuideModal';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  onRefreshData: () => void;
  onCloseAdmin: () => void;
  onShowToast: (message: string) => void;
  onViewProduct: (product: Product) => void;
}

const STORES_LIST: StoreType[] = ['Shopee', 'Amazon', 'Mercado Livre', 'Shein', 'Magalu', 'AliExpress', 'Outro'];

const BADGE_PRESETS = [
  'Destaque',
  'Mais Vendido',
  'Frete Grátis',
  'Cupom Ativo',
  'Viral no TikTok',
  'Tendência',
  'Garantia Loja',
];

// Sample preset photos for quick product addition
const PRESET_IMAGES = [
  { label: 'Organizador Giratório Acrílico', url: '/src/assets/images/organizador_acrilico_giratorio_1790120510574.jpg' },
  { label: 'Mini Processador Portátil', url: '/src/assets/images/mini_processador_portatil_1790120527360.jpg' },
  { label: 'Umidificador Efeito Chama', url: '/src/assets/images/umidificador_chama_led_1790120545471.jpg' },
  { label: 'Luminária Minimalista Indução', url: '/src/assets/images/luminaria_inducao_minimalista_1790120556704.jpg' },
  { label: 'Dispenser Automático Espuma', url: '/src/assets/images/dispenser_sensor_espuma_1790120594683.jpg' },
  { label: 'Kit Potes Herméticos Bambu', url: '/src/assets/images/kit_potes_hermeticos_1790120605012.jpg' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  categories,
  onRefreshData,
  onCloseAdmin,
  onShowToast,
  onViewProduct,
}) => {
  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => getAdminSession());
  const [loginUser, setLoginUser] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'products' | 'new-product' | 'banners' | 'categories' | 'stats' | 'security' | 'backup'>('products');
  const [searchAdmin, setSearchAdmin] = useState('');
  
  // Banners & Site Settings State
  const [banners, setBanners] = useState<Banner[]>(() => getStoredBanners());
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => getStoredSiteConfig());

  // Password Change Form State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);

  // Product Edit / Create form state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    store: 'Shopee' as StoreType,
    affiliateUrl: '',
    category: categories[0]?.name || 'Organizadores',
    images: [''] as string[],
    description: '',
    highlights: [''] as string[],
    badges: ['Destaque'] as string[],
    isFeatured: true,
  });

  // Category creation state
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Package');

  // Stats calculation
  const totalClicks = products.reduce((acc, p) => acc + (p.clicksCount || 0), 0);
  const topProducts = [...products].sort((a, b) => (b.clicksCount || 0) - (a.clicksCount || 0)).slice(0, 5);

  // Handle Login Action
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const isValid = verifyAdminCredentials(loginUser, loginPassword);
    if (isValid) {
      setAdminSession(true);
      setIsAdminLoggedIn(true);
      setLoginPassword('');
      onShowToast('Login realizado com sucesso! Bem-vindo ao painel.');
    } else {
      setLoginError('Credenciais incorretas. Verifique o usuário e a senha informados.');
    }
  };

  // Quick 1-click test login with default credentials
  const handleQuickDefaultLogin = () => {
    const currentPass = getAdminPassword();
    setLoginUser(DEFAULT_ADMIN_CONFIG.username);
    setLoginPassword(currentPass);
    setAdminSession(true);
    setIsAdminLoggedIn(true);
    setLoginError(null);
    onShowToast(`Conectado como ${DEFAULT_ADMIN_CONFIG.username}!`);
  };

  // Logout Action
  const handleLogout = () => {
    setAdminSession(false);
    setIsAdminLoggedIn(false);
    setLoginPassword('');
    onShowToast('Sessão encerrada com sucesso.');
  };

  // Handle Password Change Action
  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    const currentSavedPass = getAdminPassword();
    if (currentPasswordInput !== currentSavedPass) {
      setPasswordChangeError('A senha atual informada está incorreta.');
      return;
    }

    if (newPasswordInput.trim().length < 4) {
      setPasswordChangeError('A nova senha deve possuir no mínimo 4 caracteres.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('A confirmação da nova senha não coincide.');
      return;
    }

    // Save new password
    setAdminPassword(newPasswordInput);
    setPasswordChangeSuccess('Senha alterada com sucesso! Guarde sua nova senha com segurança.');
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    onShowToast('Senha de administrador atualizada!');
  };

  // Restore Default Password Action
  const handleRestoreDefaultPassword = () => {
    if (window.confirm(`Deseja restaurar a senha de administrador para a padrão ("${DEFAULT_ADMIN_CONFIG.defaultPassword}")?`)) {
      setAdminPassword(DEFAULT_ADMIN_CONFIG.defaultPassword);
      setPasswordChangeSuccess(`Senha redefinida para o padrão de fábrica: "${DEFAULT_ADMIN_CONFIG.defaultPassword}"`);
      setPasswordChangeError(null);
      onShowToast('Senha padrão restaurada!');
    }
  };

  // Handle Banner Update
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    const updated = banners.map((b) => (b.id === editingBanner.id ? editingBanner : b));
    setBanners(updated);
    saveBanners(updated);
    saveBannersToCloud(updated);
    setEditingBanner(null);
    onRefreshData();
    onShowToast(`Banner "${editingBanner.title}" atualizado com sucesso!`);
  };

  const handleToggleBanner = (id: string) => {
    const updated = banners.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b));
    setBanners(updated);
    saveBanners(updated);
    saveBannersToCloud(updated);
    onRefreshData();
    onShowToast('Status do banner atualizado!');
  };

  // Handle WhatsApp Config Update
  const handleSaveWhatsAppConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSiteConfig(siteConfig);
    saveSiteConfigToCloud(siteConfig);
    onShowToast('Configurações do WhatsApp salvas com sucesso!');
  };

  const resetForm = () => {
    setEditingProductId(null);
    setFormData({
      title: '',
      subtitle: '',
      store: 'Shopee',
      affiliateUrl: '',
      category: categories[0]?.name || 'Organizadores',
      images: [''],
      description: '',
      highlights: [''],
      badges: ['Destaque'],
      isFeatured: true,
    });
  };

  const handleEditClick = (p: Product) => {
    setEditingProductId(p.id);
    setFormData({
      title: p.title,
      subtitle: p.subtitle || '',
      store: p.store,
      affiliateUrl: p.affiliateUrl,
      category: p.category,
      images: p.images && p.images.length > 0 ? [...p.images] : [''],
      description: p.description,
      highlights: p.highlights && p.highlights.length > 0 ? [...p.highlights] : [''],
      badges: p.badges && p.badges.length > 0 ? [...p.badges] : [],
      isFeatured: p.isFeatured,
    });
    setActiveTab('new-product');
  };

  const handleDeleteClick = (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja remover o produto "${title}"?`)) {
      deleteProduct(id);
      deleteProductFromCloud(id);
      onRefreshData();
      onShowToast('Produto removido com sucesso!');
    }
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Por favor, informe o título do produto.');
      return;
    }

    if (!formData.affiliateUrl.trim()) {
      alert('Por favor, informe o link oficial da oferta (URL de afiliado).');
      return;
    }

    const cleanImages = formData.images.filter((img) => img.trim() !== '');
    const cleanHighlights = formData.highlights.filter((h) => h.trim() !== '');

    const finalImages = cleanImages.length > 0 
      ? cleanImages 
      : ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'];

    if (editingProductId) {
      const updates = {
        title: formData.title,
        subtitle: formData.subtitle,
        store: formData.store,
        affiliateUrl: formData.affiliateUrl,
        category: formData.category,
        images: finalImages,
        description: formData.description,
        highlights: cleanHighlights,
        badges: formData.badges,
        isFeatured: formData.isFeatured,
      };
      updateProduct(editingProductId, updates);
      updateProductInCloud(editingProductId, updates);
      onShowToast('Produto atualizado com sucesso!');
    } else {
      const created = addProduct({
        title: formData.title,
        subtitle: formData.subtitle,
        store: formData.store,
        affiliateUrl: formData.affiliateUrl,
        category: formData.category,
        images: finalImages,
        description: formData.description || 'Descrição detalhada do achadinho.',
        highlights: cleanHighlights.length > 0 ? cleanHighlights : ['Produto verificado', 'Envio rápido'],
        badges: formData.badges,
        isFeatured: formData.isFeatured,
        rating: 4.8,
        reviewCount: 150,
        verifiedDeal: true,
      });
      addProductToCloud(created);
      onShowToast('Novo produto cadastrado com sucesso!');
    }

    resetForm();
    onRefreshData();
    setActiveTab('products');
  };

  const handleAddImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleImageChange = (index: number, val: string) => {
    const updated = [...formData.images];
    updated[index] = val;
    setFormData({ ...formData, images: updated });
  };

  const handleRemoveImageField = (index: number) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated.length ? updated : [''] });
  };

  const handlePickPresetImage = (url: string) => {
    if (formData.images.length === 1 && formData.images[0] === '') {
      setFormData({ ...formData, images: [url] });
    } else {
      setFormData({ ...formData, images: [...formData.images, url] });
    }
  };

  const handleAddHighlightField = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const handleHighlightChange = (index: number, val: string) => {
    const updated = [...formData.highlights];
    updated[index] = val;
    setFormData({ ...formData, highlights: updated });
  };

  const handleRemoveHighlightField = (index: number) => {
    const updated = formData.highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: updated.length ? updated : [''] });
  };

  const toggleBadge = (badge: string) => {
    if (formData.badges.includes(badge)) {
      setFormData({ ...formData, badges: formData.badges.filter((b) => b !== badge) });
    } else {
      setFormData({ ...formData, badges: [...formData.badges, badge] });
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      iconName: newCatIcon,
    };

    const updated = [...categories, newCat];
    saveCategories(updated);
    saveCategoriesToCloud(updated);
    setNewCatName('');
    onRefreshData();
    onShowToast(`Categoria "${newCat.name}" criada com sucesso!`);
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    const isUsed = products.some((p) => p.category === catName);
    if (isUsed) {
      alert(`Não é possível excluir a categoria "${catName}" pois há produtos vinculados a ela.`);
      return;
    }

    if (window.confirm(`Excluir a categoria "${catName}"?`)) {
      const updated = categories.filter((c) => c.id !== catId);
      saveCategories(updated);
      deleteCategoryFromCloud(catId);
      onRefreshData();
      onShowToast('Categoria removida com sucesso!');
    }
  };

  const handleExport = () => {
    const jsonStr = exportCatalogJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `achados_do_dia_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Backup do catálogo exportado com sucesso!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importCatalogJSON(content);
        if (success) {
          onRefreshData();
          onShowToast('Catálogo importado com sucesso!');
        } else {
          alert('Erro ao importar JSON. Verifique a estrutura do arquivo.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Tem certeza? Isso restaurará o catálogo original com os produtos de exemplo.')) {
      resetToInitialCatalog();
      onRefreshData();
      onShowToast('Catálogo restaurado com dados iniciais de demonstração!');
    }
  };

  const filteredProducts = products.filter((p) => {
    const query = searchAdmin.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.store.toLowerCase().includes(query)
    );
  });

  // ==========================================
  // VIEW: LOGIN SCREEN (if not authenticated)
  // ==========================================
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm text-left">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Acesso Administrativo
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Faça login para gerenciar produtos, os <strong>3 banners promocionais</strong> e links de afiliado.
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Usuário ou E-mail
              </label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Digite sua senha..."
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showLoginPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Unlock className="w-4 h-4 text-amber-400" />
              <span>Entrar no Painel Admin</span>
            </button>
          </form>

          {/* Helper Card with Default Credentials */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 mb-5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Entrada Padrão Inicial:</span>
            </div>
            <div className="text-xs text-amber-800 space-y-1 mb-3 bg-white/70 p-2.5 rounded-lg border border-amber-200/60 font-mono text-[11px]">
              <div><strong>Usuário:</strong> admin</div>
              <div><strong>Senha padrão:</strong> admin123</div>
            </div>
            <p className="text-[11px] text-amber-700 leading-snug mb-3">
              Após entrar, você poderá modificar a senha para qualquer outra de sua preferência na aba <strong>Segurança</strong>.
            </p>
            <button
              type="button"
              onClick={handleQuickDefaultLogin}
              className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Preencher Dados e Entrar com 1 Clique</span>
            </button>
          </div>

          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onCloseAdmin}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              ← Voltar para a Página Inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: LOGGED-IN ADMIN PANEL
  // ==========================================
  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-4 sm:py-8">
      {/* Top Header of Admin - Mobile-first Ergonomic Layout */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 mb-6 shadow-xs">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between gap-3 pb-3.5 sm:pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base sm:text-xl font-bold text-slate-900 truncate">
                  Painel Admin
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded-md" title="Google Firestore Conectado">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  Firebase Ativo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                Gerencie catálogo, 3 banners promocionais, WhatsApp e métricas.
              </p>
            </div>
          </div>

          {/* Quick Exit Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onCloseAdmin}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
              title="Voltar para a loja pública"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Ver Loja</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
              title="Encerrar sessão de administrador"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden xs:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Quick Action Buttons on Mobile & Desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 pt-3">
          <button
            onClick={() => {
              resetForm();
              setActiveTab('new-product');
            }}
            className="col-span-2 sm:col-auto px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Cadastrar Novo Produto</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
            <span>3 Banners</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Alterar senha do administrador"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>Senha</span>
          </button>
        </div>

        {/* Tab Navigation with Mobile Touch Scroll and Pill Styling */}
        <div className="flex items-center gap-1.5 overflow-x-auto mt-4 pt-3 border-t border-slate-100 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab('products')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Produtos ({products.length})</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setActiveTab('new-product');
            }}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'new-product'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{editingProductId ? 'Editar' : 'Novo'}</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Banners & Whats</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categorias ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Cliques</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Segurança</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup</span>
          </button>
        </div>
      </div>

      {/* TAB: BANNERS & WHATSAPP SETTINGS (New Requested Feature!) */}
      {activeTab === 'banners' && (
        <div className="space-y-8">
          {/* Explanation Box of Dimensions & Formats */}
          <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-white rounded-3xl border border-orange-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Especificações Técnicas: Formato e Dimensões dos Banners
                  </h3>
                  <p className="text-xs text-slate-600">
                    Siga estas diretrizes para que seus 3 banners fiquem perfeitos no celular e no computador.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsGuideOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-orange-100 text-orange-700 text-xs font-bold border border-orange-300 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <HelpCircle className="w-4 h-4 text-orange-600" />
                <span>Abrir Guia Visual Completo</span>
              </button>
            </div>

            {/* Quick Spec Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-orange-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block mb-1">
                  📐 Dimensão Ideal (Desktop)
                </span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  1200 x 360 px
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Proporção ~10:3 ou 3:1. Encaixe harmônico no topo do site.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-orange-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block mb-1">
                  📱 Margem Mobile
                </span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  60px de Margem
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mantenha textos e fotos principais no centro para não cortar no celular.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-orange-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block mb-1">
                  🖼️ Formatos Permitidos
                </span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  WebP, PNG ou JPG
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  <strong>WebP</strong> é o mais rápido; <strong>PNG</strong> para textos nítidos.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-orange-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block mb-1">
                  ⚡ Peso Máximo
                </span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  Menos de 200 KB
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ideal entre 80KB e 150KB para carregar em 1 segundo no 4G.
                </p>
              </div>
            </div>
          </div>

          {/* The 3 Banners List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Os 3 Banners Promocionais Atuais
                </h3>
                <p className="text-xs text-slate-500">
                  Estes 3 banners aparecem em carrossel rotativo no início da página.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {banners.map((b, idx) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/60 p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center gap-4 sm:gap-5"
                >
                  {/* Banner Image Preview */}
                  <div className="relative w-full md:w-72 h-40 sm:h-36 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-300">
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Banner #{idx + 1}
                    </div>
                    {b.badge && (
                      <div className="absolute bottom-2 left-2 bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        {b.badge}
                      </div>
                    )}
                  </div>

                  {/* Banner Info */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                        {b.badge || 'Destaque'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {b.isActive ? '● Ativo no Carrossel' : '○ Pausado'}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug">{b.title}</h4>
                    <p className="text-xs text-slate-600 mb-2 line-clamp-2">{b.subtitle}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span>Botão: <strong>{b.buttonText || 'Ver Ofertas'}</strong></span>
                      {b.tagCategory && (
                        <span>Filtro: <strong>{b.tagCategory}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-0 border-slate-200">
                    <button
                      onClick={() => setEditingBanner({ ...b })}
                      className="flex-1 md:flex-initial justify-center px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => handleToggleBanner(b.id)}
                      className={`flex-1 md:flex-initial justify-center px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        b.isActive
                          ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      {b.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banner Edit Modal / Drawer if editing */}
          {editingBanner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl text-left">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-orange-600" />
                    Editar Banner
                  </h3>
                  <button
                    onClick={() => setEditingBanner(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Título Principal do Banner *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBanner.title}
                      onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                      placeholder="Ex: Top Achadinhos Virais do Momento"
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subtítulo / Descrição Rápida
                    </label>
                    <input
                      type="text"
                      value={editingBanner.subtitle}
                      onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                      placeholder="Ex: Ofertas selecionadas com frete grátis e cupons de desconto."
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Selo / Badge
                      </label>
                      <input
                        type="text"
                        value={editingBanner.badge}
                        onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                        placeholder="Ex: 🔥 Mais Vendidos ou ✨ Casa & Decor"
                        className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Texto do Botão
                      </label>
                      <input
                        type="text"
                        value={editingBanner.buttonText}
                        onChange={(e) => setEditingBanner({ ...editingBanner, buttonText: e.target.value })}
                        placeholder="Ex: Explorar Ofertas"
                        className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      URL da Imagem do Banner (Recomendado: 1200 x 360 px) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBanner.imageUrl}
                      onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                      placeholder="https://exemplo.com/banner.webp ou caminho da imagem"
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Ação ao Clicar: Filtrar Categoria no Catálogo
                    </label>
                    <select
                      value={editingBanner.tagCategory || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, tagCategory: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Nenhum (usar link direto)</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingBanner(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-orange-500/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Salvar Banner</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* WhatsApp Settings Section (Requested feature: Botão WhatsApp "Tirar Dúvidas") */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center font-bold shadow-xs">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Configuração do Botão WhatsApp (&quot;Tirar Dúvidas&quot;)
                </h3>
                <p className="text-xs text-slate-500">
                  O botão flutuante verde com o texto <strong>&quot;Tirar Dúvidas&quot;</strong> já está ativo no site. Aqui você configura o número de contato.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveWhatsAppConfig} className="max-w-xl space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Número do WhatsApp (com DDI e DDD, apenas números) *
                </label>
                <input
                  type="text"
                  required
                  value={siteConfig.whatsappNumber}
                  onChange={(e) => setSiteConfig({ ...siteConfig, whatsappNumber: e.target.value })}
                  placeholder="Ex: 5511999999999"
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Exemplo para São Paulo: 5511999999999 (55 = Brasil, 11 = DDD, 9 dígitos do celular).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mensagem Automática Inicial
                </label>
                <textarea
                  rows={3}
                  value={siteConfig.whatsappDefaultMessage}
                  onChange={(e) => setSiteConfig({ ...siteConfig, whatsappDefaultMessage: e.target.value })}
                  placeholder="Olá! Estava navegando no Achados do Dia e gostaria de tirar algumas dúvidas..."
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Salvar Configuração do WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 1: Product List */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          {/* List Search Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchAdmin}
                onChange={(e) => setSearchAdmin(e.target.value)}
                placeholder="Filtrar por título, loja ou categoria..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Mostrando {filteredProducts.length} de {products.length} produtos
            </div>
          </div>

          {/* Content: Mobile Card View (md:hidden) + Desktop Table (hidden md:block) */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">Nenhum produto encontrado</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Tente ajustar a busca ou cadastre um novo produto para sua lista.
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setActiveTab('new-product');
                }}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Cadastrar Produto
              </button>
            </div>
          ) : (
            <>
              {/* Mobile View: High-clarity Card Layout */}
              <div className="md:hidden divide-y divide-slate-100 bg-slate-50/50">
                {filteredProducts.map((p) => {
                  const storeConf = STORE_CONFIG[p.store] || STORE_CONFIG.Outro;
                  return (
                    <div key={p.id} className="p-4 space-y-3 bg-white">
                      {/* Product Header Row */}
                      <div className="flex items-start gap-3">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                            {p.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span
                              style={{
                                backgroundColor: storeConf.bg,
                                color: storeConf.text,
                                borderColor: storeConf.border,
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[10px] border"
                            >
                              <StoreLogo store={p.store} size="xs" />
                              <span>{p.store}</span>
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {p.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Info Row: Clicks & Featured Status */}
                      <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1 tabular-nums text-[11px]">
                          🔥 {p.clicksCount || 0} cliques oficiais
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            updateProduct(p.id, { isFeatured: !p.isFeatured });
                            updateProductInCloud(p.id, { isFeatured: !p.isFeatured });
                            onRefreshData();
                          }}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            p.isFeatured
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200/80 text-slate-600'
                          }`}
                        >
                          {p.isFeatured ? '★ Em Destaque' : 'Comum'}
                        </button>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="grid grid-cols-3 gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => onViewProduct(p)}
                          className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditClick(p)}
                          className="py-2.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(p.id, p.title)}
                          className="py-2.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View: Full Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Produto</th>
                      <th className="py-3 px-4">Loja Parceira</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4 text-center">Cliques</th>
                      <th className="py-3 px-4 text-center">Destaque</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const storeConf = STORE_CONFIG[p.store] || STORE_CONFIG.Outro;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0] || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div className="max-w-xs">
                                <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                                <a
                                  href={p.affiliateUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-slate-400 hover:text-orange-600 inline-flex items-center gap-1 truncate max-w-[200px]"
                                  title={p.affiliateUrl}
                                >
                                  <span>{p.affiliateUrl}</span>
                                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                </a>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              style={{
                                backgroundColor: storeConf.bg,
                                color: storeConf.text,
                                borderColor: storeConf.border,
                              }}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-bold text-[11px] border"
                            >
                              <StoreLogo store={p.store} size="xs" />
                              <span>{p.store}</span>
                            </span>
                          </td>

                          <td className="py-3 px-4 font-medium text-slate-700">
                            {p.category}
                          </td>

                          <td className="py-3 px-4 text-center font-bold tabular-nums text-slate-800">
                            🔥 {p.clicksCount || 0}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => {
                                updateProduct(p.id, { isFeatured: !p.isFeatured });
                                updateProductInCloud(p.id, { isFeatured: !p.isFeatured });
                                onRefreshData();
                              }}
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer ${
                                p.isFeatured
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                            >
                              {p.isFeatured ? '★ Destaque' : 'Comum'}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onViewProduct(p)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                                title="Visualizar no site"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditClick(p)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 cursor-pointer"
                                title="Editar produto"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(p.id, p.title)}
                                className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 cursor-pointer"
                                title="Excluir produto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: New / Edit Product Form */}
      {activeTab === 'new-product' && (
        <form onSubmit={handleSubmitProduct} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingProductId ? 'Editar Informações do Produto' : 'Cadastrar Novo Achadinho'}
              </h2>
              <p className="text-xs text-slate-500">
                Preencha os campos abaixo com as informações do parceiro oficial. Nenhum preço é exibido no site.
              </p>
            </div>
            {editingProductId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Cancelar Edição
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Título do Produto *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Organizador Giratório 360° em Acrílico Diamond Premium"
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Frase de Destaque / Subtítulo
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Ex: O queridinho do TikTok que organiza perfumes e cosméticos ocupando pouco espaço."
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Loja Parceira Oficial *
              </label>
              <select
                value={formData.store}
                onChange={(e) => setFormData({ ...formData, store: e.target.value as StoreType })}
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              >
                {STORES_LIST.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Link da Oferta no Parceiro (URL de Afiliado) *
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={formData.affiliateUrl}
                  onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                  placeholder="https://shopee.com.br/... ou https://amzn.to/..."
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Ao clicar em &quot;Ir à Loja&quot; ou no produto, o usuário será direcionado diretamente para este link.
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Fotos do Produto (URLs de Imagem)
                </label>
                <button
                  type="button"
                  onClick={handleAddImageField}
                  className="text-xs text-orange-600 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar Outra Foto
                </button>
              </div>

              <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                  Fotos de estúdio pré-geradas prontas para uso:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePickPresetImage(preset.url)}
                      className="px-2.5 py-1 bg-white hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 text-slate-700 rounded-lg text-[11px] font-medium border border-slate-200 transition-colors cursor-pointer"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {formData.images.map((imgUrl, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
                    <input
                      type="text"
                      value={imgUrl}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                      placeholder="https://exemplo.com/foto.jpg ou caminho local"
                      className="flex-1 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageField(idx)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Descrição Completa do Produto
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Escreva detalhes como dimensões, material, como funciona, facilidades de uso..."
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pontos Fortes / Destaques (Bullets com Checkmark)
                </label>
                <button
                  type="button"
                  onClick={handleAddHighlightField}
                  className="text-xs text-orange-600 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar Ponto Forte
                </button>
              </div>

              <div className="space-y-2">
                {formData.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => handleHighlightChange(idx, e.target.value)}
                      placeholder="Ex: Rotação 360° silenciosa com rolamento de aço"
                      className="flex-1 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                    {formData.highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlightField(idx)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Selos Promocionais & Badges
              </label>
              <div className="flex flex-wrap gap-2">
                {BADGE_PRESETS.map((badge) => {
                  const isChecked = formData.badges.includes(badge);
                  return (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => toggleBadge(badge)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {badge}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
              <input
                type="checkbox"
                id="isFeaturedSwitch"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded cursor-pointer"
              />
              <label htmlFor="isFeaturedSwitch" className="text-xs font-bold text-slate-800 cursor-pointer">
                Exibir este achadinho com destaque prioritário na página inicial
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
            >
              Limpar Campos
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer text-center"
            >
              <Check className="w-4 h-4" />
              <span>{editingProductId ? 'Salvar Alterações' : 'Cadastrar Produto'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Categories Manager */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs h-fit">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Nova Categoria
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Crie novas categorias para agrupar ofertas no site.
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Ex: Pets, Bebê & Kids, Livros..."
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ícone Identificador
                </label>
                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="Package">Package (Caixa padrão)</option>
                  <option value="Boxes">Boxes (Organizadores)</option>
                  <option value="Utensils">Utensils (Cozinha)</option>
                  <option value="Smartphone">Smartphone (Gadgets/Tech)</option>
                  <option value="Home">Home (Casa & Conforto)</option>
                  <option value="Sparkles">Sparkles (Beleza & Banho)</option>
                  <option value="Flame">Flame (Fogo / Destaques)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Adicionar Categoria
              </button>
            </form>
          </div>

          <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Categorias Ativas ({categories.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Categorias visíveis na navegação horizontal da página inicial.
            </p>

            <div className="space-y-2">
              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.name).length;
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{c.name}</h4>
                        <span className="text-[11px] text-slate-500">
                          {count} {count === 1 ? 'achadinho' : 'achadinhos'} associados
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="Excluir categoria (somente se não tiver produtos)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Stats & Affiliate Clicks */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total de Cliques nos Parceiros
              </span>
              <div className="text-3xl font-extrabold text-orange-600 tabular-nums">
                🔥 {totalClicks}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Cliques registrados nos botões de redirecionamento para compras
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total de Produtos Cadastrados
              </span>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {products.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Achadinhos ativos no catálogo público
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Categorias Criadas
              </span>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {categories.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Seções organizadas na barra de navegação
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              Achadinhos Mais Clicados pelos Visitantes
            </h3>

            <div className="space-y-3">
              {topProducts.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900 line-clamp-1">{p.title}</p>
                      <span className="text-[11px] text-orange-600 font-semibold">{p.store} · {p.category}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                      {p.clicksCount || 0}
                    </span>
                    <span className="text-[11px] text-slate-500 block">cliques oficiais</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Security & Password Modification */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto">
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Segurança e Alteração de Senha
              </h2>
              <p className="text-xs text-slate-500">
                Altere a senha de acesso ao Painel Administrativo. A nova senha será salva no seu navegador.
              </p>
            </div>
          </div>

          {/* Success / Error Banners */}
          {passwordChangeSuccess && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passwordChangeSuccess}</span>
            </div>
          )}

          {passwordChangeError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passwordChangeError}</span>
            </div>
          )}

          {/* Password Form */}
          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Senha Atual *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="Informe sua senha atual (padrão inicial: admin123)"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nova Senha * (mínimo 4 caracteres)
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Digite sua nova senha..."
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Confirmar Nova Senha *
              </label>
              <input
                type="password"
                required
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                placeholder="Repita exatamente a nova senha..."
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Nova Senha</span>
            </button>
          </form>

          {/* Fallback / Reset to default option */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Esqueceu a senha ou deseja resetar?
              </h4>
              <p className="text-[11px] text-slate-500">
                Restaura a senha para o valor padrão de fábrica (&quot;admin123&quot;).
              </p>
            </div>
            <button
              type="button"
              onClick={handleRestoreDefaultPassword}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Restaurar &quot;admin123&quot;
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: Backup & Restore */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto">
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Gerenciamento e Backup de Dados
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Todos os produtos, 3 banners e categorias cadastrados ficam salvos no armazenamento local do navegador.
            Você pode exportar um arquivo JSON de backup ou restaurar quando quiser.
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Exportar Catálogo em JSON</h4>
                <p className="text-[11px] text-slate-500">Baixe uma cópia completa com todos os produtos</p>
              </div>
              <button
                onClick={handleExport}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Backup</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Importar Arquivo JSON</h4>
                <p className="text-[11px] text-slate-500">Substitua o catálogo por um arquivo de backup salvo</p>
              </div>
              <label className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Carregar Arquivo</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-rose-900">Restaurar Catálogo de Demonstração</h4>
                <p className="text-[11px] text-rose-600">Volta para os achadinhos iniciais pré-configurados</p>
              </div>
              <button
                onClick={handleResetDefaults}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Fábrica</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dimensions & Formats Explanation Modal */}
      <BannerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};
