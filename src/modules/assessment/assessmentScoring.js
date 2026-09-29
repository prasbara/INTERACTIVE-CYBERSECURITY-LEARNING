/**
 * Assessment Scoring Utilities
 * Calculates scores, cognitive breakdowns, and item-level stats.
 * Explicitly separates diagnostic scores from validated psychometric instruments.
 */

export function scoreAssessment(questions, answers) {
  let correctCount = 0;
  const breakdown = {};
  const itemResults = [];

  questions.forEach(q => {
    const selected = answers[q.id];
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) correctCount++;

    itemResults.push({
      questionId: q.id,
      selectedAnswer: selected || null,
      correctAnswer: q.correctAnswer,
      isCorrect,
      cognitiveSkills: q.cognitiveSkills || []
    });

    (q.cognitiveSkills || []).forEach(skill => {
      if (!breakdown[skill]) {
        breakdown[skill] = { total: 0, correct: 0 };
      }
      breakdown[skill].total++;
      if (isCorrect) breakdown[skill].correct++;
    });
  });

  const total = questions.length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return {
    totalQuestions: total,
    correctCount,
    percentage,
    itemResults,
    cognitiveBreakdown: breakdown
  };
}
