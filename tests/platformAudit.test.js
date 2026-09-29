import test from 'node:test';
import assert from 'node:assert/strict';
import { store } from '../src/app/state.js';
import { loadState, saveState, migrateState } from '../src/app/storage.js';
import { addXP, getGamificationStats } from '../src/modules/gamification/xpSystem.js';
import { logEvent, getEvents } from '../src/modules/analytics/eventLogger.js';
import { getActiveTimeMinutes } from '../src/modules/analytics/timeTracker.js';
import { router } from '../src/app/router.js';
import { ROUTES } from '../src/app/constants.js';

test('Platform QA - Storage recovers safely from corrupt or empty values', () => {
  // Empty object
  const stateFromEmpty = migrateState({});
  assert.ok(stateFromEmpty.student);
  assert.equal(stateFromEmpty.gamification.xp, 0);
  assert.ok(Array.isArray(stateFromEmpty.bookmarks));
  assert.ok(Array.isArray(stateFromEmpty.ctf.completedChallenges));

  // Null input
  const stateFromNull = migrateState(null);
  assert.ok(stateFromNull.metadata);

  // Schema version 1 upgrade
  const v1State = {
    metadata: { schemaVersion: 1 },
    student: { name: 'Ahmad' },
    gamification: { xp: 200 }
  };
  const migrated = migrateState(v1State);
  assert.equal(migrated.student.name, 'Ahmad');
  assert.equal(migrated.gamification.xp, 200);
  assert.equal(migrated.metadata.schemaVersion, 2);
});

test('Platform QA - Gamification prevents NaN and negative XP injections', () => {
  const initialXP = store.getState().gamification?.xp || 0;

  // Attempt NaN
  addXP(NaN);
  assert.equal(store.getState().gamification?.xp, initialXP);

  // Attempt negative
  addXP(-500);
  assert.equal(store.getState().gamification?.xp, initialXP);

  // Valid XP addition
  const newXP = addXP(50);
  assert.equal(newXP, initialXP + 50);
});

test('Platform QA - Event Logger enforces maximum history buffer without bloat', () => {
  for (let i = 0; i < 600; i++) {
    logEvent('audit_stress_test', { index: i });
  }

  const events = getEvents();
  assert.ok(events.length <= 500, `Expected <= 500 events, got ${events.length}`);
  assert.equal(events[events.length - 1].payload.index, 599);
});

test('Platform QA - Time tracker does not produce negative or NaN duration', () => {
  const mins = getActiveTimeMinutes();
  assert.ok(typeof mins === 'number');
  assert.ok(!isNaN(mins));
  assert.ok(mins >= 0);
});

test('Platform QA - All required system routes are configured in ROUTES constants', () => {
  const definedRoutes = Object.values(ROUTES);

  const expectedRoutes = [
    '/',
    '/identity',
    '/onboarding',
    '/dashboard',
    '/learning-path',
    '/meeting/1',
    '/meeting/2',
    '/meeting/3',
    '/meeting/4',
    '/ctf',
    '/leaderboard',
    '/profile',
    '/review',
    '/bookmarks',
    '/pre-test',
    '/post-test',
    '/completion',
    '/progress',
    '/settings',
    '/research',
    '/admin/login',
    '/admin',
    '/admin/students',
    '/admin/questions',
    '/admin/ctf',
    '/admin/analytics',
    '/admin/research',
    '/admin/audit-logs'
  ];

  expectedRoutes.forEach(r => {
    assert.ok(definedRoutes.includes(r), `Route '${r}' is missing in ROUTES constants!`);
  });
});

