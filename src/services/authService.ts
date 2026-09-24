import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updatePassword,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth } from '../firebase';

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export const ADMIN_PRIMARY_EMAIL = '87informatica@gmail.com';

/**
 * Checks whether a given user is the authorized store admin.
 */
export function isAuthorizedAdmin(user: User | null): boolean {
  if (!user) return false;
  if (user.email?.toLowerCase() === ADMIN_PRIMARY_EMAIL.toLowerCase()) return true;
  // If user signed in via custom admin auth
  if (user.email?.toLowerCase().endsWith('@achadosdodia.com')) return true;
  return false;
}

/**
 * Normalizes input: if user types 'admin', converts to a valid email format.
 */
export function normalizeAdminEmail(input: string): string {
  const trimmed = input.trim();
  if (!trimmed.includes('@')) {
    if (trimmed.toLowerCase() === 'admin') {
      return '87informatica@gmail.com';
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
      return 'Nenhum administrador cadastrado com este e-mail. Utilize a opção "Criar Conta Admin" para registrar seu primeiro acesso.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.';
    case 'auth/invalid-email':
      return 'Formato de e-mail inválido. Por favor, digite um e-mail válido.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já possui uma conta de administrador cadastrada. Faça login diretamente.';
    case 'auth/weak-password':
      return 'A senha é muito fraca. Ela deve conter no mínimo 6 caracteres.';
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
 * Sign in admin user with Firebase Authentication.
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
    prompt: 'select_account',
    login_hint: ADMIN_PRIMARY_EMAIL,
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
 * Updates the password for the currently signed in Firebase user.
 */
export async function updateFirebaseAdminPassword(newPassword: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Nenhum administrador autenticado no momento.');
  }
  await updatePassword(currentUser, newPassword);
}

/**
 * Sends a password reset email via Firebase Auth.
 */
export async function sendFirebasePasswordReset(emailOrUser: string): Promise<void> {
  const email = normalizeAdminEmail(emailOrUser);
  await sendPasswordResetEmail(auth, email);
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
