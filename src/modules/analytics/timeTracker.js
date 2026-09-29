/**
 * Resilient Time Tracker
 * Features:
 * - Respects Page Visibility API (pauses when tab is hidden or minimized)
 * - Inactivity detection (pauses if no user input for > 3 minutes)
 * - Batched flush (flushes to store/localStorage periodically every 15s or on unload)
 * - Prevents excessive re-renders and localStorage thrashing
 */

import { store } from '../../app/state.js';

let intervalId = null;
let lastInteractionTime = Date.now();
let pendingSeconds = 0;
const IDLE_TIMEOUT_MS = 180000; // 3 minutes idle threshold

function onUserActivity() {
  lastInteractionTime = Date.now();
}

function flushTime() {
  if (pendingSeconds > 0) {
    const toAdd = pendingSeconds * 1000;
    pendingSeconds = 0;

    store.setState(prev => ({
      analytics: {
        ...prev.analytics,
        totalActiveMs: (prev.analytics?.totalActiveMs || 0) + toAdd
      }
    }));
  }
}

export function startTimeTracker() {
  if (intervalId) return;

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', onUserActivity, { passive: true });
    window.addEventListener('keydown', onUserActivity, { passive: true });
    window.addEventListener('scroll', onUserActivity, { passive: true });
    window.addEventListener('click', onUserActivity, { passive: true });
    window.addEventListener('beforeunload', flushTime);
  }

  intervalId = setInterval(() => {
    // Only track if document is visible and user is not idle
    if (typeof document !== 'undefined' && document.hidden) {
      return;
    }

    const isIdle = Date.now() - lastInteractionTime > IDLE_TIMEOUT_MS;
    if (isIdle) {
      return;
    }

    pendingSeconds += 1;

    // Flush to persistent store every 15 seconds
    if (pendingSeconds >= 15) {
      flushTime();
    }
  }, 1000);
}

export function stopTimeTracker() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  flushTime();

  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', onUserActivity);
    window.removeEventListener('keydown', onUserActivity);
    window.removeEventListener('scroll', onUserActivity);
    window.removeEventListener('click', onUserActivity);
    window.removeEventListener('beforeunload', flushTime);
  }
}

export function getActiveTimeMinutes() {
  const currentTotal = (store.getState().analytics?.totalActiveMs || 0) + (pendingSeconds * 1000);
  return Math.max(0, Math.floor(currentTotal / 60000));
}
