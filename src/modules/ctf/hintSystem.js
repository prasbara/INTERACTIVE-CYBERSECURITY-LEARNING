import { store } from '../../app/state.js';
import { logEvent } from '../analytics/eventLogger.js';

export function unlockHint(stepNumber, challengeId = 'legacy') {
  const ctfState = store.getState().ctf || {};
  const challengeHints = ctfState.hintsByChallenge || {};
  const currentHints = challengeHints[challengeId] || [];

  if (!currentHints.includes(stepNumber)) {
    const updatedHints = [...currentHints, stepNumber];
    store.setState(prev => ({
      ctf: {
        ...prev.ctf,
        hintsUsed: challengeId === 'legacy' ? updatedHints : (prev.ctf?.hintsUsed || []),
        hintsByChallenge: {
          ...challengeHints,
          [challengeId]: updatedHints
        }
      }
    }));

    logEvent('ctf_hint_revealed', { challengeId, step: stepNumber }, 4, `hint-${challengeId}-${stepNumber}`);
  }
}

export function isHintUnlocked(stepNumber, challengeId = 'legacy') {
  const ctfState = store.getState().ctf || {};
  const challengeHints = ctfState.hintsByChallenge || {};
  const currentHints = challengeHints[challengeId] || (challengeId === 'legacy' ? (ctfState.hintsUsed || []) : []);
  return currentHints.includes(stepNumber);
}

export function getUnlockedHintsCount(challengeId = 'legacy') {
  const ctfState = store.getState().ctf || {};
  const challengeHints = ctfState.hintsByChallenge || {};
  const currentHints = challengeHints[challengeId] || (challengeId === 'legacy' ? (ctfState.hintsUsed || []) : []);
  return currentHints.length;
}
