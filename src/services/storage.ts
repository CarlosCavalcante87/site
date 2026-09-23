import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_BANNERS, INITIAL_SITE_CONFIG } from '../data/initialData';
import { Category, Product, StoreType, Banner, SiteConfig } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'achados_do_dia_products_v1',
  CATEGORIES: 'achados_do_dia_categories_v1',
  CLICKS: 'achados_do_dia_clicks_v1',
  ADMIN_PIN: 'achados_do_dia_admin_pin_v1',
  BANNERS: 'achados_do_dia_banners_v1',
  SITE_CONFIG: 'achados_do_dia_site_config_v1',
};

// Store color configuration
export const STORE_CONFIG: Record<
  StoreType,
  { name: string; bg: string; text: string; border: string; badgeBg: string; buttonBg: string }
> = {
  Shopee: {
    name: 'Shopee',
    bg: '#FEF2EE',
    text: '#EE4D2D',
    border: '#FCD8CE',
    badgeBg: '#EE4D2D',
    buttonBg: '#EE4D2D',
  },
  Amazon: {
    name: 'Amazon',
    bg: '#FFF8E6',
    text: '#B25E00',
    border: '#FFE29A',
    badgeBg: '#232F3E',
    buttonBg: '#FF9900',
  },
  'Mercado Livre': {
    name: 'Mercado Livre',
    bg: '#FFFDE5',
    text: '#2D3277',
    border: '#FFE600',
    badgeBg: '#FFE600',
    buttonBg: '#2D3277',
  },
  Shein: {
    name: 'Shein',
    bg: '#F8F8F8',
    text: '#111111',
    border: '#E5E5E5',
    badgeBg: '#111111',
    buttonBg: '#111111',
  },
  Magalu: {
    name: 'Magalu',
    bg: '#EEF6FF',
    text: '#0086FF',
    border: '#BFDBFE',
    badgeBg: '#0086FF',
    buttonBg: '#0086FF',
  },
  AliExpress: {
    name: 'AliExpress',
    bg: '#FFF1F1',
    text: '#E62E04',
    border: '#FECACA',
    badgeBg: '#E62E04',
    buttonBg: '#E62E04',
  },
  Outro: {
    name: 'Loja Parceira',
    bg: '#F1F5F9',
    text: '#475569',
    border: '#E2E8F0',
    badgeBg: '#475569',
    buttonBg: '#1E293B',
  },
};

export const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRODUCTS;
  } catch (error) {
    console.error('Failed to load products from localStorage', error);
    return INITIAL_PRODUCTS;
  }
};

export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (error) {
    console.error('Failed to save products to localStorage', error);
  }
};

export const getStoredCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CATEGORIES;
  } catch (error) {
    console.error('Failed to load categories from localStorage', error);
    return INITIAL_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories to localStorage', error);
  }
};

export const getStoredBanners = (): Banner[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BANNERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
      return INITIAL_BANNERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BANNERS;
  } catch (error) {
    console.error('Failed to load banners from localStorage', error);
    return INITIAL_BANNERS;
  }
};

export const saveBanners = (banners: Banner[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  } catch (error) {
    console.error('Failed to save banners to localStorage', error);
  }
};

export const getStoredSiteConfig = (): SiteConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SITE_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(INITIAL_SITE_CONFIG));
      return INITIAL_SITE_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return parsed?.whatsappNumber ? parsed : INITIAL_SITE_CONFIG;
  } catch (error) {
    console.error('Failed to load site config from localStorage', error);
    return INITIAL_SITE_CONFIG;
  }
};

export const saveStoredSiteConfig = (config: SiteConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save site config to localStorage', error);
  }
};

export const addProduct = (
  newProductData: Omit<Product, 'id' | 'createdAt' | 'clicksCount'>
): Product => {
  const current = getStoredProducts();
  const id = `prod-${Date.now()}`;
  const newProduct: Product = {
    ...newProductData,
    id,
    createdAt: new Date().toISOString(),
    clicksCount: 0,
    rating: 4.8,
    reviewCount: Math.floor(Math.random() * 200) + 40,
    verifiedDeal: true,
  };

  const updated = [newProduct, ...current];
  saveProducts(updated);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const current = getStoredProducts();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedProduct: Product = {
    ...current[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  current[index] = updatedProduct;
  saveProducts(current);
  return updatedProduct;
};

export const deleteProduct = (id: string): boolean => {
  const current = getStoredProducts();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length === current.length) return false;
  saveProducts(filtered);
  return true;
};

export const trackProductClick = (id: string): void => {
  const current = getStoredProducts();
  const item = current.find((p) => p.id === id);
  if (item) {
    item.clicksCount = (item.clicksCount || 0) + 1;
    saveProducts(current);
  }
};

export const resetToInitialCatalog = (): Product[] => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  return INITIAL_PRODUCTS;
};

export const exportCatalogJSON = (): string => {
  const products = getStoredProducts();
  const categories = getStoredCategories();
  return JSON.stringify({ products, categories, exportedAt: new Date().toISOString() }, null, 2);
};

export const importCatalogJSON = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.products && Array.isArray(data.products)) {
      saveProducts(data.products);
    }
    if (data.categories && Array.isArray(data.categories)) {
      saveCategories(data.categories);
    }
    return true;
  } catch (error) {
    console.error('Failed to import JSON data', error);
    return false;
  }
};

export const DEFAULT_ADMIN_CONFIG = {
  username: 'admin',
  defaultPassword: 'admin123',
};

export const getAdminPassword = (): string => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_PIN);
    return saved ? saved : DEFAULT_ADMIN_CONFIG.defaultPassword;
  } catch {
    return DEFAULT_ADMIN_CONFIG.defaultPassword;
  }
};

export const setAdminPassword = (newPassword: string): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPassword);
    return true;
  } catch (error) {
    console.error('Failed to update admin password', error);
    return false;
  }
};

export const verifyAdminCredentials = (enteredUser: string, enteredPass: string): boolean => {
  const currentPass = getAdminPassword();
  const validUser = (enteredUser.trim().toLowerCase() === DEFAULT_ADMIN_CONFIG.username.toLowerCase()) || 
                    (enteredUser.trim().toLowerCase() === 'admin@achadosdodia.com.br');
  return validUser && enteredPass === currentPass;
};

export const getAdminSession = (): boolean => {
  try {
    return sessionStorage.getItem('achados_do_dia_admin_session') === 'active';
  } catch {
    return false;
  }
};

export const setAdminSession = (active: boolean): void => {
  try {
    if (active) {
      sessionStorage.setItem('achados_do_dia_admin_session', 'active');
    } else {
      sessionStorage.removeItem('achados_do_dia_admin_session');
    }
  } catch (error) {
    console.error('Failed to set admin session', error);
  }
};
