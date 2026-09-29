import test from 'node:test';
import assert from 'node:assert/strict';
import { addXP, awardBadge, getGamificationStats } from '../src/modules/gamification/xpSystem.js';
import { store } from '../src/app/state.js';

test('XPSystem - adds XP points and updates store state', () => {
  store.setState({ gamification: { xp: 50, badges: [] } });
  const newXP = addXP(25, 'Analisis Evidence');

  assert.equal(newXP, 75);
  assert.equal(store.getState().gamification.xp, 75);
});

test('XPSystem - awards unique badges without duplication', () => {
  store.setState({ gamification: { xp: 100, badges: ['log-explorer'] } });
  awardBadge('evidence-hunter');
  awardBadge('evidence-hunter'); // Duplicate attempt

  const stats = getGamificationStats();
  const hunterBadges = stats.unlockedBadges.filter(b => b.id === 'evidence-hunter');
  assert.equal(hunterBadges.length, 1);
});
