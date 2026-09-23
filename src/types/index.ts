export type StoreType = 
  | 'Shopee'
  | 'Amazon'
  | 'Mercado Livre'
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
  isFeatured: boolean;
  clicksCount: number;
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

export interface SiteConfig {
  whatsappNumber: string;
  whatsappDefaultMessage: string;
}

export type SortOption = 'latest' | 'popular' | 'featured' | 'title';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedStore: string;
  selectedBadge: string;
  sortBy: SortOption;
}
