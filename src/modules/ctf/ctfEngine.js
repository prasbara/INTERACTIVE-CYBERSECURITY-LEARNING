/**
 * CTF Engine Module
 * Manages challenge lifecycle, verification flow, attempt tracking, XP scoring, and progress persistence.
 * Architecture:
 * - Adapters: LocalCtfAdapter (Active Local/Demo) and RemoteCtfAdapter (Production Stub)
 * - Safe Gamification: Prevents duplicate XP farming and negative score exploitation
 * - Tracks: startedAt, completedAt, attemptsUsed, hintsUsed, xpAwarded, and reflection state
 */

import { store } from '../../app/state.js';
import { validateFlagSubmission } from './flagValidator.js';
import { logEvent } from '../analytics/eventLogger.js';
import { updateProgressState } from '../analytics/progressTracker.js';
import { addXP, awardBadge } from '../gamification/xpSystem.js';
import { getChallengeById } from '../../data/ctf/realCases.js';
import { calculateChallengeXp } from '../../data/ctf/difficulty.js';
import { getUnlockedHintsCount } from './hintSystem.js';

/**
 * Local Offline CTF Evaluation Adapter
 */
export class LocalCtfAdapter {
  constructor() {
    this.mode = 'local_offline';
  }

  validate(userInput, challengeId, options = {}) {
    return validateFlagSubmission(userInput, challengeId, options);
  }
}

/**
 * Remote Production CTF Adapter Stub
 * Explicitly marked: NOT PRODUCTION READY — BACKEND REQUIRED
 */
export class RemoteCtfAdapter {
  constructor(endpoint = '/api/v1/ctf/validate-flag') {
    this.endpoint = endpoint;
    this.mode = 'remote_production_required';
  }

  async validate(userInput, challengeId, options = {}) {
    // NOT PRODUCTION READY — BACKEND REQUIRED
    console.warn('[CTF Engine] Remote evaluation requested but backend API is not connected. Falling back to local adapter.');
    return validateFlagSubmission(userInput, challengeId, options);
  }
}

// Default active adapter
const defaultAdapter = new LocalCtfAdapter();

export function getChallengeAttempts(challengeId = 'legacy') {
  const ctfState = store.getState().ctf || {};
  const attemptsMap = ctfState.attemptsByChallenge || {};
  return attemptsMap[challengeId] || 0;
}

export function getRemainingAttempts(challengeId = 'legacy', maxAttempts = 5) {
  const used = getChallengeAttempts(challengeId);
  return Math.max(0, maxAttempts - used);
}

export function isChallengeLockedOut(challengeId = 'legacy', maxAttempts = 5) {
  return getChallengeAttempts(challengeId) >= maxAttempts && !isCtfSolved(challengeId);
}

export function submitFlag(inputString, challengeId = null, options = {}) {
  const targetId = challengeId || 'legacy';
  const state = store.getState();
  const ctfState = state.ctf || {};
  const attemptsMap = ctfState.attemptsByChallenge || {};
  const currentAttempts = attemptsMap[targetId] || 0;

  const challenge = targetId !== 'legacy' ? getChallengeById(targetId) : null;
  const maxAttempts = challenge?.flagConfig?.maxAttempts ?? options.maxAttempts ?? 5;

  // Already solved check
  const completedChallenges = ctfState.completedChallenges || [];
  const isAlreadyCompleted = completedChallenges.includes(targetId);

  if (isAlreadyCompleted) {
    return {
      valid: true,
      correct: true,
      alreadySolved: true,
      attemptsUsed: currentAttempts,
      attemptsRemaining: Math.max(0, maxAttempts - currentAttempts),
      message: 'FLAG ACCEPTED — Kasus ini sudah terselesaikan sebelumnya.',
      feedback: 'Kasus investigasi ini sudah terselesaikan.'
    };
  }

  // Lockout check
  if (currentAttempts >= maxAttempts) {
    return {
      valid: false,
      correct: false,
      lockedOut: true,
      attemptsUsed: currentAttempts,
      attemptsRemaining: 0,
      message: 'Batas percobaan flag telah habis. Telaah kembali evidence dan korelasi log.',
      feedback: 'Batas percobaan flag telah habis. Periksa kembali IOC dan timeline investigasi.'
    };
  }

  // Validate using local adapter
  const result = defaultAdapter.validate(inputString, challenge || targetId, {
    currentAttempts,
    maxAttempts,
    ...options
  });

  const updatedAttempts = currentAttempts + 1;

  // Update attempt counter in state
  store.setState(prev => ({
    ctf: {
      ...prev.ctf,
      attemptsByChallenge: {
        ...(prev.ctf?.attemptsByChallenge || {}),
        [targetId]: updatedAttempts
      }
    }
  }));

  if (result.valid) {
    const difficultyId = challenge?.difficulty || 'intermediate';
    const hintsUsedCount = getUnlockedHintsCount(targetId);
    
    // Calculate scoring with hints bonus/penalty
    const earnedXp = calculateChallengeXp(difficultyId, {
      hintsUsedCount,
      isFirstAttempt: updatedAttempts === 1
    });

    const completionRecord = {
      challengeId: targetId,
      solved: true,
      solvedAt: new Date().toISOString(),
      attemptsUsed: updatedAttempts,
      hintsUsed: hintsUsedCount,
      xpAwarded: earnedXp,
      scoringMode: 'local_offline' // explicitly marked as local/demo scoring
    };

    store.setState(prev => ({
      ctf: {
        ...prev.ctf,
        solved: true,
        flagSubmittedAt: new Date().toISOString(),
        completedChallenges: [...(prev.ctf?.completedChallenges || []), targetId],
        resultsByChallenge: {
          ...(prev.ctf?.resultsByChallenge || {}),
          [targetId]: completionRecord
        }
      }
    }));

    // Award XP & Badges (Guaranteed only once per challenge)
    addXP(earnedXp, `CTF Berhasil: ${challenge ? challenge.title : 'Incident Investigation'}`);
    awardBadge('incident-investigator');

    if (hintsUsedCount === 0) {
      awardBadge('eagle-eye'); // Badge for solving without hint
    }

    logEvent('ctf_flag_solved', {
      challengeId: targetId,
      earnedXp,
      hintsUsedCount,
      attemptsUsed: updatedAttempts
    }, 4, `ctf-${targetId}`);

    updateProgressState();
  } else {
    logEvent('ctf_flag_failed', {
      challengeId: targetId,
      attemptNumber: updatedAttempts
    }, 4, `ctf-${targetId}`);
  }

  return {
    ...result,
    attemptsUsed: updatedAttempts,
    attemptsRemaining: Math.max(0, maxAttempts - updatedAttempts)
  };
}

export function isCtfSolved(challengeId = null) {
  const ctfState = store.getState().ctf || {};
  if (!challengeId || challengeId === 'legacy') {
    return !!ctfState.solved;
  }
  const completed = ctfState.completedChallenges || [];
  return completed.includes(challengeId);
}

export class CtfEngine {
  constructor(challengeData) {
    this.challenge = challengeData;
    this.id = challengeData?.id || 'legacy';
  }

  submitFlag(userInput) {
    return submitFlag(userInput, this.id);
  }

  isSolved() {
    return isCtfSolved(this.id);
  }

  getDetails() {
    return this.challenge;
  }
}
