import { store } from '../../app/state.js';
import { QUESTIONS_BY_MEETING } from '../../data/questions.js';
import { SCENARIOS } from '../../data/scenarios.js';
import { TRIAGE_CASES } from '../../data/triageCases.js';
import { CTF_CHALLENGE } from '../../data/ctfChallenge.js';

export function calculateMeetingProgress(meetingId, state = store.getState()) {
  const activities = state.activities || {};

  if (meetingId === 1) {
    const questions = QUESTIONS_BY_MEETING[1] || [];
    const answered = questions.filter(q => activities[q.id] !== undefined).length;
    const isCompleted = answered >= questions.length && questions.length > 0;
    return {
      meetingId: 1,
      completed: isCompleted,
      progressPercent: questions.length ? Math.round((answered / questions.length) * 100) : 0,
      answeredCount: answered,
      totalCount: questions.length
    };
  }

  if (meetingId === 2) {
    const questions = QUESTIONS_BY_MEETING[2] || [];
    const scenarios = SCENARIOS || [];
    const total = questions.length + scenarios.length;

    const answeredQ = questions.filter(q => activities[q.id] !== undefined).length;
    const answeredS = scenarios.filter(s => activities[`scenario-${s.id}`] !== undefined).length;
    const answered = answeredQ + answeredS;
    const isCompleted = answered >= total && total > 0;

    return {
      meetingId: 2,
      completed: isCompleted,
      progressPercent: total ? Math.round((answered / total) * 100) : 0,
      answeredCount: answered,
      totalCount: total
    };
  }

  if (meetingId === 3) {
    const questions = QUESTIONS_BY_MEETING[3] || [];
    const cases = TRIAGE_CASES || [];
    const total = questions.length + cases.length;

    const answeredQ = questions.filter(q => activities[q.id] !== undefined).length;
    const answeredC = cases.filter(c => state.triageDecisions[c.id] !== undefined).length;
    const answered = answeredQ + answeredC;
    const isCompleted = answered >= total && total > 0;

    return {
      meetingId: 3,
      completed: isCompleted,
      progressPercent: total ? Math.round((answered / total) * 100) : 0,
      answeredCount: answered,
      totalCount: total
    };
  }

  if (meetingId === 4) {
    const valQuestions = CTF_CHALLENGE.validationQuestions || [];
    const answeredV = valQuestions.filter(q => activities[q.id] !== undefined).length;
    const flagSolved = !!state.ctf?.solved;
    const reflectionValid = (state.ctf?.reflection || '').trim().length >= 100;

    const totalSteps = valQuestions.length + 2; // questions + flag + reflection
    let completedSteps = answeredV;
    if (flagSolved) completedSteps++;
    if (reflectionValid) completedSteps++;

    const isCompleted = answeredV >= valQuestions.length && flagSolved && reflectionValid;

    return {
      meetingId: 4,
      completed: isCompleted,
      progressPercent: totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0,
      answeredCount: completedSteps,
      totalCount: totalSteps
    };
  }

  return { meetingId, completed: false, progressPercent: 0, answeredCount: 0, totalCount: 0 };
}

export function calculateOverallProgress(state = store.getState()) {
  const p1 = calculateMeetingProgress(1, state);
  const p2 = calculateMeetingProgress(2, state);
  const p3 = calculateMeetingProgress(3, state);
  const p4 = calculateMeetingProgress(4, state);

  let completedCount = 0;
  if (p1.completed) completedCount++;
  if (p2.completed) completedCount++;
  if (p3.completed) completedCount++;
  if (p4.completed) completedCount++;

  const totalActivities = p1.totalCount + p2.totalCount + p3.totalCount + p4.totalCount;
  const answeredActivities = p1.answeredCount + p2.answeredCount + p3.answeredCount + p4.answeredCount;

  return {
    completedMeetings: completedCount,
    totalMeetings: 4,
    percent: Math.round((completedCount / 4) * 100),
    totalActivities,
    answeredActivities,
    isAllCompleted: completedCount === 4,
    meetingDetails: { 1: p1, 2: p2, 3: p3, 4: p4 }
  };
}

export function updateProgressState() {
  const overall = calculateOverallProgress();
  store.setState(prev => ({
    progress: {
      meeting1: overall.meetingDetails[1].completed,
      meeting2: overall.meetingDetails[2].completed,
      meeting3: overall.meetingDetails[3].completed,
      meeting4: overall.meetingDetails[4].completed
    }
  }));
  return overall;
}

export function checkMeetingCompletion(meetingId) {
  const progress = calculateMeetingProgress(meetingId);
  const state = store.getState();
  const currentKey = `meeting${meetingId}`;

  if (progress.completed && !state.progress?.[currentKey]) {
    store.setState({
      progress: {
        ...state.progress,
        [currentKey]: true
      }
    });
  }
  return progress;
}

export function getRecommendedActivity(state = store.getState()) {
  if (state.scores?.pretest === null || state.scores?.pretest === undefined) {
    return {
      path: '/pre-test',
      label: 'Pre-Test Kemampuan Awal',
      reason: 'Disarankan untuk mengukur baseline pemahaman sebelum memulai materi pertemuan 1.'
    };
  }

  const p1 = calculateMeetingProgress(1, state);
  if (!p1.completed) {
    return {
      path: '/meeting/1',
      label: 'Pertemuan 1: Memahami Masalah',
      reason: 'Lanjutkan analisis log mentah Suricata dan kuis identifikasi fakta vs opini.'
    };
  }

  const p2 = calculateMeetingProgress(2, state);
  if (!p2.completed) {
    return {
      path: '/meeting/2',
      label: 'Pertemuan 2: Merencanakan Pemecahan',
      reason: 'Eksplorasi trade-off arsitektur NIDS vs HIDS dan strategi pendeteksian.'
    };
  }

  const p3 = calculateMeetingProgress(3, state);
  if (!p3.completed) {
    return {
      path: '/meeting/3',
      label: 'Pertemuan 3: Melaksanakan Rencana',
      reason: 'Selesaikan latihan triase alert insiden SOC dengan 7 konteks infrastruktur.'
    };
  }

  const p4 = calculateMeetingProgress(4, state);
  if (!p4.completed) {
    return {
      path: '/meeting/4',
      label: 'Pertemuan 4: Meninjau Kembali',
      reason: 'Pecahkan tantangan Blue Team CTF dan tuliskan refleksi investigasi diri.'
    };
  }

  if (state.scores?.posttest === null || state.scores?.posttest === undefined) {
    return {
      path: '/post-test',
      label: 'Post-Test Evaluasi Akhir',
      reason: 'Uji peningkatan kemampuan berpikir kritis setelah seluruh tahapan LAPS selesai.'
    };
  }

  return {
    path: '/completion',
    label: 'Ringkasan & Unduh Data Belajar',
    reason: 'Seluruh materi dan evaluasi telah selesai diselesaikan.'
  };
}
