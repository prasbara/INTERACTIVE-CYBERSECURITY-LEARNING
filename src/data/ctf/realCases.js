/**
 * Master Real-Case CTF Challenge Bank Aggregator
 * Consolidates all 30 real-case-inspired cybersecurity challenges with verified open sources.
 */

import { AUTH_CHALLENGES } from './challenges/authChallenges.js';
import { WEB_CHALLENGES } from './challenges/webChallenges.js';
import { NETWORK_CHALLENGES } from './challenges/networkChallenges.js';
import { ENDPOINT_CHALLENGES } from './challenges/endpointChallenges.js';
import { CLOUD_CHALLENGES } from './challenges/cloudChallenges.js';
import { ADVANCED_CHALLENGES } from './challenges/advancedChallenges.js';
import { CTF_SOURCES } from './sources.js';
import { CTF_CATEGORIES } from './categories.js';
import { CTF_DIFFICULTIES } from './difficulty.js';

// Aggregate raw challenges
const RAW_CHALLENGES = [
  ...AUTH_CHALLENGES,
  ...WEB_CHALLENGES,
  ...NETWORK_CHALLENGES,
  ...ENDPOINT_CHALLENGES,
  ...CLOUD_CHALLENGES,
  ...ADVANCED_CHALLENGES
];

// Enrich challenges with source metadata and category info
export const REAL_CASE_CHALLENGES = RAW_CHALLENGES.map((ch) => {
  const source = CTF_SOURCES[ch.sourceId] || {
    id: ch.sourceId,
    sourceName: "Public Security Incident Advisory",
    title: ch.title,
    sourceUrl: "#",
    publicationDate: "2021-2023"
  };
  const categoryInfo = CTF_CATEGORIES[ch.category] || {
    id: ch.category,
    name: ch.category,
    icon: "ShieldAlert"
  };
  const difficultyInfo = CTF_DIFFICULTIES[ch.difficulty] || {
    id: ch.difficulty,
    name: ch.difficulty,
    baseXp: ch.xpReward || 100
  };

  const evidence = ch.evidence || ch.evidencePack || [];
  const questions = ch.questions || [];

  return {
    ...ch,
    evidence,
    evidencePack: ch.evidencePack || evidence,
    realWorldCase: ch.realWorldCase || ch.caseBrief?.narrative || ch.title,
    attackCategory: ch.attackCategory || ch.category,
    lapsStage: ch.lapsStage || "review",
    flagConfig: ch.flagConfig || {
      value: ch.flag,
      caseSensitive: false,
      maxAttempts: 5
    },
    investigation: ch.investigation || {
      questions,
      requiredEvidence: evidence.map(e => e.fileName || e.title),
      requiredDecisions: ['threat_classification', 'mitigation_verification']
    },
    mitigation: ch.mitigation || (ch.mitigationSummary ? [ch.mitigationSummary] : []),
    reflection: ch.reflection || [
      "Mengapa kamu yakin aktivitas tersebut merupakan serangan?",
      "Evidence mana yang paling kuat?",
      "Apakah ada kemungkinan false positive?",
      "Bagaimana cara memvalidasi keputusanmu?",
      "Mitigasi apa yang sebaiknya diterapkan?"
    ],
    source,
    categoryInfo,
    difficultyInfo
  };
});

/**
 * Get all available CTF challenges
 */
export function getAllChallenges() {
  return REAL_CASE_CHALLENGES;
}

/**
 * Find challenge by unique ID (e.g. 'RC-CTF-001' or 'ctf-001')
 */
export function getChallengeById(id) {
  if (!id) return null;
  const raw = String(id).trim();
  const normalizedId = raw.toUpperCase();
  return REAL_CASE_CHALLENGES.find(c => {
    if (c.id.toUpperCase() === normalizedId) return true;
    if (c.aliasId && c.aliasId.toUpperCase() === normalizedId) return true;
    if (c.id.replace('RC-', '').toUpperCase() === normalizedId) return true;
    if (`RC-${normalizedId}` === c.id.toUpperCase()) return true;
    return false;
  }) || null;
}

/**
 * Get challenges filtered by threat category
 */
export function getChallengesByCategory(category) {
  if (!category || category === 'all') return REAL_CASE_CHALLENGES;
  return REAL_CASE_CHALLENGES.filter(c => c.category === category);
}

/**
 * Get challenges filtered by difficulty level
 */
export function getChallengesByDifficulty(difficulty) {
  if (!difficulty || difficulty === 'all') return REAL_CASE_CHALLENGES;
  return REAL_CASE_CHALLENGES.filter(c => c.difficulty === difficulty);
}

/**
 * Filter challenges with multi-parameter criteria
 */
export function filterChallenges({
  category = 'all',
  difficulty = 'all',
  searchQuery = '',
  technology = 'all',
  status = 'all', // 'all', 'completed', 'uncompleted'
  completedIds = []
} = {}) {
  return REAL_CASE_CHALLENGES.filter(challenge => {
    // Category match
    if (category !== 'all' && challenge.category !== category) {
      return false;
    }

    // Difficulty match
    if (difficulty !== 'all' && challenge.difficulty !== difficulty) {
      return false;
    }

    // Technology match
    if (technology !== 'all' && !challenge.affectedTechnology.toLowerCase().includes(technology.toLowerCase())) {
      return false;
    }

    // Completion status match
    if (status === 'completed' && !completedIds.includes(challenge.id)) {
      return false;
    }
    if (status === 'uncompleted' && completedIds.includes(challenge.id)) {
      return false;
    }

    // Search query match
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = challenge.title.toLowerCase().includes(q);
      const matchId = challenge.id.toLowerCase().includes(q);
      const matchTech = challenge.affectedTechnology.toLowerCase().includes(q);
      const matchNarrative = challenge.caseBrief.narrative.toLowerCase().includes(q);
      const matchMitre = (challenge.mitreTechniques || []).some(t => t.toLowerCase().includes(q));

      if (!matchTitle && !matchId && !matchTech && !matchNarrative && !matchMitre) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get aggregate statistics across the CTF Bank
 */
export function getChallengeStats(completedIds = []) {
  const total = REAL_CASE_CHALLENGES.length;
  const completed = completedIds.filter(id => REAL_CASE_CHALLENGES.some(c => c.id === id)).length;
  const totalXp = REAL_CASE_CHALLENGES.reduce((sum, c) => sum + (c.xpReward || 0), 0);
  const earnedXp = REAL_CASE_CHALLENGES
    .filter(c => completedIds.includes(c.id))
    .reduce((sum, c) => sum + (c.xpReward || 0), 0);

  const byCategory = {};
  Object.keys(CTF_CATEGORIES).forEach(cat => {
    byCategory[cat] = REAL_CASE_CHALLENGES.filter(c => c.category === cat).length;
  });

  const byDifficulty = {};
  Object.keys(CTF_DIFFICULTIES).forEach(diff => {
    byDifficulty[diff] = REAL_CASE_CHALLENGES.filter(c => c.difficulty === diff).length;
  });

  return {
    total,
    completed,
    completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    totalXp,
    earnedXp,
    byCategory,
    byDifficulty
  };
}
