/**
 * Reflection Engine
 * Handles student qualitative reflection validation, submission, and research logging.
 */

import { validateReflection } from '../../utils/validators.js';
import { logEvent } from '../analytics/eventLogger.js';
import { store } from '../../app/state.js';
import { checkMeetingCompletion } from '../analytics/progressTracker.js';

export function submitReflection({ meetingId = 4, text }) {
  const validation = validateReflection(text, 100);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      charCount: validation.charCount
    };
  }

  const sanitized = validation.sanitized;

  // Persist into state
  const state = store.getState();
  const ctf = { ...state.ctf, reflection: sanitized, reflectionSubmittedAt: new Date().toISOString() };
  
  store.setState({ ctf });

  // Log research event
  logEvent('reflection_submitted', {
    meetingId,
    charCount: validation.charCount,
    submittedAt: ctf.reflectionSubmittedAt
  });

  // Re-check meeting 4 completion
  checkMeetingCompletion(4);

  return {
    success: true,
    message: 'Refleksi investigasi berhasil disimpan.',
    charCount: validation.charCount
  };
}

export function getSavedReflection() {
  const state = store.getState();
  return state.ctf?.reflection || '';
}
