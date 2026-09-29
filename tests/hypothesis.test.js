import test from 'node:test';
import assert from 'node:assert/strict';
import { submitHypothesis } from '../src/modules/hypothesis/hypothesisEngine.js';
import { store } from '../src/app/state.js';

test('HypothesisEngine - evaluates Strong quality when hypothesis is supported by key evidences', () => {
  const result = submitHypothesis(1, 'brute_force', ['evi_freq', 'evi_users']);
  assert.equal(result.quality, 'Strong');
  assert.match(result.feedback, /Penalaran Sangat Kuat/);

  const state = store.getState();
  assert.equal(state.hypotheses[1].quality, 'Strong');
});

test('HypothesisEngine - provides remediation feedback for normal user failure hypothesis', () => {
  const result = submitHypothesis(1, 'normal_failure', ['evi_single_user']);
  assert.equal(result.quality, 'Developing');
  assert.match(result.feedback, /Kurang Tepat/);
});
