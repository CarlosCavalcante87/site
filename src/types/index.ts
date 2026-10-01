export type StoreType = 
  | 'Mercado Livre'
  | 'Amazon'
  | 'Shopee'
  | 'Shein'
  | 'Magalu'
  | 'AliExpress'
  | 'Outro';

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  store: StoreType;
  storeCustomName?: string;
  affiliateUrl: string;
  category: string;
  images: string[];
  description: string;
  highlights: string[];
  badges: string[];
  originalPrice?: number;
  price?: number;
  priceHistory?: Array<{ date: string; price: number }>;
  isFeatured: boolean;
  order?: number;
  realClicksCount?: number;
  realViewsCount?: number;
  clicksCount: number;
  isCollection?: boolean;
  collectionButtonText?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt?: string;
  verifiedDeal: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description?: string;
  productCount?: number;
  displayOrder?: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  linkUrl: string;
  buttonText: string;
  tagCategory?: string;
  isActive: boolean;
  order?: number;
}

export interface BottomCtaBannerConfig {
  isActive: boolean;
  badge?: string;
  title: string;
  description: string;
  buttonText: string;
  secondaryButtonText?: string;
  linkType: 'whatsapp_direct' | 'whatsapp_group' | 'hybrid' | 'custom_url';
  targetUrl?: string;
  whatsappMessage?: string;
}

export interface SiteConfig {
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  mobileDoubleColumns?: boolean;
  bottomCtaBanner?: BottomCtaBannerConfig;
}

export type SortOption = 'latest' | 'popular' | 'featured' | 'title';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedStore: string;
  selectedBadge: string;
  sortBy: SortOption;
}
