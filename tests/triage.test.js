import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreTriageCases, evaluateTriageDecision } from '../src/modules/triage/triageScoring.js';

test('TriageScoring - evaluateTriageDecision identifies valid vs invalid decisions', () => {
  const triageCase = {
    id: 'tc-01',
    validDecisions: ['TRUE_POSITIVE'],
    reasoning: 'Log otentikasi SSH mencatat 25 kegagalan berturut-turut.'
  };

  const evalCorrect = evaluateTriageDecision(triageCase, 'TRUE_POSITIVE');
  assert.equal(evalCorrect.isCorrect, true);
  assert.equal(evalCorrect.explanation, triageCase.reasoning);

  const evalWrong = evaluateTriageDecision(triageCase, 'FALSE_POSITIVE');
  assert.equal(evalWrong.isCorrect, false);
});

test('TriageScoring - scoreTriageCases calculates total points and percentage', () => {
  const cases = [
    { id: 'c1', validDecisions: ['TRUE_POSITIVE'] },
    { id: 'c2', validDecisions: ['FALSE_POSITIVE'] },
    { id: 'c3', validDecisions: ['NEED_MORE_EVIDENCE'] }
  ];

  const decisions = {
    c1: { isCorrect: true },
    c2: { isCorrect: true },
    c3: { isCorrect: false }
  };

  const scoreResult = scoreTriageCases(cases, decisions);
  assert.equal(scoreResult.correctCount, 2);
  assert.equal(scoreResult.totalCases, 3);
  assert.equal(scoreResult.percentage, 67);
});
