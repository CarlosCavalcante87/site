import { 
  collection, 
  doc, 
  getDoc,
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  increment,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../firebase';
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
  getStoredSiteConfig as getLocalSiteConfig,
  getAdminPassword as getLocalAdminPassword,
  setAdminPassword as saveLocalAdminPassword,
  normalizeProductOrders,
  DEFAULT_ADMIN_CONFIG
} from './storage';

// Collection references
const PRODUCTS_COL = 'products';
const CATEGORIES_COL = 'categories';
const BANNERS_COL = 'banners';
const SETTINGS_COL = 'settings';
const SITE_CONFIG_DOC = 'siteConfig';
const ADMIN_AUTH_DOC = 'adminAuth';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Validate Connection to Firestore on startup as mandated by Firebase Skill
 */
export async function testFirestoreConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'settings', 'siteConfig'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or internet connection.");
    }
  }
}
testFirestoreConnection();

/**
 * Initializes Firestore with default seed data if collections are empty.
 */
export async function initializeFirestoreSeed(): Promise<void> {
  try {
    const productsSnap = await getDocs(collection(db, PRODUCTS_COL));
    if (productsSnap.empty) {
      console.log('Seeding initial products to Firestore...');
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
    const siteConfigSnap = await getDoc(siteConfigRef);
    if (!siteConfigSnap.exists()) {
      await setDoc(siteConfigRef, getLocalSiteConfig() || INITIAL_SITE_CONFIG, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'initial_seed');
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
          const normalized = normalizeProductOrders(items);
          saveLocalProducts(normalized);
          onUpdate(normalized);
        } else {
          onUpdate(getLocalProducts());
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, PRODUCTS_COL);
        if (onError) onError(err);
        onUpdate(getLocalProducts());
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, PRODUCTS_COL);
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
        handleFirestoreError(err, OperationType.LIST, CATEGORIES_COL);
        onUpdate(getLocalCategories());
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, CATEGORIES_COL);
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
        handleFirestoreError(err, OperationType.LIST, BANNERS_COL);
        onUpdate(getLocalBanners());
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, BANNERS_COL);
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
        handleFirestoreError(err, OperationType.GET, `${SETTINGS_COL}/${SITE_CONFIG_DOC}`);
        onUpdate(getLocalSiteConfig());
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `${SETTINGS_COL}/${SITE_CONFIG_DOC}`);
    onUpdate(getLocalSiteConfig());
    return () => {};
  }
}

/**
 * Cloud CRUD operations for Products
 */
export async function addProductToCloud(product: Product): Promise<void> {
  const current = getLocalProducts();
  saveLocalProducts([product, ...current]);

  try {
    await setDoc(doc(db, PRODUCTS_COL, product.id), product);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${PRODUCTS_COL}/${product.id}`);
  }
}

export async function updateProductInCloud(id: string, updates: Partial<Product>): Promise<void> {
  const current = getLocalProducts();
  const index = current.findIndex((p) => p.id === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...updates };
    saveLocalProducts(normalizeProductOrders(current));
  }

  try {
    await updateDoc(doc(db, PRODUCTS_COL, id), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${PRODUCTS_COL}/${id}`);
  }
}

export async function swapProductOrdersInCloud(
  p1: { id: string; order: number },
  p2?: { id: string; order: number }
): Promise<void> {
  try {
    await updateDoc(doc(db, PRODUCTS_COL, p1.id), { order: p1.order, updatedAt: new Date().toISOString() });
    if (p2) {
      await updateDoc(doc(db, PRODUCTS_COL, p2.id), { order: p2.order, updatedAt: new Date().toISOString() });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${PRODUCTS_COL}/${p1.id}`);
  }
}

export async function deleteProductFromCloud(id: string): Promise<void> {
  const current = getLocalProducts().filter((p) => p.id !== id);
  saveLocalProducts(current);

  try {
    await deleteDoc(doc(db, PRODUCTS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PRODUCTS_COL}/${id}`);
  }
}

export async function trackCloudProductClick(id: string): Promise<void> {
  const current = getLocalProducts();
  const item = current.find((p) => p.id === id);
  if (item) {
    item.realClicksCount = (item.realClicksCount || 0) + 1;
    saveLocalProducts(current);
  }

  try {
    await updateDoc(doc(db, PRODUCTS_COL, id), { 
      realClicksCount: increment(1) 
    });
  } catch (err) {
    // Non-blocking for visitors
  }
}

export async function trackCloudProductView(id: string): Promise<void> {
  const current = getLocalProducts();
  const item = current.find((p) => p.id === id);
  if (item) {
    item.realViewsCount = (item.realViewsCount || 0) + 1;
    saveLocalProducts(current);
  }

  try {
    await updateDoc(doc(db, PRODUCTS_COL, id), { 
      realViewsCount: increment(1) 
    });
  } catch (err) {
    // Non-blocking for visitors
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
    handleFirestoreError(err, OperationType.WRITE, BANNERS_COL);
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
    handleFirestoreError(err, OperationType.WRITE, CATEGORIES_COL);
  }
}

export async function deleteCategoryFromCloud(id: string): Promise<void> {
  const current = getLocalCategories().filter((c) => c.id !== id);
  saveLocalCategories(current);
  try {
    await deleteDoc(doc(db, CATEGORIES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${CATEGORIES_COL}/${id}`);
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
    handleFirestoreError(err, OperationType.WRITE, `${SETTINGS_COL}/${SITE_CONFIG_DOC}`);
  }
}

/**
 * Cloud Operations for Admin Password Security (Available when Admin is authenticated)
 */
export async function fetchAdminPasswordFromCloud(): Promise<string> {
  if (!auth.currentUser) {
    return getLocalAdminPassword() || DEFAULT_ADMIN_CONFIG.defaultPassword;
  }
  try {
    const adminAuthRef = doc(db, SETTINGS_COL, ADMIN_AUTH_DOC);
    const snap = await getDoc(adminAuthRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && typeof data.password === 'string' && data.password.trim()) {
        const cloudPass = data.password.trim();
        saveLocalAdminPassword(cloudPass);
        return cloudPass;
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `${SETTINGS_COL}/${ADMIN_AUTH_DOC}`);
  }
  return getLocalAdminPassword() || DEFAULT_ADMIN_CONFIG.defaultPassword;
}

export async function saveAdminPasswordToCloud(newPassword: string): Promise<boolean> {
  const trimmed = newPassword.trim();
  saveLocalAdminPassword(trimmed);
  if (!auth.currentUser) {
    return true;
  }
  try {
    const adminAuthRef = doc(db, SETTINGS_COL, ADMIN_AUTH_DOC);
    await setDoc(adminAuthRef, { password: trimmed, updatedAt: Date.now() }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SETTINGS_COL}/${ADMIN_AUTH_DOC}`);
    // Local save succeeded, so return true so the user is not locked out
    return true;
  }
}

export function subscribeToAdminPassword(
  onUpdate: (password: string) => void
): () => void {
  if (!auth.currentUser) {
    return () => {};
  }
  try {
    const adminAuthRef = doc(db, SETTINGS_COL, ADMIN_AUTH_DOC);
    return onSnapshot(
      adminAuthRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && typeof data.password === 'string' && data.password.trim()) {
            const cloudPass = data.password.trim();
            saveLocalAdminPassword(cloudPass);
            onUpdate(cloudPass);
          }
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, `${SETTINGS_COL}/${ADMIN_AUTH_DOC}`);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `${SETTINGS_COL}/${ADMIN_AUTH_DOC}`);
    return () => {};
  }
}
