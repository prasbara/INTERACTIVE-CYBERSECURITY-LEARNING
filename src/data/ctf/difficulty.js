/**
 * CTF Difficulty Levels & Scoring Specifications
 */

export const CTF_DIFFICULTY_LEVELS = {
  beginner: {
    id: 'beginner',
    label: 'Beginner',
    stars: 1,
    baseXp: 50,
    color: '#10b981',
    description: '1-2 sumber log, minim noise, indikasi serangan terlihat jelas secara langsung.',
    criteria: 'Mengenali format log dasar dan mencocokkan indikator tunggal.'
  },
  intermediate: {
    id: 'intermediate',
    label: 'Intermediate',
    stars: 2,
    baseXp: 100,
    color: '#0ea5e9',
    description: '2-3 sumber log, terdapat lalu lintas sah normal sebagai noise pembanding.',
    criteria: 'Mengkorelasikan cap waktu dan mengeliminasi aktivitas operasional normal.'
  },
  advanced: {
    id: 'advanced',
    label: 'Advanced',
    stars: 3,
    baseXp: 175,
    color: '#f59e0b',
    description: '3-4 sumber telemetri multi-sensor, bukti berantai, teknik penyamaran penyerang.',
    criteria: 'Menghubungkan jejak jaringan dengan log proses/sistem serta merumuskan mitigasi presisi.'
  },
  expert: {
    id: 'expert',
    label: 'Expert',
    stars: 4,
    baseXp: 250,
    color: '#ef4444',
    description: 'Investigasi multi-stage APT, muatan payload terobfuskasi, anomali tersembunyi.',
    criteria: 'Rekonstruksi komprehensif seluruh linimasa serangan dan pemetaan taktik MITRE ATT&CK.'
  }
};

export function calculateChallengeXp(difficultyId, { hintsUsedCount = 0, isFirstAttempt = false }) {
  const diff = CTF_DIFFICULTY_LEVELS[difficultyId] || CTF_DIFFICULTY_LEVELS.beginner;
  let xp = diff.baseXp;

  // Bonuses
  if (hintsUsedCount === 0) {
    xp = Math.round(xp * 1.25); // +25% No Hint bonus
  } else {
    xp = Math.max(Math.round(diff.baseXp * 0.5), xp - (hintsUsedCount * 15)); // Deduction per hint
  }

  if (isFirstAttempt) {
    xp = Math.round(xp * 1.10); // +10% First Attempt bonus
  }

  return xp;
}

export const CTF_DIFFICULTIES = CTF_DIFFICULTY_LEVELS;
