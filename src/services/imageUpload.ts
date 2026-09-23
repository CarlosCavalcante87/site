import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export interface UploadImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Validates and uploads an image file to Firebase Storage under the given folder,
 * returning a public download URL that can be stored on a document (e.g. banner.imageUrl).
 */
export const uploadImageFile = async (
  file: File,
  folder: string = 'banners'
): Promise<UploadImageResult> => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: 'Formato inválido. Envie uma imagem JPG, PNG, WEBP, AVIF ou GIF.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: 'Imagem muito grande. O tamanho máximo é 5MB.' };
  }

  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `${folder}/${Date.now()}_${safeName}`;
    const storageRef = ref(storage, path);

    const snapshot = await uploadBytes(storageRef, file, { contentType: file.type });
    const url = await getDownloadURL(snapshot.ref);

    return { success: true, url };
  } catch (error) {
    console.error('Failed to upload image to Firebase Storage', error);
    return { success: false, error: 'Falha ao enviar a imagem. Tente novamente.' };
  }
};
