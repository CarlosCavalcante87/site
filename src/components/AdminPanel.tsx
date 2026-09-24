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
  Star,
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
  FileText,
  Pencil,
  Laptop,
  Cpu,
  HardDrive,
  Printer,
  Headphones,
  Tv,
  Zap,
  Plug,
  Wrench,
  Hammer,
  Drill,
  Construction,
  Home,
  Armchair,
  Lamp,
  Bed,
  Utensils,
  CookingPot,
  ChefHat,
  Coffee,
  Refrigerator,
  Microwave,
  Boxes,
  Shirt,
  Dumbbell,
  Car,
  Dog,
  Loader2
} from 'lucide-react';
import {
  removeBannerImage,
  uploadBannerImage
} from '../services/bannerUpload';

export const CATEGORY_ICON_GROUPS = [
  {
    group: 'Informática & Computação',
    options: [
      { value: 'Laptop', label: 'Laptop / Notebook', icon: Laptop },
      { value: 'Monitor', label: 'Monitor & Telas', icon: Monitor },
      { value: 'Cpu', label: 'Hardware / Processador', icon: Cpu },
      { value: 'HardDrive', label: 'Armazenamento & SSD', icon: HardDrive },
      { value: 'Printer', label: 'Impressoras & Periféricos', icon: Printer },
    ],
  },
  {
    group: 'Eletrônicos & Áudio',
    options: [
      { value: 'Smartphone', label: 'Smartphone / Celular', icon: Smartphone },
      { value: 'Headphones', label: 'Fones de Ouvido & Áudio', icon: Headphones },
      { value: 'Tv', label: 'TV & Vídeo', icon: Tv },
      { value: 'Zap', label: 'Eletrônicos & Energia', icon: Zap },
      { value: 'Plug', label: 'Cabos & Carregadores', icon: Plug },
    ],
  },
  {
    group: 'Ferramentas & Construção',
    options: [
      { value: 'Wrench', label: 'Chave Inglesa / Ferramentas', icon: Wrench },
      { value: 'Hammer', label: 'Martelo & Obras', icon: Hammer },
      { value: 'Drill', label: 'Furadeira & Elétricas', icon: Drill },
      { value: 'Construction', label: 'Construção & Reparos', icon: Construction },
    ],
  },
  {
    group: 'Casa & Decoração',
    options: [
      { value: 'Home', label: 'Casa & Conforto', icon: Home },
      { value: 'Armchair', label: 'Móveis & Poltrona', icon: Armchair },
      { value: 'Lamp', label: 'Iluminação & Luminárias', icon: Lamp },
      { value: 'Bed', label: 'Cama, Mesa & Banho', icon: Bed },
    ],
  },
  {
    group: 'Cozinha & Eletroportáteis',
    options: [
      { value: 'Utensils', label: 'Talheres & Utensílios', icon: Utensils },
      { value: 'CookingPot', label: 'Panelas & Cocção', icon: CookingPot },
      { value: 'ChefHat', label: 'Gourmet & Confeitaria', icon: ChefHat },
      { value: 'Coffee', label: 'Cafeteira & Bebidas', icon: Coffee },
      { value: 'Refrigerator', label: 'Geladeira & Refrigeração', icon: Refrigerator },
      { value: 'Microwave', label: 'Micro-ondas & Eletros', icon: Microwave },
    ],
  },
  {
    group: 'Outras Categorias Populares',
    options: [
      { value: 'Boxes', label: 'Organizadores & Caixas', icon: Boxes },
      { value: 'Package', label: 'Embalagens / Geral', icon: Package },
      { value: 'Sparkles', label: 'Beleza & Cuidados', icon: Sparkles },
      { value: 'Flame', label: 'Achadinhos & Promoções', icon: Flame },
      { value: 'Shirt', label: 'Moda & Vestuário', icon: Shirt },
      { value: 'Dumbbell', label: 'Fitness & Esportes', icon: Dumbbell },
      { value: 'Car', label: 'Automotivo & Carro', icon: Car },
      { value: 'Dog', label: 'Pets & Animais', icon: Dog },
    ],
  },
];

export const renderCategoryIcon = (iconName?: string, className = 'w-4 h-4') => {
  if (!iconName) return <Package className={className} />;
  for (const grp of CATEGORY_ICON_GROUPS) {
    const opt = grp.options.find((o) => o.value.toLowerCase() === iconName.toLowerCase());
    if (opt) {
      const IconComp = opt.icon;
      return <IconComp className={className} />;
    }
  }
  return <Package className={className} />;
};
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
  saveStoredSiteConfig,
  reorderProductPosition
} from '../services/storage';
import { StoreLogo } from './StoreLogo';
import {
  addProductToCloud,
  updateProductInCloud,
  swapProductOrdersInCloud,
  deleteProductFromCloud,
  saveBannersToCloud,
  saveCategoriesToCloud,
  deleteCategoryFromCloud,
  saveSiteConfigToCloud,
  fetchAdminPasswordFromCloud,
  saveAdminPasswordToCloud
} from '../services/firebaseService';
import { BannerGuideModal } from './BannerGuideModal';
import { WhatsAppIcon } from './WhatsAppButton';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  onRefreshData: () => void;
  onCloseAdmin: () => void;
  onShowToast: (message: string) => void;
  onViewProduct: (product: Product) => void;
}

const STORES_LIST: StoreType[] = ['Mercado Livre', 'Amazon', 'Shopee', 'Shein', 'Magalu', 'AliExpress', 'Outro'];

const BADGE_PRESETS = [
  'Destaque',
  'Mais Vendido',
  'Frete Grátis',
  'Cupom Ativo',
  'Viral no TikTok',
  'Tendência',
  'Garantia Loja',
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
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [bannerUploadProgress, setBannerUploadProgress] = useState(0);
  const [showManualBannerUrl, setShowManualBannerUrl] = useState(false);
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
    rating: 4.9,
    reviewCount: 384,
    clicksCount: 1420,
    order: products.length + 1,
  });

  // Category creation & edit state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Package');

  // Stats calculation (100% Números Reais de Visitantes)
  const totalRealClicks = products.reduce((acc, p) => acc + (p.realClicksCount || 0), 0);
  const totalRealViews = products.reduce((acc, p) => acc + (p.realViewsCount || 0), 0);
  const topProducts = [...products]
    .sort((a, b) => (b.realClicksCount || 0) - (a.realClicksCount || 0))
    .slice(0, 5);

  // Handle Login Action
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      // 1. Check with local storage credentials
      let isValid = verifyAdminCredentials(loginUser, loginPassword);

      // 2. If it fails, fetch the true cloud password directly from Firestore (handles multi-device / incognito)
      if (!isValid) {
        const cloudPass = (await fetchAdminPasswordFromCloud()).trim();
        const trimmedUser = loginUser.trim().toLowerCase();
        const trimmedPass = loginPassword.trim();
        const validUser = (trimmedUser === DEFAULT_ADMIN_CONFIG.username.toLowerCase()) || 
                          (trimmedUser === 'admin@achadosdodia.com.br');
        if (validUser && trimmedPass === cloudPass) {
          isValid = true;
          // Synchronize local password immediately
          setAdminPassword(cloudPass);
        }
      }

      if (isValid) {
        setAdminSession(true);
        setIsAdminLoggedIn(true);
        setLoginPassword('');
        onShowToast('Login realizado com sucesso! Bem-vindo ao painel.');
      } else {
        setLoginError('Credenciais incorretas. Verifique o usuário e a senha informados.');
      }
    } catch {
      setLoginError('Erro ao validar acesso. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout Action
  const handleLogout = () => {
    setAdminSession(false);
    setIsAdminLoggedIn(false);
    setLoginPassword('');
    onShowToast('Sessão encerrada com sucesso.');
  };

  // Handle Password Change Action
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);
    setIsChangingPassword(true);

    try {
      // Fetch latest cloud password to verify current password
      const currentSavedPass = (await fetchAdminPasswordFromCloud()).trim();
      if (currentPasswordInput.trim() !== currentSavedPass) {
        setPasswordChangeError('A senha atual informada está incorreta.');
        return;
      }

      const trimmedNew = newPasswordInput.trim();
      if (trimmedNew.length < 4) {
        setPasswordChangeError('A nova senha deve possuir no mínimo 4 caracteres.');
        return;
      }

      if (trimmedNew !== confirmPasswordInput.trim()) {
        setPasswordChangeError('A confirmação da nova senha não coincide.');
        return;
      }

      // Save new password to LocalStorage AND to Firestore Cloud
      const savedOk = await saveAdminPasswordToCloud(trimmedNew);
      if (savedOk) {
        setAdminPassword(trimmedNew);
        setPasswordChangeSuccess('Senha alterada com sucesso! Ela foi salva na nuvem e será exigida em todos os seus acessos futuros.');
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
        onShowToast('Senha de administrador atualizada e salva na nuvem!');
      } else {
        setPasswordChangeError('Não foi possível sincronizar na nuvem. Verifique sua conexão.');
      }
    } catch {
      setPasswordChangeError('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Restore Default Password Action
  const handleRestoreDefaultPassword = async () => {
    if (window.confirm(`Deseja restaurar a senha de administrador para a padrão ("${DEFAULT_ADMIN_CONFIG.defaultPassword}")?`)) {
      await saveAdminPasswordToCloud(DEFAULT_ADMIN_CONFIG.defaultPassword);
      setAdminPassword(DEFAULT_ADMIN_CONFIG.defaultPassword);
      setPasswordChangeSuccess(`Senha redefinida para o padrão de fábrica: "${DEFAULT_ADMIN_CONFIG.defaultPassword}"`);
      setPasswordChangeError(null);
      onShowToast('Senha padrão restaurada na nuvem!');
    }
  };

  // Handle Banner File Processing (Upload or Instant Optimization)
  const handleProcessBannerFile = async (file: File) => {
    if (!file || !editingBanner) return;
    
    if (file.size > 10 * 1024 * 1024) {
      onShowToast('A imagem deve ter no máximo 10 MB.');
      return;
    }

    setIsUploadingBanner(true);
    setBannerUploadProgress(15);

    // Hard safety timer: guarantee the loader disappears within 3s under any condition
    const safetyTimer = setTimeout(() => {
      setIsUploadingBanner(false);
    }, 3000);

    try {
      const url = await uploadBannerImage(file, editingBanner.id, (prog) => {
        setBannerUploadProgress(prog);
      });
      clearTimeout(safetyTimer);
      setEditingBanner((current) => current ? { ...current, imageUrl: url } : current);
      onShowToast('Imagem do banner carregada com sucesso!');
    } catch (error: any) {
      clearTimeout(safetyTimer);
      console.error('Banner upload error:', error);
      onShowToast('Erro ao processar imagem. Tente novamente.');
    } finally {
      setIsUploadingBanner(false);
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
    const nextOrder = products.reduce((max, p) => Math.max(max, p.order || 0), 0) + 1;
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
      rating: 4.9,
      reviewCount: 384,
      clicksCount: 1420,
      order: nextOrder,
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
      rating: p.rating !== undefined ? p.rating : 4.9,
      reviewCount: p.reviewCount !== undefined ? p.reviewCount : 384,
      clicksCount: p.clicksCount !== undefined ? p.clicksCount : 1420,
      order: p.order || 1,
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
      const desiredOrder = Number(formData.order) || 1;
      const reorderRes = reorderProductPosition(editingProductId, desiredOrder);
      if (reorderRes.swappedProduct) {
        swapProductOrdersInCloud(
          { id: editingProductId, order: desiredOrder },
          { id: reorderRes.swappedProduct.id, order: reorderRes.swappedProduct.order || 1 }
        );
      } else {
        swapProductOrdersInCloud({ id: editingProductId, order: desiredOrder });
      }

      const updates = {
        title: formData.title,
        subtitle: formData.subtitle,
        store: formData.store,
        affiliateUrl: formData.affiliateUrl,
        category: formData.category,
        order: desiredOrder,
        images: finalImages,
        description: formData.description,
        highlights: cleanHighlights,
        badges: formData.badges,
        isFeatured: formData.isFeatured,
        rating: Number(formData.rating) || 4.9,
        reviewCount: Number(formData.reviewCount) >= 0 ? Number(formData.reviewCount) : 384,
        clicksCount: Number(formData.clicksCount) >= 0 ? Number(formData.clicksCount) : 1420,
      };
      updateProduct(editingProductId, updates);
      updateProductInCloud(editingProductId, updates);
      onShowToast('Produto atualizado com sucesso!');
    } else {
      const desiredOrder = Number(formData.order) || (products.length + 1);
      const created = addProduct({
        title: formData.title,
        subtitle: formData.subtitle,
        store: formData.store,
        affiliateUrl: formData.affiliateUrl,
        category: formData.category,
        order: desiredOrder,
        images: finalImages,
        description: formData.description || 'Descrição detalhada do achadinho.',
        highlights: cleanHighlights.length > 0 ? cleanHighlights : ['Produto verificado', 'Envio rápido'],
        badges: formData.badges,
        isFeatured: formData.isFeatured,
        rating: Number(formData.rating) || 4.9,
        reviewCount: Number(formData.reviewCount) >= 0 ? Number(formData.reviewCount) : 384,
        clicksCount: Number(formData.clicksCount) >= 0 ? Number(formData.clicksCount) : 1420,
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

  const handleStartEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setNewCatName(cat.name);
    setNewCatIcon(cat.iconName || 'Package');
    const formEl = document.getElementById('category-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setNewCatName('');
    setNewCatIcon('Package');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newCatName.trim();
    if (!trimmedName) return;

    if (editingCategoryId) {
      const existing = categories.find((c) => c.id === editingCategoryId);
      if (!existing) return;

      const nameAlreadyUsed = categories.some(
        (c) => c.id !== editingCategoryId && c.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (nameAlreadyUsed) {
        alert(`Já existe uma categoria cadastrada com o nome "${trimmedName}".`);
        return;
      }

      const oldName = existing.name;
      const updatedCategory: Category = {
        ...existing,
        name: trimmedName,
        slug: trimmedName.toLowerCase().replace(/\s+/g, '-'),
        iconName: newCatIcon,
      };

      const updatedCategories = categories.map((c) =>
        c.id === editingCategoryId ? updatedCategory : c
      );

      // If category name changed, synchronize all catalog products that used the old name
      if (oldName !== trimmedName) {
        const affectedProducts = products.filter((p) => p.category === oldName);
        for (const p of affectedProducts) {
          const updatedProd = { ...p, category: trimmedName };
          updateProduct(p.id, updatedProd);
          updateProductInCloud(p.id, { category: trimmedName });
        }
      }

      saveCategories(updatedCategories);
      saveCategoriesToCloud(updatedCategories);
      setEditingCategoryId(null);
      setNewCatName('');
      setNewCatIcon('Package');
      onRefreshData();
      onShowToast(`Categoria "${trimmedName}" atualizada com sucesso!`);
    } else {
      const nameAlreadyUsed = categories.some(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (nameAlreadyUsed) {
        alert(`Já existe uma categoria cadastrada com o nome "${trimmedName}".`);
        return;
      }

      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: trimmedName,
        slug: trimmedName.toLowerCase().replace(/\s+/g, '-'),
        iconName: newCatIcon,
      };

      const updated = [...categories, newCat];
      saveCategories(updated);
      saveCategoriesToCloud(updated);
      setNewCatName('');
      setNewCatIcon('Package');
      onRefreshData();
      onShowToast(`Categoria "${newCat.name}" criada com sucesso!`);
    }
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    const isUsed = products.some((p) => p.category === catName);
    if (isUsed) {
      alert(`Não é possível excluir a categoria "${catName}" pois há produtos vinculados a ela.`);
      return;
    }

    if (window.confirm(`Excluir a categoria "${catName}"?`)) {
      if (editingCategoryId === catId) {
        handleCancelEditCategory();
      }
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

  const handleUpdatePosition = async (product: Product, newPositionRaw: number) => {
    if (isNaN(newPositionRaw) || newPositionRaw < 1) {
      onShowToast('❌ O número da posição deve ser 1 ou maior.');
      return;
    }

    const currentPos = product.order || 1;
    if (currentPos === newPositionRaw) return;

    const result = reorderProductPosition(product.id, newPositionRaw);
    if (!result.success) {
      onShowToast(`❌ ${result.message}`);
      return;
    }

    if (result.targetProduct) {
      await swapProductOrdersInCloud(
        { id: product.id, order: newPositionRaw },
        result.swappedProduct ? { id: result.swappedProduct.id, order: result.swappedProduct.order || currentPos } : undefined
      );
    }

    onRefreshData();
    onShowToast(`✅ ${result.message}`);
  };

  const filteredProducts = [...products]
    .filter((p) => {
      const query = searchAdmin.toLowerCase();
      return (
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.store.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => (a.order || 9999) - (b.order || 9999));

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
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Unlock className="w-4 h-4 text-amber-400" />
              <span>{isLoggingIn ? 'Validando acesso...' : 'Entrar no Painel Admin'}</span>
            </button>
          </form>

          {/* Dica discreta de primeiro acesso */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mb-5 text-center">
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Primeiro acesso de fábrica? Usuário: <strong className="text-slate-900 font-mono">admin</strong> &bull; Senha inicial: <strong className="text-slate-900 font-mono">admin123</strong>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Caso já tenha alterado sua senha na aba Segurança, utilize a sua nova senha cadastrada.
            </p>
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
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-transparent text-slate-700 font-semibold text-xs transition-all duration-200 cursor-pointer flex items-center gap-1 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0"
              title="Voltar para a loja pública"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Ver Loja</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-transparent text-slate-600 font-semibold text-xs transition-all duration-200 cursor-pointer flex items-center gap-1 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0"
              title="Encerrar sessão de administrador"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600" />
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
            className="col-span-2 sm:col-auto px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 hover:ring-2 hover:ring-orange-400/50"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Produto</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'banners'
                ? 'bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-500/20 hover:bg-orange-700'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 hover:shadow-xs'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
            <span>3 Banners</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'security'
                ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-xs hover:bg-amber-600 hover:text-white'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 hover:shadow-xs'
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
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'products'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/25 hover:bg-orange-700'
                : 'text-slate-600 bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 hover:shadow-xs'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Produtos ({products.length})</span>
          </button>

          {editingProductId && (
            <button
              onClick={() => setActiveTab('new-product')}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
                activeTab === 'new-product'
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/25 hover:bg-orange-700'
                  : 'text-slate-600 bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 hover:shadow-xs'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Editando Produto</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('banners')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'banners'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/25 hover:bg-orange-700'
                : 'text-slate-600 bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 hover:shadow-xs'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Banners & Whats</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'categories'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/25 hover:bg-orange-700'
                : 'text-slate-600 bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 hover:shadow-xs'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categorias ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'stats'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/25 hover:bg-orange-700'
                : 'text-slate-600 bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 hover:shadow-xs'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Cliques</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'security'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/25 hover:bg-orange-700'
                : 'text-slate-600 bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 hover:shadow-xs'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Segurança</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'backup'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/25 hover:bg-orange-700'
                : 'text-slate-600 bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 hover:shadow-xs'
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
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Upload da Imagem do Banner (Recomendado: 1200 x 360 px) *
                    </label>

                    <div className="space-y-3">
                      {/* Upload em andamento */}
                      {isUploadingBanner && (
                        <div className="p-5 bg-orange-50/80 border-2 border-orange-300 rounded-2xl flex flex-col items-center justify-center text-center">
                          <Loader2 className="w-8 h-8 text-orange-600 animate-spin mb-2" />
                          <span className="text-sm font-bold text-slate-800">Otimizando e carregando banner...</span>
                          <span className="text-xs text-orange-600 font-semibold mt-1">{bannerUploadProgress}% concluído</span>
                          <div className="w-full max-w-xs bg-orange-200/70 h-2 rounded-full mt-3 overflow-hidden">
                            <div 
                              className="bg-orange-600 h-full transition-all duration-200" 
                              style={{ width: `${bannerUploadProgress}%` }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsUploadingBanner(false)}
                            className="mt-3 text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}

                      {/* Caso já exista imagem carregada */}
                      {!isUploadingBanner && editingBanner.imageUrl ? (
                        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 shadow-sm">
                          <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs font-bold text-slate-700">Imagem Carregada</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="text-xs text-orange-600 hover:text-orange-700 font-bold cursor-pointer flex items-center gap-1">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Substituir</span>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,image/avif"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleProcessBannerFile(file);
                                    e.target.value = '';
                                  }}
                                />
                              </label>
                              <span className="text-slate-300">|</span>
                              <button
                                type="button"
                                onClick={() => setEditingBanner({ ...editingBanner, imageUrl: '' })}
                                className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remover</span>
                              </button>
                            </div>
                          </div>
                          <img
                            src={editingBanner.imageUrl}
                            alt="Pré-visualização do banner"
                            className="w-full max-h-48 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                      ) : (
                        /* Área de Upload (quando não há imagem ainda) */
                        !isUploadingBanner && (
                          <label className="flex flex-col items-center justify-center w-full min-h-36 px-4 py-6 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/40 hover:bg-orange-50/80 hover:border-orange-500 transition-all cursor-pointer group">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 mb-3 group-hover:scale-105 transition-transform">
                              <Upload className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-slate-800 text-center">
                              Clique aqui para fazer upload da imagem do banner
                            </span>
                            <span className="text-[11px] text-slate-500 mt-1 text-center">
                              Formatos aceitos: JPG, PNG, WEBP &bull; Até 10 MB
                            </span>
                            <span className="mt-3 px-4 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-xs group-hover:bg-orange-700">
                              Selecionar Imagem
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/avif"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleProcessBannerFile(file);
                                e.target.value = '';
                              }}
                            />
                          </label>
                        )
                      )}

                      {/* Opção secundária para quem preferir colar link/URL */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setShowManualBannerUrl(!showManualBannerUrl)}
                          className="text-[11px] text-slate-500 hover:text-slate-700 underline font-medium cursor-pointer"
                        >
                          {showManualBannerUrl ? 'Ocultar inserção por URL' : 'Prefere colar a URL da imagem em vez de enviar o arquivo? Clique aqui'}
                        </button>
                        
                        {showManualBannerUrl && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={editingBanner.imageUrl}
                              onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                              placeholder="https://exemplo.com/imagem-do-banner.webp"
                              className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
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
                <WhatsAppIcon className="w-5 h-5 fill-current" />
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

          {/* Configuração de Layout Mobile: Visualização Dupla (2 colunas) vs Simples (1 coluna) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Visualização dos Cards em Dispositivos Mobile (Celulares)
                </h3>
                <p className="text-xs text-slate-500">
                  Ative ou desative a exibição dupla (2 colunas lado a lado) para visitantes que acessam pelo celular.
                </p>
              </div>
            </div>

            <div className="max-w-xl space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">
                      Visualização Dupla (2 Cards por Linha)
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      siteConfig.mobileDoubleColumns !== false
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {siteConfig.mobileDoubleColumns !== false ? '● Ativado (2 Colunas)' : '○ Desativado (1 Coluna)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {siteConfig.mobileDoubleColumns !== false
                      ? 'Ativado: Exibe 2 produtos lado a lado na tela do celular (formato vitrine compacta da Shopee / Mercado Livre). Permite ver mais achadinhos sem rolar muito.'
                      : 'Desativado: Exibe 1 produto em destaque por linha na tela do celular (cards largos com largura total).'}
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={siteConfig.mobileDoubleColumns !== false}
                    onChange={(e) => {
                      const updated = { ...siteConfig, mobileDoubleColumns: e.target.checked };
                      setSiteConfig(updated);
                      saveStoredSiteConfig(updated);
                      saveSiteConfigToCloud(updated);
                      onShowToast(
                        e.target.checked
                          ? 'Visualização dupla (2 colunas) no mobile ativada!'
                          : 'Visualização simples (1 coluna) no mobile ativada!'
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              {/* Botões seletores visuais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...siteConfig, mobileDoubleColumns: true };
                    setSiteConfig(updated);
                    saveStoredSiteConfig(updated);
                    saveSiteConfigToCloud(updated);
                    onShowToast('Visualização dupla (2 colunas) ativada no celular!');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    siteConfig.mobileDoubleColumns !== false
                      ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-400/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-7 border-2 border-slate-700 rounded-sm flex items-center justify-center gap-0.5 p-0.5">
                      <div className="w-1.5 h-4 bg-orange-500 rounded-2xs"></div>
                      <div className="w-1.5 h-4 bg-orange-500 rounded-2xs"></div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">2 Colunas (Dupla)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Estilo Shopee/Instagram. Mais ofertas visíveis por tela.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...siteConfig, mobileDoubleColumns: false };
                    setSiteConfig(updated);
                    saveStoredSiteConfig(updated);
                    saveSiteConfigToCloud(updated);
                    onShowToast('Visualização simples (1 coluna) ativada no celular!');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    siteConfig.mobileDoubleColumns === false
                      ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-400/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-7 border-2 border-slate-700 rounded-sm flex flex-col items-center justify-center gap-0.5 p-0.5">
                      <div className="w-3.5 h-1.5 bg-orange-500 rounded-2xs"></div>
                      <div className="w-3.5 h-1.5 bg-orange-500 rounded-2xs"></div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">1 Coluna (Simples)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Cards grandes ocupando toda a largura do celular.
                  </p>
                </button>
              </div>
            </div>
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

          {/* Dica de Organização Manual das Ofertas */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/80 flex items-center gap-2 text-xs text-amber-950">
            <Sliders className="w-4 h-4 text-orange-600 shrink-0" />
            <span className="font-semibold text-orange-800">Organização Manual:</span>
            <span className="text-slate-600 text-[11px] sm:text-xs">
              Digite o número no campo <strong># Posição</strong> para definir a ordem no site (ex: <strong>1</strong> para 1ª oferta, <strong>4</strong> para 4ª). Ao trocar, nenhuma posição é repetida.
            </span>
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
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
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

                            {/* Posição no Site (campo manual) */}
                            <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200" title="Posição da oferta no site">
                              <span className="text-[10px] font-bold text-amber-950 uppercase">Posição:</span>
                              <span className="text-xs font-black text-orange-600">#</span>
                              <input
                                type="number"
                                min="1"
                                step="1"
                                key={`mob-${p.id}-${p.order}`}
                                defaultValue={p.order}
                                onBlur={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val !== p.order) {
                                    handleUpdatePosition(p, val);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = parseInt((e.target as HTMLInputElement).value, 10);
                                    if (!isNaN(val) && val !== p.order) {
                                      handleUpdatePosition(p, val);
                                    }
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                className="w-12 px-1 py-0.5 text-center font-bold text-xs bg-white border border-amber-300 rounded text-slate-900 focus:outline-none focus:border-orange-500"
                                title="Posição no site (sem repetição)"
                              />
                            </div>

                            <span className="text-[11px] text-slate-400 font-medium">
                              {p.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Info Row: Real Clicks, Real Views & Featured Status */}
                      <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl text-xs gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-extrabold text-orange-600 flex items-center gap-1 tabular-nums text-[11px]" title="Cliques reais no link oficial do parceiro">
                            🔥 {p.realClicksCount || 0} cliques reais
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="font-semibold text-slate-600 flex items-center gap-1 tabular-nums text-[11px]" title="Visualizações reais da página da oferta">
                            👀 {p.realViewsCount || 0} views
                          </span>
                        </div>
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
                          {p.isFeatured ? '★ Destaque' : 'Comum'}
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
                      <th className="py-3 px-4 text-center">Posição no Site</th>
                      <th className="py-3 px-4 text-center" title="Cliques reais que visitantes deram no botão de compra">Cliques Reais</th>
                      <th className="py-3 px-4 text-center" title="Visualizações reais da página da oferta">Views Reais</th>
                      <th className="py-3 px-4 text-center" title="Números definidos manualmente para aparecer na loja aos clientes">Prova Social (Loja)</th>
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

                          {/* Posição no Site (onde exibia categoria) */}
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex flex-col items-center">
                              <div className="flex items-center gap-1 bg-amber-50/70 hover:bg-amber-100/70 px-2 py-1 rounded-xl border border-amber-200 transition-colors">
                                <span className="text-xs font-black text-orange-600 pl-0.5">#</span>
                                <input
                                  type="number"
                                  min="1"
                                  step="1"
                                  key={`tbl-${p.id}-${p.order}`}
                                  defaultValue={p.order}
                                  onBlur={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val) && val !== p.order) {
                                      handleUpdatePosition(p, val);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const val = parseInt((e.target as HTMLInputElement).value, 10);
                                      if (!isNaN(val) && val !== p.order) {
                                        handleUpdatePosition(p, val);
                                      }
                                      (e.target as HTMLInputElement).blur();
                                    }
                                  }}
                                  className="w-14 px-1.5 py-1 text-center font-black text-sm bg-white border border-amber-300 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500 shadow-2xs"
                                  title="Digite a posição no site (ex: 1 para primeira oferta). Os números não se repetem!"
                                />
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium mt-1 truncate max-w-[120px]" title={`Categoria: ${p.category}`}>
                                {p.category}
                              </span>
                            </div>
                          </td>

                          {/* Cliques Reais no Link */}
                          <td className="py-3 px-4 text-center">
                            <span className="font-extrabold tabular-nums text-orange-600 inline-flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100" title="Cliques reais no link oficial do parceiro">
                              🔥 {p.realClicksCount || 0}
                            </span>
                          </td>

                          {/* Views Reais da Oferta */}
                          <td className="py-3 px-4 text-center">
                            <span className="font-semibold tabular-nums text-slate-700 inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200" title="Aberturas reais da página desta oferta">
                              👀 {p.realViewsCount || 0}
                            </span>
                          </td>

                          {/* Prova Social Manual da Loja */}
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex flex-col items-center gap-0.5 text-[11px] text-slate-600">
                              <span className="font-bold text-amber-600">★ {p.rating !== undefined ? p.rating : 4.9}</span>
                              <span className="text-[10px] text-slate-400">({p.reviewCount !== undefined ? p.reviewCount : 384} aval. · {p.clicksCount || 1420} na loja)</span>
                            </span>
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

            {/* Posição no Site (Ordem Manual da Oferta) */}
            <div className="md:col-span-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-950">
                  <Sliders className="w-4 h-4 text-orange-600" />
                  Posição da Oferta no Site (Ordem de Exibição) *
                </span>
                <span className="text-[11px] font-bold text-orange-600 normal-case bg-orange-100/80 px-2 py-0.5 rounded-md">
                  Sem números repetidos
                </span>
              </label>
              <div className="flex items-center gap-3 mt-2">
                <div className="relative w-32">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-orange-600">#</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-amber-300 text-sm font-black text-slate-900 focus:outline-none focus:border-orange-500 shadow-2xs"
                  />
                </div>
                <p className="text-xs text-slate-600 flex-1">
                  Ex: Digite <strong>1</strong> para ser a primeira oferta exibida no site, <strong>4</strong> para quarta, etc. Se o número já estiver ocupado, as posições serão trocadas automaticamente para que nenhum número se repita!
                </p>
              </div>
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

            {/* Prova Social: Avaliações e Acessos este Mês */}
            <div className="md:col-span-2 bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span>Prova Social do Produto (Exibida na Loja para o Público)</span>
                    <span className="text-[10px] normal-case font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
                      Inserção Manual
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Insira manualmente estes valores para exibir na página da oferta aos clientes. O painel administrativo contabiliza os cliques e acessos 100% reais de forma separada.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 pt-3 border-t border-slate-200/60">
                {/* 1. Nota da Avaliação (ex: 4.9) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>Nota da Avaliação</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                      placeholder="4.9"
                      className="w-full pl-3.5 pr-14 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500 shadow-xs"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-amber-600 pointer-events-none">
                      ★ / 5.0
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Ex: <strong className="text-slate-600">4.9</strong>
                  </span>
                </div>

                {/* 2. Quantidade de Avaliações no Parceiro (ex: 384) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <span>Qtd. de Avaliações</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={formData.reviewCount}
                      onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value, 10) || 0 })}
                      placeholder="384"
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 shadow-xs"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Exibe: <strong className="text-slate-600">({formData.reviewCount || 384} avaliações no parceiro)</strong>
                  </span>
                </div>

                {/* 3. Quantidade de Acessos este Mês (ex: 1420) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-600" />
                    <span>Acessos este Mês</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={formData.clicksCount}
                      onChange={(e) => setFormData({ ...formData, clicksCount: parseInt(e.target.value, 10) || 0 })}
                      placeholder="1420"
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 shadow-xs"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Exibe: <strong className="text-slate-600">{formData.clicksCount || 1420} acessos este mês</strong>
                  </span>
                </div>
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
          <div id="category-form-section" className="md:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs h-fit scroll-mt-20">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategoryId ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              {editingCategoryId && (
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                  Modo Edição
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {editingCategoryId 
                ? 'Atualize o nome ou o ícone da categoria. Os produtos associados serão sincronizados.'
                : 'Crie novas categorias para agrupar ofertas no site.'}
            </p>

            {editingCategoryId && (
              <div className="flex items-center justify-between p-2.5 mb-4 bg-orange-50/70 border border-orange-200 rounded-xl text-xs text-orange-950">
                <span className="font-semibold truncate">
                  Editando: <strong className="text-orange-600">{categories.find(c => c.id === editingCategoryId)?.name}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleCancelEditCategory}
                  className="text-orange-700 hover:text-orange-900 font-bold ml-2 underline shrink-0 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Ex: Informática, Ferramentas, Pets..."
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ícone Identificador
                </label>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 shadow-xs">
                    {renderCategoryIcon(newCatIcon, 'w-5 h-5')}
                  </div>
                  <select
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
                  >
                    {CATEGORY_ICON_GROUPS.map((grp) => (
                      <optgroup key={grp.group} label={grp.group}>
                        {grp.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Escolha o ícone representativo (Eletrônicos, Informática, Ferramentas, Casa, Cozinha, etc.).
                </span>
              </div>

              <div className="pt-2">
                {editingCategoryId ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-orange-500/20"
                    >
                      <Check className="w-4 h-4" />
                      Salvar Alterações
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEditCategory}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Categoria
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Categorias Ativas ({categories.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Categorias visíveis na navegação horizontal da página inicial.
            </p>

            <div className="space-y-2.5">
              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.name).length;
                const isEditing = editingCategoryId === c.id;
                return (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isEditing
                        ? 'bg-orange-50/70 border-orange-300 ring-2 ring-orange-400/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                        isEditing
                          ? 'bg-white border-orange-300 text-orange-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                      }`}>
                        {renderCategoryIcon(c.iconName, 'w-4 h-4')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{c.name}</h4>
                          {isEditing && (
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-md">
                              Em edição
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {count} {count === 1 ? 'achadinho' : 'achadinhos'} associados &bull; <span className="font-mono text-[10px] text-slate-400">{c.iconName || 'Package'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEditCategory(c)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          isEditing
                            ? 'bg-orange-200 text-orange-800'
                            : 'text-slate-400 hover:text-slate-900 hover:bg-white'
                        }`}
                        title="Editar nome e ícone desta categoria"
                        aria-label={`Editar categoria ${c.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c.id, c.name)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="Excluir categoria (somente se não tiver produtos)"
                        aria-label={`Excluir categoria ${c.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                Cliques Reais nos Parceiros
              </span>
              <div className="text-3xl font-extrabold text-orange-600 tabular-nums">
                🔥 {totalRealClicks}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Total de cliques 100% reais dados por visitantes em botões de compra ("Ir à Loja" / "Comprar")
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Visualizações Reais das Ofertas
              </span>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                👀 {totalRealViews}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Acessos e visualizações reais das páginas completas dos achadinhos
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
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                Achadinhos Mais Clicados pelos Visitantes (Dados 100% Reais)
              </h3>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                Atualizado em tempo real
              </span>
            </div>

            <div className="space-y-3">
              {topProducts.length === 0 || totalRealClicks === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Flame className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">Nenhum clique registrado ainda</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Conforme visitantes reais acessarem e clicarem em "Ir à Loja" nas ofertas, as estatísticas reais aparecerão aqui.
                  </p>
                </div>
              ) : (
                topProducts.map((p, idx) => (
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

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-orange-600 tabular-nums bg-orange-100/70 px-2.5 py-1 rounded-xl">
                        🔥 {p.realClicksCount || 0} cliques
                      </span>
                      <span className="text-xs font-semibold text-slate-600 tabular-nums">
                        👀 {p.realViewsCount || 0} views
                      </span>
                    </div>
                  </div>
                ))
              )}
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
              disabled={isChangingPassword}
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isChangingPassword ? 'Salvando na nuvem...' : 'Salvar Nova Senha'}</span>
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
