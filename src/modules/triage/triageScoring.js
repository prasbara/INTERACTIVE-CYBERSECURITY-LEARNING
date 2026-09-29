export function evaluateTriageDecision(triageCase, decision) {
  if (!triageCase || !decision) {
    return { isCorrect: false, error: 'Keputusan belum dipilih' };
  }

  const validDecisions = triageCase.validDecisions || [triageCase.expectedDecision];
  const isCorrect = validDecisions.includes(decision);

  return {
    isCorrect,
    decision,
    expectedDecision: triageCase.expectedDecision,
    explanation: triageCase.explanation || triageCase.reasoning || ''
  };
}

export function scoreTriageCases(cases = [], decisions = {}) {
  let correctCount = 0;
  cases.forEach(c => {
    const dec = decisions[c.id];
    if (dec && dec.isCorrect) {
      correctCount++;
    }
  });

  const total = cases.length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return {
    correctCount,
    totalCases: total,
    percentage
  };
}
