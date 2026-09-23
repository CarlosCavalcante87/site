import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Category, Banner, SiteConfig } from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_BANNERS, 
  INITIAL_SITE_CONFIG 
} from '../data/initialData';
import {
  saveProducts as saveLocalProducts,
  saveCategories as saveLocalCategories,
  saveBanners as saveLocalBanners,
  saveStoredSiteConfig as saveLocalSiteConfig,
  getStoredProducts as getLocalProducts,
  getStoredCategories as getLocalCategories,
  getStoredBanners as getLocalBanners,
  getStoredSiteConfig as getLocalSiteConfig
} from './storage';

// Collection references
const PRODUCTS_COL = 'products';
const CATEGORIES_COL = 'categories';
const BANNERS_COL = 'banners';
const SETTINGS_COL = 'settings';
const SITE_CONFIG_DOC = 'siteConfig';

/**
 * Initializes Firestore with default seed data if collections are empty.
 */
export async function initializeFirestoreSeed(): Promise<void> {
  try {
    const productsSnap = await getDocs(collection(db, PRODUCTS_COL));
    if (productsSnap.empty) {
      console.log('Seeding initial products to Firestore...');
      // Use local storage data or initial products
      const productsToSeed = getLocalProducts().length > 0 ? getLocalProducts() : INITIAL_PRODUCTS;
      for (const prod of productsToSeed) {
        await setDoc(doc(db, PRODUCTS_COL, prod.id), prod);
      }
    }

    const categoriesSnap = await getDocs(collection(db, CATEGORIES_COL));
    if (categoriesSnap.empty) {
      console.log('Seeding initial categories to Firestore...');
      const catsToSeed = getLocalCategories().length > 0 ? getLocalCategories() : INITIAL_CATEGORIES;
      for (const cat of catsToSeed) {
        await setDoc(doc(db, CATEGORIES_COL, cat.id), cat);
      }
    }

    const bannersSnap = await getDocs(collection(db, BANNERS_COL));
    if (bannersSnap.empty) {
      console.log('Seeding initial banners to Firestore...');
      const bannersToSeed = getLocalBanners().length > 0 ? getLocalBanners() : INITIAL_BANNERS;
      for (const banner of bannersToSeed) {
        await setDoc(doc(db, BANNERS_COL, banner.id), banner);
      }
    }

    const siteConfigRef = doc(db, SETTINGS_COL, SITE_CONFIG_DOC);
    await setDoc(siteConfigRef, getLocalSiteConfig() || INITIAL_SITE_CONFIG, { merge: true });
  } catch (error) {
    console.error('Error during Firestore initialization:', error);
  }
}

/**
 * Real-time listener for Products collection
 */
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const colRef = collection(db, PRODUCTS_COL);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((d) => items.push(d.data() as Product));
          // Keep local cache in sync
          saveLocalProducts(items);
          onUpdate(items);
        } else {
          // If empty, initialize seed
          initializeFirestoreSeed().then(() => {
            onUpdate(getLocalProducts());
          });
        }
      },
      (err) => {
        console.error('Firestore products listener error:', err);
        if (onError) onError(err);
        // Fallback to local
        onUpdate(getLocalProducts());
      }
    );
  } catch (err) {
    console.error('Failed to attach products listener:', err);
    onUpdate(getLocalProducts());
    return () => {};
  }
}

/**
 * Real-time listener for Categories collection
 */
export function subscribeToCategories(
  onUpdate: (categories: Category[]) => void
): () => void {
  try {
    const colRef = collection(db, CATEGORIES_COL);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Category[] = [];
          snapshot.forEach((d) => items.push(d.data() as Category));
          items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          saveLocalCategories(items);
          onUpdate(items);
        } else {
          onUpdate(getLocalCategories());
        }
      },
      (err) => {
        console.error('Firestore categories listener error:', err);
        onUpdate(getLocalCategories());
      }
    );
  } catch (err) {
    console.error('Failed to attach categories listener:', err);
    onUpdate(getLocalCategories());
    return () => {};
  }
}

/**
 * Real-time listener for Banners collection
 */
export function subscribeToBanners(
  onUpdate: (banners: Banner[]) => void
): () => void {
  try {
    const colRef = collection(db, BANNERS_COL);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Banner[] = [];
          snapshot.forEach((d) => items.push(d.data() as Banner));
          items.sort((a, b) => (a.order || 0) - (b.order || 0));
          saveLocalBanners(items);
          onUpdate(items);
        } else {
          onUpdate(getLocalBanners());
        }
      },
      (err) => {
        console.error('Firestore banners listener error:', err);
        onUpdate(getLocalBanners());
      }
    );
  } catch (err) {
    console.error('Failed to attach banners listener:', err);
    onUpdate(getLocalBanners());
    return () => {};
  }
}

/**
 * Real-time listener for Site Config
 */
export function subscribeToSiteConfig(
  onUpdate: (config: SiteConfig) => void
): () => void {
  try {
    const docRef = doc(db, SETTINGS_COL, SITE_CONFIG_DOC);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SiteConfig;
          saveLocalSiteConfig(data);
          onUpdate(data);
        } else {
          onUpdate(getLocalSiteConfig());
        }
      },
      (err) => {
        console.error('Firestore siteConfig listener error:', err);
        onUpdate(getLocalSiteConfig());
      }
    );
  } catch (err) {
    console.error('Failed to attach site config listener:', err);
    onUpdate(getLocalSiteConfig());
    return () => {};
  }
}

/**
 * Cloud CRUD operations for Products
 */
export async function addProductToCloud(product: Product): Promise<void> {
  // Save to local cache first
  const current = getLocalProducts();
  saveLocalProducts([product, ...current]);

  try {
    await setDoc(doc(db, PRODUCTS_COL, product.id), product);
  } catch (err) {
    console.error('Failed to add product to Firestore:', err);
  }
}

export async function updateProductInCloud(id: string, updates: Partial<Product>): Promise<void> {
  const current = getLocalProducts();
  const index = current.findIndex((p) => p.id === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...updates };
    saveLocalProducts(current);
  }

  try {
    await updateDoc(doc(db, PRODUCTS_COL, id), updates);
  } catch (err) {
    console.error('Failed to update product in Firestore:', err);
  }
}

export async function deleteProductFromCloud(id: string): Promise<void> {
  const current = getLocalProducts().filter((p) => p.id !== id);
  saveLocalProducts(current);

  try {
    await deleteDoc(doc(db, PRODUCTS_COL, id));
  } catch (err) {
    console.error('Failed to delete product from Firestore:', err);
  }
}

export async function trackCloudProductClick(id: string): Promise<void> {
  const current = getLocalProducts();
  const item = current.find((p) => p.id === id);
  if (item) {
    const newCount = (item.clicksCount || 0) + 1;
    item.clicksCount = newCount;
    saveLocalProducts(current);

    try {
      await updateDoc(doc(db, PRODUCTS_COL, id), { clicksCount: newCount });
    } catch {
      // Non-blocking
    }
  }
}

/**
 * Cloud Operations for Banners
 */
export async function saveBannersToCloud(banners: Banner[]): Promise<void> {
  saveLocalBanners(banners);
  try {
    for (const b of banners) {
      await setDoc(doc(db, BANNERS_COL, b.id), b);
    }
  } catch (err) {
    console.error('Failed to save banners to Firestore:', err);
  }
}

/**
 * Cloud Operations for Categories
 */
export async function saveCategoriesToCloud(categories: Category[]): Promise<void> {
  saveLocalCategories(categories);
  try {
    for (const c of categories) {
      await setDoc(doc(db, CATEGORIES_COL, c.id), c);
    }
  } catch (err) {
    console.error('Failed to save categories to Firestore:', err);
  }
}

export async function deleteCategoryFromCloud(id: string): Promise<void> {
  const current = getLocalCategories().filter((c) => c.id !== id);
  saveLocalCategories(current);
  try {
    await deleteDoc(doc(db, CATEGORIES_COL, id));
  } catch (err) {
    console.error('Failed to delete category from Firestore:', err);
  }
}

/**
 * Cloud Operations for Site Config
 */
export async function saveSiteConfigToCloud(config: SiteConfig): Promise<void> {
  saveLocalSiteConfig(config);
  try {
    await setDoc(doc(db, SETTINGS_COL, SITE_CONFIG_DOC), config, { merge: true });
  } catch (err) {
    console.error('Failed to save site config to Firestore:', err);
  }
}
