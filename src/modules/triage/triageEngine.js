import { store } from '../../app/state.js';
import { evaluateTriageDecision } from './triageScoring.js';
import { logEvent } from '../analytics/eventLogger.js';
import { updateProgressState } from '../analytics/progressTracker.js';

export function submitTriageDecision(triageCase, decision) {
  const result = evaluateTriageDecision(triageCase, decision);

  store.setState(prev => ({
    triageDecisions: {
      ...prev.triageDecisions,
      [triageCase.id]: decision
    }
  }));

  logEvent('triage_decision_made', {
    caseId: triageCase.id,
    decision,
    isCorrect: result.isCorrect
  }, triageCase.meetingId, `triage-${triageCase.id}`);

  updateProgressState();
  return result;
}

export function unlockTriageEvidence(caseId, evidenceId) {
  const unlocked = store.getState().unlockedEvidence || [];
  const key = `${caseId}-${evidenceId}`;

  if (!unlocked.includes(key)) {
    store.setState(prev => ({
      unlockedEvidence: [...(prev.unlockedEvidence || []), key]
    }));

    logEvent('triage_evidence_unlocked', { caseId, evidenceId }, 3, `evidence-${key}`);
  }
}

export function isEvidenceUnlocked(caseId, evidenceId) {
  const unlocked = store.getState().unlockedEvidence || [];
  return unlocked.includes(`${caseId}-${evidenceId}`);
}

export class TriageEngine {
  constructor(cases = [], meetingId = 3) {
    this.cases = cases;
    this.meetingId = meetingId;
    this.decisions = {};
    this.unlockedEvidence = {};
  }

  unlockEvidence(caseId, evidenceId) {
    unlockTriageEvidence(caseId, evidenceId);
    if (!this.unlockedEvidence[caseId]) this.unlockedEvidence[caseId] = [];
    if (!this.unlockedEvidence[caseId].includes(evidenceId)) {
      this.unlockedEvidence[caseId].push(evidenceId);
    }
  }

  submitDecision(caseId, decision) {
    const c = this.cases.find(x => x.id === caseId) || { id: caseId, meetingId: this.meetingId };
    const res = submitTriageDecision(c, decision);
    this.decisions[caseId] = { decision, ...res };
    return res;
  }
}
