/**
 * Post-Test Engine
 * Manages post-test session, answer tracking, submission, and scoring.
 */

import { posttestQuestions } from '../../data/posttest.js';
import { scoreAssessment } from './assessmentScoring.js';
import { store } from '../../app/state.js';
import { logEvent } from '../analytics/eventLogger.js';

export class PostTestEngine {
  constructor() {
    this.questions = posttestQuestions;
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
    const scores = { ...state.scores, posttest: result.percentage };

    store.setState({ scores });

    logEvent('posttest_completed', {
      total: result.totalQuestions,
      correct: result.correctCount,
      percentage: result.percentage,
      cognitiveBreakdown: result.cognitiveBreakdown
    });

    return result;
  }
}
