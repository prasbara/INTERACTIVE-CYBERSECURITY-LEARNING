import test from 'node:test';
import assert from 'node:assert/strict';
import { REAL_CASE_CHALLENGES, getAllChallenges, getChallengeById, filterChallenges, getChallengeStats } from '../src/data/ctf/realCases.js';
import { CTF_SOURCES } from '../src/data/ctf/sources.js';
import { CTF_CATEGORIES } from '../src/data/ctf/categories.js';
import { CTF_DIFFICULTY_LEVELS, calculateChallengeXp } from '../src/data/ctf/difficulty.js';
import { validateFlagSubmission } from '../src/modules/ctf/flagValidator.js';

test('CTF Bank - minimum 30 real-case-inspired challenges available', () => {
  const challenges = getAllChallenges();
  assert.ok(challenges.length >= 30, `Expected >= 30 challenges, got ${challenges.length}`);
  assert.equal(challenges.length, 30);
});

test('CTF Bank - schema completeness and integrity of all 30 challenges', () => {
  const challenges = getAllChallenges();

  challenges.forEach((ch, idx) => {
    assert.ok(ch.id && ch.id.startsWith('RC-CTF-'), `Challenge #${idx} missing valid ID: ${ch.id}`);
    assert.ok(ch.title && ch.title.length > 5, `Challenge ${ch.id} missing descriptive title`);
    assert.ok(CTF_CATEGORIES[ch.category], `Challenge ${ch.id} invalid category: ${ch.category}`);
    assert.ok(CTF_DIFFICULTY_LEVELS[ch.difficulty], `Challenge ${ch.id} invalid difficulty: ${ch.difficulty}`);
    assert.ok(ch.xpReward > 0, `Challenge ${ch.id} must offer XP reward`);
    assert.ok(CTF_SOURCES[ch.sourceId], `Challenge ${ch.id} sourceId '${ch.sourceId}' not found in CTF_SOURCES`);
    
    // Case brief verification
    assert.ok(ch.caseBrief && ch.caseBrief.narrative, `Challenge ${ch.id} missing caseBrief narrative`);
    assert.ok(Array.isArray(ch.caseBrief.mission) && ch.caseBrief.mission.length > 0, `Challenge ${ch.id} missing mission items`);

    // Evidence pack verification
    assert.ok(Array.isArray(ch.evidencePack) && ch.evidencePack.length >= 1, `Challenge ${ch.id} must have at least 1 evidence file`);
    ch.evidencePack.forEach(e => {
      assert.ok(e.fileName, `Challenge ${ch.id} evidence missing fileName`);
      assert.ok(e.content && e.content.length > 10, `Challenge ${ch.id} evidence ${e.fileName} content too short`);
    });

    // Guided questions
    assert.ok(Array.isArray(ch.questions) && ch.questions.length >= 1, `Challenge ${ch.id} must have at least 1 question`);
    ch.questions.forEach(q => {
      assert.ok(q.id && q.question, `Challenge ${ch.id} question missing id or text`);
      assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Challenge ${ch.id} question options must be >= 2`);
      assert.ok(q.correctAnswer, `Challenge ${ch.id} question missing correctAnswer`);
      assert.ok(q.explanation, `Challenge ${ch.id} question missing explanation`);
    });

    // Hints
    assert.ok(Array.isArray(ch.hints) && ch.hints.length >= 2, `Challenge ${ch.id} hints must be >= 2 tiers`);

    // Deterministic flag format
    assert.ok(typeof ch.flag === 'string' && /^FLAG\{[A-Z0-9_]+\}$/.test(ch.flag), `Challenge ${ch.id} flag invalid format: ${ch.flag}`);

    // Mitigation & LAPS
    assert.ok(ch.mitigationSummary && ch.mitigationSummary.length > 10, `Challenge ${ch.id} missing mitigationSummary`);
    assert.ok(ch.lapsMapping && ch.lapsMapping.understand && ch.lapsMapping.plan && ch.lapsMapping.execute && ch.lapsMapping.review, `Challenge ${ch.id} incomplete lapsMapping`);
  });
});

test('CTF Bank - category coverage across threat vectors', () => {
  const challenges = getAllChallenges();
  const categories = new Set(challenges.map(c => c.category));

  assert.ok(categories.has('authentication'), 'Missing authentication challenges');
  assert.ok(categories.has('web'), 'Missing web application challenges');
  assert.ok(categories.has('network'), 'Missing network challenges');
  assert.ok(categories.has('endpoint'), 'Missing endpoint challenges');
  assert.ok(categories.has('cloud'), 'Missing cloud challenges');
  assert.ok(categories.has('forensics') || categories.has('malware'), 'Missing forensics or malware challenges');
});

test('CTF Bank - difficulty tier distribution', () => {
  const challenges = getAllChallenges();
  const difficulties = new Set(challenges.map(c => c.difficulty));

  assert.ok(difficulties.has('beginner'), 'Missing beginner challenges');
  assert.ok(difficulties.has('intermediate'), 'Missing intermediate challenges');
  assert.ok(difficulties.has('advanced'), 'Missing advanced challenges');
  assert.ok(difficulties.has('expert'), 'Missing expert challenges');
});

test('CTF Bank - lookup by ID and case insensitivity', () => {
  const ch1 = getChallengeById('RC-CTF-001');
  assert.ok(ch1);
  assert.equal(ch1.id, 'RC-CTF-001');

  const ch1Lower = getChallengeById('rc-ctf-001');
  assert.ok(ch1Lower);
  assert.equal(ch1Lower.id, 'RC-CTF-001');

  const nonExistent = getChallengeById('RC-CTF-999');
  assert.equal(nonExistent, null);
});

test('CTF Bank - multi-parameter filtering', () => {
  // Filter by category
  const webChs = filterChallenges({ category: 'web' });
  assert.ok(webChs.length >= 6);
  webChs.forEach(c => assert.equal(c.category, 'web'));

  // Filter by difficulty
  const advChs = filterChallenges({ difficulty: 'advanced' });
  assert.ok(advChs.length >= 6);
  advChs.forEach(c => assert.equal(c.difficulty, 'advanced'));

  // Search query filter
  const log4jMatches = filterChallenges({ searchQuery: 'log4j' });
  assert.ok(log4jMatches.length >= 1);
  assert.ok(log4jMatches.some(c => c.id === 'RC-CTF-006'));
});

test('CTF Bank - statistics aggregator', () => {
  const stats = getChallengeStats(['RC-CTF-001', 'RC-CTF-002']);
  assert.equal(stats.total, 30);
  assert.equal(stats.completed, 2);
  assert.equal(stats.completionPercentage, 7);
  assert.ok(stats.earnedXp > 0);
  assert.ok(stats.totalXp >= 3500);
});

test('CTF Bank - flag verification per challenge ID', () => {
  const ch1 = getChallengeById('RC-CTF-001');
  const validRes = validateFlagSubmission(ch1.flag, 'RC-CTF-001');
  assert.equal(validRes.valid, true);

  // Case insensitive & whitespace trimmed
  const lowerRes = validateFlagSubmission(`  ${ch1.flag.toLowerCase()}  `, 'RC-CTF-001');
  assert.equal(lowerRes.valid, true);

  // Wrong flag rejected
  const wrongRes = validateFlagSubmission('FLAG{WRONG_CODE_HERE}', 'RC-CTF-001');
  assert.equal(wrongRes.valid, false);
});

test('CTF Bank - scoring and XP bonus calculations', () => {
  // Beginner base: 50 XP, No hint bonus (+25%) = 63, First attempt (+10%) = 69
  const scoreNoHint = calculateChallengeXp('beginner', { hintsUsedCount: 0, isFirstAttempt: true });
  assert.ok(scoreNoHint >= 60);

  // Expert base: 250 XP with 2 hints used
  const scoreWithHints = calculateChallengeXp('expert', { hintsUsedCount: 2, isFirstAttempt: false });
  assert.ok(scoreWithHints < 250);
});

test('CTF Bank - exactly 30 specific flags mapped and verified', () => {
  const EXPECTED_FLAGS = [
    "FLAG{SSH_SANTAI_TAPI_BRUTE_FORCE}",
    "FLAG{AKU_BUKAN_BOT_CUMA_SALAH_PASSWORD}",
    "FLAG{LOG_DULU_BARU_PANIK}",
    "FLAG{IP_NYA_NAKAL_BANG}",
    "FLAG{ROOT_JANGAN_DIAJAK_MAIN}",
    "FLAG{PASSWORD123_BELUM_TAHUN_2010}",
    "FLAG{AUTH_LOG_TAHU_SEGALANYA}",
    "FLAG{GREP_SAMPAI_KETEMU}",
    "FLAG{FALSE_POSITIVE_TAPI_BAPER}",
    "FLAG{NEED_MORE_EVIDENCE_BRO}",
    "FLAG{TP_KETEMU_JUGA_AKHIRNYA}",
    "FLAG{SOC_TIDAK_SEMUA_YANG_MERAH_BAHAYA}",
    "FLAG{SI_IP_185_KOK_BALIK_LAGI}",
    "FLAG{TIMELINE_NYA_JELAS_BOSS}",
    "FLAG{LOGNYA_BERISIK_TAPI_KITA_TELITI}",
    "FLAG{SIGNATURE_KENALAN_LAMA}",
    "FLAG{ANOMALI_TIBA_TIBA_DATANG}",
    "FLAG{JANGAN_ASAL_BLOCK_DULU}",
    "FLAG{EVIDENCE_DULU_BARU_NUDUH}",
    "FLAG{SIAPA_SURUH_LOGIN_100_KALI}",
    "FLAG{CTF_DULU_MITIGASI_KEMUDIAN}",
    "FLAG{IOC_NYA_KETEMU_GES}",
    "FLAG{MITRE_NYA_MANA_BANG}",
    "FLAG{SI_MALWARE_PURA_PURA_NORMAL}",
    "FLAG{404_ATTACKER_NOT_FOUND}",
    "FLAG{TERMINALNYA_CUMA_SIMULASI}",
    "FLAG{KLIK_SEMUA_LOG_BELUM_TENTU_BENAR}",
    "FLAG{SATU_LOG_TIDAK_CUKUP}",
    "FLAG{LAPS_SAMPAI_FLAG}",
    "FLAG{ANALIS_MUDA_JANGAN_ASAL_TUDUH}"
  ];

  const challenges = getAllChallenges();
  assert.equal(challenges.length, 30);

  EXPECTED_FLAGS.forEach((flagVal, idx) => {
    const ch = challenges[idx];
    assert.equal(ch.flag, flagVal, `Challenge #${idx + 1} (${ch.id}) flag mismatch`);
    
    // Verify lookup by alias ctf-xxx
    const num = String(idx + 1).padStart(3, '0');
    const byAlias = getChallengeById(`ctf-${num}`);
    assert.ok(byAlias, `Failed to find challenge by alias ctf-${num}`);
    assert.equal(byAlias.id, ch.id);

    // Validate flag submission
    const res = validateFlagSubmission(flagVal, ch.id);
    assert.equal(res.valid, true);
    assert.equal(res.correct, true);
  });

  // Verify specific challenge 29 (LAPS Final) and 30 (Grand Final)
  const ch29 = getChallengeById('RC-CTF-029');
  assert.equal(ch29.flag, "FLAG{LAPS_SAMPAI_FLAG}");
  assert.equal(ch29.lapsStage, "review");

  const ch30 = getChallengeById('RC-CTF-030');
  assert.equal(ch30.flag, "FLAG{ANALIS_MUDA_JANGAN_ASAL_TUDUH}");
  assert.equal(ch30.difficulty, "expert");
});

test('CTF Bank - flag validator attempt limits and anti-leak feedback', () => {
  const ch1 = getChallengeById('RC-CTF-001');

  // Attempt 1: Wrong flag
  const res1 = validateFlagSubmission('FLAG{WRONG_GUESS_ONE}', ch1, { currentAttempts: 0, maxAttempts: 3 });
  assert.equal(res1.valid, false);
  assert.equal(res1.correct, false);
  assert.equal(res1.attemptsUsed, 1);
  assert.equal(res1.attemptsRemaining, 2);
  assert.equal(res1.lockedOut, false);
  // Must NOT leak target flag
  assert.equal(res1.message.includes(ch1.flag), false);
  assert.equal(res1.feedback.includes(ch1.flag), false);

  // Attempt 3: Exhausted
  const res3 = validateFlagSubmission('FLAG{WRONG_GUESS_THREE}', ch1, { currentAttempts: 2, maxAttempts: 3 });
  assert.equal(res3.attemptsUsed, 3);
  assert.equal(res3.attemptsRemaining, 0);
  assert.equal(res3.lockedOut, true);

  // Attempt 4: Already locked out
  const res4 = validateFlagSubmission('FLAG{ANOTHER_GUESS}', ch1, { currentAttempts: 3, maxAttempts: 3 });
  assert.equal(res4.lockedOut, true);
  assert.equal(res4.attemptsRemaining, 0);
});
