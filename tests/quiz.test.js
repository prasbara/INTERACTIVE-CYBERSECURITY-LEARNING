import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuizScore, getPedagogicalFeedback } from '../src/modules/quiz/quizScoring.js';

test('QuizScoring - calculateQuizScore returns accurate count and percentage', () => {
  const questions = [
    { id: 'q1', correctAnswer: 'a', cognitiveSkills: ['analysis'] },
    { id: 'q2', correctAnswer: 'b', cognitiveSkills: ['interpretation'] }
  ];

  const answers = { q1: 'a', q2: 'b' };
  const res = calculateQuizScore(questions, answers);

  assert.equal(res.correctCount, 2);
  assert.equal(res.totalQuestions, 2);
  assert.equal(res.percentage, 100);
});

test('QuizScoring - handles wrong answers and empty answers correctly', () => {
  const questions = [
    { id: 'q1', correctAnswer: 'a' },
    { id: 'q2', correctAnswer: 'b' },
    { id: 'q3', correctAnswer: 'c' }
  ];

  const answers = { q1: 'a', q2: 'wrong' }; // q3 is unanswered
  const res = calculateQuizScore(questions, answers);

  assert.equal(res.correctCount, 1);
  assert.equal(res.totalQuestions, 3);
  assert.equal(res.percentage, 33);
});

test('QuizScoring - provides pedagogical feedback with misconception and remediation', () => {
  const question = {
    id: 'q1',
    correctAnswer: 'b',
    explanation: 'Log menunjukkan volume tinggi.',
    misconception: 'Mengira semua alert adalah insiden nyata.',
    remediation: 'Periksa status kode respon HTTP.'
  };

  const correctFb = getPedagogicalFeedback(question, 'b');
  assert.equal(correctFb.isCorrect, true);
  assert.equal(correctFb.explanation, 'Log menunjukkan volume tinggi.');

  const wrongFb = getPedagogicalFeedback(question, 'a');
  assert.equal(wrongFb.isCorrect, false);
  assert.equal(wrongFb.misconception, 'Mengira semua alert adalah insiden nyata.');
  assert.equal(wrongFb.remediation, 'Periksa status kode respon HTTP.');
});
