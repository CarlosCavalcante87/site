import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';

const MAX_BANNER_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/** Uploads a banner image to Firebase Storage and returns its public download URL. */
export async function uploadBannerImage(file: File, bannerId: string): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Formato não suportado. Use JPG, PNG ou WEBP.');
  }

  if (file.size > MAX_BANNER_SIZE) {
    throw new Error('A imagem excede o limite de 5 MB.');
  }

  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const safeId = bannerId.replace(/[^a-zA-Z0-9_-]/g, '-');
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const storageRef = ref(storage, `banners/${safeId}/${fileName}`);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
    cacheControl: 'public,max-age=31536000,immutable',
  });

  return getDownloadURL(snapshot.ref);
}
