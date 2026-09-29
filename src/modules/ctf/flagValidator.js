/**
 * Flag Validator Module
 * Robust deterministic verification of cybersecurity CTF flags conforming to SOC standards.
 * Features:
 * - Trims whitespace
 * - Reject empty or malformed flag
 * - Enforces case-sensitivity per challenge configuration
 * - Tracks attempt counting and limits (maxAttempts, attemptsUsed, attemptsRemaining)
 * - Safe error handling (never leaks expected flag string or internal secrets)
 * - Backward-compatible with existing tests and single-challenge Meeting 4 flow
 */

import { getChallengeById } from '../../data/ctf/realCases.js';
import { getExpectedFlag } from '../../utils/security.js';

export function validateFlag(userInput, challengeOrId = null, options = {}) {
  // Resolve challenge object if ID was passed
  let challenge = null;
  if (challengeOrId && typeof challengeOrId === 'object') {
    challenge = challengeOrId;
  } else if (typeof challengeOrId === 'string') {
    challenge = getChallengeById(challengeOrId);
  }

  const maxAttempts = options.maxAttempts ?? challenge?.flagConfig?.maxAttempts ?? 5;
  const currentAttempts = typeof options.currentAttempts === 'number' ? options.currentAttempts : 0;

  // Check lockout
  if (currentAttempts >= maxAttempts) {
    return {
      valid: false,
      correct: false,
      attemptsUsed: currentAttempts,
      attemptsRemaining: 0,
      lockedOut: true,
      message: 'Batas percobaan flag telah habis. Telaah kembali evidence dan korelasi log.',
      feedback: 'Batas percobaan flag telah habis. Periksa kembali IOC dan timeline investigasi.'
    };
  }

  // 1. Reject empty input
  if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
    return {
      valid: false,
      correct: false,
      attemptsUsed: currentAttempts,
      attemptsRemaining: Math.max(0, maxAttempts - currentAttempts),
      lockedOut: false,
      message: 'Masukkan kode security flag terlebih dahulu!',
      feedback: 'Masukkan kode security flag terlebih dahulu.'
    };
  }

  const clean = userInput.trim();
  const attemptsUsed = currentAttempts + 1;
  const attemptsRemaining = Math.max(0, maxAttempts - attemptsUsed);

  // 2. Reject malformed flag (must match FLAG{...})
  const flagFormatRegex = /^FLAG\{[A-Za-z0-9_+\-!@#$%\^&*.]+\}$/i;
  if (!flagFormatRegex.test(clean)) {
    return {
      valid: false,
      correct: false,
      attemptsUsed,
      attemptsRemaining,
      lockedOut: attemptsRemaining <= 0,
      message: 'FLAG NOT VALID — Format flag tidak valid. Gunakan format standar: FLAG{...}',
      feedback: 'Format flag tidak valid. Pastikan format menggunakan FLAG{NAMA_FLAG}.'
    };
  }

  // 3. Resolve target flag
  let targetFlag = null;
  let caseSensitive = false;

  if (challenge) {
    targetFlag = challenge.flagConfig?.value || (typeof challenge.flag === 'string' ? challenge.flag : null);
    caseSensitive = !!challenge.flagConfig?.caseSensitive;
  } else {
    // Legacy single challenge prototype fallback
    targetFlag = getExpectedFlag();
  }

  if (typeof options.caseSensitive === 'boolean') {
    caseSensitive = options.caseSensitive;
  }

  // 4. Verification comparison
  let isCorrect = false;
  if (targetFlag) {
    if (caseSensitive) {
      isCorrect = clean === targetFlag.trim();
    } else {
      isCorrect = clean.toUpperCase() === targetFlag.trim().toUpperCase();
    }
  }

  // Allow legacy flag aliases for meeting 4 if no challenge specified
  if (!isCorrect && !challenge) {
    const legacyAliases = [
      'FLAG{SSH_BRUTE_FORCE_DETECTED}',
      'FLAG{SSH_SANTAI_TAPI_BRUTE_FORCE}'
    ];
    isCorrect = legacyAliases.some(alias => clean.toUpperCase() === alias);
  }

  if (isCorrect) {
    return {
      valid: true,
      correct: true,
      attemptsUsed,
      attemptsRemaining,
      lockedOut: false,
      message: 'FLAG ACCEPTED — Verifikasi investigasi insiden berhasil dikonfirmasi!',
      feedback: 'FLAG ACCEPTED — Verifikasi investigasi insiden berhasil dikonfirmasi!'
    };
  }

  return {
    valid: false,
    correct: false,
    attemptsUsed,
    attemptsRemaining,
    lockedOut: attemptsRemaining <= 0,
    message: 'FLAG NOT VALID — Cermati kembali korelasi bukti log dan petunjuk investigasi.',
    feedback: 'Flag belum tepat. Periksa kembali IOC dan timeline investigasi.'
  };
}

export const validateFlagSubmission = validateFlag;
