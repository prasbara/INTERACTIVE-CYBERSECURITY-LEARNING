/**
 * Pre-Test Engine
 * Manages pre-test session, answer tracking, submission, and scoring.
 */

import { pretestQuestions } from '../../data/pretest.js';
import { scoreAssessment } from './assessmentScoring.js';
import { store } from '../../app/state.js';
import { logEvent } from '../analytics/eventLogger.js';

export class PreTestEngine {
  constructor() {
    this.questions = pretestQuestions;
    this.answers = {};
  }

  getQuestions() {
    return this.questions;
  }

  setAnswer(questionId, optionId) {
    this.answers[questionId] = optionId;
  }

  getAnswer(questionId) {
    return this.answers[questionId];
  }

  getAllAnswers() {
    return { ...this.answers };
  }

  getAnsweredCount() {
    return Object.keys(this.answers).length;
  }

  isAllAnswered() {
    return this.getAnsweredCount() === this.questions.length;
  }

  submit() {
    const result = scoreAssessment(this.questions, this.answers);
    const state = store.getState();
    const scores = { ...state.scores, pretest: result.percentage };

    store.setState({ scores });

    logEvent('pretest_completed', {
      total: result.totalQuestions,
      correct: result.correctCount,
      percentage: result.percentage,
      cognitiveBreakdown: result.cognitiveBreakdown
    });

    return result;
  }
}
