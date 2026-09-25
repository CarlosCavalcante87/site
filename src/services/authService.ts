import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updatePassword,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

import { getAdminPassword } from './storage';

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export const OWNER_RECOVERY_EMAIL = '87informatica@gmail.com';

export const AUTHORIZED_ADMIN_EMAILS: string[] = [
  '87informatica@gmail.com',
  'ursula879518@gmail.com'
];

export const ADMIN_PRIMARY_EMAIL = '87informatica@gmail.com';

/**
 * Checks whether a given user is an authorized store admin.
 */
export function isAuthorizedAdmin(user: User | null): boolean {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  if (AUTHORIZED_ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === email)) {
    return true;
  }
  // Custom store domain admins
  if (email.endsWith('@achadosdodia.com') || email.endsWith('@achadosdodia.com.br')) {
    return true;
  }
  return false;
}

/**
 * Normalizes input: if user types 'admin', converts to primary admin email.
 */
export function normalizeAdminEmail(input: string): string {
  const trimmed = input.trim();
  if (!trimmed.includes('@')) {
    if (trimmed.toLowerCase() === 'admin') {
      return ADMIN_PRIMARY_EMAIL;
    }
    return `${trimmed.toLowerCase()}@achadosdodia.com`;
  }
  return trimmed;
}

/**
 * Translates Firebase Auth error codes into friendly Portuguese messages.
 */
export function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Nenhum administrador cadastrado com este e-mail. Verifique suas credenciais de acesso ou solicite a redefinição de senha.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.';
    case 'auth/invalid-email':
      return 'Formato de e-mail inválido. Por favor, digite um e-mail válido.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já possui uma conta cadastrada. Faça login diretamente com suas credenciais.';
    case 'auth/weak-password':
      return 'A senha é muito fraca. Ela deve conter no mínimo 6 caracteres, combinando letras, números e símbolos.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas sem sucesso. Por segurança, aguarde alguns instantes antes de tentar novamente.';
    case 'auth/network-request-failed':
      return 'Falha na conexão de rede. Verifique sua conexão com a internet.';
    case 'auth/requires-recent-login':
      return 'Por motivos de segurança, saia do painel e faça login novamente para alterar sua senha.';
    default:
      return 'Ocorreu um erro na autenticação. Tente novamente.';
  }
}

/**
 * Sign in admin user with Firebase Authentication (Email/Password).
 */
export async function loginWithFirebaseAuth(emailOrUser: string, password: string): Promise<User> {
  const email = normalizeAdminEmail(emailOrUser);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Create a new admin account with Firebase Authentication.
 */
export async function registerAdminWithFirebaseAuth(emailOrUser: string, password: string): Promise<User> {
  const email = normalizeAdminEmail(emailOrUser);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Sign in admin user with Google Authentication (1-click secure login).
 */
export async function loginWithGoogleAuth(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

/**
 * Signs out current user from Firebase Auth.
 */
export async function logoutFirebaseAuth(): Promise<void> {
  await signOut(auth);
}

/**
 * Updates the password for the admin in Firebase Auth.
 * Uses re-authentication with current password to avoid 'auth/requires-recent-login' errors.
 * If user is not currently signed in, authenticates first then updates.
 * If user does not exist in Firebase Auth yet, creates the account with the new password.
 */
export async function updateFirebaseAdminPassword(
  arg1: string,
  arg2?: string,
  emailOrUser?: string
): Promise<void> {
  // Support both (currentPassword, newPassword) and legacy (newPassword)
  const isTwoParam = typeof arg2 === 'string';
  const currentPassword = isTwoParam ? arg1.trim() : '';
  const newPassword = isTwoParam ? arg2.trim() : arg1.trim();
  const targetEmail = normalizeAdminEmail(emailOrUser || auth.currentUser?.email || ADMIN_PRIMARY_EMAIL);

  let currentUser = auth.currentUser;

  if (currentUser && currentUser.email?.toLowerCase() === targetEmail.toLowerCase()) {
    if (currentPassword) {
      try {
        const credential = EmailAuthProvider.credential(currentUser.email!, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
      } catch (reauthErr) {
        console.warn('Re-auth notice, attempting direct re-login:', reauthErr);
        try {
          const res = await signInWithEmailAndPassword(auth, targetEmail, currentPassword);
          currentUser = res.user;
        } catch {
          // If currentPassword failed, also attempt default password fallback
          try {
            const fallbackRes = await signInWithEmailAndPassword(auth, targetEmail, 'admin123');
            currentUser = fallbackRes.user;
          } catch {
            throw reauthErr;
          }
        }
      }
    }
    await updatePassword(currentUser, newPassword);
  } else {
    // Current user not signed in to Firebase Auth
    const passToTry = currentPassword || 'admin123';
    try {
      const res = await signInWithEmailAndPassword(auth, targetEmail, passToTry);
      await updatePassword(res.user, newPassword);
    } catch (signInErr: unknown) {
      const code = (signInErr as { code?: string })?.code;
      if (code === 'auth/user-not-found') {
        await createUserWithEmailAndPassword(auth, targetEmail, newPassword);
      } else {
        // Try with default password
        try {
          const fallback = await signInWithEmailAndPassword(auth, targetEmail, 'admin123');
          await updatePassword(fallback.user, newPassword);
        } catch {
          throw signInErr;
        }
      }
    }
  }
}

/**
 * Sends a password reset email via Firebase Auth.
 * Normalizes input, ensures user account exists to avoid silent drops due to email enumeration protection, and dispatches the reset link.
 */
export async function sendFirebasePasswordReset(emailOrUser?: string): Promise<string> {
  const targetEmail = (emailOrUser && emailOrUser.trim())
    ? normalizeAdminEmail(emailOrUser.trim())
    : OWNER_RECOVERY_EMAIL;

  try {
    // 1. Ensure user account is provisioned in Firebase Auth so reset email is dispatched
    try {
      const currentPass = getAdminPassword().trim() || 'admin123';
      await createUserWithEmailAndPassword(auth, targetEmail, currentPass);
    } catch (provisionErr: unknown) {
      const code = (provisionErr as { code?: string })?.code;
      // If user already exists (auth/email-already-in-use), this is expected
      if (code !== 'auth/email-already-in-use') {
        console.warn('Notice during user provision before reset:', provisionErr);
      }
    }

    // 2. Dispatch password reset email via Firebase Auth
    await sendPasswordResetEmail(auth, targetEmail);
    return targetEmail;
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === 'auth/user-not-found') {
      try {
        const currentPass = getAdminPassword().trim() || 'admin123';
        await createUserWithEmailAndPassword(auth, targetEmail, currentPass);
        await sendPasswordResetEmail(auth, targetEmail);
        return targetEmail;
      } catch (createErr) {
        console.warn('Could not auto-provision account before reset:', createErr);
        throw err;
      }
    }
    throw err;
  }
}

/**
 * Registers an authorized admin in the Firestore admins registry for verified RBAC.
 */
export async function registerAdminInFirestore(user: User): Promise<void> {
  try {
    if (isAuthorizedAdmin(user) && user.uid) {
      await setDoc(doc(db, 'admins', user.uid), {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Admin',
        role: 'admin',
        lastLogin: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Registro de admin no Firestore:', err);
  }
}

/**
 * Returns current authenticated user or null.
 */
export function getCurrentAuthUser(): User | null {
  return auth.currentUser;
}

/**
 * Listens to authentication state changes.
 */
export function onAuthUserChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
