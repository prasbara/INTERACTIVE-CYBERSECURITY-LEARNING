import { store } from '../../app/state.js';
import { evaluateAnswer, calculateQuizScore } from './quizScoring.js';
import { logEvent } from '../analytics/eventLogger.js';
import { updateProgressState } from '../analytics/progressTracker.js';

export function submitQuizAnswer(question, selectedOptionId) {
  const result = evaluateAnswer(question, selectedOptionId);
  const currentAttempts = (store.getState().attempts?.[question.id] || 0) + 1;

  store.setState(prev => ({
    activities: {
      ...prev.activities,
      [question.id]: selectedOptionId
    },
    attempts: {
      ...prev.attempts,
      [question.id]: currentAttempts
    }
  }));

  logEvent('question_answered', {
    questionId: question.id,
    meetingId: question.meetingId,
    selectedOptionId,
    isCorrect: result.isCorrect,
    attempt: currentAttempts
  }, question.meetingId, question.id);

  updateProgressState();
  return { ...result, attempts: currentAttempts };
}

export function getQuestionState(questionId) {
  const state = store.getState();
  return {
    selectedAnswer: state.activities?.[questionId] || null,
    attempts: state.attempts?.[questionId] || 0,
    isAnswered: state.activities?.[questionId] !== undefined
  };
}

export class QuizEngine {
  constructor(questions = [], meetingId = 1) {
    this.questions = questions;
    this.meetingId = meetingId;
  }

  submitAnswer(questionId, optionId) {
    const q = this.questions.find(x => x.id === questionId) || { id: questionId, meetingId: this.meetingId };
    return submitQuizAnswer(q, optionId);
  }

  getState(questionId) {
    return getQuestionState(questionId);
  }
}
