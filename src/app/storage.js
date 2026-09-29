import { STORAGE_KEY, CURRENT_SCHEMA_VERSION } from './constants.js';
import { INITIAL_STATE } from '../types/schemas.js';

const CORRUPTED_BACKUP_KEY = 'ids_learning_lab_corrupted_backup';

function getStorage() {
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }
  // Memory storage fallback for Node.js test environment
  if (!globalThis._mockStorage) {
    globalThis._mockStorage = {
      _data: {},
      getItem(k) { return this._data[k] || null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; },
      clear() { this._data = {}; }
    };
  }
  return globalThis._mockStorage;
}

export function loadState() {
  const storage = getStorage();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return initializeDefaultState();
    }

    const parsed = JSON.parse(raw);
    return migrateState(parsed);
  } catch (error) {
    console.error('LocalStorage parsing failed:', error);
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw) storage.setItem(CORRUPTED_BACKUP_KEY, raw);
    } catch {
      // ignore
    }
    return {
      ...initializeDefaultState(),
      _hasCorruptedState: true
    };
  }
}

export function saveState(state) {
  const storage = getStorage();
  try {
    const serialized = JSON.stringify({
      ...state,
      metadata: {
        ...state.metadata,
        schemaVersion: CURRENT_SCHEMA_VERSION,
        updatedAt: new Date().toISOString()
      }
    });
    storage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
    return false;
  }
}

export function clearState() {
  const storage = getStorage();
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear state:', error);
    return false;
  }
}

export const resetState = clearState;

export function updateState(partialOrFn, currentState) {
  const next = typeof partialOrFn === 'function' ? partialOrFn(currentState) : { ...currentState, ...partialOrFn };
  saveState(next);
  return next;
}

export function migrateState(savedState) {
  if (!savedState || typeof savedState !== 'object') {
    return initializeDefaultState();
  }

  const version = savedState.metadata?.schemaVersion || 0;

  return {
    ...INITIAL_STATE,
    ...savedState,
    student: {
      ...INITIAL_STATE.student,
      ...(savedState.student || {})
    },
    progress: {
      ...INITIAL_STATE.progress,
      ...(savedState.progress || {})
    },
    scores: {
      ...INITIAL_STATE.scores,
      ...(savedState.scores || {})
    },
    gamification: {
      ...INITIAL_STATE.gamification,
      ...(savedState.gamification || {}),
      xp: typeof savedState.gamification?.xp === 'number' && !isNaN(savedState.gamification.xp) ? savedState.gamification.xp : 0,
      badges: Array.isArray(savedState.gamification?.badges) ? savedState.gamification.badges : ['log-explorer']
    },
    activities: { ...(savedState.activities || {}) },
    attempts: { ...(savedState.attempts || {}) },
    selectedEvidence: { ...(savedState.selectedEvidence || {}) },
    hypotheses: { ...(savedState.hypotheses || {}) },
    triageDecisions: { ...(savedState.triageDecisions || {}) },
    unlockedEvidence: Array.isArray(savedState.unlockedEvidence) ? savedState.unlockedEvidence : [],
    microChecks: { ...(savedState.microChecks || {}) },
    bookmarks: Array.isArray(savedState.bookmarks) ? savedState.bookmarks : [],
    ctf: {
      ...INITIAL_STATE.ctf,
      ...(savedState.ctf || {}),
      completedChallenges: Array.isArray(savedState.ctf?.completedChallenges) ? savedState.ctf.completedChallenges : (savedState.ctf?.solved ? ['legacy'] : []),
      hintsByChallenge: savedState.ctf?.hintsByChallenge || {},
      reflections: savedState.ctf?.reflections || {},
      resultsByChallenge: savedState.ctf?.resultsByChallenge || {}
    },
    settings: {
      ...INITIAL_STATE.settings,
      ...(savedState.settings || {})
    },
    analytics: {
      ...INITIAL_STATE.analytics,
      ...(savedState.analytics || {}),
      events: Array.isArray(savedState.analytics?.events) ? savedState.analytics.events : []
    },
    metadata: {
      ...INITIAL_STATE.metadata,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      updatedAt: new Date().toISOString()
    }
  };
}

export function exportState(state) {
  return JSON.stringify(state, null, 2);
}

export function importState(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Format data JSON tidak valid' };
    }
    const migrated = migrateState(parsed);
    saveState(migrated);
    return { success: true, state: migrated };
  } catch (err) {
    return { success: false, error: 'Gagal membaca berkas: ' + err.message };
  }
}

function initializeDefaultState() {
  const now = new Date().toISOString();
  return {
    ...INITIAL_STATE,
    metadata: {
      ...INITIAL_STATE.metadata,
      createdAt: now,
      updatedAt: now
    },
    analytics: {
      ...INITIAL_STATE.analytics,
      startedAt: Date.now()
    }
  };
}
