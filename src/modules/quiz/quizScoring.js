export function evaluateAnswer(question, selectedOptionId) {
  if (!question || !selectedOptionId) {
    return { isCorrect: false, error: 'Jawaban belum dipilih' };
  }

  const isCorrect = selectedOptionId === question.correctAnswer;
  const selectedOption = (question.options || []).find(o => o.id === selectedOptionId);

  return {
    isCorrect,
    selectedOptionId,
    selectedText: selectedOption ? selectedOption.text : '',
    correctAnswerId: question.correctAnswer,
    evidence: question.evidence || '',
    explanation: question.explanation || '',
    misconception: question.misconception || '',
    takeaway: question.takeaway || '',
    remediation: question.remediation || ''
  };
}

export const getPedagogicalFeedback = evaluateAnswer;

export function calculateQuizScore(questions, answers) {
  if (!questions || !questions.length) return { correctCount: 0, totalQuestions: 0, percentage: 0 };
  let correct = 0;
  for (const q of questions) {
    if (answers && answers[q.id] === q.correctAnswer) {
      correct++;
    }
  }
  const percentage = Math.round((correct / questions.length) * 100);
  return {
    correctCount: correct,
    totalQuestions: questions.length,
    percentage
  };
}
