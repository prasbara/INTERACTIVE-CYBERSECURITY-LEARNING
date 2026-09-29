/**
 * Admin Authentication & Session Security Service
 * Implements session token management, role validation, expiration, and audit logging.
 * Supports both browser localStorage and Node.js in-memory test fallback.
 */

const SESSION_KEY = 'ids_admin_session_v1';
const AUDIT_KEY = 'ids_admin_audit_logs_v1';
const SESSION_DURATION_HOURS = 4;

const memoryStore = new Map();

function getStorageItem(key) {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return memoryStore.get(key) || null;
}

function setStorageItem(key, val) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, val);
  } else {
    memoryStore.set(key, val);
  }
}

function removeStorageItem(key) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  } else {
    memoryStore.delete(key);
  }
}

export function getAdminSession() {
  try {
    const raw = getStorageItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.expiresAt) return null;

    if (Date.now() > session.expiresAt) {
      logoutAdmin('Session expired');
      return null;
    }
    return session;
  } catch (e) {
    console.error('Failed to parse admin session', e);
    return null;
  }
}

export function isAuthenticatedAdmin() {
  const session = getAdminSession();
  return Boolean(session && session.role === 'admin' && session.token);
}

export function loginAdmin(email, password) {
  // Validates administrator credentials
  const validEmail = 'admin@idslab.local';
  const validPass = 'AdminSecurity2026!';

  if (email.trim().toLowerCase() === validEmail && password === validPass) {
    const token = 'sec_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000;

    const session = {
      user: {
        email: validEmail,
        name: 'Lead Research Coordinator',
        role: 'admin'
      },
      token,
      expiresAt,
      role: 'admin'
    };

    setStorageItem(SESSION_KEY, JSON.stringify(session));
    logAdminAction('LOGIN', 'AuthService', 'SUCCESS', `Administrator ${validEmail} signed in.`);
    return { success: true, session };
  }

  logAdminAction('LOGIN_FAILED', 'AuthService', 'FAILURE', `Failed login attempt for ${email}`);
  return { success: false, error: 'Kredensial administrator tidak valid. Periksa email dan password.' };
}

export function logoutAdmin(reason = 'User initiated logout') {
  const session = getAdminSession();
  const email = session?.user?.email || 'admin';
  removeStorageItem(SESSION_KEY);
  logAdminAction('LOGOUT', 'AuthService', 'SUCCESS', `${email}: ${reason}`);
}

export function logAdminAction(action, resource, result, details = '') {
  try {
    const raw = getStorageItem(AUDIT_KEY);
    const logs = raw ? JSON.parse(raw) : [];

    const newLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      admin: getAdminSession()?.user?.email || 'System',
      action,
      resource,
      result,
      details
    };

    logs.unshift(newLog);
    const trimmed = logs.slice(0, 200);
    setStorageItem(AUDIT_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to log admin action', e);
  }
}

export function getAdminAuditLogs() {
  try {
    const raw = getStorageItem(AUDIT_KEY);
    if (!raw) {
      const initialLogs = [
        {
          id: 'log_init_01',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          admin: 'admin@idslab.local',
          action: 'SYSTEM_BOOT',
          resource: 'IDSPlatform',
          result: 'SUCCESS',
          details: 'Admin security workstation initialized.'
        }
      ];
      setStorageItem(AUDIT_KEY, JSON.stringify(initialLogs));
      return initialLogs;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
