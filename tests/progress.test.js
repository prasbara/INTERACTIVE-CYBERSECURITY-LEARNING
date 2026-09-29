import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOverallProgress, calculateMeetingProgress } from '../src/modules/analytics/progressTracker.js';
import { store } from '../src/app/state.js';
import { QUESTIONS_BY_MEETING } from '../src/data/questions.js';

test('Progress - calculates meeting progress accurately based on answered activities', () => {
  const m1Questions = QUESTIONS_BY_MEETING[1] || [];
  const activities = {};
  m1Questions.forEach(q => { activities[q.id] = 'c'; });

  store.setState({ activities });

  const m1Prog = calculateMeetingProgress(1);
  assert.equal(m1Prog.completed, true);
  assert.equal(m1Prog.progressPercent, 100);
});

test('Progress - overall progress reflects completed meetings', () => {
  const overall = calculateOverallProgress();
  assert.equal(typeof overall.percent, 'number');
  assert.equal(overall.totalMeetings, 4);
});
