/**
 * Gamification & XP System (Lightweight Educational Gamification)
 * Note: Used solely for learning engagement and intrinsic motivation,
 * NOT as a psychometric measure of critical thinking.
 */

import { store } from '../../app/state.js';
import { logEvent } from '../analytics/eventLogger.js';
import { showToast } from '../../components/Toast.js';

export const BADGES = [
  { id: 'log-explorer', name: 'Log Explorer', icon: 'search', iconName: 'search', tier: 'FOUNDATION', description: 'Memulai investigasi log mentah IDS' },
  { id: 'evidence-hunter', name: 'Evidence Hunter', icon: 'target', iconName: 'target', tier: 'DISCOVERY', description: 'Menemukan dan menandai 3 bukti log penting' },
  { id: 'hypothesis-maker', name: 'Hypothesis Crafter', icon: 'compass', iconName: 'compass', tier: 'REASONING', description: 'Menyusun hipotesis berlandaskan bukti empiris' },
  { id: 'alert-analyst', name: 'Alert Analyst', icon: 'shield', iconName: 'shield', tier: 'TRIAGE', description: 'Menyelesaikan triase alert SOC dengan 7 konteks' },
  { id: 'incident-investigator', name: 'Incident Investigator', icon: 'flag', iconName: 'flag', tier: 'INVESTIGATION', description: 'Menemukan validasi flag insiden CTF' },
  { id: 'critical-reflector', name: 'Critical Reflector', icon: 'fileText', iconName: 'fileText', tier: 'METACOGNITION', description: 'Menyelesaikan refleksi diri minimal 100 karakter' },
  { id: 'ids-specialist', name: 'IDS Specialist', icon: 'trophy', iconName: 'trophy', tier: 'MASTERY', description: 'Menyelesaikan seluruh 4 tahapan LAPS-Heuristik' }
];

export function addXP(amount, reason = 'Aktivitas Belajar') {
  const validAmount = typeof amount === 'number' && !isNaN(amount) ? Math.max(0, Math.round(amount)) : 0;
  if (validAmount === 0 && amount !== 0) return 0;

  const state = store.getState();
  const currentXP = typeof state.gamification?.xp === 'number' && !isNaN(state.gamification.xp) ? state.gamification.xp : 0;
  const newXP = currentXP + validAmount;

  store.setState({
    gamification: {
      ...(state.gamification || {}),
      xp: newXP
    }
  });

  logEvent('xp_earned', { amount: validAmount, newXP, reason });
  showToast({ type: 'success', message: `+${validAmount} XP: ${reason}` });
  checkBadges();
  return newXP;
}

export function awardBadge(badgeId) {
  const state = store.getState();
  const currentBadges = state.gamification?.badges || [];

  if (!currentBadges.includes(badgeId)) {
    const updated = [...currentBadges, badgeId];
    store.setState({
      gamification: {
        ...(state.gamification || {}),
        badges: updated
      }
    });

    const badge = BADGES.find(b => b.id === badgeId);
    logEvent('badge_unlocked', { badgeId, name: badge?.name });
    showToast({
      type: 'info',
      message: `Lencana Baru Terbuka: ${badge?.name || badgeId}! ${badge?.description || ''}`
    });
  }
}

export function checkBadges() {
  const state = store.getState();
  const evidenceCount = Object.values(state.selectedEvidence || {}).flat().length;
  if (evidenceCount >= 3) awardBadge('evidence-hunter');

  if (Object.keys(state.hypotheses || {}).length > 0) awardBadge('hypothesis-maker');

  if (Object.keys(state.triageDecisions || {}).length >= 3) awardBadge('alert-analyst');

  if (state.ctf?.solved) awardBadge('incident-investigator');

  if ((state.ctf?.reflection || '').trim().length >= 100) awardBadge('critical-reflector');

  if (state.progress?.meeting1 && state.progress?.meeting2 && state.progress?.meeting3 && state.progress?.meeting4) {
    awardBadge('ids-specialist');
  }
}

export function getGamificationStats() {
  const state = store.getState();
  const xp = state.gamification?.xp || 0;
  const unlockedIds = state.gamification?.badges || [];

  // Level computation
  const levelIndex = Math.min(Math.floor(xp / 150) + 1, 10);
  const nextLevelXP = levelIndex * 150;
  const levelNames = [
    'Junior SOC Analyst',
    'Triage Investigator',
    'Log Evidence Specialist',
    'Incident Responder',
    'Threat Hunter',
    'Senior IDS Analyst'
  ];
  const levelName = levelNames[Math.min(levelIndex - 1, levelNames.length - 1)];

  return {
    xp,
    level: {
      current: levelIndex,
      name: levelName
    },
    nextLevelXP,
    unlockedBadges: BADGES.filter(b => unlockedIds.includes(b.id)),
    allBadges: BADGES.map(b => ({
      ...b,
      isUnlocked: unlockedIds.includes(b.id)
    }))
  };
}
