/**
 * Quiz Card Component
 * Displays a single question, its evidence/context, options, and handles user answer selection.
 */

import { createElement } from '../utils/dom.js';
import { createFeedbackPanel } from './FeedbackPanel.js';

export function createQuizCard({ question, selectedAnswer, isLocked, feedback, onSelectOption, onSubmitAnswer }) {
  const container = createElement('div', {
    className: 'quiz-card card',
    attributes: { 'data-question-id': question.id }
  });

  const header = createElement('div', {
    className: 'quiz-card-header',
    children: [
      createElement('div', {
        className: 'quiz-meta-tags',
        children: [
          createElement('span', { className: 'badge badge-primary', text: question.id }),
          question.lapsStage ? createElement('span', { className: 'badge badge-subtle', text: question.lapsStage }) : null,
          question.difficulty ? createElement('span', { className: 'badge badge-outline', text: question.difficulty }) : null
        ].filter(Boolean)
      }),
      isLocked ? createElement('span', { className: 'badge badge-neutral', text: 'Terkunci' }) : null
    ].filter(Boolean)
  });

  const questionBody = createElement('div', { className: 'quiz-question-body' });
  const questionTitle = createElement('h3', { className: 'quiz-question-text', text: question.question });
  questionBody.appendChild(questionTitle);

  if (question.context) {
    questionBody.appendChild(createElement('p', { className: 'quiz-context-text', text: question.context }));
  }

  if (question.evidence && question.evidence.length > 0) {
    const evidenceBox = createElement('pre', {
      className: 'code-block quiz-evidence-block',
      children: [
        createElement('code', { text: question.evidence.join('\n') })
      ]
    });
    questionBody.appendChild(evidenceBox);
  }

  const optionsList = createElement('div', { className: 'quiz-options-list' });

  question.options.forEach(opt => {
    const isSelected = selectedAnswer === opt.id;
    let optClass = 'quiz-option-btn';
    if (isSelected) optClass += ' option-selected';

    if (isLocked) {
      if (opt.id === question.correctAnswer) {
        optClass += ' option-correct';
      } else if (isSelected && !feedback?.isCorrect) {
        optClass += ' option-wrong';
      }
    }

    const btn = createElement('button', {
      className: optClass,
      attributes: {
        disabled: isLocked ? 'true' : null
      },
      children: [
        createElement('span', { className: 'option-letter', text: opt.id.toUpperCase() }),
        createElement('span', { className: 'option-text', text: opt.text })
      ],
      events: {
        click: () => {
          if (!isLocked && onSelectOption) {
            onSelectOption(opt.id);
          }
        }
      }
    });

    optionsList.appendChild(btn);
  });

  container.appendChild(header);
  container.appendChild(questionBody);
  container.appendChild(optionsList);

  if (!isLocked && onSubmitAnswer) {
    const actionRow = createElement('div', {
      className: 'quiz-action-row',
      children: [
        createElement('button', {
          className: 'btn btn-primary',
          attributes: { disabled: !selectedAnswer ? 'true' : null },
          text: 'Kirim Jawaban',
          events: {
            click: () => onSubmitAnswer()
          }
        })
      ]
    });
    container.appendChild(actionRow);
  }

  if (isLocked && feedback) {
    const fbPanel = createFeedbackPanel({
      isCorrect: feedback.isCorrect,
      explanation: feedback.explanation,
      misconception: feedback.misconception,
      remediation: feedback.remediation,
      scoreImpact: feedback.scoreImpact
    });
    container.appendChild(fbPanel);
  }

  return container;
}
