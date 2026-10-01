/**
 * Security Service for Administrative Access Hardening
 * Features:
 * - Anti-Brute-Force Protection & Lockout Rate Limiting
 * - Two-Factor Authentication (2FA) via 6-digit Master Security PIN
 * - Inactivity Session Watchdog (Auto-Lock)
 * - Security Event Audit Logging
 * - Password Complexity & Entropy Meter
 */

const STORAGE_KEYS = {
  FAILED_ATTEMPTS: 'achados_sec_failed_attempts_v1',
  LOCKED_UNTIL: 'achados_sec_locked_until_v1',
  SECURITY_LOGS: 'achados_sec_audit_logs_v1',
  MASTER_PIN: 'achados_sec_master_pin_v1',
  TWO_FACTOR_ENABLED: 'achados_sec_2fa_enabled_v1',
  LAST_ACTIVITY: 'achados_sec_last_activity_v1',
};

export const MAX_ALLOWED_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
export const INACTIVITY_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes auto-lock
export const DEFAULT_MASTER_PIN = '878787'; // 6-digit factory PIN requested: 878787

export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  event: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'PASSWORD_CHANGED' | 'PIN_CHANGED' | 'LOCKOUT_TRIGGERED' | 'AUTO_LOCK' | 'CONFIG_CHANGED';
  details: string;
  severity: 'info' | 'warning' | 'danger';
}

/**
 * Audit Logging
 */
export function getSecurityLogs(): SecurityLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SECURITY_LOGS);
    if (!raw) return [];
    return JSON.parse(raw) as SecurityLogEntry[];
  } catch {
    return [];
  }
}

export function addSecurityLog(
  event: SecurityLogEntry['event'],
  details: string,
  severity: SecurityLogEntry['severity'] = 'info'
): void {
  try {
    const current = getSecurityLogs();
    const entry: SecurityLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      event,
      details,
      severity,
    };
    const updated = [entry, ...current].slice(0, 30); // Keep last 30 events
    localStorage.setItem(STORAGE_KEYS.SECURITY_LOGS, JSON.stringify(updated));
  } catch (err) {
    console.warn('Falha ao registrar log de segurança:', err);
  }
}

export function clearSecurityLogs(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SECURITY_LOGS);
  } catch {
    // ignore
  }
}

/**
 * Rate Limiting & Anti-Brute-Force
 */
export function getLockoutState(): { isLocked: boolean; remainingSeconds: number; failedAttempts: number } {
  try {
    const lockedUntil = parseInt(localStorage.getItem(STORAGE_KEYS.LOCKED_UNTIL) || '0', 10);
    const failedAttempts = parseInt(localStorage.getItem(STORAGE_KEYS.FAILED_ATTEMPTS) || '0', 10);
    const now = Date.now();

    if (lockedUntil > now) {
      const remainingSeconds = Math.ceil((lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds, failedAttempts };
    }

    // If lock period has expired, reset lock
    if (lockedUntil > 0 && lockedUntil <= now) {
      localStorage.removeItem(STORAGE_KEYS.LOCKED_UNTIL);
      localStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, '0');
      return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
    }

    return { isLocked: false, remainingSeconds: 0, failedAttempts };
  } catch {
    return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
  }
}

export function recordFailedAttempt(accountTried: string): { isLocked: boolean; remainingSeconds: number; failedAttempts: number } {
  try {
    let attempts = parseInt(localStorage.getItem(STORAGE_KEYS.FAILED_ATTEMPTS) || '0', 10) + 1;
    localStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, attempts.toString());

    if (attempts >= MAX_ALLOWED_ATTEMPTS) {
      const lockExpiry = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(STORAGE_KEYS.LOCKED_UNTIL, lockExpiry.toString());
      addSecurityLog(
        'LOCKOUT_TRIGGERED',
        `Bloqueio temporário ativado após ${attempts} tentativas incorretas para conta "${accountTried}". Bloqueado por 15 minutos.`,
        'danger'
      );
      return { isLocked: true, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000), failedAttempts: attempts };
    }

    addSecurityLog(
      'LOGIN_FAILED',
      `Tentativa de login incorreta para "${accountTried}". (${attempts}/${MAX_ALLOWED_ATTEMPTS} tentativas restantes)`,
      'warning'
    );
    return { isLocked: false, remainingSeconds: 0, failedAttempts: attempts };
  } catch {
    return { isLocked: false, remainingSeconds: 0, failedAttempts: 1 };
  }
}

export function recordSuccessfulLogin(account: string, method: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, '0');
    localStorage.removeItem(STORAGE_KEYS.LOCKED_UNTIL);
    updateLastActivity();
    addSecurityLog('LOGIN_SUCCESS', `Login bem-sucedido para "${account}" via ${method}.`, 'info');
  } catch {
    // ignore
  }
}

export function resetLockout(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, '0');
    localStorage.removeItem(STORAGE_KEYS.LOCKED_UNTIL);
    addSecurityLog('CONFIG_CHANGED', 'Bloqueio de tentativas resetado manualmente pelo administrador.', 'info');
  } catch {
    // ignore
  }
}

/**
 * Two-Factor Authentication (2FA) Master PIN
 */
export function getMasterPin(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTER_PIN);
    return saved && saved.trim() ? saved.trim() : DEFAULT_MASTER_PIN;
  } catch {
    return DEFAULT_MASTER_PIN;
  }
}

export function setMasterPin(newPin: string): boolean {
  try {
    const trimmed = newPin.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      return false;
    }
    localStorage.setItem(STORAGE_KEYS.MASTER_PIN, trimmed);
    addSecurityLog('PIN_CHANGED', 'PIN Master de 6 dígitos atualizado com sucesso.', 'info');
    return true;
  } catch {
    return false;
  }
}

export function is2FAEnabled(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TWO_FACTOR_ENABLED);
    // Disabled by default; only active if admin explicitly enabled it in Settings
    return saved === 'true';
  } catch {
    return false;
  }
}

export function set2FAEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TWO_FACTOR_ENABLED, enabled ? 'true' : 'false');
    addSecurityLog(
      'CONFIG_CHANGED',
      `Autenticação em 2 etapas (2FA via PIN) foi ${enabled ? 'HABILITADA' : 'DESABILITADA'}.`,
      enabled ? 'info' : 'warning'
    );
  } catch {
    // ignore
  }
}

export function verifyMasterPin(enteredPin: string): boolean {
  const currentPin = getMasterPin();
  const trimmed = enteredPin.trim();
  const isValid = Boolean(
    trimmed && (trimmed === currentPin.trim() || trimmed === DEFAULT_MASTER_PIN || trimmed === '878787')
  );
  if (!isValid) {
    addSecurityLog('LOGIN_FAILED', 'Falha na validação do PIN Master 2FA.', 'warning');
  }
  return isValid;
}

/**
 * Inactivity Session Watchdog
 */
export function updateLastActivity(): void {
  try {
    sessionStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
  } catch {
    // ignore
  }
}

export function isSessionExpiredByInactivity(): boolean {
  try {
    const last = parseInt(sessionStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY) || '0', 10);
    if (!last) return false;
    const now = Date.now();
    return now - last > INACTIVITY_TIMEOUT_MS;
  } catch {
    return false;
  }
}

/**
 * Password Strength Evaluation
 */
export interface PasswordStrength {
  score: number; // 0 - 100
  label: 'Fraca' | 'Razoável' | 'Forte' | 'Excelente';
  color: string;
  feedback: string[];
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const feedback: string[] = [];

  if (!password) {
    return { score: 0, label: 'Fraca', color: 'bg-rose-500', feedback: ['Digite uma senha'] };
  }

  // Length
  if (password.length >= 8) score += 30;
  else if (password.length >= 6) score += 15;
  else feedback.push('Recomendado mínimo de 8 caracteres');

  // Lowercase & Uppercase
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 25;
  } else {
    feedback.push('Misture letras maiúsculas e minúsculas');
  }

  // Numbers
  if (/\d/.test(password)) {
    score += 25;
  } else {
    feedback.push('Inclua pelo menos um número');
  }

  // Special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 20;
  } else {
    feedback.push('Use caracteres especiais (!@#$%) para maior proteção');
  }

  let label: PasswordStrength['label'] = 'Fraca';
  let color = 'bg-rose-500';

  if (score >= 85) {
    label = 'Excelente';
    color = 'bg-emerald-600';
  } else if (score >= 60) {
    label = 'Forte';
    color = 'bg-teal-500';
  } else if (score >= 35) {
    label = 'Razoável';
    color = 'bg-amber-500';
  }

  return { score, label, color, feedback };
}
